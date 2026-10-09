# Open Questions and Owner Decisions

Updated: 2026-10-09 — Vercel deployment and [issue backlog](../planning/BACKLOG.md) follow-up.

Resolved decisions are not questions to ask again. Record new decisions in the affected requirements/ADR and project state.

## Confirmed for this increment

- Solo ownership; English-only source; 5 MiB UTF-8 SRT; balanced i/b/u tags; current desktop browser targets.
- Official NMT and TLLM only; project-owner credentials and billing through the server; no visitor keys or Gemini product integration.
- Both engines receive joined lowercase/ellipsis continuation speech. Redistribute locally into existing time slots, then wrap; approximate placement needs review. No source-word ratio, invented marker guarantee or automatic retiming.
- Explicit Adult 20 CPS / Children 17 CPS profile; automatic language discovery; no paid service-check gate.
- Compact Ant Design shell, system-initial theme, reset/help/repository controls, stationary job controls, editable paired cards, error attribution and cumulative retry requests.
- Statistics hidden; completed subtitle storage/reuse deferred. Previously discussed telemetry/metadata/lives do not block the current core.
- Vercel is the selected production host for the Vite frontend and same-origin gateway Functions. GitHub Actions remains CI only.

## Owner input still needed before public translation

1. Monthly translation budget, public usage allowance and behavior at exhaustion.
2. Select the exact public allowance, exhaustion behavior and Vercel Firewall rate-limit rule. The production enablement flag must remain off until these and Google budget/quota controls are configured.
3. Mongolian now has one owner-reviewed movie-subtitle crop with mixed qualitative results; obtain a licensed/original controlled sample, identify the model/settings, and compare NMT/TLLM before naming a winner. See [the 2026-10-09 spot check](../audits/MONGOLIAN_SUBTITLE_REVIEW_2026-10-09.md).
4. Acceptance of the actual redistributed timing against movie audio. Which mistakes are unacceptable, and what benchmark passes? A deterministic split cannot guarantee semantic synchronization.
5. TLLM language/model/location coverage: the current shared picker comes from the NMT catalogue. Which supported pairs will be advertised after live verification?
6. Inspect and record the project's actual NMT/TLLM per-minute quota settings and same-project usage. The 2026-10-01 full-file run reported `rate_limited` after two application requests; the automatic cooldown recovers safely but does not establish the account-level cause or a public allowance.

No key or billing values need to be pasted into a conversation. The ignored local `.env` already has the owner-controlled configuration.

## Human/course work still required

7. Confirm semester dates, weekly capacity and a real sprint review/retrospective schedule. The published [issue backlog](../planning/BACKLOG.md) covers verified milestones and selected open follow-ups; remaining draft tasks are not automatically published issues.
8. Validate the audience/personas/user stories with real people; provide interview evidence rather than AI-invented users. The Chapter 3 lecture asks for one real-person check with three corrections, plus an additional role/scenario. The owner corrected Jenna's profile on 2026-10-09 and plans to supply a third fictional persona; neither action is a real-person check. Do not invent the third role or claim validation.
9. Arrange the external classmate/instructor review required by Week 12; self-review is not equivalent.
10. Complete the human kept/rejected/mistakes reflections in the linked detailed AI log and rehearse explaining actual source files.
11. Sync this refactor commit into the personal fork when ready; verify remote CI and the Vercel frontend/Function deployment at that exact commit. The earlier public language-route check does not verify this commit or paid translation. Decide which additional desktop browsers to verify.
12. Language-specific readability profiles beyond the English-derived default remain open. Do not claim universal grammatical accuracy.

The owner's cue-77 native-counting concern, cue-246 nuance concern and cue-251 speaking-perspective concern need preferred human corrections and, for cue 251, a comparison of joined provider output with local redistribution. The review note's “213” reference is ambiguous; source cue 213 is a music description.

## Conditional questions — not active blockers

- Telemetry: country/city acquisition method, unknown-data behavior, retention, notice, controls and deletion. No GPS/IP service or raw IP retention is authorized by default.
- Metadata: approved API/account/attribution, movie versus TV scope, localized titles and confidence thresholds. No scraping.
- Lives: purpose, identity scope, resets, which actions/failures count, exhausted behavior and enforcement. Do not invent these rules.
- Storage/reuse or durable closed-tab jobs: requires an explicit new scope decision before scheduling.
- Source-language auto-detection, automatic retiming and extra subtitle formats are future scope only.
