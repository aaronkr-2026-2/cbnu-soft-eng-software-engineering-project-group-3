import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseSrt } from '../srt/srt';
import { plainText, textRuns } from '../srt/markup';
import {
  groupCues,
  sourceSections,
  speechUnits,
  distributeTranslation,
  MAX_GROUP_CUES,
} from './groups';
import { estimateTranslation } from '../../services/translation/batches';
import { translationBody } from '../../services/translation/googleTranslate';

const base = parseSrt('101\n00:00:01,000 --> 00:00:04,000\nHello.')[0];
const cues = (texts: string[]) =>
  texts.map((text, i) => ({
    ...base,
    id: `cue-${i + 1}`,
    index: String(101 + i),
    text,
  }));
const compact = (text: string) => plainText(text).replace(/\s+/g, '');

describe('connected speech input', () => {
  it.each(['nmt', 'tllm'] as const)(
    'sends the pizza example as one normalized %s input',
    (model) => {
      const source = cues([
        'I did get up early\nand then the phone rang, but',
        'the pizza in the oven from the supermarket was burning so I had to...',
        'i just had to get the burnt pizza out or otherwise it would have tripped the smoke alarm.',
      ]);
      const before = structuredClone(source);
      const batch = estimateTranslation(source, 'mn', model).batches[0];
      const request = JSON.parse(translationBody(batch.inputs, 'mn', model));
      expect(request.q).toEqual([
        source.map((cue) => cue.text.replace(/\s+/g, ' ')).join(' '),
      ]);
      expect(request.model).toBe(model);
      expect(batch.groups[0].units[0].parts).toHaveLength(3);
      expect(source).toEqual(before);
    },
  );
  it('recognizes markup, lowercase and both ellipses; stops at capital/sound/speaker/music starts', () => {
    const source = cues([
      'First',
      '<i>continuation</i>',
      '...and more',
      '…then',
      'New',
      '[sighs]',
      '- next speaker',
      '♪ Music ♪',
    ]);
    expect(groupCues(source).map((group) => group.length)).toEqual([
      4, 1, 1, 1, 1,
    ]);
  });
  it('keeps real punctuation and gives descriptions/music their own units', () => {
    const units = speechUnits(cues(['Hello, [sighs] I\nam here. ♪ A song ♪']));
    expect(units.map((unit) => unit.text)).toEqual([
      'Hello,',
      '[sighs]',
      'I am here.',
      '♪ A song ♪',
    ]);
  });
  it('does not turn hyphens inside protected descriptions or music into speakers', () => {
    const source = cues([
      'Hello [sighs - quietly] [sighs - Quietly] there. ♪ low - Music ♪',
      '- [sighs] words',
    ]);
    expect(
      sourceSections(source[0].text).map((section) => section.text),
    ).toEqual([
      'Hello',
      '[sighs - quietly]',
      '[sighs - Quietly]',
      'there.',
      '♪ low - Music ♪',
    ]);
    const units = speechUnits([source[1]]);
    expect(units.map((unit) => unit.text)).toEqual(['- [sighs]', 'words']);
    expect(units.some((unit) => unit.text.trim() === '-')).toBe(false);
    expect(
      estimateTranslation([source[1]], 'mn').batches[0].inputs.map(
        (input) => input.text,
      ),
    ).toEqual(['- [sighs]', 'words']);
  });
  it('joins the final speaker with the following cue without merging speakers', () => {
    const source = cues(['- One.\n- the second speaker', 'continues here.']);
    const units = speechUnits(groupCues(source)[0]);
    expect(units.map((unit) => unit.text)).toEqual([
      '- One.',
      '- the second speaker continues here.',
    ]);
    expect(units[0].parts).toHaveLength(1);
    expect(units[1].parts).toHaveLength(2);
  });
  it('bounds long groups without losing or changing source cues', () => {
    const source = cues(Array(MAX_GROUP_CUES + 1).fill('continuing'));
    expect(groupCues(source).map((group) => group.length)).toEqual([
      MAX_GROUP_CUES,
      1,
    ]);
    expect(groupCues(source).flat()).toEqual(source);
    expect(groupCues(cues(['A'.repeat(3000), 'a'.repeat(3000)]))).toHaveLength(
      2,
    );
  });
  it('skips complete original groups without joining across their missing neighbours', () => {
    const source = cues(['First', 'continues', 'Separate', 'continuation']);
    const estimate = estimateTranslation(source, 'mn', 'nmt', {
      'cue-1': 'Done',
      'cue-2': 'Also done',
    });
    expect(estimate.batches[0].inputs.map((input) => input.text)).toEqual([
      'Separate continuation',
    ]);
  });
  it('keeps the demo fixture parseable and joins its continuation examples', () => {
    const demo = parseSrt(readFileSync('examples/demo.srt', 'utf8'));
    expect(demo).toHaveLength(51);
    const groups = groupCues(demo);
    expect(
      groups.find((group) => group[0]?.index === '41')?.map((cue) => cue.index),
    ).toEqual(['41', '42', '43']);
    expect(
      groups.find((group) => group[0]?.index === '45')?.map((cue) => cue.index),
    ).toEqual(['45', '46']);
    expect(
      groups.find((group) => group[0]?.index === '48')?.map((cue) => cue.index),
    ).toEqual(['48', '49', '50']);
  });
});

describe('redistribution across fixed cues', () => {
  it('preserves every returned character, markup and source timecode', () => {
    const source = cues(['First', 'continues', 'and ends']);
    const text =
      '<i>We took the pizza out, before the smoke alarm went off.</i>';
    const before = structuredClone(source);
    const parts = speechUnits(source)[0].parts;
    const chunks = distributeTranslation(text, parts, 'en', 20);
    expect(chunks).toHaveLength(3);
    expect(chunks.every((chunk) => plainText(chunk).trim())).toBe(true);
    chunks.forEach((chunk) => expect(() => textRuns(chunk)).not.toThrow());
    expect(compact(chunks.join(''))).toBe(compact(text));
    expect(source).toEqual(before);
  });
  it.each([
    ['ja', 'これは長い翻訳です。ピザを取り出して火災を防ぎました。'],
    ['mn', 'Бид пиццаг гаргаж аваад галын дохиоллыг дуугарахаас сэргийлсэн.'],
    ['en', 'A family 👩🏽‍💻 and a café owner saved the pizza, before the alarm.'],
  ])('preserves text and graphemes in %s', (language, text) => {
    const parts = speechUnits(cues(['One', 'continues', 'and more']))[0].parts;
    const chunks = distributeTranslation(text, parts, language, 17);
    expect(compact(chunks.join(''))).toBe(compact(text));
    expect(chunks.every((chunk) => plainText(chunk).trim())).toBe(true);
  });
  it('gives longer time slots more reading capacity instead of using source word ratios', () => {
    const source = cues(['Many many many many words', 'few']);
    source[0].endMs = source[0].startMs + 1000;
    source[1].endMs = source[1].startMs + 4000;
    const chunks = distributeTranslation(
      'One two three four five six seven eight nine ten eleven twelve.',
      speechUnits(source)[0].parts,
      'en',
      20,
    );
    expect(plainText(chunks[1]).length).toBeGreaterThan(
      plainText(chunks[0]).length,
    );
  });
  it('rejects too-short output instead of producing empty cues or duplicating text', () => {
    expect(() =>
      distributeTranslation(
        'Yes.',
        speechUnits(cues(['One', 'two', 'three']))[0].parts,
        'en',
        20,
      ),
    ).toThrow('too short');
  });
});
