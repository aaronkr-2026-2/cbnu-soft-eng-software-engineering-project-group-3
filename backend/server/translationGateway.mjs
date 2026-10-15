const googleEndpoint =
  'https://translation.googleapis.com/language/translate/v2';

export const MAX_GATEWAY_BODY_BYTES = 100_000;
export const MAX_TLLM_INPUT_CHARACTERS = 30_000;
const defaultRateLimitRetrySeconds = 60;

export class GatewayError extends Error {
  constructor(message, status = 500, category = 'gateway_failure', options) {
    super(message);
    this.name = 'GatewayError';
    this.status = status;
    this.category = category;
    this.retryAfterSeconds = options?.retryAfterSeconds;
  }
}

function runtime(options = {}) {
  return {
    env: options.env ?? process.env,
    fetch: options.fetch ?? globalThis.fetch,
    logger: options.logger ?? console,
  };
}

function ensureGatewayEnabled(env) {
  const isDeployed =
    env.NODE_ENV === 'production' ||
    env.VERCEL === '1' ||
    env.VERCEL_ENV === 'production' ||
    env.VERCEL_ENV === 'preview';
  if (isDeployed && env.TRANSLATION_GATEWAY_ENABLED !== 'true') {
    throw new GatewayError(
      'Public translation is disabled until production abuse controls are configured.',
      503,
      'gateway_disabled',
    );
  }
}

function modelName(model, env) {
  if (model === 'nmt') return 'nmt';
  if (model === 'tllm' && env.GOOGLE_CLOUD_PROJECT_ID?.trim()) {
    const projectId = env.GOOGLE_CLOUD_PROJECT_ID.trim();
    const location =
      env.GOOGLE_TRANSLATE_TLLM_LOCATION?.trim() || 'us-central1';
    return `projects/${projectId}/locations/${location}/models/general/translation-llm`;
  }
  if (model === 'tllm') {
    throw new GatewayError(
      'TLLM gateway configuration is incomplete.',
      500,
      'gateway_failure',
    );
  }
  throw new GatewayError('Invalid translation model.', 400, 'invalid_request');
}

function retryAfterSeconds(response) {
  const value = response.headers.get('retry-after');
  if (!value) return defaultRateLimitRetrySeconds;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds > 0) {
    return Math.min(Math.ceil(seconds), 120);
  }
  return defaultRateLimitRetrySeconds;
}

function cloudFailure(response, data, logger) {
  const providerMessage =
    data &&
    typeof data === 'object' &&
    data.error &&
    typeof data.error === 'object' &&
    typeof data.error.message === 'string'
      ? data.error.message.toLowerCase()
      : '';
  let category = 'upstream_failure';
  if (response.status === 403) {
    if (providerMessage.includes('referer')) category = 'key_restriction';
    else if (providerMessage.includes('billing')) category = 'billing';
    else if (providerMessage.includes('daily limit')) category = 'daily_quota';
    else if (
      providerMessage.includes('user rate limit') ||
      providerMessage.includes('per minute')
    ) {
      category = 'rate_limited';
    } else if (
      providerMessage.includes('quota') ||
      providerMessage.includes('limit exceeded')
    ) {
      category = 'quota';
    } else if (providerMessage.includes('has not been used')) {
      category = 'api_not_enabled';
    } else category = 'access_denied';
  } else if (response.status === 400) category = 'invalid_request';
  else if (response.status === 429) category = 'rate_limited';

  logger.error(
    `[translation-gateway] Cloud Translation failure: HTTP ${response.status}; ${category}`,
  );
  return new GatewayError(
    'Cloud Translation request failed.',
    response.status,
    category,
    category === 'rate_limited'
      ? { retryAfterSeconds: retryAfterSeconds(response) }
      : undefined,
  );
}

async function google(path, requestOptions, options) {
  const current = runtime(options);
  ensureGatewayEnabled(current.env);
  const key = current.env.GOOGLE_CLOUD_API_KEY?.trim();
  if (!key) {
    throw new GatewayError(
      'Gateway configuration is missing its Cloud Translation credential.',
    );
  }
  const response = await current.fetch(`${googleEndpoint}${path}`, {
    ...requestOptions,
    headers: {
      ...requestOptions?.headers,
      'x-goog-api-key': key,
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw cloudFailure(response, data, current.logger);
  return data;
}

export function validTranslationRequest(body) {
  return (
    body &&
    (body.model === 'nmt' || body.model === 'tllm') &&
    typeof body.target === 'string' &&
    /^[a-zA-Z-]{2,20}$/.test(body.target) &&
    Array.isArray(body.q) &&
    body.q.length > 0 &&
    body.q.length <= 128 &&
    body.q.every((text) => typeof text === 'string' && text.trim() !== '') &&
    (body.model !== 'tllm' ||
      body.q.reduce((total, text) => total + [...text].length, 0) <=
        MAX_TLLM_INPUT_CHARACTERS)
  );
}

export function parseJsonBytes(bytes) {
  if (bytes.byteLength > MAX_GATEWAY_BODY_BYTES) {
    throw new GatewayError(
      'Translation request is too large.',
      413,
      'invalid_request',
    );
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new GatewayError(
      'Translation request must contain JSON.',
      400,
      'invalid_request',
    );
  }
}

export async function getLanguages(model, options) {
  const current = runtime(options);
  ensureGatewayEnabled(current.env);
  // Basic v2 rejects a TLLM model resource on its languages endpoint. Validate
  // the requested engine, then use the NMT catalogue for the shared picker.
  modelName(model, current.env);
  return google('/languages?target=en', {}, current);
}

export async function translate(body, options) {
  const current = runtime(options);
  ensureGatewayEnabled(current.env);
  if (!validTranslationRequest(body)) {
    throw new GatewayError(
      'Invalid translation request.',
      400,
      'invalid_request',
    );
  }
  return google(
    '',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        q: body.q,
        source: 'en',
        target: body.target,
        format: 'html',
        model: modelName(body.model, current.env),
      }),
    },
    current,
  );
}

export function gatewayFailure(error) {
  const known = error instanceof GatewayError;
  return {
    status: known ? error.status : 500,
    body: {
      error: {
        message: 'Translation gateway request failed.',
        category: known ? error.category : 'gateway_failure',
        ...(known && typeof error.retryAfterSeconds === 'number'
          ? { retryAfterSeconds: error.retryAfterSeconds }
          : {}),
      },
    },
  };
}
