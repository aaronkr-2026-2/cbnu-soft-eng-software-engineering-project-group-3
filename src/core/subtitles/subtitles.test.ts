import { describe, expect, it } from 'vitest';
import { parseSrt } from '../srt/srt';
import { plainText } from '../srt/markup';
import {
  continuationGroups,
  formatTranslation,
  graphemes,
  quality,
  speakerSegments,
} from './subtitles';

const cue = parseSrt('1\n00:00:01,000 --> 00:00:03,000\nHello.')[0];
describe('subtitle presentation and quality', () => {
  it('counts grapheme clusters, not UTF-16 units', () =>
    expect(graphemes('👩🏽‍💻e\u0301')).toBe(2));
  it('keeps 42 visible graphemes on one line, wraps 43', () => {
    expect(formatTranslation(['x'.repeat(42)], 'mn')).not.toContain('\n');
    expect(
      formatTranslation(['x'.repeat(21) + ' ' + 'x'.repeat(21)], 'mn'),
    ).toContain('\n');
  });
  it('flags unbreakable and excessive text without losing characters', () => {
    const output = formatTranslation(['x'.repeat(100)], 'mn');
    expect(output).toHaveLength(100);
    expect(quality(output, cue, 'adult').warnings.length).toBeGreaterThan(0);
  });
  it('enforces exact adult/children CPS boundaries', () => {
    expect(quality('x'.repeat(40), cue, 'adult').warnings).toEqual([]);
    expect(quality('x'.repeat(41), cue, 'adult').warnings.join(' ')).toContain(
      '20.5 CPS',
    );
    expect(
      quality('x'.repeat(35), cue, 'children').warnings.join(' '),
    ).toContain('17.5 CPS');
    expect(quality('x'.repeat(34), cue, 'children').capacity).toBe(34);
  });
  it('detects source speaker boundaries through markup and preserves caseless translations', () => {
    expect(speakerSegments('<i>- Hello. - Goodbye.</i>')).toEqual([
      '<i>- Hello.</i>',
      '<i>- Goodbye.</i>',
    ]);
    expect(formatTranslation(['- こんにちは', '- さようなら'], 'ja')).toBe(
      '- こんにちは\n- さようなら',
    );
  });
  it('preserves three speakers and flags the two-line conflict', () => {
    const output = formatTranslation(['- One', '- Two', '- Three'], 'en');
    expect(output.split('\n')).toHaveLength(3);
    expect(quality(output, cue, 'adult').warnings).toContain(
      '3 lines; maximum is 2.',
    );
  });
  it('wraps markup without dropping words or producing invalid tags', () => {
    const text =
      '<i>This sentence has enough words to wrap into two readable display lines.</i>';
    const output = formatTranslation([text], 'en');
    expect(plainText(output).replace('\n', ' ')).toBe(plainText(text));
    expect(output.split('\n')).toHaveLength(2);
  });
  it('uses locale word boundaries to wrap long CJK translations without spaces', () => {
    const text =
      'これは字幕として読みやすい長さに分ける必要がある日本語の翻訳です。これは二つ目の文です。';
    const output = formatTranslation([text], 'ja');
    expect(output).toContain('\n');
    expect(plainText(output).replace('\n', '')).toBe(text);
  });
  it('does not turn inline descriptions or music into forced display lines', () => {
    expect(
      formatTranslation(
        [
          { text: 'Hello,' },
          { text: '[sighs]' },
          { text: 'I am here.' },
          { text: '♪ Song ♪' },
        ],
        'en',
      ),
    ).toBe('Hello, [sighs] I am here. ♪ Song ♪');
  });
  it('groups continuation cues without modifying identities or timing', () => {
    const cues = [
      cue,
      { ...cue, text: 'continuing here' },
      { ...cue, text: '...and here' },
      { ...cue, text: 'New sentence.' },
    ];
    expect(continuationGroups(cues)).toEqual([1, 1, 1, 2]);
  });
});
