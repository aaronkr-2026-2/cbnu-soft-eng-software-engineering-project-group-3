# Project State

Last updated: 2026-09-17; local repository inspected 2026-09-17

## Confirmed ownership and current planning

The user confirmed on 2026-09-16 that this is a solo project. Plan for one developer; do not infer teammates from the repository name. The user subsequently confirmed telemetry-only cloud collection: country and city, target language, and movie identity. Completed SRT upload/storage and cross-user subtitle reuse are deferred. Local download and local checkpoints remain. No object-storage provider is needed in current scope. Firebase billing acceptance and telemetry details remain open. See `docs/ADR-001-TELEMETRY-ONLY.md`; earlier storage research is historical, not an implementation plan.

The user also confirmed that public translation calls must be funded by each visitor. Current release design uses a session-memory-only Gemini API key or Cloud Translation Basic key supplied by that visitor. Consumer Google/Gemini login does not fund external API calls. See `docs/ADR-002-USER-FUNDED-PROVIDERS.md`.

Accepted behavior now includes visually grouped continuation cues, paired hover and persistent edit highlighting, an elapsed job timer, an active-tab warning, the exact formatting rules in `docs/SUBTITLE_FORMATTING_SPEC.md`, and the Gemini contract in `docs/GEMINI_TRANSLATION_PROMPT.md`.

The product vision is now documented in `README.md`: the intended audience is tech-savvy movie viewers with a language barrier or a preference for their mother language. Its differentiator is preserving relationships between connected conversation cues and speaker segments rather than proportionally redistributing translated words. This is a product direction; the current Basic v2 NMT adapter preserves one provider string per cue and does not claim cross-cue semantic context.

## Current implementation and evidence boundary

The React client is implemented and published for review on branch `feat/react-official-translate`. The original `srt-translator-beta-3.html` remains unchanged; local annotated tag `mvp-baseline` points to `b64bc59`. Existing documentation/setup changes were preserved. No live deployment is claimed for this implementation task.

Current code includes a compatible locked React/TypeScript/Vite/Ant Design scaffold; pure SRT/markup/quality modules; an official Cloud Translation Basic v2 NMT adapter; temporary credential testing; provider-supported language lookup; local file preview; progress, timer, retry/cancellation; protected edits; grouping and scroll-follow; and validated downloads. A native uncontrolled password input and private adapter field keep keys out of serializable React state. Vite env loading is disabled. Statistics is hidden and Gemini is unavailable.

The user confirmed the initial 5 MiB UTF-8 limit, balanced i/b/u-only formatting, explicit Adult/Children selection, and current desktop Chrome/Edge/Firefox/Safari targets. Unsupported input produces errors. Historical parser renumbering and silent malformed-block skipping are corrected, with characterization and round-trip tests.

GitHub's open-issue query returned an empty list on 2026-09-17. The Pages API returned HTTP 404; Pages configuration/availability remains unverified. GitHub Actions configuration now runs checks and prepares main-only deployment, but no remote run or published URL has been verified. Draft issues, workflow, and review state are local in docs/sprints/WEEK_05.md and docs/AGILE_WORKFLOW.md. See BUILD_LOG.md for current command outcomes.

## Official provider development preparation

The user requested a working React port using the official Google Cloud Translation API and instructions for obtaining a development key. [Google Translate setup](docs/GOOGLE_TRANSLATE_SETUP.md) now documents project/billing/API setup, a restricted Basic v2 key, quotas, and the planned memory-only local test flow. The user reports activating the Google Cloud $300 trial on 2026-09-17. The user subsequently confirmed the reported signup amount is on hold, consistent with a pending verification authorization; release and trial-versus-paid account status have not been independently verified. The user subsequently reports completing Google Cloud project setup and creating a key saved under GOOGLE_TRANSLATE_API_KEY in a local .env. The file exists and is now Git-ignored; its contents were not read. API enablement, key restrictions, and key validity have not been independently verified, and no live API test has run. This local credential is not wired into the frontend build. The React app now accepts manual key entry in volatile memory; the historical HTML remains unchanged. No real credential was read or used by the AI. Browser CORS/restriction compatibility remains a live-test requirement.

## Historical MVP behavior (before-state)

The attached prototype is one standalone HTML file with embedded CSS and JavaScript. It contains:

- an `.srt` file picker;
- a hard-coded searchable target-language list;
- Google Translate and Google Gemini selector options;
- a 20/80 sidebar and dual-column cue view;
- parsing and serialization of SubRip entries;
- a heuristic that merges lowercase or ellipsis-leading continuation cues;
- sequential network translation;
- proportional word-count redistribution across original cue boundaries;
- six-word line wrapping and a capital-letter dialogue heuristic;
- per-cue waiting/translating/done colors;
- progress indicators and translated-file download;
- retry, timeout, and visible error handling.

## Historical baseline discrepancies and debt

1. The reviewed file has no `StatsManager` and no Started/API calls/Finished statistics panel, although the provided written state says it does.
2. The Gemini option calls the same Google Translate provider; it is not a Gemini integration.
3. Google Translate uses the undocumented `translate_a/single?client=gtx` endpoint rather than the official Cloud Translation API.
4. Translation is one sentence group at a time with a `setTimeout`-based 120 ms delay. Hidden or frozen tabs can throttle or suspend this loop.
5. Proportional word splitting can damage meaning and grammar when target-language word order differs from English, especially for Mongolian.
6. Six words per line is not a recognized universal subtitle rule. It can generate more than two lines and ignores character width, cue duration, script, and reading speed.
7. The dialogue rule depends on Unicode uppercase after a hyphen. It does not work reliably for scripts without letter case and can confuse punctuation with speaker markers.
8. Malformed subtitle blocks are silently skipped, which can create unnoticed data loss.
9. Formatting tags are removed for analysis and are not robustly preserved through merge/split operations.
10. The supported-language list is hard-coded and already smaller than the current official Google NMT list.
11. There is no cancellation, checkpoint/resume, output editing, user-scroll lock, or test suite in the reviewed file.
Correction on 2026-09-16: the earlier claim of duplicate statements was incorrect. Direct inspection shows one return in `firstVisibleChar`, separate updates for the two progress bars, and one target-header update in `updateControls`. No source fix is needed for that claim.

## Current milestone

The Week 5 process/scaffold work has expanded into the requested working React/official-provider increment. The feature branch is published for review; no pull request has been created. Baseline public deployment evidence, a real-key smoke test, remote CI/Pages, and the human walkthrough remain pending. Existing deadlines are unchanged.

## Next safe implementation step

Review the implemented increment using README.md and BUILD_LOG.md. Run a tiny user-operated Google test on localhost with the restricted key, then review/publish the branch and configure Pages for GitHub Actions when ready. Preserve the current visitor-funded boundary. General Gemini, reload checkpoints, and full language-specific grammatical formatting are separate remaining milestones.

Local verification: clean `npm ci`, typecheck, lint, 56 tests, production build, formatting, and targeted build-artifact checks pass. The production JavaScript is approximately 640 kB (208 kB gzip); the chunk-size warning remains visible. See BUILD_LOG.md for browser evidence and failures corrected.

## Decisions still open

- future Gemini model and batch budgets (the initial Cloud Translation NMT defaults are recorded in ADR-003);
- telemetry location acquisition method and handling of unknown movie/location;
- exact three-life rule identity, reset, and bypass semantics;
- metadata provider and permitted use;
- telemetry retention/deletion and notice/opt-out details;
- verification across the agreed desktop browsers and large-file performance.

Known limits: no reload checkpoints/background guarantee; grammar-aware line breaking is only a conservative English heuristic plus general punctuation/word boundaries; long/unbreakable or >2-speaker content is preserved with review warnings; the current production bundle exceeds Vite’s 500 kB warning threshold. Live provider and deployment verification remain pending.

See `docs/OPEN_QUESTIONS.md`. Do not turn any open item into a fact without a human decision.
