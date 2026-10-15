import { describe, expect, it, vi } from 'vitest';
import { parseSrt } from '../../core/srt/srt';
import { estimateTranslation } from '../../services/translation/batches';
import type { TranslationProvider } from '../../services/translation/provider';
import { runJob } from './job';

const cues = parseSrt('7\n00:00:01,000 --> 00:00:04,000\n- Hello. - Goodbye.');
const batches = estimateTranslation(cues, 'ja').batches;
const callbacks = () => ({
  active: vi.fn(),
  completed: vi.fn(),
  request: vi.fn(),
});
function provider(
  translateBatch: TranslationProvider['translateBatch'],
): TranslationProvider {
  return { translateBatch, getLanguages: vi.fn() };
}
describe('job integrity', () => {
  it('maps reordered IDs and keeps mandatory speakers in a caseless script', async () => {
    const cb = callbacks();
    await runJob(
      provider(async () => [
        { id: 'cue-1:1', text: 'さようなら' },
        { id: 'cue-1:0', text: 'こんにちは' },
      ]),
      batches,
      'ja',
      new AbortController().signal,
      cb,
    );
    expect(cb.completed).toHaveBeenCalledWith({
      'cue-1': '- こんにちは\n- さようなら',
    });
  });
  it.each(
    [
      [{ id: 'cue-1:0', text: 'one' }],
      [
        { id: 'cue-1:0', text: 'one' },
        { id: 'cue-1:0', text: 'two' },
      ],
      [
        { id: 'cue-1:0', text: 'one' },
        { id: 'extra', text: 'two' },
      ],
    ].map((results) => ({ results })),
  )(
    'rejects missing, duplicate, or foreign IDs without partial commits',
    async ({ results }) => {
      const cb = callbacks();
      await expect(
        runJob(
          provider(async () => results),
          batches,
          'ja',
          new AbortController().signal,
          cb,
        ),
      ).rejects.toThrow('IDs');
      expect(cb.completed).not.toHaveBeenCalled();
    },
  );
  it('ignores a response delivered after cancellation', async () => {
    const controller = new AbortController();
    const cb = callbacks();
    await expect(
      runJob(
        provider(async () => {
          controller.abort();
          return [
            { id: 'cue-1:0', text: 'one' },
            { id: 'cue-1:1', text: 'two' },
          ];
        }),
        batches,
        'ja',
        controller.signal,
        cb,
      ),
    ).rejects.toThrow('Cancelled');
    expect(cb.completed).not.toHaveBeenCalled();
  });
  it('preserves successful earlier batches when a later batch fails', async () => {
    const two = [...batches, ...batches];
    const cb = callbacks();
    const translate = vi
      .fn()
      .mockResolvedValueOnce([
        { id: 'cue-1:0', text: 'one' },
        { id: 'cue-1:1', text: 'two' },
      ])
      .mockRejectedValueOnce(new Error('failure'));
    await expect(
      runJob(provider(translate), two, 'ja', new AbortController().signal, cb),
    ).rejects.toThrow('failure');
    expect(cb.completed).toHaveBeenCalledTimes(1);
  });
});

it('commits a complete joined group with unchanged cue identities', async () => {
  const source = parseSrt(
    '101\n00:00:01,000 --> 00:00:03,000\nI was cooking\n\n102\n00:00:03,000 --> 00:00:06,000\nwhen the telephone rang.',
  );
  const prepared = estimateTranslation(source, 'en').batches;
  const cb = callbacks();
  const text = 'I was cooking when the telephone rang.';
  const translate = vi.fn(async () => [{ id: prepared[0].inputs[0].id, text }]);
  await runJob(
    provider(translate),
    prepared,
    'en',
    new AbortController().signal,
    cb,
  );
  expect(translate.mock.calls).toHaveLength(1);
  const result = cb.completed.mock.calls[0][0];
  expect(Object.keys(result)).toEqual(['cue-1', 'cue-2']);
  expect(Object.values(result).join(' ').replace(/\s+/g, ' ')).toBe(text);
});

it('attributes an unallocatable group to the failed batch without saving partial output', async () => {
  const source = parseSrt(
    '1\n00:00:01,000 --> 00:00:03,000\nOne\n\n2\n00:00:03,000 --> 00:00:06,000\ncontinues',
  );
  const prepared = estimateTranslation(source, 'en').batches;
  const cb = { ...callbacks(), failed: vi.fn() };
  await expect(
    runJob(
      provider(async () => [{ id: prepared[0].inputs[0].id, text: 'Yes.' }]),
      prepared,
      'en',
      new AbortController().signal,
      cb,
    ),
  ).rejects.toThrow('too short');
  expect(cb.completed).not.toHaveBeenCalled();
  expect(cb.failed.mock.calls[0][0]).toEqual(['cue-1', 'cue-2']);
});

it('saves a valid sibling group when another group cannot be redistributed', async () => {
  const source = parseSrt(
    '1\n00:00:01,000 --> 00:00:03,000\nOne\n\n2\n00:00:03,000 --> 00:00:06,000\ncontinues\n\n3\n00:00:07,000 --> 00:00:10,000\nSeparate.',
  );
  const prepared = estimateTranslation(source, 'en').batches;
  const cb = { ...callbacks(), failed: vi.fn() };
  await expect(
    runJob(
      provider(async () => [
        { id: prepared[0].inputs[0].id, text: 'Yes.' },
        { id: prepared[0].inputs[1].id, text: 'Saved.' },
      ]),
      prepared,
      'en',
      new AbortController().signal,
      cb,
    ),
  ).rejects.toThrow('too short');
  expect(cb.completed).toHaveBeenCalledWith({ 'cue-3': 'Saved.' });
  expect(cb.failed).toHaveBeenCalledWith(['cue-1', 'cue-2'], expect.any(Error));
});

it('reports every failed group while preserving a valid sibling group', async () => {
  const source = parseSrt(
    '1\n00:00:01,000 --> 00:00:03,000\nOne\n\n2\n00:00:03,000 --> 00:00:06,000\ncontinues\n\n3\n00:00:07,000 --> 00:00:09,000\nTwo\n\n4\n00:00:09,000 --> 00:00:12,000\ncontinues\n\n5\n00:00:13,000 --> 00:00:16,000\nSeparate.',
  );
  const prepared = estimateTranslation(source, 'en').batches;
  const cb = { ...callbacks(), failed: vi.fn() };
  await expect(
    runJob(
      provider(async () => [
        { id: prepared[0].inputs[0].id, text: 'Yes.' },
        { id: prepared[0].inputs[1].id, text: 'No.' },
        { id: prepared[0].inputs[2].id, text: 'Saved.' },
      ]),
      prepared,
      'en',
      new AbortController().signal,
      cb,
    ),
  ).rejects.toThrow('too short');
  expect(cb.completed).toHaveBeenCalledWith({ 'cue-5': 'Saved.' });
  expect(cb.failed).toHaveBeenNthCalledWith(
    1,
    ['cue-1', 'cue-2'],
    expect.any(Error),
  );
  expect(cb.failed).toHaveBeenNthCalledWith(
    2,
    ['cue-3', 'cue-4'],
    expect.any(Error),
  );
});
