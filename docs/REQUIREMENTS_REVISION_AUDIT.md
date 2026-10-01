# Voice Memo Revision Audit

Date: 2026-09-18

The [executable prompt](REQUIREMENTS_REVISION_PROMPT.md) interprets the owner's voice transcription. Astra reviewed the plan; GPT-5.6 Terra (high reasoning effort) completes code/test execution. This document records the task's requirements findings, not a blanket claim that every semester requirement is complete.

## What differed from the memo

| Area | Before revision | Revised contract |
| --- | --- | --- |
| Connected speech | UI groups only; separate provider strings per cue. | Actual joined input for both engines, then local approximate redistribution and wrapping. |
| Mapping | Prior answer proposed arbitrary preserved cue markers. | No marker guarantee; local membership plus text-conserving distribution and review notice. |
| Start flow | Manual Check service sent a paid Hello probe before language selection. | Automatic catalogue loading; choose file/model/language/profile and Start. |
| Errors | Every remaining cue looked pending-retry after a job stopped. | Distinguish failed submitted group/batch from unattempted cues; show local error. |
| Retry metrics | Request count reset on every Start. | Translation attempt count persists across retries. |
| Cost | Pending NMT only; no TLLM estimate. | Selected-engine whole-file/remaining estimates; TLLM explicitly assumes output length. |
| Theme/reset | Always started light; brand only linked to preview. | OS-initial theme, shared tokens and confirmed workspace reset. |
| Spacing/upload | Many one-off gaps and custom drop zone. | Ant Design Upload and 8/16/24/32 px spacing; compact layout retained. |
| Project memory | README/architecture/migration plan still instructed visitor keys and future gateway work. | Owner-funded running local gateway documented; obsolete instructions superseded. |

## Mechanism decisions

ADR-006 records the owner's new join-and-redistribute requirement. Lowercase and ellipsis detection is retained from the intended MVP mechanism. Source soft wraps are removed; speaker/sound/music boundaries are preserved. Both models share this pipeline. Technical grouping/request limits bound work. Original index/time strings survive.

The original MVP's proportional word split and six-word wrapper are not restored. Reading capacity and target-language boundaries drive approximate redistribution; subtitle profile warnings remain. No automatic algorithm here proves semantic placement against the audio. Overflows need review; impossible distributions fail instead of dropping text.

Source input descriptions and music sections are meaningful text. They must not be stripped or turn every inline section into an unnecessary extra display line. Actual speaker boundaries remain mandatory. Newline handling is an application normalization decision; no universal claim is made that Google always treats every newline as a new sentence.

## Scope deliberately retained from earlier decisions

The memo does not revoke key safety, official-only APIs, strict parsing, supported markup, cancellation, protected edits, virtualized long lists, scroll-follow, active-tab warnings, accessible statuses, automated checks, local commits or the semester's external review. Those obligations remain.

Local checkpoint/resume is still planned; current recovery is in-tab only. Statistics, metadata, lives and telemetry stay conditional. Subtitle cloud storage/reuse stays deferred. No new services or packages are justified simply by the course chapter names.

`GEMINI.md` and `CLAUDE.md` remain relevant as coding-assistant instruction pointers; they are not runtime providers. Removed Gemini product prompt/configuration files are not recreated. Superseded ADRs and prior logs are retained as dated history, while active documents must use ADR-004/006.

## Course alignment check

Inspected the repository's five-page project-guide PDF and its Markdown companion. The revised product still fits its solo-project model and emphasis on applying engineering principles to one evolving product. Its before/after story now includes a concrete mistake: the React migration retained visual groups but lost the intended provider context.

This is not evidence that all course deliverables are done. Still needed: real user validation/personas, actual weekly sprint/review evidence, a deployed working frontend plus gateway, security/cost controls, external peer review, license/attribution review, and an unscripted author walkthrough. The short AI log links the full five-field course record; human reflections must be supplied honestly.

The original 40-cue demo is safe course/demo data but did not sufficiently exercise continuation groups. Regression tests provide the pizza-style joined example and edge cases. Full downloaded movie subtitle files remain local inputs rather than repository fixtures.

## Verification and remaining decisions

Current command outcomes are recorded in BUILD_LOG.md after execution. Routine tests use mocked providers; they do not establish live translation quality, all-browser compatibility, quota capacity or public deployment. The user must review representative NMT/TLLM output against original timing and decide the public host, budget and allowance. See OPEN_QUESTIONS.md.
