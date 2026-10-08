import { createServer } from 'node:http';
import {
  GatewayError,
  gatewayFailure,
  getLanguages,
  MAX_GATEWAY_BODY_BYTES,
  parseJsonBytes,
  translate,
} from './translationGateway.mjs';

const port = 8787;

function send(response, status, body, additionalHeaders = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...additionalHeaders,
  });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_GATEWAY_BODY_BYTES) {
      throw new GatewayError(
        'Translation request is too large.',
        413,
        'invalid_request',
      );
    }
    chunks.push(chunk);
  }
  return parseJsonBytes(Buffer.concat(chunks));
}

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (
      request.method === 'GET' &&
      url.pathname === '/api/translation/languages'
    ) {
      send(response, 200, await getLanguages(url.searchParams.get('model')));
      return;
    }
    if (request.method === 'POST' && url.pathname === '/api/translation') {
      send(response, 200, await translate(await readJson(request)));
      return;
    }
    send(response, 404, { error: { message: 'Not found.' } });
  } catch (error) {
    const failure = gatewayFailure(error);
    const retryAfter = failure.body.error.retryAfterSeconds;
    send(
      response,
      failure.status,
      failure.body,
      typeof retryAfter === 'number'
        ? { 'Retry-After': String(retryAfter) }
        : {},
    );
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Translation gateway listening on http://localhost:${port}`);
});
