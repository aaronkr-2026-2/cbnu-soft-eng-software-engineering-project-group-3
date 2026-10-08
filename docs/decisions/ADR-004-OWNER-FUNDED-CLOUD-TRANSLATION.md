# ADR-004: Owner-funded Cloud Translation gateway

Status: Accepted

Date: 2026-09-18; deployment amendment 2026-10-08

## Decision

The product offers only two official Cloud Translation models: NMT and Translation LLM (TLLM). Gemini Developer API is outside product scope.

Visitors never enter or supply an API key. A backend gateway holds the project-owner credential, reads `GOOGLE_CLOUD_API_KEY` from a gitignored local `.env` during development, and uses a deployment secret manager in production. The React client sends subtitle text only to that gateway; it never receives the key.

Vercel is the production host selected on 2026-10-08. The Vite frontend and same-origin Vercel Functions deploy together. The local Node server and Vercel adapters reuse one gateway core so request validation, model selection, size limits and sanitized failure categories cannot silently diverge. Production fails closed until the owner sets `TRANSLATION_GATEWAY_ENABLED=true` after configuring the approved allowance and abuse/cost controls.

NMT is the fast general translation option. TLLM is the higher-quality, context-oriented translation option. The product describes these as provider positions, not a guarantee that TLLM wins for every language or subtitle.

## Consequences

- ADR-002 is superseded.
- GitHub Pages deployment is retired; GitHub Actions remains CI only. Vercel serves the frontend and Function routes.
- The enablement flag is not itself abuse protection. Public translation still requires an owner-approved Vercel Firewall rate limit, request-size limits, Google budget/quota controls and a defined monthly allowance.
- Local `.env` is permitted only at the gateway process boundary. `VITE_*` variables must never contain the key.
- TLLM requires the configured Cloud project ID and model location in addition to the API key. Its exact available languages and quality must be benchmarked before it becomes the default.
- Function code alone does not prove a public deployment or live provider result. The personal fork, Vercel environment and live routes require separate verification.

## Revisit trigger

Revisit the allowance, abuse controls, hosting provider, and model default after a measured quality/cost comparison on representative subtitle fixtures.
