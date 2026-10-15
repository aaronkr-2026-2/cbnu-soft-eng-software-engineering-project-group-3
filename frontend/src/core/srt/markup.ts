export type Mark = 'i' | 'b' | 'u';
export interface TextRun {
  text: string;
  marks: Mark[];
}

/** A deliberately small SRT markup grammar. Attributes and executable HTML are rejected. */
export function textRuns(text: string): TextRun[] {
  const stack: Mark[] = [];
  const runs: TextRun[] = [];
  let offset = 0;
  for (const match of text.matchAll(/<[^>]*>/g)) {
    if (match.index > offset)
      runs.push({ text: text.slice(offset, match.index), marks: [...stack] });
    const tag = /^<(\/?)([ibu])>$/i.exec(match[0]);
    if (!tag)
      throw new Error(
        'Unsupported formatting. Only <i>, <b>, and <u> without attributes are supported.',
      );
    const mark = tag[2].toLowerCase() as Mark;
    if (tag[1]) {
      if (stack.pop() !== mark)
        throw new Error(
          'Formatting tags must be balanced and correctly nested.',
        );
    } else {
      stack.push(mark);
    }
    offset = match.index + match[0].length;
  }
  if (offset < text.length)
    runs.push({ text: text.slice(offset), marks: [...stack] });
  if (stack.length) throw new Error('Formatting tags must be closed.');
  return runs;
}

export function plainText(text: string): string {
  return textRuns(text)
    .map((run) => run.text)
    .join('');
}

export function serializeRuns(runs: TextRun[]): string {
  return runs
    .map(({ text, marks }) =>
      text
        ? marks.map((mark) => `<${mark}>`).join('') +
          text +
          [...marks]
            .reverse()
            .map((mark) => `</${mark}>`)
            .join('')
        : '',
    )
    .join('');
}

/** Slice by visible UTF-16 offsets while keeping markup balanced on both sides. */
export function sliceMarkup(text: string, start: number, end: number): string {
  let offset = 0;
  return serializeRuns(
    textRuns(text).map((run) => {
      const value = run.text.slice(
        Math.max(0, start - offset),
        Math.max(0, end - offset),
      );
      offset += run.text.length;
      return { ...run, text: value };
    }),
  );
}

export function normalizeMarkup(text: string): string {
  const normalized = serializeRuns(
    textRuns(text).map((run) => ({
      ...run,
      text: run.text.replace(/\s+/g, ' '),
    })),
  );
  const plain = plainText(normalized);
  return sliceMarkup(
    normalized,
    plain.length - plain.trimStart().length,
    plain.trimEnd().length,
  );
}

export function providerHtml(text: string): string {
  return serializeRuns(
    textRuns(text).map((run) => ({
      ...run,
      text: run.text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;'),
    })),
  );
}

/** Decode entities once, after transport. Validation/rendering never executes HTML. */
export function decodeEntities(text: string): string {
  const named: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: '\u00a0',
  };
  return text.replace(
    /&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,
    (whole, entity: string) => {
      if (!entity.startsWith('#')) return named[entity.toLowerCase()] ?? whole;
      const value =
        entity[1].toLowerCase() === 'x'
          ? parseInt(entity.slice(2), 16)
          : Number(entity.slice(1));
      return value > 0 &&
        value <= 0x10ffff &&
        !(value >= 0xd800 && value <= 0xdfff)
        ? String.fromCodePoint(value)
        : whole;
    },
  );
}
