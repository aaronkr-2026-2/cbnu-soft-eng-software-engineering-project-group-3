# Project State

Last updated: 2026-09-18

## Product and ownership decisions

This is a solo project. The intended audience is tech-savvy movie viewers who already obtain `.srt` subtitle files and want a translation in their preferred language.

The product will offer two official Cloud Translation choices:

- **NMT** — the fast general-purpose model. It translates the sentence/text supplied to it; it is not a word-by-word dictionary.
- **TLLM** — Google's specialized Translation LLM, intended for higher-quality translation and better use of supplied context. Its performance, language coverage, latency, and cost must be measured on representative subtitle fixtures before it becomes the default.

Gemini Developer API is removed from product scope. The app will not show a Gemini option, prompt contract, or visitor key field.

Translation is owner-funded. The React browser app must call a server-side translation gateway; the gateway reads `GOOGLE_TRANSLATE_API_KEY` from ignored `.env` during local development and from a secret manager in production. The key is never bundled by Vite, committed, logged, sent to telemetry, or stored in the browser. Public deployment also needs a hosting decision plus a defined budget, rate limit, and abuse-control policy. See [ADR-004](docs/ADR-004-OWNER-FUNDED-CLOUD-TRANSLATION.md).

Cloud scope remains telemetry only: country/city, target language, and movie identity after its open privacy decisions are resolved. Completed subtitle storage, sharing, cloud checkpoints, and cross-user reuse remain deferred.

## Current implementation

The React/TypeScript/Vite/Ant Design client is on local `main`. It contains local UTF-8 SRT parsing/serialization, supported markup validation, subtitle quality warnings, editing, download, progress, cancellation, and the owner-funded gateway client. The new local Node gateway reads ignored `.env`, proxies only NMT/TLLM requests, and keeps the key outside Vite and the browser. It has not yet been tested with the real provider or deployed publicly.

Source inspection on 2026-09-18 confirmed that continuation groups are currently visual only. The app submits separate cue/speaker strings, so it does not yet provide conversation-aware translation or semantic cue alignment. ADR-004 records the corrective direction.

The historical one-file MVP is preserved at `archive/mvp/srt-translator-beta-3.html` and local tag `mvp-baseline` (`b64bc59`). It uses an undocumented consumer endpoint and is not part of the production build.

## Evidence boundary

Earlier local checks recorded in [BUILD_LOG.md](BUILD_LOG.md) passed against mocked provider responses. There is no current live Cloud Translation verification, production gateway, public deployment, remote CI/Pages evidence, or human translation-quality review. Do not describe any of those as complete.

## Next implementation steps

1. Build and test the local gateway that reads the ignored `.env` key without exposing it to Vite.
2. Select a production gateway host and define cost, rate-limit, and abuse controls before public deployment.
3. Implement NMT and TLLM model selection through that gateway and run a human-reviewed quality/cost benchmark.
4. Implement bounded connected-dialogue groups and validated cue alignment for the chosen contextual path.

## Records

[AI_LOG.md](AI_LOG.md) is the short professor-readable record. [docs/AI_DETAILED_LOG.md](docs/AI_DETAILED_LOG.md) preserves detailed evidence and historical entries. `AGENTS.md` is the canonical working agreement; `GEMINI.md` and `CLAUDE.md` only direct those tools to it.
