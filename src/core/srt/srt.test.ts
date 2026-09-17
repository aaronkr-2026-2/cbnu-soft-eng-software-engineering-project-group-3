import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { parseSrt, serializeSrt, outputFilename } from './srt';
import { decodeEntities, plainText, sliceMarkup } from './markup';

const source =
  '7\n00:00:01,000 --> 00:00:04,000\n<i>Hello there.</i>\nSecond line.\n\n12\n00:00:05,000 --> 00:00:06,500\nGoodbye.\n';

describe('baseline characterization (historical HTML remains unchanged)', () => {
  const html = readFileSync('srt-translator-beta-3.html', 'utf8');
  const parserSource = html.slice(
    html.indexOf('const SRTParser ='),
    html.indexOf('const SentenceGrouper ='),
  );
  const legacy = runInNewContext(parserSource + '\nSRTParser;') as {
    parse: (raw: string) => { index: number }[];
    serialize: (entries: unknown[]) => string;
  };
  it('preserves valid timing/text but historically renumbers serialized cue indexes', () => {
    const entries = legacy.parse(source);
    expect(entries.map((entry) => entry.index)).toEqual([7, 12]);
    expect(legacy.serialize(entries)).toMatch(/^1\n/);
  });
  it('historically skips a malformed block in a mixed file', () => {
    expect(legacy.parse(source + '\nmalformed block')).toHaveLength(2);
  });
});

describe('cue-preserving SRT domain', () => {
  it('round trips cue indexes, timestamps, markup, and multiline text', () =>
    expect(serializeSrt(parseSrt(source))).toBe(source));
  it('normalizes BOM and CRLF while preserving Unicode', () => {
    const fixture =
      '\ufeff' +
      source.replace('Goodbye.', 'Баяртай 👩🏽‍💻').replace(/\n/g, '\r\n');
    expect(serializeSrt(parseSrt(fixture))).toContain('Баяртай 👩🏽‍💻');
  });
  it('assigns unique internal IDs even when source indexes repeat', () => {
    const cues = parseSrt(source.replace('\n12\n', '\n7\n'));
    expect(cues.map((cue) => cue.index)).toEqual(['7', '7']);
    expect(new Set(cues.map((cue) => cue.id)).size).toBe(2);
  });
  it.each([
    '',
    'bad file',
    source + '\nmalformed block',
    source.replace('00:00:04,000', '00:00:00,000'),
    source.replace('00:00:04,000', '00:99:04,000'),
  ])('rejects malformed/empty input without silent loss', (raw) =>
    expect(() => parseSrt(raw)).toThrow(),
  );
  it.each([
    '<script>alert(1)</script>',
    '<font color="red">text</font>',
    '<i>unclosed',
    '<i><b>wrong</i></b>',
    '{\\an8}Hello',
  ])('rejects unsupported/unbalanced formatting', (text) =>
    expect(() => parseSrt(source.replace('Goodbye.', text))).toThrow(),
  );
  it('rejects incomplete and invalid downloads', () => {
    const cues = parseSrt(source);
    expect(() => serializeSrt(cues, { 'cue-1': 'Hola' })).toThrow('incomplete');
    expect(() =>
      serializeSrt(cues, { 'cue-1': 'Hola', 'cue-2': 'bad\n\nblock' }),
    ).toThrow('blank lines');
  });
  it('serializes saved edits at original boundaries', () => {
    const output = serializeSrt(parseSrt(source), {
      'cue-1': 'Сайн байна уу.',
      'cue-2': '<b>Баяртай.</b>',
    });
    expect(parseSrt(output).map((cue) => [cue.index, cue.start])).toEqual([
      ['7', '00:00:01,000'],
      ['12', '00:00:05,000'],
    ]);
    expect(output).toContain('<b>Баяртай.</b>');
  });
  it('creates a filename with the language', () =>
    expect(outputFilename('movie.SRT', 'mn')).toBe('movie.mn.srt'));
  it('slices visible ranges with balanced tags', () => {
    expect(sliceMarkup('<i>Hello world</i>', 6, 11)).toBe('<i>world</i>');
    expect(plainText('<b>A</b><u>B</u>')).toBe('AB');
  });
  it('decodes entities exactly once', () =>
    expect(decodeEntities('A &amp; B &#39; &#x1f600; &amp;lt;')).toBe(
      "A & B ' 😀 &lt;",
    ));
});
