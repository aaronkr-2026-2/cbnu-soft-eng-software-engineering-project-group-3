import { afterEach, describe, expect, it, vi } from 'vitest';
import translationHandler from '../../api/translation.mjs';
import languagesHandler from '../../api/translation/languages.mjs';

function configureTestGateway() {
  vi.stubEnv('NODE_ENV', 'test');
  vi.stubEnv('GOOGLE_CLOUD_API_KEY', 'test-cloud-key');
  vi.stubEnv('GOOGLE_CLOUD_PROJECT_ID', 'test-project');
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('Vercel translation functions', () => {
  it('serves the language endpoint as a same-origin GET function', async () => {
    configureTestGateway();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: { languages: [{ language: 'ko', name: 'Korean' }] },
          }),
          { status: 200 },
        ),
      ),
    );

    const response = await languagesHandler.fetch(
      new Request(
        'https://srt-translator.example/api/translation/languages?model=nmt',
      ),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(response.headers.get('access-control-allow-origin')).toBeNull();
    await expect(response.json()).resolves.toEqual({
      data: { languages: [{ language: 'ko', name: 'Korean' }] },
    });
  });

  it('proxies a valid translation through the POST function', async () => {
    configureTestGateway();
    const upstream = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: { translations: [{ translatedText: '안녕' }] },
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', upstream);

    const response = await translationHandler.fetch(
      new Request('https://srt-translator.example/api/translation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: ['Hello'],
          source: 'en',
          target: 'ko',
          format: 'html',
          model: 'nmt',
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(upstream).toHaveBeenCalledTimes(1);
    await expect(response.json()).resolves.toEqual({
      data: { translations: [{ translatedText: '안녕' }] },
    });
  });

  it('rejects wrong methods and oversized declared bodies before Google', async () => {
    configureTestGateway();
    const upstream = vi.fn();
    vi.stubGlobal('fetch', upstream);

    const wrongMethod = await translationHandler.fetch(
      new Request('https://srt-translator.example/api/translation'),
    );
    expect(wrongMethod.status).toBe(405);
    expect(wrongMethod.headers.get('allow')).toBe('POST');

    const oversized = await translationHandler.fetch(
      new Request('https://srt-translator.example/api/translation', {
        method: 'POST',
        headers: { 'Content-Length': '100001' },
        body: '{}',
      }),
    );
    expect(oversized.status).toBe(413);
    expect(upstream).not.toHaveBeenCalled();
  });

  it('rejects an oversized streamed body without reading the whole request', async () => {
    configureTestGateway();
    const upstream = vi.fn();
    vi.stubGlobal('fetch', upstream);
    let reads = 0;
    const body = new ReadableStream({
      pull(controller) {
        reads++;
        controller.enqueue(new Uint8Array(50_001));
      },
    });
    const response = await translationHandler.fetch(
      new Request('https://srt-translator.example/api/translation', {
        method: 'POST',
        body,
        duplex: 'half',
      }),
    );
    expect(response.status).toBe(413);
    expect(reads).toBeLessThanOrEqual(3);
    expect(upstream).not.toHaveBeenCalled();
  });

  it('returns a non-retryable fail-closed category before public enablement', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('GOOGLE_CLOUD_API_KEY', 'test-cloud-key');
    const upstream = vi.fn();
    vi.stubGlobal('fetch', upstream);

    const response = await languagesHandler.fetch(
      new Request(
        'https://srt-translator.example/api/translation/languages?model=nmt',
      ),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: {
        message: 'Translation gateway request failed.',
        category: 'gateway_disabled',
      },
    });
    expect(upstream).not.toHaveBeenCalled();
  });
});
