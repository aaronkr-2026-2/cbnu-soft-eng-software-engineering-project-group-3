# ADR-002: User-funded translation providers

Status: Accepted

Date: 2026-09-16

Decision owner: project owner (solo developer)

## Context

The public app may become popular, and the project owner explicitly will not fund Google Translate or Gemini usage. The user asked whether ordinary Google login or a consumer Gemini subscription can fund requests.

## Decision

Each visitor supplies the selected provider's API credential for the current tab session. Gemini uses a current Gemini API key from AI Studio. Google Translate uses a user-owned Cloud Translation Basic key. The application stores neither credential. Ordinary Google Sign-In and consumer Gemini subscriptions are not offered as provider billing mechanisms because official documentation separates external API usage from those consumer/AI Studio subscription benefits.

OAuth is deferred. It remains technically possible for configured Cloud developer identities, but it requires a Cloud project, OAuth client, scopes/verification, and a quota/billing project. It is not the Claude-Code-like consumer login experience envisioned for this static public site.

## Consequences

- Provider credential controls appear only for the selected engine.
- Keys are masked and session-memory-only; reload requires re-entry.
- The app provides setup/test/clear actions and honest security/cost text.
- No developer-funded fallback provider exists.
- The undocumented MVP Google endpoint is removed when the official provider is implemented.
- If direct browser authentication is incompatible with provider policy/technology, that engine is unavailable until a compliant design exists.
- Google Translate shows preflight character/batch/list-price estimates.
- The Gemini integration uses stateless bounded requests with `store=false` and validated structured output.

## Revisit trigger

Revisit if Google introduces an official delegated end-user API-billing flow suitable for public web apps, or if the project owner explicitly approves a funded backend allowance.

## AI involvement

Official provider documentation was used to distinguish consumer subscriptions, API authentication, quota, and billing. See the `Provider funding, subtitle UX, and formatting rules` entry in `AI_LOG.md`.
