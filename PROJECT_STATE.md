# Project State

Last updated: 2026-10-09 — owner corrected Jenna's persona and unedited-quality need

## Confirmed product

This is a solo project for movie viewers who can obtain an English SRT and want subtitles in their preferred language. The core flow is choose file → select NMT/TLLM, target language and explicit Adult/Children profile → start → review/edit → download. Original cue indexes/order/timecodes remain intact.

Both official Cloud Translation models use the owner's server-side gateway. The local server reads ignored `.env`; Vercel Functions read server-only project environment variables; the browser never sees the credential. No visitor key field or Gemini product integration exists. See ADR-004 and ADR-006.

## Current implementation

- Application source and browser tests live in `frontend/`; the shared gateway and its tests live in `backend/`. Root `api/` holds only the Vercel-required same-origin Function entrypoints. Root build/test configuration coordinates one Vite deployment. The professor/Classroom50 starter files and course resources were not moved or edited.

- React/TypeScript/Vite/Ant Design with a compact header, approximate 20/80 desktop layout and virtualized paired cue cards. Theme starts from the OS; shared configuration lives in `frontend/src/app/theme.ts`. Major controls use 24 px spacing within an 8/16/24/32 px scale. Ant Design Upload handles choose/drop.
- Desktop controls use a responsive 240-384 px sidebar before switching to the stacked mobile layout. Major flex/grid children, cards and feedback surfaces can shrink without horizontal overflow; the language-load Alert keeps its message readable and stacks its retry action below the text.
- English UTF-8 SRT up to 5 MiB; balanced i/b/u markup; strict import errors; original source identity/times preserved. The header brand confirms before resetting loaded work. Help has X and OK; repository/theme controls remain compact.
- Long loaded filenames stay within the Ant Design upload card, clamp to three visible lines and expose the complete name in a tooltip.
- Languages load automatically through the gateway, without a paid Hello probe. The picker uses Google's NMT catalogue; not every TLLM language/model/location is independently verified.
- Malformed successful language JSON (including an English-only catalogue) keeps setup unavailable and recoverable through Retry. Malformed successful translation JSON never becomes a completed cue; a mocked browser flow confirms download stays disabled until valid retry. The Vercel adapter now limits actual streamed body bytes before buffering the full request.
- Shared source grouping joins lowercase/ellipsis continuation speech for BOTH engines. Soft wraps become spaces; structural speaker/sound/music boundaries remain distinct. Groups are technically bounded to 64 cues and a preferred 5,000 source characters, with request-size validation.
- Provider results are validated and redistributed locally into original time slots by reading capacity and target-language boundaries, then wrapped. This is approximate text placement, not semantic/audio alignment. Redistributed cues show a review notice. See `docs/requirements/SUBTITLE_FORMATTING_SPEC.md` for constraints.
- Original timing, supported markup, translated text and edits are retained. Impossible distributions fail visibly. Valid sibling groups survive a local group failure; request failures affect the submitted batch. Retry preserves completed original groups and edits; unattempted cues remain waiting.
- Progress, elapsed time, cumulative translation-attempt count, cancellation, per-cue errors, editing and complete-only download exist. Retry retains the first start time; elapsed time spans from first Start to the latest stop, including the gap when resumed. Reload recovery is not implemented.
- The gateway recognizes Google's per-minute quota response as an allowlisted `rate_limited` 403 and supplies a bounded retry delay. The browser waits for that cancelable cooldown (60 seconds when Google supplies no usable `Retry-After`) and retries the same batch, up to three total attempts. The UI shows `cooldown` and the scheduled retry time. Other transient failures retain short bounded backoff; daily quota, permission, billing and invalid requests are not retried.
- Cost estimates show the selected engine's whole file and remaining work. NMT counts prepared input; TLLM assumes output length equals input and labels that assumption. Credits and final billing are unknown. No guaranteed cost ceiling is claimed.
- A shared gateway core proxies official NMT/TLLM only, validates request shape/size and sanitizes failure categories. The local Node adapter remains behind Vite's development proxy; same-origin Vercel Functions now expose the production language and translation routes. TLLM input is capped at 30,000 code points. Production fails closed until `TRANSLATION_GATEWAY_ENABLED=true`. Routine tests mock Google. Requests are currently sequential; concurrency is not part of this revision.

The original fictional `examples/demo.srt` now has 51 cues: its previous 43 plus eight original cases inspired by the owner's English → Mongolian spot check. Dedicated regression fixtures exercise continuation gathering, annotations, output distribution and large lists. Complete downloaded movie subtitles remain local manual inputs rather than repository fixtures.

## Corrected previous records

The React port previously grouped cues only on screen while sending separate strings. The voice memo explicitly restored real joined provider input for both models. ADR-006 supersedes ADR-005's marked-TLLM-only proposal. Arbitrary cue markers are not a Google-guaranteed alignment mechanism, and source-word ratios are not restored.

README, architecture and migration plans no longer instruct visitor keys or describe the already implemented local gateway as future work. The README again includes the course-required FOR/WHO/THAT/UNLIKE product-vision statement after its brief public introduction and screenshot. Historical ADR-002/003/005 and previous log entries remain labelled history. The empty `TranslationProvider.clear()` hook left by the visitor-key design was removed; no active Gemini/visitor-key/Firebase/Statistics implementation was found to delete. `GEMINI.md` and `CLAUDE.md` are coding-assistant pointers, not runtime features.

## Evidence and remaining limits

The archived HTML at `docs/mvp/srt-translator-beta-3.html` and local `mvp-baseline` tag (`b64bc59`) preserve the before-state. The archive's undocumented endpoint is excluded from the production build.

Earlier logs record minimal live NMT/TLLM requests on 2026-09-18 using `us-central1`; Seoul `asia-northeast3` failed that smoke test. The user also reported full-file attempts and UI/quality problems. Neither is controlled live acceptance evidence for the revised grouped pipeline. On 2026-10-01, the upload-name and quota-cooldown revision passed typecheck, zero-warning lint, 84 Vitest tests, the production build, formatting, the build-artifact check and 12 mocked Chromium workflows. Current automated verification is recorded in BUILD_LOG.md, with mocked provider quality clearly separated from human review.

The Vercel frontend is deployed at `https://srt-translator-tawny.vercel.app`. Before the Function change, a read-only check returned the frontend but `404 NOT_FOUND` for language discovery. After the owner synchronized and configured the deployment on 2026-10-08, the owner reported the web flow working and a read-only check returned 195 languages with HTTP 200. This establishes frontend-to-Function language discovery, not paid grouped-translation quality. Current automated verification is recorded in BUILD_LOG.md.

The responsive feedback revision passed formatting, typecheck, zero-warning lint, 94 Vitest tests across nine files, the production build and artifact scan, whitespace validation, and 13 mocked Chromium workflows. The new workflow verifies the language-error message/action geometry and horizontal containment at 1024 px and 390 px; temporary desktop/mobile screenshots were visually inspected and were not committed.

The folder/refactor audit is recorded in `docs/audits/CODE_AUDIT_2026-10-08.md`. Its final typecheck/lint/108 Vitest tests/build, documentation-link check and 15 mocked Chromium workflows passed after local socket permission was granted. The README uses a screenshot from a mocked browser run, not live provider evidence. The lecture-alignment documentation change requires its own current verification, recorded in `BUILD_LOG.md`.

The owner budget/allowance, Vercel Firewall rate limit, exhaustion behavior, the project's actual Google quota settings, controlled model-labelled grouped-subtitle language/timing review and paid-translation smoke evidence remain outstanding. The enablement switch and existing Google cooldown are not a production allowance or spending control. Current desktop compatibility targets exceed the browsers actually tested. A bundle-size warning remains documented with build evidence.

The owner supplied a local 301-cue English movie-subtitle crop and translated Mongolian file for a small qualitative review on 2026-10-09. Cue IDs and timecodes match; the owner rated cues 56, 132, 151 and 189 positively, 207 roughly 4/5, and flagged native phrasing at 77, nuance at 246 and speaking perspective around 251. The note mentioning “213” alongside 251 is ambiguous because source cue 213 is a music-description cue. Model identity, manual-edit history, audio alignment and preferred corrections were not established. See [the dated spot check](docs/audits/MONGOLIAN_SUBTITLE_REVIEW_2026-10-09.md); no production translation logic changed.

No reproducing deadlock was found in the inspected sequential flow, but the local gateway's upstream fetch has no separate server-side timeout. Client timeout and the Vercel 30-second Function limit do not create a spending cap or prove every hang impossible. Provider output-size and public rate/allowance enforcement are also open; see the audit rather than treating this refactor as a security certification.

## Next work

1. Human-review grouped NMT/TLLM output and timing on a small original fixture in representative target languages; define acceptance and model/language coverage.
2. Confirm and retain evidence for the owner allowance, Firewall rate limit and Google budget/quota controls; record controlled deployed NMT/TLLM smoke results without exposing subtitles or credentials.
3. Complete dated user/persona, sprint/review, security and external peer-review evidence under the existing semester plan.
4. Implement browser-local checkpoint/resume at its planned milestone. Current retry is in-tab only.
5. Keep Statistics/metadata/lives/telemetry conditional. Country/city acquisition, retention and notice remain open. Cloud subtitle storage/reuse and durable persisted jobs remain deferred.

## Records and workflow

`AGENTS.md` is canonical. `docs/requirements/REQUIREMENTS_REVISION_PROMPT.md` is the extracted executable memo; `docs/audits/REQUIREMENTS_REVISION_AUDIT.md` records the gap analysis and course check. The short `AI_LOG.md` links detailed course-format evidence in `docs/AI_DETAILED_LOG.md`. Every completed file-changing prompt requires documentation, verification and a local commit; a remote push requires an explicit request.

`docs/product/` contains the source-checked current-feature inventory and the lecture-aligned, provisional persona → scenario → story → feature → gap/creep-audit trail described below. Teddy and Jenna were supplied by the project owner and have not been interviewed or validated. Real-user validation, revisions based on that evidence, and human translation/timing review remain required; creating these documents alone does not complete the Week 4 milestone.

The owner clarified that Jenna is in her early thirties, lives with her family, organizes weekly movie night and has advanced English. Her parents do not understand English; she will not fix web-app errors and needs the downloaded translation to convey the plot without manual repair. Her occupation and formal education are not relevant to this consumer workflow. The persona/scenario and story trace now put her need on unedited translation quality; paired review/editing belong to a separate hypothetical reviewer. This is owner-authored fictional-persona clarification, not interview validation. Teddy and the planned third persona still await owner details. GitHub issue #22 remains open.

`docs/sprints/` now includes retrospective Week 2-4 summaries alongside the existing Week 5 record. They cite Git/document evidence and mark missing pitch, public MVP deployment, real-user validation, review, capacity, and human retrospective details as gaps rather than reconstructing events that were not recorded contemporaneously.

`docs/README.md` is the navigation map. Decisions, requirements, guides, planning and audits now have their own folders; `docs/mvp/` holds the unchanged archived HTML. The owner subsequently supplied the correct *5. Features, Stories* lecture. `docs/product/` now separates two proto-persona cards, two named scenarios, 11 provisional stories, an 11-feature activation/input/action/output list, a feature ↔ story ↔ issue gap map and a four-question creep audit. The earlier literature-review PDF was the wrong lecture for this task; no real-person check, third persona/scenario, or runtime feature cut is claimed. The owner now plans to supply a third fictional role; no details have yet been supplied.

On 2026-10-09, the verified responsive/refactor/product-document branch was merged through [PR #5](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/pull/5) into `main` (`d95c971`); its final `verify` check passed on the PR head. [The GitHub backlog](docs/planning/BACKLOG.md) now traces historical implementation commits to 12 closed issues and records six open follow-ups. GitHub issue/PR status is the live source of truth. The old root `archive/` contained only ignored `.DS_Store` metadata and was removed locally; Git does not track empty directories. `PROJECT_STATE.md` was already first in `AGENTS.md`'s required reading order and already required after material changes.
