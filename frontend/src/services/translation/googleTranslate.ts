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

export const TRANSLATE_ENDPOINT = '/api/translation';
export type TranslationModel = 'nmt' | 'tllm';
export const MAX_REQUEST_BYTES = 90000; // Margin beneath Basic's documented 100 KB limit.
export const MAX_TLLM_INPUT_CHARACTERS = 30000;

export function inputCharacters(inputs: TranslationInput[]): number {
  return inputs.reduce((total, input) => total + [...input.text].length, 0);
}

export function translationBody(
  inputs: TranslationInput[],
  target: string,
  model: TranslationModel = 'nmt',
): string {
  return JSON.stringify({
    q: inputs.map((input) => input.text),
    source: 'en',
    target,
    format: 'html',
    model,
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

function failureCategory(value: unknown): string | undefined {
  if (
    record(value) &&
    record(value.error) &&
    typeof value.error.category === 'string'
  )
    return value.error.category;
  return undefined;
}

function retryDelayMs(value: unknown): number | undefined {
  if (
    record(value) &&
    record(value.error) &&
    typeof value.error.retryAfterSeconds === 'number' &&
    Number.isFinite(value.error.retryAfterSeconds) &&
    value.error.retryAfterSeconds > 0
  )
    return Math.min(Math.ceil(value.error.retryAfterSeconds), 120) * 1000;
  return undefined;
}

function failureMessage(status: number, category: string | undefined): string {
  if (category === 'gateway_disabled')
    return 'Public translation is disabled until the project owner configures production usage and abuse controls.';
  if (category === 'key_restriction')
    return 'Google blocked this server key restriction. A local gateway key must not use a Websites/referrer restriction.';
  if (category === 'billing')
    return 'Google requires billing to use this Translation project.';
  if (category === 'api_not_enabled')
    return 'Cloud Translation API is not enabled for this Google Cloud project.';
  if (category === 'quota')
    return 'Google Translation quota was reached. Check the Cloud Translation quota page, then translate remaining cues.';
  if (category === 'daily_quota')
    return 'Google Translation daily quota was reached. It resets at midnight Pacific Time; adjust the project quota if appropriate.';
  if (category === 'rate_limited')
    return 'Google Translation per-minute quota was reached. Automatic retries use a one-minute cooldown; if they are exhausted, retry remaining cues later.';
  if (category === 'access_denied')
    return 'Google denied the project gateway request. Check API access, billing, server key restrictions, and quota.';
  if (category === 'invalid_request')
    return 'Google rejected this request. The selected model, language, or batch size may not be supported.';
  if (status === 401 || status === 403)
    return 'Google denied the project gateway request. Check API access, billing, server key restrictions, and quota.';
  if (status === 400)
    return 'Google rejected this request. The selected model, language, or batch size may not be supported.';
  return `Google returned HTTP ${status}.`;
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

/** Calls the owner-funded gateway. The browser never receives the Cloud API key. */
export class GoogleTranslate implements TranslationProvider {
  private readonly model: TranslationModel;
  constructor(
    model: TranslationModel | string,
    private readonly timeoutMs = 15000,
  ) {
    this.model = model === 'tllm' ? 'tllm' : 'nmt';
  }

  private async request(
    url: string,
    init: RequestInit,
    signal: AbortSignal,
    onRequest?: () => void,
    onRetryDelay?: (delayMs: number) => void,
  ): Promise<unknown> {
    for (let attempt = 0; attempt < 3; attempt++) {
      checkAbort(signal);
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
          },
          signal: controller.signal,
          credentials: 'omit',
          cache: 'no-store',
          redirect: 'error',
        });
        if (!response.ok) {
          const data: unknown = await response.json().catch(() => null);
          const category = failureCategory(data);
          const rateLimited = category === 'rate_limited';
          if (response.status === 502)
            throw new ProviderError(
              'The translation connection is unavailable. If you are working locally, stop both servers and run npm run dev again.',
              true,
            );
          const retryableStatus =
            category !== 'gateway_disabled' &&
            (rateLimited || response.status === 429 || response.status >= 500);
          throw new ProviderError(
            failureMessage(response.status, category),
            retryableStatus,
            rateLimited ? (retryDelayMs(data) ?? 60000) : undefined,
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
                  : 'Could not reach the translation gateway. Start it locally or check the deployed service.',
                true,
              );
      } finally {
        clearTimeout(timer);
        signal.removeEventListener('abort', cancel);
      }
      if (!failure.retryable || attempt === 2) throw failure;
      const delayMs = failure.retryDelayMs ?? 1000 * 2 ** attempt;
      onRetryDelay?.(delayMs);
      await sleep(delayMs, signal);
    }
    throw new ProviderError('Request failed.');
  }

  async getLanguages(signal: AbortSignal): Promise<Language[]> {
    const data = await this.request(
      `${TRANSLATE_ENDPOINT}/languages?model=${this.model}`,
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
    onRetryDelay?: (delayMs: number) => void,
  ): Promise<TranslationResult[]> {
    const body = translationBody(inputs, target, this.model);
    if (
      !inputs.length ||
      inputs.length > 128 ||
      (this.model === 'tllm' &&
        inputCharacters(inputs) > MAX_TLLM_INPUT_CHARACTERS) ||
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
      onRetryDelay,
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
        const structure = (value: string) =>
          (plainText(value).match(/(?:\[|\]|[♪♫])/g) ?? []).join('');
        if (structure(text) !== structure(inputs[i].text))
          throw new Error('Changed sound/music structure');
      } catch {
        throw new ProviderError(
          'Google returned empty text or changed formatting, sound brackets, or music symbols. No results from this batch were saved.',
        );
      }
      return { id: inputs[i].id, text };
    });
  }
}
