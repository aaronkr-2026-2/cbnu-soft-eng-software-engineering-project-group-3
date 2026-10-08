# Week 3: Standalone MVP and product vision

Record status: retrospective summary created 2026-10-08 from the preserved MVP, Git history, and AI records. Exact sprint dates, capacity, live demonstration, and contemporaneous review were not recorded and remain `TBD - human review required`.

Course deliverable: vibe-coded MVP live and product vision.

Goal: produce a rough end-to-end translator that demonstrates local SRT input, translation progress, review, and downloadable output before applying later software-engineering improvements.

Owner: project owner (solo developer).

## Work summary

| Local ID | Work and evidence | Retrospective state |
| --- | --- | --- |
| W3-01 | A standalone HTML/CSS/JavaScript MVP was committed on 2026-09-15 as `week1-mvp` (`b64bc59`). The commit name is historical; this record maps the artifact to the course's Week 3 MVP deliverable. | Evidenced |
| W3-02 | The MVP supported local SRT selection, target-language selection, translation progress, paired original/translated cards, continuation grouping, formatting, and SRT download. | Evidenced by the preserved source and baseline review |
| W3-03 | The MVP contained a provider registry and Google Translate/Gemini choices, but both choices used the same undocumented consumer translation endpoint. It was not a real Gemini integration and must not be described as production-ready. | Evidenced limitation |
| W3-04 | The original proportional word redistribution and fixed six-word wrapping were identified as risky subtitle behavior and retained only as before-state evidence, not as the current product contract. | Evidenced limitation |
| W3-05 | The MVP is preserved at `archive/mvp/srt-translator-beta-3.html` and by the `mvp-baseline` tag at `b64bc59`; it is excluded from the production build. The archive move and tag were completed later as preservation work. | Evidenced |
| W3-06 | The current README contains a structured product vision for tech-savvy movie viewers who already obtain subtitle files and want an editable translation with preserved timing. That wording was added later on 2026-09-17, so it is retrofit evidence rather than a contemporaneous Week 3 vision record. | Partial |
| W3-07 | No verified public URL or retained Week 3 deployment result exists. The 2026-10-08 GitHub Actions run verified the build but failed its Pages configuration step because Pages was not enabled. | Gap |

## Demonstrable outcome

The repository preserves a working rough MVP and an honest technical review of its behavior. It provides the required before-state for the semester's before/after story. The “live” part of the Week 3 deliverable is not proven because no public deployment URL, smoke result, screenshot, or dated live-demo record is available.

## Evidence

- Commit `b64bc59` and local tag `mvp-baseline`.
- Preserved [standalone MVP](../../archive/mvp/srt-translator-beta-3.html).
- “Standalone MVP baseline review — 2026-09-15” in [the detailed AI log](../AI_DETAILED_LOG.md).
- Current [README product vision](../../README.md#product-vision).
- [Project state](../../PROJECT_STATE.md) and [build log](../../BUILD_LOG.md) for current evidence boundaries.

## Carryover and gaps

- Obtain and retain a working public deployment URL and smoke evidence.
- Replace the undocumented endpoint with an official, secret-safe provider boundary.
- Replace unsafe cue redistribution/formatting assumptions with a verified domain contract.
- Add structured requirements, architecture, verification, and course records.
- Record the missing human demo feedback and author explanation.

Review/demo: local source exists; public live demonstration evidence is missing. Human review remains `TBD - human review required`.

Human retrospective — what was kept, changed, rejected, or learned: `TBD - human review required`.
