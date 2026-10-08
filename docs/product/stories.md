# Initial prioritized user stories

Updated: 2026-10-08

These stories are derived from the provisional Teddy and Jenna hypotheses and the confirmed product scope. Priorities and acceptance criteria remain provisional until they are validated with real users. `Must` protects the current end-to-end translator outcome; `Should` improves review confidence without expanding into deferred product areas.

## US-01 — Load a valid English subtitle

**Persona:** Teddy and Jenna

**Priority:** Must

> As a movie viewer who has found an English subtitle, I want to load it and see clear validation, so that I do not begin translation with a corrupt or unsupported file.

Acceptance criteria:

- The user can choose or drop one `.srt` file.
- A valid fatal-decoded UTF-8 SRT at or below 5 MiB shows its filename, cue count, and source cues.
- Invalid extension, encoding, size, structure, timestamps, empty cue text, unsupported formatting, or unbalanced supported markup produces a visible error and no partial import.
- Imported cue order, index strings, exact timing strings, multiline text, Unicode, and supported `i`/`b`/`u` markup are retained.

## US-02 — Choose the translation setup

**Persona:** Teddy and Jenna

**Priority:** Must

> As a subtitle user, I want to choose a model, target language, and reading profile, so that the translation matches my language and intended audience.

Acceptance criteria:

- The user can select NMT or TLLM and sees a concise, non-guaranteed description of each.
- The searchable language list loads automatically through the gateway, excludes English, and provides a retry when loading fails.
- The user explicitly selects Adult (20 CPS) or Children (17 CPS).
- Start remains disabled until the file, language, profile, service state, and request estimate are valid.
- The selected engine shows whole-file and remaining-work character/request/cost estimates with the TLLM output-length assumption labelled.

## US-03 — Translate connected dialogue coherently

**Persona:** Teddy and Jenna

**Priority:** Must

> As a movie viewer, I want connected dialogue translated as joined speech, so that fragments split across subtitle cues have useful context.

Acceptance criteria:

- Both NMT and TLLM receive joined lowercase/ellipsis continuation speech within documented group limits.
- Soft display wraps become spaces, while known speaker, sound, and music boundaries remain separate translation units.
- Provider results are validated before saving and redistributed only across the contributing original cues.
- Every successful output preserves returned text order, cue identity, and exact source timing; no source-word-ratio split, silent deletion, duplicated filler, or automatic retiming is used.
- Multi-cue redistribution is labelled for review, and human comparison with representative movie audio/languages is recorded before claiming translation quality.

## US-04 — See progress during a long translation

**Persona:** Teddy and Jenna

**Priority:** Must

> As a user translating a long subtitle, I want clear ongoing progress, so that I know the app is working and how much remains.

Acceptance criteria:

- While work is active, the UI shows completed and total cues, percentage, current state, elapsed time, and cumulative translation-request attempts.
- The active cue or batch is visibly identified, and the preview can follow it without preventing manual scrolling.
- The app warns the user to keep the tab open and foregrounded.
- The timer stops on completion, cancellation, or failure; manual retry retains the first start time and cumulative request count.

## US-05 — Recover from interruption without repeating completed work

**Persona:** Teddy and Jenna

**Priority:** Must

> As a user whose translation is interrupted, I want to continue from completed work, so that I do not waste time or paid translation attempts.

Acceptance criteria:

- After an in-tab request failure or cancellation, completed groups and saved edits remain available and unattempted cues remain waiting.
- Retry submits only unfinished original groups and never overwrites saved edits.
- Transient failures use bounded retries; an allowlisted per-minute quota response shows a cancelable cooldown and retry time.
- Reloading or reopening the page restores a validated local checkpoint without retranslating completed groups.
- The interface never promises that work continues while the tab is frozen, discarded, or closed.

## US-06 — Review connected subtitle blocks

**Persona:** Teddy and Jenna

**Priority:** Should

> As a subtitle reviewer, I want connected cues to look connected while keeping their original time slots visible, so that I can judge the redistributed dialogue in context.

Acceptance criteria:

- Original and translated cards are paired and show cue index and timeframe.
- Bounded continuation groups have visible labels, compact spacing inside a group, and larger spacing between groups.
- Each translated card shows waiting, translating, translated, failed, or edited status and any cue-specific failure.
- A multi-cue redistributed result tells the reviewer to compare wording and timing with the movie.

## US-07 — Find readability problems

**Persona:** Teddy and Jenna

**Priority:** Should

> As a subtitle reviewer, I want readability problems highlighted, so that I can find cues that may be difficult to read before downloading.

Acceptance criteria:

- The selected Adult or Children profile checks the appropriate 20 or 17 CPS limit.
- Completed cues flag more than two lines, any line above 42 visible graphemes, CPS excess, and cue-capacity excess.
- Required speaker structure is preserved even when it creates a warning.
- Warnings do not delete text, change timing, or claim universal language or accessibility correctness.

## US-08 — Correct an important translation

**Persona:** Jenna; Teddy may also use it

**Priority:** Must

> As a reviewer who finds an important mistake, I want to edit that cue, so that the downloaded subtitle communicates the intended meaning.

Acceptance criteria:

- A completed cue offers an Edit action and a visible editing state.
- Cancel leaves the previously saved text unchanged.
- Save rejects empty text, blank subtitle lines, and invalid supported markup.
- A valid saved edit is marked Edited, survives in-tab retry, and appears exactly in the downloaded SRT.

## US-09 — Download a usable translated SRT

**Persona:** Teddy and Jenna

**Priority:** Must

> As a movie viewer, I want to download the completed translation as an SRT, so that I can use it with my movie.

Acceptance criteria:

- Download remains disabled while translation is active or any cue lacks valid output.
- The output is UTF-8 SRT with the original cue order, index strings, exact timecodes, intentional line breaks, and saved edits.
- The output filename includes the source basename and selected target-language code.
- Parsing the downloaded file yields the same cue count and timing as the imported file.

## US-10 — Open a working public translator

**Persona:** Teddy and Jenna

**Priority:** Must

> As a movie viewer, I want to open the translator from a public URL, so that I can use it without installing the local development environment.

Acceptance criteria:

- A documented public HTTPS URL loads the production frontend without local setup.
- The public frontend reaches a separately hosted private gateway and can complete a controlled NMT and TLLM smoke translation without exposing the owner credential.
- The gateway enforces documented origin, request-size, rate/concurrency, allowance, and abuse controls tied to an owner-approved budget.
- Current CI/deployment evidence records the tested commit, public URLs, date, and outcome.

## Scope guardrail

Statistics, telemetry, movie metadata, lives, accounts, Gemini Developer API, subtitle sharing, and cloud subtitle storage/reuse are not core stories in this set. Adding them requires the existing open decisions and a separate scope decision; they must not displace these protected outcomes.
