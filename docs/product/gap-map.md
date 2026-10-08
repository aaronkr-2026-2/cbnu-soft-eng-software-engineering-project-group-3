# Feature-to-story gap map

Updated: 2026-10-08

This map connects the [current feature inventory](features-now.md) to the [initial user stories](stories.md). It records implementation coverage, not a claim that provisional personas or translation quality have been validated.

## Status definitions

- **Covered:** The acceptance criteria represented in the current story are implemented and have repository evidence, while any stated human evidence boundary remains explicit.
- **Partial:** Useful behavior exists, but at least one acceptance criterion or required evidence item is incomplete.
- **Gap:** The story's main outcome is not available or has no current verification.

## Mapping

| Story ID | Persona need | Current feature IDs | Status | Remaining gap or evidence needed |
| --- | --- | --- | --- | --- |
| US-01 | Load a trustworthy English subtitle without wasting a translation attempt. | F-03, F-04, F-05 | Covered | Automated parsing and mocked-browser evidence exists. Real-user usability/accessibility review of errors and file selection is still needed. |
| US-02 | Configure the language, model, profile, and likely cost before starting. | F-06, F-07, F-08, F-09 | Partial | The NMT language catalogue and selectors are implemented. TLLM support for every listed language/model/location is not verified, and the cost is an estimate rather than a guaranteed bill. |
| US-03 | Understand connected dialogue rather than isolated fragments. | F-10, F-11, F-12, F-13, F-14, F-26 | Partial | Structural tests prove joined inputs, validated mapping, redistribution, text conservation, and fixed timecodes with mocked translations. Human review against movie audio in representative NMT/TLLM language pairs is still required; no professional-quality claim is supported. |
| US-04 | Know that a long translation is moving and retain control of the preview. | F-15, F-21, F-25 | Covered | Mocked Chromium covers progress-related workflows and a synthetic 2,500-cue virtual list. Subjective responsiveness on representative full movies and additional target browsers still need human/live evidence. |
| US-05 | Resume interrupted work without paying or waiting for completed groups again. | F-16, F-17, F-18, F-19 | Partial | Failure/cancellation retry and edit preservation work only in the current tab. Reload/closed-tab checkpoint recovery is not implemented, and background/closed-tab completion is not guaranteed. |
| US-06 | Review visibly connected dialogue while retaining original cue boundaries. | F-13, F-16, F-20, F-21 | Covered | The structure and notices are implemented. Human review must still decide whether grouping and visual presentation make real subtitle correction efficient. |
| US-07 | Find cues likely to be hard to read. | F-14, F-22 | Covered | Exact boundary tests exist, but the profile is an English-derived reference. Language-specific readability and real-user comprehension remain unvalidated. |
| US-08 | Correct an important translation and keep the correction. | F-19, F-23, F-24 | Covered | Automated edit/retry/download evidence exists. Jenna's ability and willingness to identify and repair important target-language errors remains a persona hypothesis. |
| US-09 | Download a structurally usable translated SRT. | F-04, F-12, F-24, F-26 | Covered | Structural round-trip and mocked browser-download evidence exists. Playback with representative media players and human timing/translation review still need evidence. |
| US-10 | Use the complete translator from a public URL without local setup. | — | Gap | Vercel Function adapters now exist, but the personal fork must receive the change and production still needs server-only environment variables, an owner-approved allowance, Vercel Firewall rate limiting, Google budget/quota controls, explicit gateway enablement, and deployed frontend-to-gateway smoke evidence. |

## Prioritized gaps

1. **Public end-to-end deployment (US-10).** Sync the personal fork, configure and secure the Vercel gateway, define the owner-funded allowance and abuse controls, explicitly enable it, and retain dated smoke/CI evidence.
2. **Human translation and timing validation (US-03).** Compare joined NMT/TLLM output with representative movie audio and target languages; record acceptable and unacceptable errors. Automated structural mapping tests are not human quality evidence.
3. **Reload recovery (US-05).** Add a validated browser-local checkpoint and a reload test. Current retry/edit preservation is only in the open tab and must not be described as durable recovery.
4. **Model/language coverage and real-user validation (US-02 and all persona-derived stories).** Confirm TLLM pairs and test the Teddy/Jenna hypotheses, priorities, wait-time tolerance, comprehension needs, and editing workflow with real people.

Deferred Statistics/telemetry, metadata, lives, accounts, Gemini, sharing, and cloud subtitle storage/reuse remain outside the protected core and are not solutions to these gaps.
