import { plainText } from './markup';

export interface Cue {
  id: string;
  index: string;
  start: string;
  end: string;
  startMs: number;
  endMs: number;
  text: string;
}

const timePattern = '(\\d{1,2}:[0-5]\\d:[0-5]\\d[,\\.]\\d{1,3})';
const timing = new RegExp(`^${timePattern}\\s*-->\\s*${timePattern}$`);
export const MAX_FILE_BYTES = 5 * 1024 * 1024;

function milliseconds(time: string): number {
  const [hours, minutes, seconds, fraction] = time.split(/[:,.]/);
  return (
    Number(hours) * 3600000 +
    Number(minutes) * 60000 +
    Number(seconds) * 1000 +
    Number(fraction.padEnd(3, '0'))
  );
}

export function parseSrt(raw: string): Cue[] {
  if (!raw.trim()) throw new Error('The subtitle file is empty.');
  const normalized = raw
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/^\n+|\n+$/g, '');
  const blocks = normalized.split(/\n[ \t]*\n+/);
  return blocks.map((block, position) => {
    const lines = block.split('\n');
    const match = timing.exec(lines[1]?.trim() ?? '');
    const prefix = `Block ${position + 1}: `;
    if (!/^\d+$/.test(lines[0].trim()) || !match) {
      throw new Error(
        prefix +
          'expected a numeric index and valid start --> end timestamps. No cues were imported.',
      );
    }
    const text = lines.slice(2).join('\n');
    try {
      if (!plainText(text).trim()) throw new Error('subtitle text is empty.');
      if (/\{\\[^}]*\}/.test(text))
        throw new Error('ASS-style formatting is not supported.');
    } catch (error) {
      throw new Error(
        prefix + (error instanceof Error ? error.message : 'invalid text.'),
        { cause: error },
      );
    }
    const startMs = milliseconds(match[1]);
    const endMs = milliseconds(match[2]);
    if (endMs <= startMs)
      throw new Error(prefix + 'end time must be after start time.');
    return {
      id: `cue-${position + 1}`,
      index: lines[0].trim(),
      start: match[1],
      end: match[2],
      startMs,
      endMs,
      text,
    };
  });
}

export function validateOutput(text: string): void {
  if (!plainText(text).trim()) throw new Error('Each cue needs nonempty text.');
  if (/\r|\n[ \t]*\n/.test(text))
    throw new Error('A cue cannot contain blank lines or carriage returns.');
}

export function serializeSrt(
  cues: Cue[],
  translations?: Readonly<Record<string, string>>,
): string {
  if (!cues.length) throw new Error('There are no cues to download.');
  return (
    cues
      .map((cue) => {
        const text = translations ? translations[cue.id] : cue.text;
        if (typeof text !== 'string')
          throw new Error('Translation is incomplete.');
        validateOutput(text);
        return `${cue.index}\n${cue.start} --> ${cue.end}\n${text}`;
      })
      .join('\n\n') + '\n'
  );
}

export function outputFilename(filename: string, language: string): string {
  const basename = [...filename.replace(/\.srt$/i, '')]
    .map((character) =>
      character.charCodeAt(0) < 32 || /[\\/:*?"<>|]/.test(character)
        ? '_'
        : character,
    )
    .join('');
  return `${basename}.${language.replace(/[^a-zA-Z0-9-]/g, '')}.srt`;
}
