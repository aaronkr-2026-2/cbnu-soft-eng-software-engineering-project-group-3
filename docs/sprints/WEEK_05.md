# Week 5: React migration and official provider

Sprint dates / capacity: TBD — confirm against the course calendar and personal availability. This record tracks work, not an invented completed week.

Goal: establish a weekly workflow and implement a local, verified React upload-to-download increment using official Cloud Translation. The expanded provider/editing work may span multiple sprints.

Owner for every item: project owner (solo developer). Current branch: `main`. Baseline: local `mvp-baseline` tag at `b64bc59`; its HTML now lives in `archive/mvp/` and is excluded from the production artifact.

| Local ID | Work and acceptance | State |
| --- | --- | --- |
| W5-01 | Reconcile baseline and remote backlog; preserve source/tag | Review — tag created locally; GitHub open-issue query returned empty; Pages lookup returned 404, so deployment remains unverified |
| W5-02 | Cadence, owners, labels proposal, review policy, build log, canonical DoD link | Review — documents added; remote labels/board not created |
| W5-03 | Compatible locked React/TypeScript/Vite/Ant Design scaffold and runnable checks | Review — implementation and local gates available |
| W5-04 | Characterize historical parser/serializer; expose renumbering/skipping debt | Review — automated characterization fixtures pass |
| W5-05 | Pure SRT domain with explicit errors and preserved identities/timing | Review — round-trip and validation fixtures pass |
| W5-06 | Responsive themed shell and local file preview | Review — Statistics hidden, profile choice required |
| W5-07 | Owner-funded NMT/TLLM gateway and complete job/download/edit flow | In progress — local gateway reads ignored `.env`; live provider test, production host, limits, and context alignment remain required |
| W5-08 | CI/Pages configuration, docs and final evidence | Review — workflow prepared; remote CI/deployment and human walkthrough pending |

These IDs are local draft issues, not GitHub issue numbers. Query existing issues before publishing them. Evidence: BUILD_LOG.md, tests under src/ and e2e/, and AI_LOG.md. No item is marked Done merely because AI implemented it.

Review/demo: automated results are recorded in the build log; user-run live Google test and author code walkthrough are pending. Human retrospective (kept/rejected, mistakes caught, next-week improvement): TBD - human review required.

User decisions confirmed during implementation: hide Statistics; require explicit Adult/Children profile; 5 MiB UTF-8 SRT limit; current desktop Chrome/Edge/Firefox/Safari targets; support only balanced i/b/u tags without attributes and report unsupported formatting.
