# Project State

Last updated: 2026-10-01 — joined-speech revision verification

## Confirmed product

This is a solo project for movie viewers who can obtain an English SRT and want subtitles in their preferred language. The core flow is choose file → select NMT/TLLM, target language and explicit Adult/Children profile → start → review/edit → download. Original cue indexes/order/timecodes remain intact.

Both official Cloud Translation models use the owner's server-side gateway. The local server reads ignored `.env`; the browser never sees the credential. No visitor key field or Gemini product integration exists. See ADR-004 and ADR-006.

## Current implementation

- React/TypeScript/Vite/Ant Design with a compact header, approximate 20/80 desktop layout and virtualized paired cue cards. Theme starts from the OS; shared configuration lives in `src/app/theme.ts`. Major controls use 24 px spacing within an 8/16/24/32 px scale. Ant Design Upload handles choose/drop.
- English UTF-8 SRT up to 5 MiB; balanced i/b/u markup; strict import errors; original source identity/times preserved. The header brand confirms before resetting loaded work. Help has X and OK; repository/theme controls remain compact.
- Languages load automatically through the gateway, without a paid Hello probe. The picker uses Google's NMT catalogue; not every TLLM language/model/location is independently verified.
- Shared source grouping joins lowercase/ellipsis continuation speech for BOTH engines. Soft wraps become spaces; structural speaker/sound/music boundaries remain distinct. Groups are technically bounded to 64 cues and a preferred 5,000 source characters, with request-size validation.
- Provider results are validated and redistributed locally into original time slots by reading capacity and target-language boundaries, then wrapped. This is approximate text placement, not semantic/audio alignment. Redistributed cues show a review notice. See `docs/SUBTITLE_FORMATTING_SPEC.md` for constraints.
- Original timing, supported markup, translated text and edits are retained. Impossible distributions fail visibly. Valid sibling groups survive a local group failure; request failures affect the submitted batch. Retry preserves completed original groups and edits; unattempted cues remain waiting.
- Progress, elapsed time, cumulative translation-attempt count, cancellation, per-cue errors, editing and complete-only download exist. Retry retains the first start time; elapsed time spans from first Start to the latest stop, including the gap when resumed. Reload recovery is not implemented.
- Cost estimates show the selected engine's whole file and remaining work. NMT counts prepared input; TLLM assumes output length equals input and labels that assumption. Credits and final billing are unknown. No guaranteed cost ceiling is claimed.
- The local Node gateway proxies official NMT/TLLM only, validates request shape/size and sanitizes failure categories. TLLM input is capped at 30,000 code points. Routine tests mock Google. Requests are currently sequential; concurrency is not part of this revision.

The 43-cue original `examples/demo.srt` remains available. Dedicated regression fixtures exercise continuation gathering, annotations, output distribution and large lists. Complete downloaded movie subtitles remain local manual inputs rather than repository fixtures.

## Corrected previous records

The React port previously grouped cues only on screen while sending separate strings. The voice memo explicitly restored real joined provider input for both models. ADR-006 supersedes ADR-005's marked-TLLM-only proposal. Arbitrary cue markers are not a Google-guaranteed alignment mechanism, and source-word ratios are not restored.

README, architecture and migration plans no longer instruct visitor keys or describe the already implemented local gateway as future work. Historical ADR-002/003/005 and previous log entries remain labelled history. `GEMINI.md` and `CLAUDE.md` are coding-assistant pointers, not runtime features.

## Evidence and remaining limits

The archived HTML at `archive/mvp/srt-translator-beta-3.html` and local `mvp-baseline` tag (`b64bc59`) preserve the before-state. The archive's undocumented endpoint is excluded from the production build.

Earlier logs record minimal live NMT/TLLM requests on 2026-09-18 using `us-central1`; Seoul `asia-northeast3` failed that smoke test. The user also reported full-file attempts and UI/quality problems. Neither is controlled live acceptance evidence for the revised grouped pipeline. On 2026-10-01, the current revision passed typecheck, zero-warning lint, 83 Vitest tests, the production build, formatting, and 10 mocked Chromium workflows. Current automated verification is recorded in BUILD_LOG.md, with mocked provider quality clearly separated from human review.

Public gateway hosting, owner budget/allowance, server-enforced abuse/rate controls, live grouped-subtitle language/timing review and current remote deployment evidence remain outstanding. Current desktop compatibility targets exceed the browsers actually tested. A bundle-size warning remains documented with build evidence.

## Next work

1. Human-review grouped NMT/TLLM output and timing on a small original fixture in representative target languages; define acceptance and model/language coverage.
2. Choose production gateway host and budget/allowance/abuse controls; verify the deployed frontend-to-gateway flow.
3. Complete dated user/persona, sprint/review, security and external peer-review evidence under the existing semester plan.
4. Implement browser-local checkpoint/resume at its planned milestone. Current retry is in-tab only.
5. Keep Statistics/metadata/lives/telemetry conditional. Country/city acquisition, retention and notice remain open. Cloud subtitle storage/reuse and durable persisted jobs remain deferred.

## Records and workflow

`AGENTS.md` is canonical. `docs/REQUIREMENTS_REVISION_PROMPT.md` is the extracted executable memo; `docs/REQUIREMENTS_REVISION_AUDIT.md` records the gap analysis and course check. The short `AI_LOG.md` links detailed course-format evidence in `docs/AI_DETAILED_LOG.md`. Every completed file-changing prompt requires documentation, verification and a local commit; a remote push requires an explicit request.
