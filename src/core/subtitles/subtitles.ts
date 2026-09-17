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
  const visible = plainText(text);
  const markers = [...visible.matchAll(/-\s+(?=\p{Lu})/gu)].map(
    (match) => match.index,
  );
  // A marker after the first forces a boundary, independent of target-script case.
  const boundaries = [0, ...markers.slice(1), visible.length];
  return boundaries
    .slice(0, -1)
    .map((start, i) =>
      normalizeMarkup(sliceMarkup(text, start, boundaries[i + 1])),
    );
}

export function continuationGroups(cues: Cue[]): number[] {
  let group = 0;
  return cues.map((cue, i) => {
    if (i === 0 || !/^(?:[a-z]|\.)/.test(plainText(cue.text).trimStart()))
      group += 1;
    return group;
  });
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

export function formatTranslation(
  segments: string[],
  language: string,
): string {
  const normalized = segments.map(normalizeMarkup);
  // Preserve every speaker, including overflow, and let quality() flag it.
  if (normalized.length > 1) return normalized.join('\n');
  const text = normalized[0] ?? '';
  const visible = plainText(text);
  if (graphemes(visible) <= 42) return text;
  const candidates = [...visible.matchAll(/\s+/g)].map((match) => {
    const before = visible.slice(0, match.index);
    const after = visible.slice(match.index + match[0].length);
    const left = graphemes(before),
      right = graphemes(after);
    const overflow = Math.max(0, left - 42) + Math.max(0, right - 42);
    const protectedBreak =
      language === 'en' && protectedEnglishBreak(before, after);
    const punctuation = /[.!?,;:]$/.test(before) ? 0 : 25;
    return {
      start: match.index,
      end: match.index + match[0].length,
      score:
        overflow * 1000 +
        Number(protectedBreak) * 10000 +
        punctuation +
        Math.abs(left - right),
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
