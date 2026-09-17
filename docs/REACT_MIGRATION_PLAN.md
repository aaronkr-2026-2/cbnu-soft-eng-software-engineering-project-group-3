# React migration and official Google Translate integration

Date: 2026-09-17

Status: Local React/official Translate implementation completed for review on 2026-09-17. Live Google verification, remote CI/Pages deployment, full language-specific grammatical formatting, and human review remain pending. See PROJECT_STATE.md and BUILD_LOG.md for evidence.

Follow-up 2026-09-18: this increment did not implement conversation-aware provider context or semantic cue redistribution. ADR-004 now supersedes every visitor-key and Gemini statement below. The next increment is an owner-funded NMT/TLLM gateway; the browser never receives a key. See [ADR-004](ADR-004-OWNER-FUNDED-CLOUD-TRANSLATION.md).

## Outcome and scope

Deliver a React + TypeScript + Vite + Ant Design application that loads an English SRT locally, checks the owner-funded gateway, estimates usage, translates with visible progress, and downloads a validated SRT with preserved cue identities and timing.

Keep the original HTML as historical evidence in Git. The new deployment must not ship it as an executable alternative or include its undocumented endpoint. The product offers NMT/TLLM only. Telemetry, movie lookup, lives, cloud storage, and closed-tab execution are outside this migration. Local checkpoint/resume remains a separate semester milestone; do not claim it exists in this increment.

## Provider distinction

Cloud Translation Basic v2 supports API keys. Current Cloud Translation documentation describes standard NMT and Translation LLM models. The gateway offers both and keeps the key server-side. NMT has a character-only estimate; TLLM pricing includes input and output characters, so it needs a separate estimate before a cost quote is shown.

TLLM requires the configured Cloud project ID/location and model-specific response, language, pricing, and quality validation. The gateway keeps the developer key restricted to Cloud Translation and outside the browser.

Sources checked 2026-09-18: [Cloud Translation models](https://docs.cloud.google.com/translate/docs/advanced/compare-models), [Translation LLM](https://docs.cloud.google.com/translate/docs/translation-llm), [Translation authentication](https://docs.cloud.google.com/translate/docs/authentication), and [Cloud Translation pricing](https://cloud.google.com/products/translate/pricing).

## Small implementation issues and acceptance checks

| Order | Issue | Acceptance checks |
| --- | --- | --- |
| 1 | Baseline and workflow | Record the baseline commit/tag status; reconcile remote issues before creating duplicates. Establish a weekly sprint goal, one active implementation issue, PR review checklist, and build log using the existing Definition of Done. Preserve the HTML source. |
| 2 | Scaffold and checks | Add compatible stable React/TypeScript/Vite/Ant Design dependencies, one lockfile, moderate ESLint/Prettier, and justified test tooling. Pin localhost port 5173 with strict port selection. Add typecheck/lint/test/build scripts and document setup. |
| 3 | Official provider vertical slice | Build a provider contract and Basic v2 NMT adapter, temporary credential control, and tiny translation smoke-test UI. Test response validation and failures with mocked requests. User-run browser test verifies the restricted key, CORS, billing/API enablement, and localhost origin before calling the integration ready. |
| 4 | SRT domain extraction | Characterize the old parser/serializer with synthetic fixtures before extracting pure TypeScript. Make intentional corrections separately: report malformed blocks and preserve original cue indexes/order/timecodes. Test Unicode, multiline text, BOM/line endings, nonsequential indexes, and agreed tags. |
| 5 | Shell and local upload | Port the header, controls, responsive paired cue layout, theme tokens, searchable provider-supported language list, file selection/drop, cue count, and errors. Safely render subtitle text. Replacing a file clears stale job/output state; asynchronous file reads cannot overwrite a newer selection. |
| 6 | Complete translation job | Derive Start/Download availability from explicit state. Add preflight character/batch/list-price estimates, progress, elapsed time derived from timestamps, API-call count, bounded retries/timeouts, cancellation, partial-failure handling, and active-tab warning. Cancelled or obsolete requests cannot update another job. Preserve completed cues for in-tab retry. |
| 7 | Cue mapping, presentation, and output | Batch bounded cue/segment inputs, validate result counts, and map by retained request ordering/IDs. Never redistribute translated words proportionally. Preserve source speaker boundaries and supported markup; use the accepted 42-grapheme/two-line/CPS rules with review warnings. Add continuation-group spacing/labels, paired hover/focus, editable output with protected edits, and scroll-follow control. Download only after every cue has a validated result. |
| 8 | Release evidence | Run all local gates, exercise browser upload-to-download with a tiny live fixture, inspect credential handling, and verify the built app has no legacy endpoint or developer key injection. Configure PR checks and gated GitHub Pages deployment with the correct repository base. Record actual deployment smoke-test results when deployment occurs. |

Issues 1–2 precede implementation slices. Issue 3's mocked work and issues 4–5 can proceed while the user prepares the live test. Full end-to-end acceptance requires that test; inability to call the official service must not trigger an undocumented fallback.

## Boundaries and credential handling

- `src/app/`: shell, modes, and theme.
- `src/features/translator/`: file UI, cue presentation, and job orchestration.
- `src/core/srt/`: cue types, parser, serializer, and fixtures.
- `src/core/subtitles/`: continuation grouping, speaker structure, and quality formatting.
- `src/services/translation/`: provider contract, official Translate adapter, capability lookup, request sizing, and response validation.

Create modules when needed; avoid empty architecture scaffolding. Keep domain functions independent of React and HTTP.

The existing `.env` remains ignored and unused by the frontend. No server or proxy is introduced solely to load it. The user enters the key into a masked, autocomplete-disabled field; credential references stay out of serializable job state, browser persistence, URLs, logs, and downloads. Provide Test/Clear actions and clear it on provider change/reload. Send it only to the official provider in `x-goog-api-key`, using POST bodies for subtitle content. Handle returned text/entities without treating provider output as executable HTML.

User-funded browser credentials are observable in that browser's memory/network traffic. Verify direct browser operation with the restricted key. If it is incompatible, leave the provider unavailable and resolve the architecture explicitly; do not introduce a project-funded proxy or inject `.env` through Vite configuration.

## Decisions and user participation

Before the affected UI/parser implementation, resolve the existing open questions about Statistics placeholder versus hidden mode, supported formatting tags, maximum input size, browser targets, and adult/children profile selection. Resolved during implementation: hide Statistics; support balanced i/b/u tags without attributes; limit UTF-8 input to 5 MiB; target current desktop Chrome/Edge/Firefox/Safari; require Adult/Children selection. These user decisions are recorded in ADR-003.

No further key sharing or account changes are required to begin. The user will enter their key locally for the small smoke test and select a target language. The API key and live account configuration have not been independently verified. Larger tests should follow the small test and the user's quota/cost allowance.

Exact package versions/test packages are selected and verified at scaffold time. The proposed issues may span multiple weekly sprints; this is not a claim that the full migration fits Week 5. Tests, CI, and provider work move earlier only as needed to make the increment usable and meet the existing Definition of Done.

## Completion evidence

Record successful typecheck, lint, non-watch tests, and production build; browser workflow and live API results separately; and remaining limitations. Tests must cover wrong/cleared credentials, invalid/mismatched responses, retries, cancellation races, partial completion, cue preservation, formatting overflow, edited output, and Start/Download prerequisites. Use mocks for routine tests, not paid API calls in CI.

Update PROJECT_STATE.md, relevant setup/architecture/requirements documents, and the course-format AI_LOG.md after material changes. Human reflection stays `TBD - human review required`. Passing mocked tests alone does not establish live provider compatibility or translation quality.
