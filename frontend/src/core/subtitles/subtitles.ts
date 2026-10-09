import { groupCues, sourceSections } from './groups';
import type { Cue } from '../srt/srt';
import { normalizeMarkup, plainText, sliceMarkup } from '../srt/markup';

export type Profile = 'adult' | 'children';
export const CPS_LIMITS: Record<Profile, number> = { adult: 20, children: 17 };
export interface Quality {
  warnings: string[];
  cps: number;
  length: number;
  capacity: number;
}
const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
export function graphemes(text: string): number {
  return [...segmenter.segment(text)].length;
}

export function speakerSegments(text: string): string[] {
  return sourceSections(text).map((section) => section.text);
}

export function continuationGroups(cues: Cue[]): number[] {
  return groupCues(cues).flatMap((group, i) => group.map(() => i + 1));
}

export function quality(text: string, cue: Cue, profile: Profile): Quality {
  const lines = plainText(text).split('\n');
  const length = graphemes(lines.join(''));
  const seconds = (cue.endMs - cue.startMs) / 1000;
  const cps = length / seconds;
  const capacity = Math.min(84, Math.floor(seconds * CPS_LIMITS[profile]));
  const warnings: string[] = [];
  if (lines.length > 2) warnings.push(`${lines.length} lines; maximum is 2.`);
  if (lines.some((line) => graphemes(line) > 42))
    warnings.push('A line exceeds 42 visible characters.');
  if (cps > CPS_LIMITS[profile])
    warnings.push(`${cps.toFixed(1)} CPS exceeds ${CPS_LIMITS[profile]} CPS.`);
  if (length > capacity)
    warnings.push(
      `${length} visible characters exceed this cue’s ${capacity}-character capacity.`,
    );
  return { warnings, cps, length, capacity };
}

/** English break protection is conservative; other languages use punctuation/word boundaries. */
function protectedEnglishBreak(before: string, after: string): boolean {
  const last = before.split(/\s+/).at(-1)?.toLowerCase() ?? '';
  const first = after.split(/\s+/)[0]?.toLowerCase() ?? '';
  return (
    /^(a|an|the|i|you|he|she|we|they|it|my|your|his|her|our|their|not|don't|doesn't|is|are|was|were|have|has|had|will|would|can|could|should|must)$/.test(
      last,
    ) ||
    /^(up|off|out|down|away)$/.test(first) ||
    (/\b\p{Lu}\p{Ll}+$/u.test(before) && /^\p{Lu}\p{Ll}+\b/u.test(after))
  );
}

export interface TranslationSegment {
  text: string;
  hardBreak?: boolean;
}

function normalizeSegments(
  segments: Array<string | TranslationSegment>,
): TranslationSegment[] {
  return segments.map((segment) =>
    typeof segment === 'string'
      ? { text: normalizeMarkup(segment), hardBreak: /^-\s*/.test(segment) }
      : { ...segment, text: normalizeMarkup(segment.text) },
  );
}

function lineBreakPositions(visible: string, language: string): number[] {
  const whitespace = [...visible.matchAll(/\s+/g)].map(
    (match) => match.index + match[0].length,
  );
  if (whitespace.length) return whitespace;
  const words = [
    ...new Intl.Segmenter(language || undefined, {
      granularity: 'word',
    }).segment(visible),
  ]
    .map(({ index, segment }) => index + segment.length)
    .filter((index) => index > 0 && index < visible.length);
  return words;
}

export function formatTranslation(
  segments: Array<string | TranslationSegment>,
  language: string,
): string {
  const text = normalizeSegments(segments).reduce(
    (output, segment, index) =>
      output + (index ? (segment.hardBreak ? '\n' : ' ') : '') + segment.text,
    '',
  );
  // Preserve every required speaker boundary, including overflow.
  if (text.includes('\n')) return text;
  const visible = plainText(text);
  if (graphemes(visible) <= 42) return text;
  const candidates = lineBreakPositions(visible, language).map((position) => {
    const left = visible.slice(0, position);
    const right = visible.slice(position);
    const before = left.trimEnd();
    const after = right.trimStart();
    const leftGraphemes = graphemes(before),
      rightGraphemes = graphemes(after);
    const overflow =
      Math.max(0, leftGraphemes - 42) + Math.max(0, rightGraphemes - 42);
    const protectedBreak =
      language === 'en' && protectedEnglishBreak(before, after);
    const punctuation = /[.!?,;:]$/.test(before) ? 0 : 25;
    return {
      start: before.length,
      end: visible.length - after.length,
      score:
        overflow * 1000 +
        Number(protectedBreak) * 10000 +
        punctuation +
        Math.abs(leftGraphemes - rightGraphemes),
    };
  });
  const best = candidates.sort((a, b) => a.score - b.score)[0];
  if (!best) return text;
  return (
    sliceMarkup(text, 0, best.start) +
    '\n' +
    sliceMarkup(text, best.end, visible.length)
  );
}
