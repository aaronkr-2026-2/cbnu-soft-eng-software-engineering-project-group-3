import {
  CPS_LIMITS,
  formatTranslation,
  type Profile,
  type TranslationSegment,
} from '../../core/subtitles/subtitles';
import { distributeTranslation } from '../../core/subtitles/groups';
import { plainText } from '../../core/srt/markup';
import { validateOutput } from '../../core/srt/srt';
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
  failed?: (ids: string[], error: unknown) => void;
}

function yieldForPaint(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        checkAbort(signal);
        resolve();
      } catch (error) {
        reject(error);
      }
    }, 0);
  });
}

export async function runJob(
  provider: TranslationProvider,
  batches: Batch[],
  target: string,
  signal: AbortSignal,
  callbacks: JobCallbacks,
  profile: Profile = 'adult',
): Promise<void> {
  for (const batch of batches) {
    checkAbort(signal);
    const ids = batch.groups.flatMap((group) =>
      group.cues.map((cue) => cue.id),
    );
    callbacks.active(ids);
    let groupFailuresReported = false;
    try {
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
      const failedGroups: Array<{ ids: string[]; error: ProviderError }> = [];
      for (const group of batch.groups) {
        const groupCompleted: Record<string, string> = {};
        const cueSegments = new Map(
          group.cues.map((cue) => [cue.id, [] as TranslationSegment[]]),
        );
        try {
          for (const unit of group.units) {
            let text = byId.get(unit.id)!;
            if (unit.speaker && !/^-\s*/.test(plainText(text)))
              text = `- ${text}`;
            const chunks = distributeTranslation(
              text,
              unit.parts,
              target,
              CPS_LIMITS[profile],
            );
            unit.parts.forEach(({ cue }, i) =>
              cueSegments.get(cue.id)!.push({
                text: chunks[i],
                hardBreak: unit.speaker,
              }),
            );
          }
          for (const cue of group.cues) {
            const text = formatTranslation(cueSegments.get(cue.id)!, target);
            validateOutput(text);
            groupCompleted[cue.id] = text;
          }
          Object.assign(completed, groupCompleted);
        } catch (error) {
          failedGroups.push({
            ids: group.cues.map((cue) => cue.id),
            error: new ProviderError(
              error instanceof Error
                ? error.message
                : 'Could not distribute this translation.',
            ),
          });
        }
      }
      checkAbort(signal);
      if (Object.keys(completed).length) callbacks.completed(completed);
      if (failedGroups.length) {
        for (const failed of failedGroups)
          callbacks.failed?.(failed.ids, failed.error);
        groupFailuresReported = true;
        throw failedGroups[0].error;
      }
    } catch (error) {
      if (!signal.aborted && !groupFailuresReported)
        callbacks.failed?.(ids, error);
      throw error;
    }
    await yieldForPaint(signal);
  }
}
