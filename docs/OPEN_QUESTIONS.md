# Open Questions and Owner Decisions

Updated: 2026-09-18 — voice memo revision.

Resolved decisions are not questions to ask again. Record new decisions in the affected requirements/ADR and project state.

## Confirmed for this increment

- Solo ownership; English-only source; 5 MiB UTF-8 SRT; balanced i/b/u tags; current desktop browser targets.
- Official NMT and TLLM only; project-owner credentials and billing through the server; no visitor keys or Gemini product integration.
- Both engines receive joined lowercase/ellipsis continuation speech. Redistribute locally into existing time slots, then wrap; approximate placement needs review. No source-word ratio, invented marker guarantee or automatic retiming.
- Explicit Adult 20 CPS / Children 17 CPS profile; automatic language discovery; no paid service-check gate.
- Compact Ant Design shell, system-initial theme, reset/help/repository controls, stationary job controls, editable paired cards, error attribution and cumulative retry requests.
- Statistics hidden; completed subtitle storage/reuse deferred. Previously discussed telemetry/metadata/lives do not block the current core.

## Owner input still needed before public translation

1. Monthly translation budget, public usage allowance and behavior at exhaustion.
2. Production gateway host and acceptable authentication/abuse approach. Pages alone cannot serve the private gateway.
3. Representative target languages and a small original test subtitle for human quality comparison. NMT remains the initial selector value, not a proven winner.
4. Acceptance of the actual redistributed timing against movie audio. Which mistakes are unacceptable, and what benchmark passes? A deterministic split cannot guarantee semantic synchronization.
5. TLLM language/model/location coverage: the current shared picker comes from the NMT catalogue. Which supported pairs will be advertised after live verification?

No key or billing values need to be pasted into a conversation. The ignored local `.env` already has the owner-controlled configuration.

## Human/course work still required

6. Confirm semester dates, weekly capacity and a real sprint review/retrospective schedule. Local draft backlog entries are not published GitHub issues.
7. Validate the audience/personas/user stories with real people; provide interview evidence rather than AI-invented users.
8. Arrange the external classmate/instructor review required by Week 12; self-review is not equivalent.
9. Complete the human kept/rejected/mistakes reflections in the linked detailed AI log and rehearse explaining actual source files.
10. Verify remote CI and frontend/gateway deployment, then retain live demo evidence. Decide which additional desktop browsers to verify.
11. Language-specific readability profiles beyond the English-derived default remain open. Do not claim universal grammatical accuracy.

## Conditional questions — not active blockers

- Telemetry: country/city acquisition method, unknown-data behavior, retention, notice, controls and deletion. No GPS/IP service or raw IP retention is authorized by default.
- Metadata: approved API/account/attribution, movie versus TV scope, localized titles and confidence thresholds. No scraping.
- Lives: purpose, identity scope, resets, which actions/failures count, exhausted behavior and enforcement. Do not invent these rules.
- Storage/reuse or durable closed-tab jobs: requires an explicit new scope decision before scheduling.
- Source-language auto-detection, automatic retiming and extra subtitle formats are future scope only.
