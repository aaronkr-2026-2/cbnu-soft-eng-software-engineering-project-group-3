# Project State

Last updated: 2026-10-08 — Vercel gateway deployment adapters

## Confirmed product

This is a solo project for movie viewers who can obtain an English SRT and want subtitles in their preferred language. The core flow is choose file → select NMT/TLLM, target language and explicit Adult/Children profile → start → review/edit → download. Original cue indexes/order/timecodes remain intact.

Both official Cloud Translation models use the owner's server-side gateway. The local server reads ignored `.env`; Vercel Functions read server-only project environment variables; the browser never sees the credential. No visitor key field or Gemini product integration exists. See ADR-004 and ADR-006.

## Current implementation

- React/TypeScript/Vite/Ant Design with a compact header, approximate 20/80 desktop layout and virtualized paired cue cards. Theme starts from the OS; shared configuration lives in `src/app/theme.ts`. Major controls use 24 px spacing within an 8/16/24/32 px scale. Ant Design Upload handles choose/drop.
- English UTF-8 SRT up to 5 MiB; balanced i/b/u markup; strict import errors; original source identity/times preserved. The header brand confirms before resetting loaded work. Help has X and OK; repository/theme controls remain compact.
- Long loaded filenames stay within the Ant Design upload card, clamp to three visible lines and expose the complete name in a tooltip.
- Languages load automatically through the gateway, without a paid Hello probe. The picker uses Google's NMT catalogue; not every TLLM language/model/location is independently verified.
- Shared source grouping joins lowercase/ellipsis continuation speech for BOTH engines. Soft wraps become spaces; structural speaker/sound/music boundaries remain distinct. Groups are technically bounded to 64 cues and a preferred 5,000 source characters, with request-size validation.
- Provider results are validated and redistributed locally into original time slots by reading capacity and target-language boundaries, then wrapped. This is approximate text placement, not semantic/audio alignment. Redistributed cues show a review notice. See `docs/SUBTITLE_FORMATTING_SPEC.md` for constraints.
- Original timing, supported markup, translated text and edits are retained. Impossible distributions fail visibly. Valid sibling groups survive a local group failure; request failures affect the submitted batch. Retry preserves completed original groups and edits; unattempted cues remain waiting.
- Progress, elapsed time, cumulative translation-attempt count, cancellation, per-cue errors, editing and complete-only download exist. Retry retains the first start time; elapsed time spans from first Start to the latest stop, including the gap when resumed. Reload recovery is not implemented.
- The gateway recognizes Google's per-minute quota response as an allowlisted `rate_limited` 403 and supplies a bounded retry delay. The browser waits for that cancelable cooldown (60 seconds when Google supplies no usable `Retry-After`) and retries the same batch, up to three total attempts. The UI shows `cooldown` and the scheduled retry time. Other transient failures retain short bounded backoff; daily quota, permission, billing and invalid requests are not retried.
- Cost estimates show the selected engine's whole file and remaining work. NMT counts prepared input; TLLM assumes output length equals input and labels that assumption. Credits and final billing are unknown. No guaranteed cost ceiling is claimed.
- A shared gateway core proxies official NMT/TLLM only, validates request shape/size and sanitizes failure categories. The local Node adapter remains behind Vite's development proxy; same-origin Vercel Functions now expose the production language and translation routes. TLLM input is capped at 30,000 code points. Production fails closed until `TRANSLATION_GATEWAY_ENABLED=true`. Routine tests mock Google. Requests are currently sequential; concurrency is not part of this revision.

The 43-cue original `examples/demo.srt` remains available. Dedicated regression fixtures exercise continuation gathering, annotations, output distribution and large lists. Complete downloaded movie subtitles remain local manual inputs rather than repository fixtures.

## Corrected previous records

The React port previously grouped cues only on screen while sending separate strings. The voice memo explicitly restored real joined provider input for both models. ADR-006 supersedes ADR-005's marked-TLLM-only proposal. Arbitrary cue markers are not a Google-guaranteed alignment mechanism, and source-word ratios are not restored.

README, architecture and migration plans no longer instruct visitor keys or describe the already implemented local gateway as future work. Historical ADR-002/003/005 and previous log entries remain labelled history. `GEMINI.md` and `CLAUDE.md` are coding-assistant pointers, not runtime features.

## Evidence and remaining limits

The archived HTML at `archive/mvp/srt-translator-beta-3.html` and local `mvp-baseline` tag (`b64bc59`) preserve the before-state. The archive's undocumented endpoint is excluded from the production build.

Earlier logs record minimal live NMT/TLLM requests on 2026-09-18 using `us-central1`; Seoul `asia-northeast3` failed that smoke test. The user also reported full-file attempts and UI/quality problems. Neither is controlled live acceptance evidence for the revised grouped pipeline. On 2026-10-01, the upload-name and quota-cooldown revision passed typecheck, zero-warning lint, 84 Vitest tests, the production build, formatting, the build-artifact check and 12 mocked Chromium workflows. Current automated verification is recorded in BUILD_LOG.md, with mocked provider quality clearly separated from human review.

The owner reported a Vercel frontend deployment at `https://srt-translator-tawny.vercel.app`; a read-only check on 2026-10-08 returned the frontend but `404 NOT_FOUND` for the language Function before this change. Vercel is now the confirmed host and Function adapters exist in the repository. Current local verification passed formatting, typecheck, zero-warning lint, 94 Vitest tests across nine files, the production build and artifact scan, Node syntax checks, whitespace validation, and all 12 mocked Chromium workflows. The personal fork has not yet been synchronized or redeployed and no live Function result is claimed.

The owner budget/allowance, Vercel Firewall rate limit, exhaustion behavior, explicit production enablement, the project's actual Google quota settings, live grouped-subtitle language/timing review and post-deployment smoke evidence remain outstanding. The gateway deliberately returns `gateway_disabled` in production until enabled. That switch and the existing Google cooldown are not a production allowance or spending control. Current desktop compatibility targets exceed the browsers actually tested. A bundle-size warning remains documented with build evidence.

## Next work

1. Human-review grouped NMT/TLLM output and timing on a small original fixture in representative target languages; define acceptance and model/language coverage.
2. Sync the merged change to the personal fork; configure Vercel server secrets, owner allowance, Firewall rate limit and Google budget/quota controls; explicitly enable the gateway; verify the deployed NMT/TLLM flow.
3. Complete dated user/persona, sprint/review, security and external peer-review evidence under the existing semester plan.
4. Implement browser-local checkpoint/resume at its planned milestone. Current retry is in-tab only.
5. Keep Statistics/metadata/lives/telemetry conditional. Country/city acquisition, retention and notice remain open. Cloud subtitle storage/reuse and durable persisted jobs remain deferred.

## Records and workflow

`AGENTS.md` is canonical. `docs/REQUIREMENTS_REVISION_PROMPT.md` is the extracted executable memo; `docs/REQUIREMENTS_REVISION_AUDIT.md` records the gap analysis and course check. The short `AI_LOG.md` links detailed course-format evidence in `docs/AI_DETAILED_LOG.md`. Every completed file-changing prompt requires documentation, verification and a local commit; a remote push requires an explicit request.

`docs/product/` now contains the verified current-feature inventory, provisional Teddy and Jenna persona hypotheses, prioritized initial user stories, and the feature-to-story gap map. Teddy and Jenna were supplied by the project owner and have not been interviewed or validated. Real-user validation, revisions based on that evidence, and human translation/timing review remain required; creating these documents alone does not complete the Week 4 milestone.

`docs/sprints/` now includes retrospective Week 2-4 summaries alongside the existing Week 5 record. They cite Git/document evidence and mark missing pitch, public MVP deployment, real-user validation, review, capacity, and human retrospective details as gaps rather than reconstructing events that were not recorded contemporaneously.
