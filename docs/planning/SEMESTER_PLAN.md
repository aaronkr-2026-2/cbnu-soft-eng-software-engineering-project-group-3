# Semester Plan and Milestones

Version: 0.2 draft

Updated: 2026-09-17

## How this plan handles the course documents

The project guide supplies the graded Week 2-15 deliverables. The introductory lecture supplies chapter topics, but some topics are shifted by about one week relative to the guide. This plan shows both instead of silently choosing one. Confirm due dates with the professor/Classroom50; use the project-guide deliverable as the minimum evidence until clarified.

## Core plan

| Week | Lecture topic shown in intro deck | Project-guide deliverable | SRT Translator milestone and evidence |
| --- | --- | --- | --- |
| 2 | Git & GitHub / project kickoff | Team formed, idea pitched, stack chosen | Record confirmed solo ownership; commit idea and stack; create roughly 5-10 initial issues; add `AI_LOG.md`; preserve the supplied prototype. |
| 3 | Ch. 1 Software Products | Vibe-coded MVP live + product vision | Deploy the standalone MVP without waiting for the React rewrite; add the product vision; tag the baseline; demo upload -> translate -> progress -> download; disclose that its consumer endpoint is unofficial. |
| 4 | Chuseok break in intro deck | Retrofit personas and user stories | Interview/validate intended users; write personas and prioritized user stories with acceptance criteria. Do not invent personas solely with AI. Revisit whether the primary user is a personal subtitle translator, a language learner, or another audience. |
| 5 | Ch. 2 Agile Software Engineering | Retrofit lightweight Agile/Scrum | Create one-week backlog/sprint cadence, Definition of Done, issue labels, owners, review policy, and build log. Start React + TypeScript + Vite + Ant Design scaffold and port the shell/file parsing in small issues. |
| 6 | Ch. 3 Features, Scenarios, Stories | Architecture diagram + critique | Finish feature scenarios and acceptance criteria; produce current/target diagrams; critique the single-file MVP using the verified debt list; add characterization tests around parser/serializer/grouper before replacing them. |
| 7 | Ch. 4 Software Architecture | Redeploy to a proper cloud host; midterm review | Complete behavior-preserving React port; add connected-group spacing/labels, paired-card hover/edit states, elapsed timer, and active-job warning; deploy the Vite frontend and same-origin gateway Functions through Vercel after cost/abuse controls; explain provider/domain/UI boundaries and why microservices are not needed. Demonstrate before/after architecture. |
| 8 | Midterm | Midterm | Freeze a stable review tag; present progress, unresolved decisions, failures, and AI log; use feedback to reprioritize. Avoid risky feature expansion this week. |
| 9 | Ch. 5 Cloud-based Software | Microservices/decomposition discussion (if it fits) | Evaluate client-only versus serverless job architecture. Record an ADR: modular monolith/provider adapters fit; independent microservices do not currently fit. Implement local checkpoint/resume and lifecycle-safe state saving. |
| 10 | Ch. 6 Microservices Architecture | Security audit | Produce data-flow/threat model; replace/contain undocumented API use; implement ADR-004's owner-funded gateway; audit server secret handling, file parsing, XSS, dependencies, quotas/cost, rate limits, Firebase rules, telemetry, and metadata access. Verify that no key reaches storage, logs, URLs, analytics, source, build output, or `VITE_*`. |
| 11 | Ch. 7 Security & Privacy | Code style pass | Fix high-risk security findings; configure moderate ESLint + typescript-eslint + React Hooks + Prettier; remove duplicates/dead code; make error and job states explicit. Implement real provider response validation. |
| 12 | Ch. 8 Reliable Programming + Style Guides | Real test suite + peer code review | Add fixtures and tests for round trips, continuation groups, mandatory speaker breaks, 42-grapheme/two-line/CPS checks, batching, retries, cancellation, editing, and resume. Implement/finish user-edit mode, protected edits, quality warnings, and scroll-follow/FAB behavior. Conduct and record peer review. |
| 13 | Ch. 9 Testing + Code Review | Documentation pass + CI setup | Complete README, API docs, ADRs, architecture, contributor guide, and troubleshooting. GitHub Actions runs typecheck/lint/test/build on PRs; retain Vercel frontend and Function smoke evidence after deployment. |
| 14 | Ch. 10 DevOps, Code Management, Documentation | Final polish, licensing/AI-authorship, rehearsal | Audit licenses and attributions; review AI-authorship/log completeness; improve errors/accessibility/performance based on evidence; tag a release; rehearse demo and unscripted code walkthrough. |
| 15 | Licensing topic may fall here depending on calendar | Final presentation: before/after + live walkthrough | Freeze scope; present original MVP beside engineered product, decisions, rejected scope, test/deployment evidence, security/privacy trade-offs, AI mistakes caught, and a live explanation of selected files. |

## Feature allocation

### Graded core - protect this first

- MVP baseline and public deployment.
- React/TypeScript/Ant Design port.
- provider abstraction and real provider distinction;
- correct SRT round-trip behavior;
- subtitle quality checks and editable output;
- resilient progress/checkpoint/resume;
- scroll-follow control;
- security audit and safe credential plan;
- owner-funded Cloud Translation NMT and TLLM adapters behind a server-side gateway;
- style, tests, review, documentation, CI/CD, and AI log.

### Conditional stretch track

Only schedule these after core milestone evidence is healthy:

1. Movie metadata lookup using a permitted API.
2. Filename match confidence UI.
3. An explicitly defined and server-enforced three-life rule.
4. Confirmed telemetry-only feature: minimal Firebase events and Statistics dashboard, after the location acquisition method and retention are resolved.

Completed subtitle storage, file reuse, and durable jobs requiring cloud subtitle persistence are deferred and removed from active milestones. They require a new user decision before scheduling.

Confirmed 2026-09-16: this is a solo project. Recommendation: prioritize telemetry/statistics after the core is stable. Do not schedule file storage/reuse under the current decision. One developer owns implementation, testing, operations, and documentation. Preserve the course peer-review milestone by arranging a classmate/instructor review; do not invent a teammate or claim self-review satisfies an external-review requirement.

### Telemetry work within existing course weeks

- Week 4: define stories for location/language/movie statistics; record unknown-data behavior.
- Week 6: diagram the local subtitle and cloud telemetry boundary; retain ADR-001.
- Week 9: evaluate the minimal event/aggregate design and client-reported trust limitations.
- Week 10: implement country-and-city telemetry; resolve its acquisition method, retention, notice/controls, and Firebase access rules.
- Week 12: if implemented, verify no subtitle text/files enter telemetry, duplicate events are not double-counted, and telemetry failure does not break download.
- Week 13: document the approved schema and dashboard queries. If time is limited, retain the telemetry design and defer implementation without reintroducing file hosting.

## Initial 10-issue backlog

Implementation update 2026-10-08: the React/official-provider increment, local Week 5 process documents and Vercel Function adapters are ready for review. See [Week 5 sprint](../sprints/WEEK_05.md), [Agile workflow](../guides/AGILE_WORKFLOW.md), and [build evidence](../../BUILD_LOG.md). The owner reports the public web flow working and a language-route check returned 195 languages; this refactor's deployment, live grouped-subtitle quality, paid NMT/TLLM smoke, cost/abuse controls and human review remain pending. This does not change course deadlines or mark the milestone complete.

These issue titles are drafts and should be reconciled with the repository rather than duplicated blindly.

The [React migration and official Translate implementation plan](../requirements/REACT_MIGRATION_PLAN.md) breaks the requested working-app migration into verified slices. It starts with the Week 5 workflow/scaffold and brings necessary provider/tests work forward. These proposed issues may span multiple sprints; the course deadlines above are unchanged.

1. Preserve, document, tag, and deploy the MVP baseline.
2. Add product vision, project state, AI log, and open decisions.
3. Scaffold React + TypeScript + Vite + Ant Design.
4. Port the application shell, theme, and Translator view; keep Statistics hidden.
5. Port and characterize SRT parse/serialize behavior.
6. Define translation provider contract and isolate the legacy provider.
7. Port job progress, elapsed timer, active-tab warning, connected-group/hover/edit states, errors, and download.
8. Add automated GitHub Actions checks and Vercel deployment configuration.
9. Implement the owner-funded NMT/TLLM gateway and joined-speech translation with text-conserving approximate redistribution (ADR-006).
10. Replace proportional word splitting/six-word wrapping with the exact formatting specification and editable cues.

## Milestone evidence checklist

At each milestone retain:

- issue/backlog link;
- branch/PR and logical commits;
- screenshots or short demo;
- tests/build/deployment result;
- architecture/decision change;
- one course principle applied to actual code;
- `AI_LOG.md` entry with kept/rejected/wrong details;
- one thing the developer can explain live.

## Voice memo revision — 2026-09-18

The core now explicitly restores joined speech for both NMT/TLLM, followed by local approximate redistribution and profile-based wrapping. This corrects a migration mismatch; it does not move course deadlines. Shared Ant Design theming, automatic language loading, precise failures and retry evidence support the existing engineering milestones. No extra feature track is activated.

Live grouped-subtitle quality, production gateway limits, this refactor's deployment, actual weekly process, user validation, external review and author explanation still require evidence. Earlier minimal provider smoke tests are distinct from a full film benchmark. See [revision audit](../audits/REQUIREMENTS_REVISION_AUDIT.md), [current code audit](../audits/CODE_AUDIT_2026-10-08.md) and the linked build/AI logs.
