# Solo Agile workflow

Adopted for the migration implementation on 2026-09-17. One developer owns implementation, verification, documentation, and operations. External peer review remains a separate course requirement; reviewer TBD.

- Use one-week sprints. Spend about 30 minutes at the start selecting a goal and ready issues against available hours.
- At each work session, update BUILD_LOG.md with the change, actual commands/results, blockers, and next step. For material changes, also update the one-line AI_LOG.md and detailed docs/AI_DETAILED_LOG.md record.
- Review scope midweek; move unfinished work back to the backlog rather than claiming completion.
- End each sprint with a demonstrable increment, check results, carryover, and one human-authored retrospective improvement.

The local backlog uses Backlog → Ready → In progress → Review → Done. Keep one implementation issue in progress at a time. Recommended GitHub labels when the backlog is published: type:feature, type:bug, type:docs, type:chore, area:ui, area:srt, area:provider, area:tooling, priority:high, blocked. These labels have not been created remotely.

Use focused feature/fix/docs branches and logical commits. A PR describes behavior, acceptance criteria, verification, and limits. Review correctness, readability, security/privacy, accessibility, tests, and documentation before merging. Solo self-review is recorded honestly and does not replace the Week 12 external review.

The canonical Definition of Done remains [PRODUCT_REQUIREMENTS.md](PRODUCT_REQUIREMENTS.md#7-definition-of-done): acceptance criteria, relevant tests and all checks, no accidental secrets/data, considered loading/errors/accessibility, documentation, truthful AI log, and author understanding. Do not create a weaker competing checklist.
