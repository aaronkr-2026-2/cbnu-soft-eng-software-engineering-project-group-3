# ADR-004: Owner-funded Cloud Translation gateway

Status: Accepted

Date: 2026-09-18

## Decision

The product offers only two official Cloud Translation models: NMT and Translation LLM (TLLM). Gemini Developer API is outside product scope.

Visitors never enter or supply an API key. A backend gateway holds the project-owner credential, reads `GOOGLE_CLOUD_API_KEY` from a gitignored local `.env` during development, and uses a deployment secret manager in production. The React client sends subtitle text only to that gateway; it never receives the key.

NMT is the fast general translation option. TLLM is the higher-quality, context-oriented translation option. The product describes these as provider positions, not a guarantee that TLLM wins for every language or subtitle.

## Consequences

- ADR-002 is superseded.
- GitHub Pages alone cannot provide the private gateway. Public deployment requires a separate server/serverless host, rate limiting, request-size limits, and a defined monthly budget or usage allowance.
- Local `.env` is permitted only at the gateway process boundary. `VITE_*` variables must never contain the key.
- TLLM requires the configured Cloud project ID and model location in addition to the API key. Its exact available languages and quality must be benchmarked before it becomes the default.
- No public deployment or live provider result is claimed by this decision.

## Revisit trigger

Revisit the allowance, abuse controls, hosting provider, and model default after a measured quality/cost comparison on representative subtitle fixtures.
