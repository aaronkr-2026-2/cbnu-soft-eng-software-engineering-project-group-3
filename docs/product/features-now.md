# Features available now

Updated: 2026-10-08

This inventory records what a user can do in the current repository. It was checked against the React application, gateway, automated tests, `PROJECT_STATE.md`, and `BUILD_LOG.md`. Feature IDs are stable references for the [user stories](stories.md) and [gap map](gap-map.md).

## Application and navigation

- **F-01 — Translator workspace and help.** The app presents a compact translator header, settings sidebar, subtitle preview, workflow help, and a link to the GitHub repository. The brand and reset actions ask for confirmation before discarding loaded or translated work.
- **F-02 — Light and dark themes.** The first theme follows the operating-system preference. A labelled sun/moon switch changes the theme for the current mounted session.

## Subtitle input

- **F-03 — Local SRT choose/drop and strict validation.** A user can choose or drop one `.srt` file. The app accepts fatal-decoded UTF-8 up to 5 MiB and reports empty files, invalid blocks or timestamps, empty cue text, unsupported ASS-style formatting, unsupported or unbalanced markup, and invalid timing instead of silently importing partial data.
- **F-04 — Source preservation and safe preview.** Imported cue order, numeric index text, exact start/end strings, multiline source text, Unicode, and balanced `i`/`b`/`u` markup are retained. Supported markup is rendered without trusting subtitle HTML.
- **F-05 — Loaded-file feedback.** The sidebar shows the filename and cue count. Long filenames are kept inside the upload card, clamped to three lines, and exposed in full through a tooltip.

## Translation setup

- **F-06 — Dynamic target languages.** The searchable target-language list loads automatically from the gateway's Google NMT catalogue, excludes English, validates the response, and offers a retry after a loading error. This catalogue is not independent proof that every language works with TLLM.
- **F-07 — NMT or TLLM selection.** The user can select official Cloud Translation NMT or TLLM. Both are called only through the owner-funded server-side gateway; Gemini Developer API and visitor API-key entry are absent.
- **F-08 — Explicit reading profile and guarded start.** The user must choose Adult (20 characters per second) or Children (17 characters per second), as well as a valid file, model, and target language. Start stays disabled until all prerequisites and request limits are valid, and conflicting settings lock once work is running or output exists.
- **F-09 — Cost and request estimates.** The selected engine shows estimated whole-file input characters, request count, and list-price cost, plus a remaining-work estimate after partial completion. TLLM clearly labels the assumption that output length equals input length; retries, credits, discounts, and the final bill can differ.

## Translation behavior

- **F-10 — Bounded continuation grouping.** Adjacent cues beginning with lowercase text, three dots, or an ellipsis join the previous continuation group. The same groups drive the preview and provider preparation, with bounds of 64 cues and a preferred 5,000 normalized source characters.
- **F-11 — Joined provider input for both models.** Soft-wrapped continuing speech is joined before NMT or TLLM translation. Known speaker turns, bracketed sounds, and music remain distinct structural units; batching separate units does not promise shared context between them.
- **F-12 — Provider-response validation.** The client checks result count and IDs, nonempty output, supported tag structure, and sound/music markers before accepting a batch. Unsafe or malformed results fail visibly rather than being guessed into output.
- **F-13 — Approximate redistribution into original cues.** Joined target text is redistributed locally using cue reading capacity, target-language boundaries, and punctuation preferences. All returned text stays in order, original cue identities and timecodes remain unchanged, and multi-cue results carry a review notice. This is approximate placement, not semantic or audio alignment.
- **F-14 — Subtitle wrapping without silent loss.** Translations are wrapped around a 42-visible-grapheme reference and at most two lines where source structure allows. Required speaker lines are preserved even when they exceed the target; text is not silently shortened and timing is never changed automatically.

## Progress and recovery

- **F-15 — Live job progress.** The stationary action area shows completed/total cues, percent, state, elapsed time, start/finish times, and cumulative Google translation-request attempts. Language discovery is not counted as a translation attempt.
- **F-16 — Per-cue states and failure isolation.** Cue cards distinguish waiting, translating, translated, failed, and edited states. Errors appear with the affected cues. A local redistribution failure can preserve a valid sibling group; a request failure applies to the submitted batch, while later cues remain waiting.
- **F-17 — Bounded retries and visible quota cooldown.** Timeout and transient failures have bounded automatic retries. An allowlisted Google per-minute quota response produces a visible, cancelable cooldown using a bounded provider delay or a 60-second default, with no more than three total attempts for that request. Daily quota, permission, billing, and invalid requests stop without that retry loop.
- **F-18 — Cancellation and stale-result protection.** A running job can be canceled, including during the quota wait. Results arriving after cancellation, reset, provider change, or component disposal are ignored.
- **F-19 — In-tab retry and edit preservation.** After failure or cancellation, Retry processes unfinished original groups and keeps completed results, saved edits, the original start time, and the cumulative request count in the current tab. There is no reload or closed-tab checkpoint recovery.

## Review, editing, and output

- **F-20 — Paired grouped review.** Virtualized cards show original and translated text side by side with cue index, timeframe, state, visible continuation-group labels, and larger spacing between groups.
- **F-21 — Scroll-follow controls.** The preview follows the active cue until the user scrolls or navigates away. A return-to-current control restores follow mode.
- **F-22 — Readability warnings.** Each completed cue can flag more than two lines, a line over 42 visible graphemes, Adult/Children CPS excess, and cue-capacity excess. Warnings invite review; they do not claim language-specific correctness.
- **F-23 — Local cue editing.** Each completed translation can be edited, validated, saved, or canceled. Saved edits have a distinct state, survive in-tab retries, and are used in the download.
- **F-24 — Complete-only SRT download.** Download is enabled only when every cue has valid translated or edited text and no job is running. The UTF-8 SRT keeps source order, index strings, exact timecodes, and intentional line breaks; its filename adds the target-language code.

## Performance and verification evidence

- **F-25 — Long-list virtualization and incremental painting.** The preview mounts only the visible cue rows plus a buffer, retains an active edit row, and yields between completed batches. A mocked Chromium workflow covers a synthetic 2,500-cue file, including a jump to the final cue.
- **F-26 — Automated integrity checks.** The repository has unit/integration coverage for SRT round trips and validation, continuation grouping, joined NMT/TLLM payloads, redistribution and text conservation, readability boundaries, retries, cancellation, editing, and output. Mocked Chromium workflows exercise the main user flow, partial failure, cooldown, cancellation, themes, filename containment, joined input, download, virtualization, and the mobile scroll container.

## Not available yet

The following must not be presented as current functionality:

- a verified public deployment where both the frontend and private gateway work together;
- recovery after a reload, frozen/discarded page, or closed tab, or guaranteed background translation;
- Statistics or telemetry;
- movie metadata matching or lives;
- Gemini Developer API;
- cloud subtitle storage, sharing, checkpoints, or cross-user reuse;
- automatic retiming or silent shortening;
- professional, cinema-grade, or universally accurate translation/timing guarantees;
- documented and enforced public allowance, authentication, abuse prevention, rate limits, or spending controls.

## Evidence boundary

Automated tests use mocked provider responses unless a build-log entry explicitly says otherwise. They show that the application preserves structure, sends joined input, maps validated responses, handles failure states, and produces consistent files. They do **not** prove human translation quality, semantic timing against movie audio, support for every target/model pair, production security or cost controls, additional browser compatibility, or a working public deployment. Those claims need current live and human evidence.
