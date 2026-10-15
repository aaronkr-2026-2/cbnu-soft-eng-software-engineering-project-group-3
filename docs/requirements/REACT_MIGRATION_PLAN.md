# React migration plan — historical implementation record

Status: completed migration snapshot from 2026-09-18. **Do not use this as the current task backlog or deployment status.** See [project state](../../PROJECT_STATE.md), [current requirements](PRODUCT_REQUIREMENTS.md) and the [2026-10-08 audit](../audits/CODE_AUDIT_2026-10-08.md).

Updated: 2026-09-18 — replaces obsolete active visitor-key instructions. Historical decisions remain in ADR-002/003; current decisions are ADR-004/006.

## Outcome

A React/TypeScript/Vite/Ant Design app loads English SRT locally, gathers connected speech, translates using the owner's official NMT/TLLM gateway, redistributes and wraps output in original time slots, and supports review/edit/download. The [voice-memo prompt](REQUIREMENTS_REVISION_PROMPT.md) records that revision's acceptance request; the [revision audit](../audits/REQUIREMENTS_REVISION_AUDIT.md) tracks its contemporary findings.

## Implementation slices

| Slice | Current evidence / remaining work |
| --- | --- |
| Preserve baseline | Archived HTML and baseline tag retain the before-state; no undocumented endpoint is shipped. Public MVP evidence still needs verification. |
| React scaffold and domain | Lockfile, TypeScript/lint/test/build setup, strict SRT parsing, supported markup and cue identity preservation exist. |
| Private official provider | Local Node gateway owns the key; browser uses `/api/translation`. Both NMT/TLLM exist; public hosting/limits remain open. |
| Joined speech | Shared gathering/normalization and approximate redistribution replace visual-only grouping for both engines. Live quality review remains separate. |
| User flow | Automatic languages, explicit profile, estimates, progress, retry/cancel, editing, safe download and virtualized preview. |
| Records and verification | Reconcile requirements, architecture, setup, rules and both logs. Record actual checks in BUILD_LOG. |
| Production/course follow-up | Gateway budget/abuse controls, deployed end-to-end evidence, user research, weekly review and external peer review remain required. |

Routine tests mock the API; they do not certify billing, live translation quality, every target browser or production availability. User secrets stay local, ignored and server-only. No visitor key prompt or paid service probe is part of the current flow.

## Deferred work

Local checkpoint/resume is a later core milestone. Statistics, metadata and lives are conditional; completed-file cloud storage/reuse and durable persisted subtitle jobs are deferred. Keep one implementation issue active, use weekly sprint review, and retain the semester deadlines instead of declaring the entire course complete after a migration.
