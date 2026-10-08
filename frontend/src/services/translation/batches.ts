import type { Cue } from '../../core/srt/srt';
import { providerHtml } from '../../core/srt/markup';
import {
  groupCues,
  speechUnits,
  type SpeechUnit,
} from '../../core/subtitles/groups';
import type { TranslationInput } from './provider';
import {
  inputCharacters,
  MAX_REQUEST_BYTES,
  MAX_TLLM_INPUT_CHARACTERS,
  translationBody,
  type TranslationModel,
} from './googleTranslate';

export interface PreparedGroup {
  cues: Cue[];
  units: SpeechUnit[];
  inputs: TranslationInput[];
}
export interface Batch {
  groups: PreparedGroup[];
  inputs: TranslationInput[];
}
export interface Estimate {
  characters: number;
  batches: Batch[];
  usd: number;
  outputCharactersAssumed: number;
}
export const PRICE_DATE = '2026-09-18';
export const USD_PER_MILLION = 20;
export const TLLM_USD_PER_MILLION = 10;

export function estimateTranslation(
  cues: Cue[],
  target: string,
  model: TranslationModel = 'nmt',
  completed: Readonly<Record<string, string>> = {},
): Estimate {
  const batches: Batch[] = [];
  let batch: Batch = { groups: [], inputs: [] };
  const count = (inputs: TranslationInput[]) =>
    inputs.reduce((sum, input) => sum + [...input.text].length, 0);
  for (const group of groupCues(cues)) {
    if (group.every((cue) => completed[cue.id] !== undefined)) continue;
    if (group.some((cue) => completed[cue.id] !== undefined))
      throw new Error(
        'A continuation group is only partly complete. Reset translations before changing its grouping.',
      );
    const units = speechUnits(group);
    const inputs = units.map(({ id, text }) => ({
      id,
      text: providerHtml(text),
    }));
    if (
      inputs.length > 128 ||
      (model === 'tllm' &&
        inputCharacters(inputs) > MAX_TLLM_INPUT_CHARACTERS) ||
      new TextEncoder().encode(translationBody(inputs, target, model)).length >
        MAX_REQUEST_BYTES
    )
      throw new Error(
        `Group starting at cue ${group[0].index} is too large for one safe request. Edit the source file before translating.`,
      );
    const combined = [...batch.inputs, ...inputs];
    if (
      batch.inputs.length &&
      (combined.length > 128 ||
        count(combined) > 5000 ||
        new TextEncoder().encode(translationBody(combined, target, model))
          .length > MAX_REQUEST_BYTES)
    ) {
      batches.push(batch);
      batch = { groups: [], inputs: [] };
    }
    batch.groups.push({ cues: group, units, inputs });
    batch.inputs.push(...inputs);
  }
  if (batch.inputs.length) batches.push(batch);
  const characters = batches.reduce((sum, item) => sum + count(item.inputs), 0);
  const outputCharactersAssumed = model === 'tllm' ? characters : 0;
  const usd =
    model === 'nmt'
      ? (characters / 1000000) * USD_PER_MILLION
      : ((characters + outputCharactersAssumed) / 1000000) *
        TLLM_USD_PER_MILLION;
  return {
    characters,
    batches,
    usd,
    outputCharactersAssumed,
  };
}
