# Product Requirements

Version: 0.1 draft

Updated: 2026-09-18

Ownership: one developer (confirmed by the user).

Implementation decisions confirmed 2026-09-17/18: hide Statistics in the initial React release; require explicit Adult/Children reading-profile selection; accept UTF-8 SRT up to 5 MiB; initially support balanced `<i>`, `<b>`, `<u>` tags without attributes and report all other formatting as unsupported; target current desktop Chrome, Edge, Firefox, and Safari. Translation options are official Cloud Translation NMT and TLLM only. Gemini Developer API and visitor-provided keys are removed from scope. The project owner funds calls through a server-side gateway; see ADR-004 and PROJECT_STATE.md. Remaining semester requirements are not claimed complete.

## 1. Problem

Ordinary machine translation treats subtitle fragments as isolated text and often produces output that is hard to read, poorly segmented, or tedious to correct. The product should translate an English `.srt` file with enough context to preserve meaning while retaining timing and producing readable, editable output.

The intended initial audience is tech-savvy movie viewers who can obtain and use subtitle files but need a translation in their preferred or mother language. The product differentiates itself by preserving the relationship between continuation cues and speaker segments instead of translating a joined conversation and proportionally redistributing target words across original cue boundaries. See the structured product vision in `README.md`. The current Cloud Translation NMT adapter still uses one input/output string per cue; cross-cue semantic context requires a future validated provider.

## 2. Product goals

- Preserve valid cue order and timecodes from upload through download.
- Produce better contextual translation than naive cue-by-cue copy/paste.
- Make progress, failures, retries, and completion visible.
- Apply defensible subtitle readability rules instead of a universal word-count guess.
- Let the user correct translated cues before download.
- Keep provider, UI, parsing, formatting, and persistence concerns replaceable and testable.
- Create a clear before/after software-engineering story for the course.

## 3. Non-goals for the core semester release

- A complete professional subtitle-authoring or video-retiming suite.
- Support for subtitle formats other than `.srt`.
- Automatic alteration of original audio timing without user review.
- Guaranteed continued execution after a browser tab is frozen, discarded, or closed in a frontend-only deployment.
- User accounts, subscriptions, payments, or a microservices platform.
- Scraping IMDb or Rotten Tomatoes pages.
- Automatically building a public library of copyrighted subtitle text.

The last four may be reconsidered only through an explicit architecture/security/privacy decision.

## 4. Confirmed functional requirements

### 4.1 Shell and navigation

| ID     | Requirement                                                                                                                                                                  | Acceptance evidence                                                                          |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| FR-001 | The compact header shows `SRT Translator` on the left and a dark-theme switch, help button, and GitHub repository button on the right. The help button opens an explanation modal. | Keyboard and pointer navigation work; the modal is readable and dismissible; the repository button opens the configured repository. |
| FR-002 | The app has no footer.                                                                                                                                                       | No footer is rendered in either mode.                                                        |
| FR-003 | The Translator view uses approximately 20% for controls and 80% for subtitle content on desktop, while remaining usable at narrower widths.                                  | Responsive UI test and visual review.                                                        |
| FR-004 | Light/dark themes use Ant Design theme tokens instead of unrelated hard-coded component colors wherever practical.                                                           | Both themes pass visual review and preserve status meaning.                                  |

### 4.2 Input and configuration

| ID     | Requirement                                                                                                                                                                             | Acceptance evidence                                                                                                           |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| FR-010 | The user can choose or drop one English `.srt` file.                                                                                                                                    | Valid `.srt` loads; wrong extension, empty input, unreadable input, and zero valid cues produce clear errors.                 |
| FR-011 | Parsing preserves cue order, timecodes, multiline text, and supported inline formatting needed for round-trip output.                                                                   | Parse/serialize fixture tests prove no unintended cue loss.                                                                   |
| FR-012 | The target-language picker is searchable and shows languages supported by the active provider configuration.                                                                            | Searching by label/code works; unsupported combinations cannot start.                                                         |
| FR-013 | The translation-engine selector offers Cloud Translation NMT and TLLM with short, accurate difference text. It must say when contextual grouping is unavailable.                        | Each option resolves through the owner-funded gateway; benchmark evidence records the chosen default.                         |
| FR-014 | Start is disabled until file, target language, engine, and engine-specific configuration are valid.                                                                                     | State tests cover every prerequisite.                                                                                         |
| FR-015 | The browser never asks for or receives a provider credential. It has a Check service action for the selected owner-funded gateway and a compact help control that explains the check on hover or click. | Browser source/storage/telemetry/logs contain no key; Start remains disabled until service validation succeeds; browser test opens the help content. |
| FR-016 | Before starting Google Translate, show exact provider-bound character count, estimated batches, and current list-price estimate without claiming the user's remaining credit is known.  | The estimate matches the request builder and links to current official pricing/quota information.                             |
| FR-017 | The NMT estimate appears in the scrollable configuration area and explains that the displayed USD amount is the remaining file's total list-price estimate, distinguishes characters from Google requests, and labels the retry ceiling. | Browser test confirms the location and plain-language total-cost explanation; estimate unit tests remain aligned with the request builder. |

### 4.3 Translation job

| ID     | Requirement                                                                                                                                                                                                                  | Acceptance evidence                                                                                                                                   |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-020 | Translation runs asynchronously without blocking normal UI interaction.                                                                                                                                                      | The user can scroll, change view, and inspect completed cues during work.                                                                             |
| FR-021 | Pressing Start on a valid job records started time and starts an elapsed `HH:MM:SS` timer. The job also records API-call count, completed/total cues, percentage, terminal status, and finished time using the client clock. | Elapsed time derives from timestamps, remains correct after timer throttling, stops on completed/cancelled/terminal failure, and resets on a new job. |
| FR-022 | Waiting, translating, completed, failed, and user-edited states are distinguishable without relying only on color.                                                                                                           | Status text/icon is exposed accessibly.                                                                                                               |
| FR-023 | Provider requests support timeout, bounded retry with backoff, cancellation, and response validation.                                                                                                                        | Automated tests cover timeout, retryable/non-retryable errors, cancellation, malformed response, and partial completion.                              |
| FR-024 | Completed work is checkpointed so a recoverable page reload or interruption does not force already validated cues to be translated again.                                                                                    | Reload/resume integration test. A frontend-only build must not promise work continues while the page is frozen or closed.                             |
| FR-025 | A job never silently drops an input cue.                                                                                                                                                                                     | Output cue count and identifiers are validated against input before download.                                                                         |
| FR-026 | While a frontend translation job is active, show a warning card: keep this tab open and in the foreground; backgrounding, sleeping, discarding, or closing it can pause the job.                                             | Card appears when Start succeeds and remains through the active job; it does not promise background execution.                                        |

### 4.4 Subtitle presentation and editing

| ID     | Requirement                                                                                                                                                                                                                                                          | Acceptance evidence                                                                                 |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| FR-030 | Original English and translated cues are aligned side by side with index and timecode.                                                                                                                                                                               | Every parsed cue has exactly one visible pair.                                                      |
| FR-031 | Automatic scrolling follows the current cue only until the user manually scrolls away.                                                                                                                                                                               | Manual scrolling disables follow mode and shows a `Scroll to current block` floating action button. |
| FR-032 | Pressing that button scrolls to the active cue and re-enables follow mode.                                                                                                                                                                                           | Interaction test.                                                                                   |
| FR-033 | A translated cue can enter edit mode from a pencil action, be saved or cancelled, and clearly show that it was user-edited.                                                                                                                                          | Editing changes the final serialized `.srt`; cancel restores the prior value.                       |
| FR-034 | Re-running translation must not overwrite user edits without explicit confirmation.                                                                                                                                                                                  | State and interaction tests.                                                                        |
| FR-035 | Continuation cues appear as one visual group: compact spacing inside and at least twice that vertical spacing between groups, plus a non-color group indicator.                                                                                                      | Group fixtures show correct first/middle/last boundaries in both columns and themes.                |
| FR-036 | Hovering either card highlights the paired original/translated cue row. Edit mode uses a stronger persistent translated-card background/border until Save or Cancel.                                                                                                 | Pointer, keyboard-focus, light/dark, and edit-persistence interaction tests pass.                   |
| FR-037 | On desktop, the sidebar keeps translation actions, job progress, and download in a stationary bottom region outside its scrollable controls. The content pane keeps the centered `Subtitle preview` title and source/translation labels compactly sticky at its top. | Browser CSS/interactions and visual review.                                                         |

### 4.5 Subtitle readability

| ID     | Requirement                                                                                                                                                                               | Acceptance evidence                                                                                          |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| FR-040 | The formatter allows at most two display lines per cue in automatic output.                                                                                                               | Formatter tests. Text that cannot fit is flagged rather than silently creating line 3+.                      |
| FR-041 | The exact default profile is: 42 visible graphemes per line, two lines, 20 CPS adult or 17 CPS children, and capacity `min(84, floor(durationSeconds × cpsLimit))`.                       | Boundary fixtures cover 42/43 characters, 20/17 CPS, duration capacity, and protected grammatical breaks.    |
| FR-042 | Source `- <Unicode uppercase...>` speaker segments are detected before translation. Every marker after the first forces an immovable newline; a two-speaker cue has one speaker per line. | Two-speaker structure survives caseless target scripts; three speakers are preserved and flagged for review. |
| FR-043 | The app calculates cue duration and characters per second (CPS), then warns when configured readability thresholds are exceeded.                                                          | Quality report identifies over-limit cues.                                                                   |
| FR-044 | The formatter does not automatically change original timecodes in the core release.                                                                                                       | Timecode round-trip test. Retiming remains a separately approved feature.                                    |
| FR-045 | Users can see and manually repair cues that exceed line, length, or CPS constraints.                                                                                                      | Warning state links to edit mode.                                                                            |

The baseline reference profile is Netflix's English guidance: 42 characters per line, at most two lines, and up to 20 CPS for adult or 17 CPS for children's content. These are configurable reference values, not a claim of a universal or medically defined "nausea-safe" standard.

`docs/SUBTITLE_FORMATTING_SPEC.md` is normative. Line wrapping does not reduce CPS or create reading time. Text that cannot meet capacity is flagged for editing; the core does not silently omit meaning, add a third line, or alter timecodes. Provider output remains mapped to existing cue IDs. NMT and TLLM grouping/alignment behavior must be validated before the product claims cross-cue context.

### 4.6 Output

| ID     | Requirement                                                                                                          | Acceptance evidence                                     |
| ------ | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| FR-050 | Download remains disabled until every cue has a translated/pass-through value and output validation succeeds.        | Incomplete or invalid jobs cannot download as complete. |
| FR-051 | Download creates UTF-8 `.srt` text with preserved timecodes, cue order, deliberate line breaks, and all saved edits. | Golden-file tests.                                      |
| FR-052 | The output filename includes the original base name and target-language code.                                        | Filename unit test.                                     |

## 5. Translation-provider requirements

### 5.1 Shared contract

Both providers must accept a normalized batch of stable cue/group identifiers, source text, target language, optional context metadata, and an abort signal. Both must return validated results mapped to the same identifiers. The application layer must not know provider-specific HTTP details.

Both Cloud Translation models are owner-funded under ADR-004. The gateway owns the credential; browser clients receive no key and follow `docs/PROVIDER_AUTH_AND_COST.md`.

### 5.2 Google Translate

- The production implementation must use a documented Google Cloud Translation endpoint, not the MVP's undocumented consumer endpoint.
- Requests should batch multiple input strings for network efficiency while respecting provider limits.
- Batching must not be described as guaranteed cross-segment context unless evidence from the selected model/API proves it.
- Supported languages should come from official provider data or a generated, source-dated capability file.
- Credentials must not be committed or embedded in a public production bundle.
- Use Cloud Translation Basic behind the owner-funded gateway for its documented API-key support. The gateway, not the browser, owns the key.
- Preserve one input/output string per cue. Do not revive proportional target-word splitting.

### 5.3 Cloud Translation model selection

- The browser offers NMT and TLLM only, with accurate short descriptions.
- The owner-funded gateway validates the requested model and constructs the configured TLLM model resource server-side.
- Context must be supplied through bounded connected-dialogue input groups and validated cue alignment; batching alone is not evidence of context.
- Movie title, year, genre, short synopsis, and a small proper-name glossary are optional context. They are not mandatory to translate a file.
- Benchmark representative fixtures with human review before choosing a default model.

## 6. Conditional future requirements

These are requested ideas, but their incomplete rules prevent them from being treated as committed behavior.

### 6.1 Movie metadata and filename match

- Accept a supported movie identifier or URL.
- Extract only the external identifier in the browser.
- Resolve title/year/metadata through a permitted API, not page scraping.
- Normalize filename and metadata title/year, then show match confidence and evidence.
- Do not claim that a filename match proves the subtitle belongs to the same cut, release, language, frame rate, or cue timing.

The sentence "Start only activates when the names match" conflicts with "a mismatch can spend one of three lives." The final state machine must be decided before coding.

Automatic metadata resolution accepts an IMDb URL by extracting its `tt...` identifier locally, then calling a permitted service. Preferred semester path: TMDB's official Find-by-external-ID endpoint. IMDb's official developer API is a licensed product and may replace TMDB only if access/terms are approved. Rotten Tomatoes has no self-service public API for this use; it requires a business/data-feed request. Do not scrape it. Until licensed access exists, accept manual title/year for Rotten Tomatoes cases.

### 6.2 Three-life rule

Still required decisions: what a life protects, identity scope, starting count, reset period, behavior after zero, whether failures consume a life, whether matched jobs consume none, and how privacy-preserving abuse controls work. Client-only lives are trivially reset by clearing storage and are not a security boundary.

### 6.3 Firebase telemetry/dashboard — scope confirmed 2026-09-16

Confirmed telemetry dimensions: user country and city, target language, and translated movie identity. Country-and-city precision was confirmed on 2026-09-16; the acquisition method is TBD. Resolve movie ID/title/year through the approved metadata path; unknown identity must stay unknown rather than be invented.

Proposed minimal completion-event envelope: a per-job event ID for deduplication, completion timestamp for the existing 30-day reports, target-language code, nullable movie identity, and nullable country and city. These support the existing statistics requirement without creating a persistent person identifier. Do not add other tracking fields by default.

Never include source/translated text, complete SRTs, raw filenames, raw IP addresses, exact GPS coordinates, API keys, or full user-provided URLs in telemetry. A telemetry failure must not prevent local translation download. Unknown metadata/location must not by itself block translation; the separately unresolved movie/lives rule remains undecided.

Statistics must include successful translations by country, top target languages, and top movies over a defined rolling 30-day window. Aggregates should be read from precomputed summaries rather than allowing public arbitrary queries over raw events.

### 6.4 Subtitle storage and reuse — deferred

User decision on 2026-09-16: remove completed SRT cloud upload/storage for now. Do not implement Firebase Storage, R2, saved-file listings, artifact metadata, sharing, or cross-user subtitle reuse. Local download, cue editing, and browser-local checkpoint/resume remain in scope. Subtitle text may still be sent to the selected translation provider to perform translation; it must not be copied into telemetry or project cloud persistence. Any later server-persisted subtitle job requires a new decision. See `ADR-001-TELEMETRY-ONLY.md`.

## 7. Non-functional requirements

| ID      | Area            | Requirement                                                                                                                                                                                                                                                                |
| ------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-001 | Maintainability | Prefer small feature modules and plain TypeScript over clever abstractions or a heavy global state library.                                                                                                                                                                |
| NFR-002 | Correctness     | Parser, serializer, segmentation, response mapping, formatting, editing, and resume logic require automated tests.                                                                                                                                                         |
| NFR-003 | Performance     | Keep scrolling/editing responsive; virtualize the cue list if measured performance with realistic files requires it.                                                                                                                                                       |
| NFR-004 | Reliability     | Use stable IDs, idempotent checkpoints, bounded retries, cancellation, and explicit partial-failure state.                                                                                                                                                                 |
| NFR-005 | Security        | No secret is hard-coded, committed, logged, placed in `VITE_*`, browser-persisted, autofilled by application design, or sent to telemetry. The browser receives no provider key. Local gateway secrets use gitignored `.env`; production uses the platform secret manager. |
| NFR-006 | Privacy         | Minimize data, disclose collection, obtain consent where required, and define telemetry retention/deletion before collecting location.                                                                                                                                     |
| NFR-007 | Accessibility   | Keyboard operation, visible focus, semantic controls, labels, non-color statuses, sufficient contrast, and reduced-motion behavior.                                                                                                                                        |
| NFR-008 | Compatibility   | Support a documented set of modern desktop browsers; exact versions are TBD.                                                                                                                                                                                               |
| NFR-009 | Deployment      | A reproducible lockfile build passes typecheck, lint, tests, and production build before deployment.                                                                                                                                                                       |
| NFR-010 | Explainability  | The solo developer must be able to explain every shipped line and architectural decision during an unscripted walkthrough.                                                                                                                                                 |
| NFR-011 | Cost control    | Visitors fund provider use. Show Translate character/batch/list-price estimates, surface provider quota errors, and never silently switch to a developer-funded or undocumented endpoint.                                                                                  |
| NFR-012 | Observability   | Record safe job metrics and categorized errors without logging subtitle text, secrets, or precise personal data by default.                                                                                                                                                |

## 8. Definition of Done

A change is done only when:

- acceptance criteria are met;
- relevant tests were added/updated and pass;
- typecheck, lint, tests, and build pass;
- secrets and personal/copyrighted data were not introduced accidentally;
- accessibility/error/loading states were considered;
- architecture/requirements/state documentation was updated if behavior changed;
- `AI_LOG.md` received a truthful entry in the course-required format;
- the author can explain the change.
