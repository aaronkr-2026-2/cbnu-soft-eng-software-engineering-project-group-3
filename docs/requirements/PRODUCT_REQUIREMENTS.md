# Product Requirements

Version: 0.2 — voice memo revision

Updated: 2026-10-08 — modular folder layout and malformed-response audit

Owner: one developer. Current decisions: ADR-001 (conditional telemetry only), ADR-004 (owner-funded NMT/TLLM gateway), ADR-006 (joined speech and approximate redistribution). The voice memo supersedes earlier NMT-per-cue and visitor-key instructions. [Revision prompt](REQUIREMENTS_REVISION_PROMPT.md) records the requested work; [revision audit](../audits/REQUIREMENTS_REVISION_AUDIT.md) records evidence and gaps.

## 1. Product vision and core outcome

For tech-savvy movie viewers who obtain subtitle files but want to watch in their preferred language, SRT Translator converts an English SRT into an editable translated SRT with the same cue numbers and timecodes. It gathers continuing speech across time slots before translation and formats the result for subtitle reading. The [README](../../README.md) gives the short public introduction; [product discovery](../product/README.md) records the provisional persona-to-feature trace.

The core flow is **choose file → select model/language/profile → start → review/edit → download**. Language discovery is automatic. Visitors do not supply credentials or billing accounts. The project owner pays through the server gateway.

Better contextual translation is a product aim, not an unmeasured quality claim. Grouping is heuristic, and text redistribution is approximate. Preserving timecodes does not guarantee that reordered translated phrases coincide perfectly with speech.

The owner clarified that Jenna, the family-viewing proto-persona, will not correct cues in the web app. She expects the unedited translation to be understandable enough for her parents to follow the plot. Editing remains available for other reviewers; it cannot be counted as evidence that Jenna's need is met. A human-viewing quality threshold and model comparison remain open.

## 2. Scope

Core: React/TypeScript/Vite/Ant Design; English UTF-8 SRT up to 5 MiB; balanced i/b/u markup without attributes; NMT/TLLM; joined speech; local formatting/review/edit/download; job progress/cancellation/retry; official gateway; tests/docs/security/course evidence. Adult 20 CPS or Children 17 CPS must be chosen explicitly. Initial browser targets are current desktop Chrome, Edge, Firefox and Safari; test evidence names the browsers actually checked.

Not in this increment: Gemini, visitor keys, accounts/payments, statistics, movie matching, lives, metadata lookup, cloud subtitle persistence/reuse, automatic retiming, silent shortening, or guaranteed closed-tab execution. Telemetry remains conditional under ADR-001, not silently cancelled or scheduled as required work. Browser-local checkpoint/resume is still a later core milestone; do not describe current in-tab retry as reload recovery.

## 3. Functional requirements

### Shell and configuration

| ID | Requirement | Acceptance evidence |
| --- | --- | --- |
| FR-001 | Compact header with logo/name, theme switch, help and repository link. Brand resets file/settings/job after confirming loss of loaded work. Help has X and OK only. | Browser reset/help tests; no Cancel action in the help modal. |
| FR-002 | No footer. | Shell review. |
| FR-003 | Approximately 20% desktop controls / 80% preview, usable at narrower widths. Major panels, cards, feedback and actions must shrink or wrap without horizontal overflow; mobile stacks the sidebar and preview at full width. | Desktop/mobile browser overflow checks and visual review. |
| FR-004 | Initialize theme from OS on page load; manual sun/moon switch and next-theme tooltip; all standard components use the shared theme. | Dark OS load and switch tests. |
| FR-010 | Local choose/drop English UTF-8 SRT, at most 5 MiB; report malformed, unsupported or empty files. Long loaded names remain inside the upload card and the complete name is discoverable. | Parser/file tests and browser upload/overflow check. |
| FR-011 | Retain source order, indexes, exact time strings, multiline source and supported markup. | Round trips and downloaded output. |
| FR-012 | Searchable target-language names/codes loaded automatically from official provider data. Exclude English as the fixed source. | Language-loading and selection tests. |
| FR-013 | Non-searchable NMT/TLLM picker with concise, accurate explanations; both use joined speech. | Provider payload tests for both models. |
| FR-014 | Start requires valid file, model, target and explicit Adult/Children profile; disable conflicting settings during work and after output exists until reset. | State/browser tests. |
| FR-015 | No visitor key field or paid Hello service-check prerequisite. Gateway/language errors have a retry action that remains readable and contained at supported widths. | No probe requests; key absent from client/build; mocked language-failure browser check. |
| FR-016 | Show selected model's whole-file list-price estimate, input characters and request count; distinguish remaining work. TLLM shows its output-length assumption. | Same builder used for estimates and requests; estimate tests. |
| FR-017 | Cost card scrolls with settings and states estimate ≠ final bill, unknown credits, retries and official pricing link/date. | Browser/content review. |

The language catalogue comes from Basic v2 NMT language discovery. It is not independent proof that every listed pair works with the configured TLLM model/location; failures must be explicit. A model-specific capability benchmark remains open.

### Job and recovery

| ID | Requirement | Acceptance evidence |
| --- | --- | --- |
| FR-020 | Keep review/scrolling responsive during translation; virtualize long lists and yield between batches. | Synthetic 2,500-cue browser test. |
| FR-021 | Show completed/total cues, status, percent, elapsed time and cumulative translation-request attempts. Stop the timer on terminal states; resumed elapsed time spans from the first Start (including intervening wait), and retries do not reset request counts. | Progress/retry tests; language lookup excluded from translation count. |
| FR-022 | Distinguish waiting, translating, translated, failed and edited; explain failures below the affected paired card. | Only affected submitted cues fail; unattempted cues remain waiting. |
| FR-023 | Bounded retries/timeouts, cancellation, stale-result protection and response validation. An allowlisted per-minute `rate_limited` 403 uses the gateway delay or a 60-second default, visibly and cancelably, with at most three total attempts. Failed jobs offer Retry; valid prior results/edits survive. | Provider/job/hook failure tests; mocked cooldown browser flow. |
| FR-024 | Later milestone: local checkpoint/resume after reload. Current implementation promises only in-tab recovery. | Required reload test before claiming this feature complete. |
| FR-025 | Never silently drop, duplicate or empty a cue. Group validation precedes saving its output. | Short/malformed output and conservation tests. |
| FR-026 | Active-job warning: keep tab open and foregrounded; reloading currently loses session work. | Browser warning test. |

### Presentation, editing and output

| ID | Requirement | Acceptance evidence |
| --- | --- | --- |
| FR-030 | Paired original/translated cards show cue index/timeframe; translated cards show status and pencil/edit/save controls. | Browser review and edited download. |
| FR-031 | Follow active cues until the user scrolls away. | Scroll interaction checks. |
| FR-032 | A return-to-current button restores follow mode. | Browser interaction checks. |
| FR-033 | Save/cancel edits locally; saved text appears in downloaded SRT. | Editing and output tests. |
| FR-034 | Retry cannot overwrite saved edits; resetting existing output requires confirmation. | Partial failure/edit retry tests. |
| FR-035 | Preview groups reflect the actual bounded source groups, with compact inner gaps and at least twice that gap between groups plus a visible label. | Shared grouping function and fixtures. |
| FR-036 | Hover/focus highlights a cue pair; editing has a persistent distinct treatment in both themes. | Card/browser tests and visual review. |
| FR-037 | Start/progress/download remain at desktop sidebar bottom; settings have bottom breathing room; centered preview title and column labels stay compact/sticky. | Browser layout checks. |
| FR-040 | Prefer at most two display lines; preserve unavoidable speaker overflow and flag it rather than losing speech. | Formatter/speaker fixtures. |
| FR-041 | Reference profile: 42 visible graphemes/line, Adult 20 CPS or Children 17 CPS, capacity `min(84, durationSeconds × cpsLimit)`. | Exact boundary fixtures. |
| FR-042 | Detect source speaker turns before removing soft wraps. Preserve forced speaker breaks independently of target capitalization. Inline sounds/music are meaningful structure, not arbitrary extra display lines. | Lowercase line-leading hyphens, inline markers, caseless translations and annotations. |
| FR-043 | Report line length, number of lines, CPS and capacity violations. | Quality tests. |
| FR-044 | Never retime automatically. | Exact original time strings survive export. |
| FR-045 | Allow manual repair; warn that multi-cue redistribution requires review. | Review notice and saved output. |
| FR-050 | Download enabled only when all cues have valid output and translation is not running. | Complete/incomplete/failed job tests. |
| FR-051 | UTF-8 output retains cue order/index/times, intentional line breaks and saved edits. | Serialized/golden output tests. |
| FR-052 | Output filename includes the source basename and target-language code. | Filename tests. |

Netflix's English guidance is a reference profile, not a universal standard for every language or a medical guarantee. Wrapping cannot fix excessive CPS. [Formatting specification](SUBTITLE_FORMATTING_SPEC.md) defines the actual algorithm and limits.

## 4. Translation contract

- Both models use the owner-funded gateway and a documented API. No undocumented free fallback.
- Adjacent lowercase/ellipsis continuations are normalized into joined speech. Explicit source structure can create separate speech/speaker/sound units within a group.
- Google returns one result per submitted string. Local IDs retain source membership; no invented cue markers or prompts are assumed to be preserved by Google.
- After validation, joined output is distributed locally using reading capacity and language boundaries, then wrapped. This is approximate placement, not inferred audio alignment.
- Never split by source word-count ratio, silently omit text, duplicate output to fill empty cues or change timecodes. Unallocatable results fail visibly.
- Provider failures affect submitted batches; local group-distribution failures retain valid sibling results. Retry uses original group membership and never joins across completed/edited gaps.
- Keep group and request limits explicit. Current scheduling is sequential; concurrency needs measured quota/latency evidence.
- No movie synopsis, Gemini prompt or metadata lookup is required for the core flow.

## 5. Non-functional requirements

Use small readable modules, pure domain logic and the provider boundary. Shared Ant Design theme/component tokens are canonical; focused CSS may implement sticky, responsive and virtual subtitle layout. Follow the 8/16/24/32 px spacing scale rather than unrelated margins.

Validate untrusted SRT and provider content. Render supported markup safely without executable HTML. Keys belong only in ignored server `.env` or a production secret manager; never in `VITE_*`, browser storage, logs, telemetry, URLs or output. Production needs a defined owner budget and server-enforced abuse/cost controls. No application authentication or production limit is claimed merely because a gateway exists.

Vercel is the production target. The frontend must keep using same-origin `/api` routes, while Vercel Functions and the local Node adapter reuse the same gateway validation/provider core. Production Functions fail closed until the owner explicitly enables them after configuring the approved allowance, Vercel Firewall rate limit, and Google budget/quota controls.

The current repository separates browser code under `frontend/` and shared gateway code under `backend/`. Keep only thin Vercel route exports at root `api/` so the one Vite deployment continues to discover its Functions. Malformed successful JSON must not enter completed subtitle output or make an unusable language list look ready; oversized Function bodies must be rejected while reading, not only after buffering.

Keep keyboard access, visible focus, non-color status, theme contrast and reduced-motion behavior. Pin dependencies in the lockfile and gate deployment on relevant checks. The solo author must understand and explain every shipped module.

## 6. Deferred scope and decisions

Statistics remains hidden. Any future telemetry is limited to country/city, target language and movie identity plus minimal event metadata. Set acquisition, retention and user notice/controls first; unknown values remain unknown. Never store subtitle text/files, raw filenames, credentials, raw IP or exact GPS as telemetry. Telemetry failure must not block download.

Movie metadata, matching, IMDb identifiers and any permitted API integration remain conditional. Do not scrape IMDb/Rotten Tomatoes or implement a three-life rule without its owner-defined purpose, identity, reset and failure semantics. Cloud subtitle hosting/reuse and durable server jobs require a new scope decision. These ideas must not block core translation.

## 7. Definition of Done

- Requested acceptance criteria and focused regression tests pass.
- Current typecheck, lint, tests, production build and relevant browser/build checks pass; report actual commands, limitations and skipped checks.
- No unrelated user files, secrets or unlicensed fixtures are introduced.
- Accessibility, loading, errors, cancellation, retry and output correctness are considered.
- Requirements/architecture/state and affected setup/rules are consistent with code.
- Append one readable line to AI_LOG.md and full course-format evidence to docs/AI_DETAILED_LOG.md; human reflections remain human-authored or explicitly TBD.
- Review Git changes and create the requested local task commit. Push only when requested.
- Human author understanding, external peer review and live/public evidence remain separate requirements; automated checks cannot certify them.
