import { afterEach, describe, expect, it, vi } from 'vitest';
import { GoogleTranslate, TRANSLATE_ENDPOINT } from './googleTranslate';
import { safeError } from './provider';
import { estimateTranslation } from './batches';
import { parseSrt } from '../../core/srt/srt';

const signal = () => new AbortController().signal;
const input = [{ id: 'cue-7:0', text: 'Hello &amp; goodbye.' }];
const response = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status });
afterEach(() => vi.useRealTimers());
describe('official Google adapter', () => {
  it('uses the owner-funded gateway and NMT POST with stable local mapping', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      response({
        data: { translations: [{ translatedText: 'Hola &amp; adiós.' }] },
      }),
    );
    vi.stubGlobal('fetch', fetcher);
    const provider = new GoogleTranslate('nmt');
    expect(await provider.translateBatch(input, 'es', signal())).toEqual([
      { id: 'cue-7:0', text: 'Hola & adiós.' },
    ]);
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toBe(TRANSLATE_ENDPOINT);
    expect(options.headers['x-goog-api-key']).toBeUndefined();
    expect(JSON.parse(options.body)).toEqual({
      q: ['Hello &amp; goodbye.'],
      source: 'en',
      target: 'es',
      format: 'html',
      model: 'nmt',
    });
  });
  it.each(
    [
      [],
      [{ translatedText: '' }],
      [{ translatedText: '<img src=x onerror=alert(1)>' }],
      [{ translatedText: 'one' }, { translatedText: 'two' }],
    ].map((translations) => ({ translations })),
  )('rejects malformed/mismatched translations', async ({ translations }) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(response({ data: { translations } })),
    );
    await expect(
      new GoogleTranslate('fake').translateBatch(input, 'es', signal()),
    ).rejects.toThrow();
  });
  it('rejects changed formatting', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          response({ data: { translations: [{ translatedText: 'Hola' }] } }),
        ),
    );
    await expect(
      new GoogleTranslate('fake').translateBatch(
        [{ id: '1', text: '<i>Hello</i>' }],
        'es',
        signal(),
      ),
    ).rejects.toThrow('formatting');
  });
  it('does not retry permission errors or echo response bodies', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        response({ error: { message: 'secret-key-in-error' } }, 403),
      );
    vi.stubGlobal('fetch', fetcher);
    await expect(
      new GoogleTranslate('fake').translateBatch(input, 'es', signal()),
    ).rejects.toThrow('denied the project gateway request');
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(safeError(new Error('secret-key-in-error'))).not.toContain('secret');
  });
  it('retries transient failures with an explicit bounded request count', async () => {
    vi.useFakeTimers();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response({}, 503))
      .mockResolvedValueOnce(response({}, 429))
      .mockResolvedValue(
        response({ data: { translations: [{ translatedText: 'Hola' }] } }),
      );
    vi.stubGlobal('fetch', fetcher);
    const onRequest = vi.fn();
    const promise = new GoogleTranslate('fake').translateBatch(
      input,
      'es',
      signal(),
      onRequest,
    );
    await vi.runAllTimersAsync();
    await expect(promise).resolves.toEqual([{ id: 'cue-7:0', text: 'Hola' }]);
    expect(onRequest).toHaveBeenCalledTimes(3);
  });
  it('times out response processing and stops after three attempts', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn(
      (_url: string, options: RequestInit) =>
        new Promise((_resolve, reject) =>
          options.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          ),
        ),
    );
    vi.stubGlobal('fetch', fetcher);
    const assertion = expect(
      new GoogleTranslate('fake', 10).translateBatch(input, 'es', signal()),
    ).rejects.toThrow('timed out');
    await vi.runAllTimersAsync();
    await assertion;
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
  it('aborts a retry delay immediately', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn().mockResolvedValue(response({}, 503));
    vi.stubGlobal('fetch', fetcher);
    const controller = new AbortController();
    const assertion = expect(
      new GoogleTranslate('fake').translateBatch(
        input,
        'es',
        controller.signal,
      ),
    ).rejects.toThrow('Cancelled');
    await vi.advanceTimersByTimeAsync(1);
    controller.abort();
    await assertion;
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('fetches and validates supported languages using the temporary key', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        response({
          data: { languages: [{ language: 'mn', name: 'Mongolian' }] },
        }),
      ),
    );
    const provider = new GoogleTranslate('fake');
    expect(await provider.getLanguages(signal())).toEqual([
      { code: 'mn', name: 'Mongolian' },
    ]);
    provider.clear();
  });
});

describe('batch sizing and estimates', () => {
  const cue = parseSrt('1\n00:00:01,000 --> 00:00:05,000\nHello.')[0];
  it('counts the exact encoded provider strings in code points', () => {
    const estimate = estimateTranslation(
      [{ ...cue, text: '<i>A & B 👩</i>' }],
      'mn',
    );
    expect(estimate.characters).toBe(
      [...estimate.batches[0].inputs[0].text].length,
    );
    expect(estimate.usd).toBe((estimate.characters / 1000000) * 20);
    expect(estimate.retryCeilingUsd).toBe(estimate.usd * 3);
  });
  it('splits batches at the string limit and keeps each cue’s speaker segments together', () => {
    const cues = Array.from({ length: 65 }, (_, i) => ({
      ...cue,
      id: String(i),
      text: '- One. - Two.',
    }));
    const estimate = estimateTranslation(cues, 'mn');
    expect(estimate.batches.map((batch) => batch.inputs.length)).toEqual([
      128, 2,
    ]);
  });
  it('rejects an oversized cue without losing text', () =>
    expect(() =>
      estimateTranslation([{ ...cue, text: 'x'.repeat(100001) }], 'mn'),
    ).toThrow('too large'));
});
