# Feature ↔ story ↔ issue gap map

Updated: 2026-10-09. This is the lecture's **keep / orphan / backlog** check. Every listed product feature has a proposed story, but stories and priorities are not real-user validated. Issue references are related **milestone issues**, not a one-ticket-per-story claim; [the issue backlog](../planning/BACKLOG.md) distinguishes completed implementation from open evidence.

| Feature | Story | Map decision | Implementation / evidence gap | Issue |
| --- | --- | --- | --- | --- |
| PF-01 Import | US-01 | Keep | Code/test covered; real-user error comprehension untested. | [#7](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/7), [#22](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/22) |
| PF-02 Options | US-02 | Keep | Setup works; TLLM language coverage and actual cost unknown. | [#8](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/8), [#17](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/17) |
| PF-03 Joined translation | US-03 | Keep / quality gap | Structural tests pass; whether unedited output is understandable enough for Jenna's family is unverified. | [#10](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/10), [#17](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/17) |
| PF-04 Progress | US-04 | Keep | Mocked job UI covered; full-film responsiveness unverified. | [#11](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/11), [#17](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/17) |
| PF-05 Stop/retry | US-05 | Partial / backlog | In-tab retry exists; reload checkpoint does not. | [#2](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/2), [#19](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/19) |
| PF-06 Paired review | US-06 | Keep provisionally | Paired UI exists; reviewer demand/efficiency untested. Jenna does not depend on manual review. | [#11](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/11), [#22](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/22) |
| PF-07 Readability | US-07 | Keep provisionally | English-derived reference; language-specific validity unknown. | [#7](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/7), [#17](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/17) |
| PF-08 Edit | US-08 | Keep provisionally | Edit/export covered; reviewer need is unvalidated. This is not a workaround for Jenna's quality requirement. | [#7](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/7), [#22](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/22) |
| PF-09 Export | US-09 | Keep | Structure tested; media-player/human timing check missing. | [#7](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/7), [#17](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/17) |
| PF-10 Workspace/help | US-10 | Partial / backlog | Live language route observed; this PR and paid NMT/TLLM/cost controls unverified. | [#14](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/14), [#18](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/18) |
| PF-11 Theme | US-11 | Keep provisionally | Control exists; persona value unvalidated. | [#11](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/11), [#22](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues/22) |

## Orphans and backlog

- **Orphan product features:** none among PF-01–11. F-25/F-26 were [removed from the user-feature taxonomy](creep-audit.md), not from code. Theme remains a hypothesis-backed feature, not proof of user demand.
- **Unbuilt story outcomes:** US-05 reload recovery; US-10 controlled end-to-end production translation. US-03 human quality/timing validation and US-02 TLLM pair coverage are evidence gaps, not missing code paths.
- **Issue trace:** retrospective milestone issues identify implementing commits; open issues track evidence or partial outcomes. Splitting the provisional US-02/US-05 epics into story-sized implementation tickets remains future planning, not claimed here.

The missing third role and real-person corrections are separate homework gaps; see the [persona/scenario cards](personas.md). The [creep audit](creep-audit.md) records the actual feature-list merge/cut and its limit.
