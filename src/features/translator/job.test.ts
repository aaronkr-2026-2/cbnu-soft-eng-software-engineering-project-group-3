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
  return { translateBatch, getLanguages: vi.fn(), clear: vi.fn() };
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
