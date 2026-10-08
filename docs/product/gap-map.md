# Feature ↔ story ↔ issue gap map

Updated: 2026-10-08. This is the lecture's **keep / orphan / backlog** check. Every listed product feature has a proposed story, but stories and priorities are not real-user validated. “Issue TBD” means no GitHub issue is claimed; this documentation task did not create remote issues.

| Feature | Story | Map decision | Implementation / evidence gap | Issue |
| --- | --- | --- | --- | --- |
| PF-01 Import | US-01 | Keep | Code/test covered; real-user error comprehension untested. | TBD |
| PF-02 Options | US-02 | Keep | Setup works; TLLM language coverage and actual cost unknown. | TBD |
| PF-03 Joined translation | US-03 | Keep | Structural tests pass; human wording/timing quality missing. | TBD |
| PF-04 Progress | US-04 | Keep | Mocked job UI covered; full-film responsiveness unverified. | TBD |
| PF-05 Stop/retry | US-05 | Partial / backlog | In-tab retry exists; reload checkpoint does not. | TBD |
| PF-06 Paired review | US-06 | Keep | Paired UI exists; review efficiency untested. | TBD |
| PF-07 Readability | US-07 | Keep provisionally | English-derived reference; language-specific validity unknown. | TBD |
| PF-08 Edit | US-08 | Keep | Edit/export covered; observed Jenna-like task missing. | TBD |
| PF-09 Export | US-09 | Keep | Structure tested; media-player/human timing check missing. | TBD |
| PF-10 Workspace/help | US-10 | Partial / backlog | Live language route observed; this commit and paid NMT/TLLM/cost controls unverified. | TBD |
| PF-11 Theme | US-11 | Keep provisionally | Control exists; persona value unvalidated. | TBD |

## Orphans and backlog

- **Orphan product features:** none among PF-01–11. F-25/F-26 were [removed from the user-feature taxonomy](creep-audit.md), not from code. Theme remains a hypothesis-backed feature, not proof of user demand.
- **Unbuilt story outcomes:** US-05 reload recovery; US-10 controlled end-to-end production translation. US-03 human quality/timing validation and US-02 TLLM pair coverage are evidence gaps, not missing code paths.
- **Issue trace:** no new issue numbers are invented. Converting unbuilt stories into GitHub issues, with any epic split, is owner/backlog work; the repository currently provides only these local story IDs.

The missing third role and real-person corrections are separate homework gaps; see [personas](personas.md) and [scenarios](scenarios.md). The [creep audit](creep-audit.md) records the actual feature-list merge/cut and its limit.
