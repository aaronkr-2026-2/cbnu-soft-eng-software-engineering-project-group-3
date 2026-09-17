# Project State

Last updated: 2026-09-16; MVP baseline reviewed 2026-09-15

## Confirmed ownership and current planning

The user confirmed on 2026-09-16 that this is a solo project. Plan for one developer; do not infer teammates from the repository name. The user subsequently confirmed telemetry-only cloud collection: country and city, target language, and movie identity. Completed SRT upload/storage and cross-user subtitle reuse are deferred. Local download and local checkpoints remain. No object-storage provider is needed in current scope. Firebase billing acceptance and telemetry details remain open. See `docs/ADR-001-TELEMETRY-ONLY.md`; earlier storage research is historical, not an implementation plan.

The user also confirmed that public translation calls must be funded by each visitor. Current release design uses a session-memory-only Gemini API key or Cloud Translation Basic key supplied by that visitor. Consumer Google/Gemini login does not fund external API calls. See `docs/ADR-002-USER-FUNDED-PROVIDERS.md`.

Accepted behavior now includes visually grouped continuation cues, paired hover and persistent edit highlighting, an elapsed job timer, an active-tab warning, the exact formatting rules in `docs/SUBTITLE_FORMATTING_SPEC.md`, and the Gemini contract in `docs/GEMINI_TRANSLATION_PROMPT.md`.

## Evidence boundary

The only source code verified in this baseline is the supplied `srt-translator-beta-3.html`. The GitHub repository contents were not accessible without authenticated GitHub access. Reconcile this file against the repository before implementation.

## Verified MVP behavior

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

## Verified discrepancies and technical debt

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

The course materials define Week 3 as a live vibe-coded MVP plus product vision. The attached prototype demonstrates the core idea. Before refactoring it, the developer should preserve and tag the exact baseline, deploy it, add the product vision, create the initial backlog, and start `AI_LOG.md`.

## Next safe implementation step

Reconcile the repository with this state file, preserve the original MVP as a tagged baseline, and scaffold the React + TypeScript + Vite + Ant Design application. Port behavior module by module with characterization tests before replacing algorithms.

## Decisions still open

- exact provider/model defaults and tested batch budgets;
- telemetry location acquisition method and handling of unknown movie/location;
- exact three-life rule identity, reset, and bypass semantics;
- metadata provider and permitted use;
- telemetry retention/deletion and notice/opt-out details;
- initial browser/device support target.

See `docs/OPEN_QUESTIONS.md`. Do not turn any open item into a fact without a human decision.
