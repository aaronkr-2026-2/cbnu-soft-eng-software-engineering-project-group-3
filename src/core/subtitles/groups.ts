import type { Cue } from '../srt/srt';
import { normalizeMarkup, plainText, sliceMarkup } from '../srt/markup';

// Technical bounds, not linguistic claims. The preview uses these same groups.
export const MAX_GROUP_CHARACTERS = 5000;
export const MAX_GROUP_CUES = 64;

export function groupCues(cues: Cue[]): Cue[][] {
  const groups: Cue[][] = [];
  let size = 0;
  for (const cue of cues) {
    const text = plainText(cue.text).trimStart();
    const length = [...normalizeMarkup(cue.text)].length;
    const current = groups.at(-1);
    if (
      current &&
      /^(?:\p{Ll}|\.{3}|…)/u.test(text) &&
      current.length < MAX_GROUP_CUES &&
      size + 1 + length <= MAX_GROUP_CHARACTERS
    ) {
      current.push(cue);
      size += 1 + length;
    } else {
      groups.push([cue]);
      size = length;
    }
  }
  return groups;
}

interface SourceSection {
  text: string;
  kind: 'speech' | 'speaker' | 'annotation' | 'music';
}

/** Detect structure before removing display wraps. Offsets refer to visible text. */
export function sourceSections(text: string): SourceSection[] {
  const visible = plainText(text);
  const boundaries = new Map<number, SourceSection['kind']>([[0, 'speech']]);
  const protectedSpans = [
    ...visible.matchAll(/\[[^\]]*\]|([♪♫])[^♪♫]*\1/gu),
  ].map((match) => [match.index, match.index + match[0].length]);
  const protectedOffset = (offset: number) =>
    protectedSpans.some(([start, end]) => offset >= start && offset < end);
  for (const match of visible.matchAll(
    /(?:^|\n)[ \t]*-\s+|\s+-\s+(?=\p{Lu})/gu,
  )) {
    const offset = match.index + match[0].indexOf('-');
    if (!protectedOffset(offset)) boundaries.set(offset, 'speaker');
  }
  for (const match of visible.matchAll(/\[[^\]]*\]|([♪♫])[^♪♫]*\1/gu)) {
    boundaries.set(match.index, match[0][0] === '[' ? 'annotation' : 'music');
    boundaries.set(match.index + match[0].length, 'speech');
  }
  const starts = [...boundaries.keys()].sort((a, b) => a - b);
  const sections = starts.flatMap((start, i) => {
    const value = normalizeMarkup(
      sliceMarkup(text, start, starts[i + 1] ?? visible.length),
    );
    return plainText(value).trim()
      ? [{ text: value, kind: boundaries.get(start)! }]
      : [];
  });
  return sections.reduce<SourceSection[]>((result, section) => {
    const previous = result.at(-1);
    if (
      previous?.kind === 'speaker' &&
      /^-\s*$/.test(plainText(previous.text))
    ) {
      previous.text = normalizeMarkup(`${previous.text} ${section.text}`);
    } else result.push(section);
    return result;
  }, []);
}

export interface SpeechUnit {
  id: string;
  text: string;
  parts: { cue: Cue; text: string }[];
  speaker: boolean;
}

/** A connected speech unit can span cues, but never a known speaker/sound boundary. */
export function speechUnits(cues: Cue[]): SpeechUnit[] {
  const units: SpeechUnit[] = [];
  let canContinue = false;
  for (const cue of cues) {
    for (const [i, section] of sourceSections(cue.text).entries()) {
      const previous = units.at(-1);
      if (i === 0 && section.kind === 'speech' && previous && canContinue) {
        previous.text += ` ${section.text}`;
        previous.parts.push({ cue, text: section.text });
      } else {
        units.push({
          id: `${cue.id}:${i}`,
          text: section.text,
          parts: [{ cue, text: section.text }],
          speaker: section.kind === 'speaker',
        });
      }
      canContinue = section.kind === 'speech' || section.kind === 'speaker';
    }
  }
  return units;
}

/** Word boundaries work across scripts; bracketed descriptions stay indivisible. */
function breakPositions(text: string, language: string): number[] {
  const protectedSpans = [...text.matchAll(/\[[^\]]*\]|([♪♫])[^♪♫]*\1/gu)].map(
    (match) => [match.index, match.index + match[0].length],
  );
  return [
    ...new Intl.Segmenter(language || undefined, {
      granularity: 'word',
    }).segment(text),
  ]
    .filter((segment) => segment.isWordLike)
    .map((segment) => segment.index)
    .filter(
      (index) =>
        index > 0 &&
        !protectedSpans.some(([start, end]) => index > start && index < end),
    );
}

/** Capacity-weighted placement is approximate, never semantic/audio alignment. */
export function distributeTranslation(
  text: string,
  parts: SpeechUnit['parts'],
  language: string,
  cps: number,
): string[] {
  const normalized = normalizeMarkup(text);
  if (parts.length === 1) return [normalized];
  const visible = plainText(normalized);
  const positions = [0, ...breakPositions(visible, language), visible.length];
  if (positions.length - 1 < parts.length)
    throw new Error(
      'The joined translation is too short to fill every original cue. Edit the source grouping and retry.',
    );
  const capacity = parts.map(({ cue, text: source }) => {
    // A speaker/sound section shares its cue's reading time with the other sections.
    const fraction =
      plainText(source).length / Math.max(1, plainText(cue.text).length);
    return Math.max(
      1,
      Math.min(84, ((cue.endMs - cue.startMs) / 1000) * cps) * fraction,
    );
  });
  const graphemeOffsets = [0];
  let count = 0;
  for (const { index, segment } of new Intl.Segmenter(language || undefined, {
    granularity: 'grapheme',
  }).segment(visible)) {
    for (let offset = index; offset < index + segment.length; offset++)
      graphemeOffsets[offset] = count;
    graphemeOffsets[index + segment.length] = ++count;
  }
  let startIndex = 0;
  let remainingCapacity = capacity.reduce((sum, value) => sum + value, 0);
  const chunks: string[] = [];
  for (let i = 0; i < parts.length - 1; i++) {
    const start = positions[startIndex];
    const desired =
      ((count - graphemeOffsets[start]) * capacity[i]) / remainingCapacity;
    const lastCandidate = positions.length - 1 - (parts.length - i - 1);
    let best = startIndex + 1;
    let bestScore = Infinity;
    for (let candidate = best; candidate <= lastCandidate; candidate++) {
      const end = positions[candidate];
      const length = graphemeOffsets[end] - graphemeOffsets[start];
      const punctuationPenalty = /[.!?,;:。！？、，；：]$/.test(
        visible.slice(start, end).trimEnd(),
      )
        ? 0
        : 3;
      const score = Math.abs(length - desired) + punctuationPenalty;
      if (score < bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    chunks.push(sliceMarkup(normalized, start, positions[best]).trim());
    startIndex = best;
    remainingCapacity -= capacity[i];
  }
  chunks.push(
    sliceMarkup(normalized, positions[startIndex], visible.length).trim(),
  );
  if (chunks.some((chunk) => !plainText(chunk).trim()))
    throw new Error(
      'The joined translation could not fill every original cue. Edit the source grouping and retry.',
    );
  return chunks;
}
