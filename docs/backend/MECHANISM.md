# Backend mechanism

Updated: 2026-10-08. The gateway is one module with two HTTP adapters, **not two independent services**.

| Layer | File | Responsibility |
| --- | --- | --- |
| Core | `backend/server/translationGateway.mjs` | Validate model/body/limits; choose NMT or TLLM; call official Google API with a server-only key; sanitize provider failures. |
| Local adapter | `backend/server/index.mjs` | Serve `/api/translation` and `/api/translation/languages` on loopback port 8787 behind Vite's proxy. |
| Vercel adapter | `backend/server/vercelAdapter.mjs` | Bound and parse Function request streams, return no-store JSON and safe errors. |
| Deployment entrypoints | `api/translation.mjs`, `api/translation/languages.mjs` | Minimal root `api/` exports; required for Vercel's Vite Function discovery. |

## Request flow

1. The browser sends a same-origin JSON request without credentials. The server rejects oversized, invalid or empty translation inputs before calling Google.
2. The core checks the production enablement flag, reads server-only Cloud configuration, constructs the official NMT or TLLM model name and sends subtitle strings to Google in `q`.
3. A successful provider JSON envelope is returned to the browser. The frontend performs final shape, count, text and markup validation before any cue is saved; malformed successful JSON fails the batch rather than becoming output.
4. A provider error is classified into a small safe category. The response never includes provider text, subtitle content or the credential. Allowlisted per-minute quota responses include a bounded retry delay.

The language route queries Google's NMT catalogue for both picker modes; it does not prove each TLLM pair. The API has no application authentication. `TRANSLATION_GATEWAY_ENABLED=true` is **not** a cost cap; an approved allowance, Firewall rate limit and Google controls are still required. See [provider/cost guide](../guides/PROVIDER_AUTH_AND_COST.md) and [setup](../guides/GOOGLE_TRANSLATE_SETUP.md).

## Failure and test boundary

The Function adapter now rejects an oversized stream while reading, even if `Content-Length` is absent. Invalid request JSON gets a 400; a large body gets a 413. Gateway tests use fake keys and mocked provider responses. A local Node request is also size-bounded. Network hangs and real provider latency remain operational risks; the browser has a 15-second attempt timeout and Vercel Functions a configured 30-second maximum, but these are not server-side spend limits.
