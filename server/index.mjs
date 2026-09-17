import { createServer } from 'node:http';

const port = 8787;
const endpoint = 'https://translation.googleapis.com/language/translate/v2';
const key = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID?.trim();
const location =
  process.env.GOOGLE_TRANSLATE_TLLM_LOCATION?.trim() || 'us-central1';
const maxBodyBytes = 100_000;

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
    throw new Error(
      'Gateway configuration is missing GOOGLE_TRANSLATE_API_KEY.',
    );
  const response = await fetch(`${endpoint}${path}`, {
    ...options,
    headers: { ...options.headers, 'x-goog-api-key': key },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      response.status === 403
        ? 'Google denied the gateway request. Check API, billing, key restrictions, and quota.'
        : `Google returned HTTP ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
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
    body.q.every((text) => typeof text === 'string')
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
      const model = modelName(url.searchParams.get('model'));
      const data = await google(
        `/languages?target=en&model=${encodeURIComponent(model)}`,
      );
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
        message: error instanceof Error ? error.message : 'Gateway failed.',
      },
    });
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Translation gateway listening on http://localhost:${port}`);
});
