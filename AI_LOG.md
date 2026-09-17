# AI Log

Short, professor-readable record of AI-assisted work. Detailed evidence, commands, decisions, and historical entries are in [docs/AI_DETAILED_LOG.md](docs/AI_DETAILED_LOG.md).

- 2026-09-16 — Documented the initial course plan, solo ownership, subtitle requirements, and telemetry-only scope.
- 2026-09-17 — Ported the MVP to React and replaced the undocumented consumer endpoint with official Cloud Translation NMT; automated checks passed with mocked provider responses.
- 2026-09-17 — Added the product vision, agile workflow, setup guidance, CI configuration, and safe ignore rules.
- 2026-09-18 — Reviewed official Google documentation and found that the current app lacks context-aware translation despite visual cue grouping.
- 2026-09-18 — Changed the product direction to owner-funded Cloud Translation only: NMT and TLLM. Gemini Developer API and visitor API-key entry are removed from scope. Moved the historical MVP to `archive/mvp/`, removed tracked `.DS_Store`, and separated this short log from the detailed record.
- 2026-09-18 — Aligned the local gateway with the developer's configured `GOOGLE_CLOUD_API_KEY` and Cloud project ID names; values remain private and untested.
- 2026-09-18 — Set the requested Seoul TLLM default to `asia-northeast3`; live model availability remains to be checked.
