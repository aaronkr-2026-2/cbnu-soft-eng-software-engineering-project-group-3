import { decodeEntities, plainText, textRuns } from '../../core/srt/markup';
import { validateOutput } from '../../core/srt/srt';
import {
  aborted,
  checkAbort,
  ProviderError,
  type Language,
  type TranslationInput,
  type TranslationProvider,
  type TranslationResult,
} from './provider';

export const TRANSLATE_ENDPOINT =
  'https://translation.googleapis.com/language/translate/v2';
export const MAX_REQUEST_BYTES = 90000; // Margin beneath Basic's documented 100 KB limit.
export function translationBody(
  inputs: TranslationInput[],
  target: string,
): string {
  return JSON.stringify({
    q: inputs.map((input) => input.text),
    source: 'en',
    target,
    format: 'html',
    model: 'nmt',
  });
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
function responseItems(value: unknown, field: string): unknown[] {
  if (
    !record(value) ||
    !record(value.data) ||
    !Array.isArray(value.data[field])
  )
    throw new ProviderError(
      'Google returned an invalid response. No results from this batch were saved.',
    );
  return value.data[field];
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    checkAbort(signal);
    const cancel = () => {
      clearTimeout(timer);
      reject(aborted());
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', cancel);
      resolve();
    }, ms);
    signal.addEventListener('abort', cancel, { once: true });
  });
}

/** The private key is not enumerable/serializable and is never placed in app job state. */
export class GoogleTranslate implements TranslationProvider {
  #key: string;
  constructor(
    key: string,
    private readonly timeoutMs = 15000,
  ) {
    this.#key = key.trim();
  }
  clear(): void {
    this.#key = '';
  }

  private async request(
    url: string,
    init: RequestInit,
    signal: AbortSignal,
    onRequest?: () => void,
  ): Promise<unknown> {
    for (let attempt = 0; attempt < 3; attempt++) {
      checkAbort(signal);
      if (!this.#key) throw new ProviderError('Enter and test your key again.');
      const controller = new AbortController();
      const cancel = () => controller.abort();
      signal.addEventListener('abort', cancel, { once: true });
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, this.timeoutMs);
      let failure: ProviderError;
      try {
        onRequest?.();
        const response = await fetch(url, {
          ...init,
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.#key,
          },
          signal: controller.signal,
          credentials: 'omit',
          cache: 'no-store',
          redirect: 'error',
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403)
            throw new ProviderError(
              'Google denied access. Check the key, website/API restrictions, billing, and daily quota.',
            );
          if (response.status === 400)
            throw new ProviderError(
              'Google rejected this request. Check the language, key, and request size.',
            );
          throw new ProviderError(
            `Google returned HTTP ${response.status}.`,
            response.status === 429 || response.status >= 500,
          );
        }
        let data: unknown;
        try {
          data = await response.json();
        } catch {
          if (timedOut)
            throw new ProviderError('Google request timed out.', true);
          throw new ProviderError('Google returned invalid JSON.');
        }
        checkAbort(signal);
        return data;
      } catch (error) {
        if (signal.aborted) throw aborted();
        failure =
          error instanceof ProviderError
            ? error
            : new ProviderError(
                timedOut
                  ? 'Google request timed out.'
                  : 'Could not reach Google. Check your connection and browser/API restrictions.',
                true,
              );
      } finally {
        clearTimeout(timer);
        signal.removeEventListener('abort', cancel);
      }
      if (!failure.retryable || attempt === 2) throw failure;
      await sleep(500 * 2 ** attempt, signal);
    }
    throw new ProviderError('Request failed.');
  }

  async getLanguages(signal: AbortSignal): Promise<Language[]> {
    const data = await this.request(
      `${TRANSLATE_ENDPOINT}/languages?target=en&model=nmt`,
      { method: 'GET' },
      signal,
    );
    const items = responseItems(data, 'languages');
    if (!items.length)
      throw new ProviderError('Google returned no supported languages.');
    const languages = items.map((item) => {
      if (
        !record(item) ||
        typeof item.language !== 'string' ||
        !/^[a-zA-Z-]{2,20}$/.test(item.language) ||
        typeof item.name !== 'string' ||
        !item.name.trim()
      )
        throw new ProviderError('Google returned invalid language data.');
      return { code: item.language, name: item.name };
    });
    if (
      new Set(languages.map((language) => language.code)).size !==
      languages.length
    )
      throw new ProviderError('Google returned duplicate language codes.');
    return languages.sort((a, b) => a.name.localeCompare(b.name));
  }

  async translateBatch(
    inputs: TranslationInput[],
    target: string,
    signal: AbortSignal,
    onRequest?: () => void,
  ): Promise<TranslationResult[]> {
    const body = translationBody(inputs, target);
    if (
      !inputs.length ||
      inputs.length > 128 ||
      new TextEncoder().encode(body).length > MAX_REQUEST_BYTES ||
      new Set(inputs.map((input) => input.id)).size !== inputs.length
    )
      throw new ProviderError(
        'This subtitle batch exceeds supported limits or contains duplicate IDs.',
      );
    const data = await this.request(
      TRANSLATE_ENDPOINT,
      { method: 'POST', body },
      signal,
      onRequest,
    );
    const items = responseItems(data, 'translations');
    if (items.length !== inputs.length)
      throw new ProviderError(
        'Google returned a different number of translations. No results from this batch were saved.',
      );
    return items.map((item, i) => {
      if (!record(item) || typeof item.translatedText !== 'string')
        throw new ProviderError('Google returned invalid translation text.');
      const text = decodeEntities(item.translatedText);
      try {
        validateOutput(text);
        textRuns(text);
        const sourceTags = inputs[i].text.match(/<\/?[ibu]>/gi) ?? [];
        const resultTags = text.match(/<\/?[ibu]>/gi) ?? [];
        if (
          sourceTags.map((tag) => tag.toLowerCase()).join('') !==
          resultTags.map((tag) => tag.toLowerCase()).join('')
        )
          throw new Error('Changed markup');
        if (!plainText(text).trim()) throw new Error('Empty');
      } catch {
        throw new ProviderError(
          'Google returned empty text or changed unsupported formatting. No results from this batch were saved.',
        );
      }
      return { id: inputs[i].id, text };
    });
  }
}
