import {
  GatewayError,
  gatewayFailure,
  MAX_GATEWAY_BODY_BYTES,
  parseJsonBytes,
} from './translationGateway.mjs';

export function jsonResponse(status, body, additionalHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...additionalHeaders,
    },
  });
}

export function failureResponse(error) {
  const failure = gatewayFailure(error);
  const retryAfter = failure.body.error.retryAfterSeconds;
  return jsonResponse(
    failure.status,
    failure.body,
    typeof retryAfter === 'number' ? { 'Retry-After': String(retryAfter) } : {},
  );
}

export function methodNotAllowed(methods) {
  return jsonResponse(
    405,
    { error: { message: 'Method not allowed.', category: 'invalid_request' } },
    { Allow: methods.join(', ') },
  );
}

export async function readRequestJson(request) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > MAX_GATEWAY_BODY_BYTES
  ) {
    throw new GatewayError(
      'Translation request is too large.',
      413,
      'invalid_request',
    );
  }
  const reader = request.body?.getReader();
  if (!reader) return parseJsonBytes(new Uint8Array());
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_GATEWAY_BODY_BYTES) {
      void reader.cancel().catch(() => {});
      throw new GatewayError(
        'Translation request is too large.',
        413,
        'invalid_request',
      );
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return parseJsonBytes(bytes);
}
