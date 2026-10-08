import { describe, expect, it, vi } from 'vitest';
import {
  gatewayFailure,
  getLanguages,
  MAX_GATEWAY_BODY_BYTES,
  parseJsonBytes,
  translate,
} from './translationGateway.mjs';

const baseEnv = {
  GOOGLE_CLOUD_API_KEY: 'test-cloud-key',
  GOOGLE_CLOUD_PROJECT_ID: 'test-project',
  GOOGLE_TRANSLATE_TLLM_LOCATION: 'us-central1',
};

describe('shared translation gateway', () => {
  it('loads the NMT language catalogue without exposing the credential', async () => {
    const request = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ data: { languages: [{ language: 'ko' }] } }),
          { status: 200 },
        ),
      );

    const result = await getLanguages('nmt', {
      env: baseEnv,
      fetch: request,
    });

    expect(result).toEqual({ data: { languages: [{ language: 'ko' }] } });
    expect(request).toHaveBeenCalledWith(
      'https://translation.googleapis.com/language/translate/v2/languages?target=en',
      expect.objectContaining({
        headers: { 'x-goog-api-key': 'test-cloud-key' },
      }),
    );
  });

  it('uses the configured TLLM model while fixing source and format server-side', async () => {
    const request = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: { translations: [{ translatedText: '안녕' }] },
        }),
        { status: 200 },
      ),
    );

    await translate(
      { q: ['Hello'], target: 'ko', model: 'tllm' },
      { env: baseEnv, fetch: request },
    );

    const body = JSON.parse(request.mock.calls[0][1].body);
    expect(body).toEqual({
      q: ['Hello'],
      source: 'en',
      target: 'ko',
      format: 'html',
      model:
        'projects/test-project/locations/us-central1/models/general/translation-llm',
    });
  });

  it('fails closed on Vercel until the owner enables the protected gateway', async () => {
    const request = vi.fn();
    await expect(
      getLanguages('nmt', {
        env: { ...baseEnv, NODE_ENV: 'test', VERCEL: '1' },
        fetch: request,
      }),
    ).rejects.toMatchObject({ status: 503, category: 'gateway_disabled' });
    expect(request).not.toHaveBeenCalled();
  });

  it('keeps provider text out of the sanitized rate-limit response', async () => {
    const logger = { error: vi.fn() };
    const request = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: { message: 'User Rate Limit Exceeded: private detail' },
        }),
        { status: 403, headers: { 'Retry-After': '75' } },
      ),
    );

    let failure;
    try {
      await translate(
        { q: ['Hello'], target: 'ko', model: 'nmt' },
        { env: baseEnv, fetch: request, logger },
      );
    } catch (error) {
      failure = gatewayFailure(error);
    }

    expect(failure).toEqual({
      status: 403,
      body: {
        error: {
          message: 'Translation gateway request failed.',
          category: 'rate_limited',
          retryAfterSeconds: 75,
        },
      },
    });
    expect(JSON.stringify(failure)).not.toContain('private detail');
    expect(logger.error).toHaveBeenCalledWith(
      '[translation-gateway] Cloud Translation failure: HTTP 403; rate_limited',
    );
  });

  it('rejects invalid JSON and bodies above the gateway limit', () => {
    expect(() => parseJsonBytes(new TextEncoder().encode('{'))).toThrow(
      expect.objectContaining({ status: 400, category: 'invalid_request' }),
    );
    expect(() =>
      parseJsonBytes(new Uint8Array(MAX_GATEWAY_BODY_BYTES + 1)),
    ).toThrow(
      expect.objectContaining({ status: 413, category: 'invalid_request' }),
    );
  });
});
