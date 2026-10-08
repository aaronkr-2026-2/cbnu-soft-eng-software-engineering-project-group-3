import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTranslator } from './useTranslator';

const fixture = '1\n00:00:01,000 --> 00:00:04,000\nHello.';
function file(text = fixture, name = 'test.srt'): File {
  return {
    name,
    size: text.length,
    arrayBuffer: async () => new TextEncoder().encode(text).buffer,
  } as File;
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
const json = (body: unknown) => new Response(JSON.stringify(body));
describe('translator state', () => {
  it('loads target languages automatically without sending a translation probe', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      json({
        data: {
          languages: [
            { language: 'en', name: 'English' },
            { language: 'mn', name: 'Mongolian' },
          ],
        },
      }),
    );
    vi.stubGlobal('fetch', fetcher);
    const { result } = renderHook(useTranslator);
    await waitFor(() => expect(result.current.serviceStatus).toBe('ready'));
    expect(result.current.languages).toEqual([
      { code: 'mn', name: 'Mongolian' },
    ]);
    expect(fetcher).toHaveBeenCalledWith(
      expect.stringContaining('/languages?model=nmt'),
      expect.objectContaining({ method: 'GET' }),
    );
  });
  it('keeps Start and Download disabled until prerequisites are valid', async () => {
    const { result } = renderHook(useTranslator);
    await act(() => result.current.loadFile(file()));
    expect(result.current.cues).toHaveLength(1);
    expect(result.current.canStart).toBe(false);
    expect(result.current.complete).toBe(false);
  });
  it('ignores a stale file read after another file is loaded', async () => {
    const slow = deferred<ArrayBuffer>();
    const { result } = renderHook(useTranslator);
    let first!: Promise<void>;
    act(() => {
      first = result.current.loadFile({
        name: 'old.srt',
        size: 20,
        arrayBuffer: () => slow.promise,
      } as File);
    });
    await act(() =>
      result.current.loadFile(
        file(fixture.replace('Hello.', 'New file.'), 'new.srt'),
      ),
    );
    await act(async () => {
      slow.resolve(new TextEncoder().encode(fixture).buffer);
      await first;
    });
    expect(result.current.filename).toBe('new.srt');
    expect(result.current.cues[0].text).toBe('New file.');
  });
  it('clears old cues after an invalid replacement', async () => {
    const { result } = renderHook(useTranslator);
    await act(() => result.current.loadFile(file()));
    await act(() => result.current.loadFile(file('not subtitles', 'bad.txt')));
    expect(result.current.cues).toHaveLength(0);
    expect(result.current.error).toContain('.srt extension');
  });
  it('cannot restore a cleared service from an in-flight language lookup', async () => {
    const pending = deferred<Response>();
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(pending.promise));
    const { result } = renderHook(useTranslator);
    let test!: Promise<void>;
    act(() => {
      test = result.current.loadLanguages();
    });
    act(() => result.current.invalidateService());
    await act(async () => {
      pending.resolve(
        json({ data: { languages: [{ language: 'es', name: 'Spanish' }] } }),
      );
      await test;
    });
    expect(result.current.serviceStatus).toBe('empty');
  });
  it('rejects over-limit files without reading their contents', async () => {
    const arrayBuffer = vi.fn();
    const { result } = renderHook(useTranslator);
    await act(() =>
      result.current.loadFile({
        name: 'large.srt',
        size: 5 * 1024 * 1024 + 1,
        arrayBuffer,
      } as unknown as File),
    );
    expect(arrayBuffer).not.toHaveBeenCalled();
    expect(result.current.error).toContain('5 MiB');
  });
  it('protects saved edits when reset is declined', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const { result } = renderHook(useTranslator);
    await act(() => result.current.loadFile(file()));
    act(() => result.current.saveEdit('cue-1', 'Saved edit'));
    act(() => result.current.restart());
    expect(result.current.translations['cue-1']).toBe('Saved edit');
    expect(result.current.edited['cue-1']).toBe(true);
  });
});
