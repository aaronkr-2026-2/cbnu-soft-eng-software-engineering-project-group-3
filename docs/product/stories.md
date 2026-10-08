# Prioritized user stories

Updated: 2026-10-08. Derived from the owner-supplied, unvalidated [persona hypotheses](personas.md). “Must” protects the translator outcome; priorities require real-user review. The [requirements](../requirements/PRODUCT_REQUIREMENTS.md) hold the detailed acceptance contract.

| ID | Priority | Story: As a viewer, I want… | Key acceptance check |
| --- | --- | --- | --- |
| US-01 | Must | to load an English SRT confidently, so I do not pay to translate corrupt input. | Valid ≤5 MiB UTF-8 SRT loads with cue count; invalid structure/markup fails without partial import. |
| US-02 | Must | to choose model, language, profile and see likely cost before starting. | Auto-loaded searchable languages, NMT/TLLM, explicit Adult/Children, guarded Start, labelled estimates. |
| US-03 | Must | connected speech translated together, so split cues retain context. | Both engines receive joined input; response and redistribution preserve text/order/times; human quality review remains required. |
| US-04 | Must | visible progress and control during long work. | State, cues, elapsed time, attempts, active cue and manual scrolling are visible. |
| US-05 | Must | interrupted work to resume without repeating completed groups. | In-tab retry preserves edits/results; reload checkpoint remains **not implemented**. |
| US-06 | Should | connected cue blocks shown together while original time slots remain visible. | Paired cards, group spacing/labels, per-cue states and redistribution review notice. |
| US-07 | Should | warnings where subtitles may be hard to read. | 20/17 CPS, 42-grapheme, two-line and capacity warnings; no text deletion or retiming. |
| US-08 | Must | to correct an important cue before download. | Edit/cancel/save validates text; saved edit survives retry and appears in output. |
| US-09 | Must | a structurally usable translated SRT. | Download only after all cues pass; preserves indexes/times/order and saved edits. |
| US-10 | Must | to open the translator at a public URL without local setup. | Same-origin frontend/Function flow works; controlled NMT/TLLM smoke, allowance and abuse controls still require evidence. |

These are outcome stories, not claims of observed user demand. Telemetry, metadata, lives, accounts, Gemini and cloud subtitle storage/reuse are outside this protected story set.
