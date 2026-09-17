import type { Cue } from '../../core/srt/srt';
import { providerHtml } from '../../core/srt/markup';
import { speakerSegments } from '../../core/subtitles/subtitles';
import type { TranslationInput } from './provider';
import { MAX_REQUEST_BYTES, translationBody } from './googleTranslate';

export interface PreparedCue {
  cue: Cue;
  inputs: TranslationInput[];
}
export interface Batch {
  cues: PreparedCue[];
  inputs: TranslationInput[];
}
export interface Estimate {
  characters: number;
  batches: Batch[];
  usd: number;
  retryCeilingUsd: number;
}
export const PRICE_DATE = '2026-09-17';
export const USD_PER_MILLION = 20;

export function estimateTranslation(cues: Cue[], target: string): Estimate {
  const batches: Batch[] = [];
  let batch: Batch = { cues: [], inputs: [] };
  const count = (inputs: TranslationInput[]) =>
    inputs.reduce((sum, input) => sum + [...input.text].length, 0);
  for (const cue of cues) {
    const prepared: PreparedCue = {
      cue,
      inputs: speakerSegments(cue.text).map((text, i) => ({
        id: `${cue.id}:${i}`,
        text: providerHtml(text),
      })),
    };
    if (
      prepared.inputs.length > 128 ||
      new TextEncoder().encode(translationBody(prepared.inputs, target))
        .length > MAX_REQUEST_BYTES
    )
      throw new Error(
        `Cue ${cue.index} is too large for one safe request. Edit the source file before translating.`,
      );
    const combined = [...batch.inputs, ...prepared.inputs];
    if (
      batch.inputs.length &&
      (combined.length > 128 ||
        count(combined) > 5000 ||
        new TextEncoder().encode(translationBody(combined, target)).length >
          MAX_REQUEST_BYTES)
    ) {
      batches.push(batch);
      batch = { cues: [], inputs: [] };
    }
    batch.cues.push(prepared);
    batch.inputs.push(...prepared.inputs);
  }
  if (batch.inputs.length) batches.push(batch);
  const characters = batches.reduce((sum, item) => sum + count(item.inputs), 0);
  const usd = (characters / 1000000) * USD_PER_MILLION;
  return { characters, batches, usd, retryCeilingUsd: usd * 3 };
}
