# AI Log

Short, professor-readable record of AI-assisted work. Detailed evidence, commands, decisions, and historical entries are in [docs/AI_DETAILED_LOG.md](docs/AI_DETAILED_LOG.md).

- 2026-09-16 — Documented the initial course plan, solo ownership, subtitle requirements, and telemetry-only scope.
- 2026-09-17 — Ported the MVP to React and replaced the undocumented consumer endpoint with official Cloud Translation NMT; automated checks passed with mocked provider responses.
- 2026-09-17 — Added the product vision, agile workflow, setup guidance, CI configuration, and safe ignore rules.
- 2026-09-18 — Reviewed official Google documentation and found that the current app lacks context-aware translation despite visual cue grouping.
- 2026-09-18 — Changed the product direction to owner-funded Cloud Translation only: NMT and TLLM. Gemini Developer API and visitor API-key entry are removed from scope. Moved the historical MVP to `archive/mvp/`, removed tracked `.DS_Store`, and separated this short log from the detailed record.
- 2026-09-18 — Aligned the local gateway with the developer's configured `GOOGLE_CLOUD_API_KEY` and Cloud project ID names; values remain private and untested.
- 2026-09-18 — Set the requested Seoul TLLM default to `asia-northeast3`; live model availability remains to be checked.
- 2026-09-18 — Fixed the local 502 setup problem by making `npm run dev` start both the browser client and local translation gateway; simplified the service-check explanation.
- 2026-09-18 — Diagnosed Google key referrer blocking, verified minimal live NMT/TLLM requests, and changed the TLLM default from unsupported Seoul to verified `us-central1`.
- 2026-09-18 — Added safe gateway failure categories so local TLLM/NMT errors identify key restrictions, billing, quota, API enablement, or rate limiting without logging subtitles or credentials.
- 2026-09-18 — Replaced the three-cue demo with a longer original 40-cue SRT fixture; complete third-party movie subtitles remain local test inputs, not repository files.
- 2026-09-18 — Improved quota diagnostics and reduced full-file UI work; documented a proposed, test-first strategy for real TLLM dialogue context.
- 2026-09-18 — Replaced generic app-shell and cue-card wrappers with Ant Design Layout, Flex, and Card components; recorded the UI-component rule for future work.
- 2026-09-18 — Added 20 px sidebar spacing and virtualized long subtitle lists so fast scrolling no longer relies on delayed off-screen card painting.
- 2026-09-18 — Fixed the Ant Design sidebar spacing target, added compact sticky sidebar/body headers, and rewrote the NMT estimate in plain language.
- 2026-09-18 — Moved the cost estimate into scrollable settings, removed the sidebar action shadow and cue-row rail, and widened subtitle cards.
- 2026-09-18 — Replaced header and service-card explanatory text with compact Ant Design help controls and reduced the header height.
- 2026-09-18 — Added the rule that each completed file-changing prompt ends with verification, documentation updates, and one local commit; remote publishing remains explicit.
- 2026-09-18 — Added sun/moon theme cues, simplified the workflow modal to one `OK` action, and narrowed the service-check help popover.
- 2026-10-01 — Verified and prepared the joined-speech NMT/TLLM revision for GitHub, correcting stale fixture/browser assertions and preserving spaces before protected annotations.
- 2026-10-01 — Opened GitHub issue #2 with the reported screenshot, contained long upload filenames, and added a visible cancelable cooldown for Google's per-minute quota response before bounded automatic retries.
- 2026-10-08 — Added a verified current-feature inventory, provisional Teddy and Jenna personas, prioritized user stories, and a feature-to-story gap map without claiming real-user or human translation-quality validation.
- 2026-10-08 — Added evidence-based retrospective Week 2-4 sprint summaries while leaving unrecorded pitch, deployment, user-validation, review, and human-reflection details explicitly TBD.
- 2026-10-08 — Added same-origin Vercel translation Functions backed by the shared local gateway core, retained fail-closed production enablement, and changed GitHub Actions from broken Pages deployment to CI-only verification.
