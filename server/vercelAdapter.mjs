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
  return parseJsonBytes(await request.arrayBuffer());
}
