import { createServer } from 'node:http';

const port = 8787;
const endpoint = 'https://translation.googleapis.com/language/translate/v2';
const key = process.env.GOOGLE_CLOUD_API_KEY?.trim();
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID?.trim();
const location =
  process.env.GOOGLE_TRANSLATE_TLLM_LOCATION?.trim() || 'us-central1';
const maxBodyBytes = 100_000;
const maxTllmInputCharacters = 30_000;

function cloudFailure(response, data) {
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
    )
      category = 'rate_limited';
    else if (
      providerMessage.includes('quota') ||
      providerMessage.includes('limit exceeded')
    )
      category = 'quota';
    else if (providerMessage.includes('has not been used'))
      category = 'api_not_enabled';
    else category = 'access_denied';
  } else if (response.status === 400) category = 'invalid_request';
  else if (response.status === 429) category = 'rate_limited';

  const error = new Error('Cloud Translation request failed.');
  error.status = response.status;
  error.category = category;
  // Never log the upstream message, request body, subtitle text, or key.
  console.error(
    `[translation-gateway] Cloud Translation failure: HTTP ${response.status}; ${category}`,
  );
  return error;
}

function send(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(body));
}

function modelName(model) {
  if (model === 'nmt') return 'nmt';
  if (model === 'tllm' && projectId)
    return `projects/${projectId}/locations/${location}/models/general/translation-llm`;
  throw new Error(
    'TLLM needs GOOGLE_CLOUD_PROJECT_ID in the gateway environment.',
  );
}

async function google(path, options = {}) {
  if (!key)
    throw new Error('Gateway configuration is missing GOOGLE_CLOUD_API_KEY.');
  const response = await fetch(`${endpoint}${path}`, {
    ...options,
    headers: { ...options.headers, 'x-goog-api-key': key },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw cloudFailure(response, data);
  return data;
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodyBytes) throw new Error('Request is too large.');
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new Error('Request must contain JSON.');
  }
}

function validTranslation(body) {
  return (
    body &&
    (body.model === 'nmt' || body.model === 'tllm') &&
    typeof body.target === 'string' &&
    /^[a-zA-Z-]{2,20}$/.test(body.target) &&
    Array.isArray(body.q) &&
    body.q.length > 0 &&
    body.q.length <= 128 &&
    body.q.every((text) => typeof text === 'string') &&
    (body.model !== 'tllm' ||
      body.q.reduce((total, text) => total + [...text].length, 0) <=
        maxTllmInputCharacters)
  );
}

createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    response.end();
    return;
  }
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (
      request.method === 'GET' &&
      url.pathname === '/api/translation/languages'
    ) {
      // Basic v2 rejects a TLLM model resource on its languages endpoint.
      // Validate the requested engine, then use the default NMT catalogue to
      // populate the picker; actual TLLM availability is checked by its
      // service translation below and must be benchmarked before release.
      modelName(url.searchParams.get('model'));
      const data = await google('/languages?target=en');
      send(response, 200, data);
      return;
    }
    if (request.method === 'POST' && url.pathname === '/api/translation') {
      const body = await readJson(request);
      if (!validTranslation(body)) {
        send(response, 400, {
          error: { message: 'Invalid translation request.' },
        });
        return;
      }
      const data = await google('', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          q: body.q,
          source: 'en',
          target: body.target,
          format: 'html',
          model: modelName(body.model),
        }),
      });
      send(response, 200, data);
      return;
    }
    send(response, 404, { error: { message: 'Not found.' } });
  } catch (error) {
    const status = typeof error.status === 'number' ? error.status : 500;
    send(response, status, {
      error: {
        message: 'Translation gateway request failed.',
        category:
          typeof error.category === 'string'
            ? error.category
            : 'gateway_failure',
      },
    });
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Translation gateway listening on http://localhost:${port}`);
});
