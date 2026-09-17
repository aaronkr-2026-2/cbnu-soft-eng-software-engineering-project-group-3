import { formatTranslation } from '../../core/subtitles/subtitles';
import { plainText } from '../../core/srt/markup';
import {
  checkAbort,
  ProviderError,
  type TranslationProvider,
} from '../../services/translation/provider';
import type { Batch } from '../../services/translation/batches';

export interface JobCallbacks {
  active: (ids: string[]) => void;
  completed: (results: Record<string, string>) => void;
  request: () => void;
}

export async function runJob(
  provider: TranslationProvider,
  batches: Batch[],
  target: string,
  signal: AbortSignal,
  callbacks: JobCallbacks,
): Promise<void> {
  for (const batch of batches) {
    checkAbort(signal);
    callbacks.active(batch.cues.map(({ cue }) => cue.id));
    const results = await provider.translateBatch(
      batch.inputs,
      target,
      signal,
      callbacks.request,
    );
    checkAbort(signal);
    const byId = new Map(results.map((result) => [result.id, result.text]));
    if (
      results.length !== batch.inputs.length ||
      byId.size !== results.length ||
      batch.inputs.some((input) => !byId.has(input.id))
    )
      throw new ProviderError(
        'Translation result IDs do not match this batch.',
      );
    const completed: Record<string, string> = {};
    for (const { cue, inputs } of batch.cues) {
      const segments = inputs.map((input) => {
        const text = byId.get(input.id)!;
        return /^-\s/.test(plainText(input.text)) &&
          !/^-\s/.test(plainText(text))
          ? `- ${text}`
          : text;
      });
      completed[cue.id] = formatTranslation(segments, target);
    }
    callbacks.completed(completed);
  }
}
