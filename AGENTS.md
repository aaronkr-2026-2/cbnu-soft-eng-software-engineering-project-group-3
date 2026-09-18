# AI Working Agreement - SRT Translator

This file is the canonical repository memory for every AI coding tool. Model-specific instruction files must point here and must not create conflicting rules.

## Required read order

Before changing anything, read:

1. `PROJECT_STATE.md`
2. `docs/PRODUCT_REQUIREMENTS.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DEVELOPMENT_RULES.md`
5. `docs/SEMESTER_PLAN.md`
6. `docs/COURSE_ALIGNMENT.md`
7. `docs/SUBTITLE_FORMATTING_SPEC.md`
8. `docs/PROVIDER_AUTH_AND_COST.md`
9. `docs/UI_COMPONENT_GUIDE.md`
10. accepted ADRs, then `docs/OPEN_QUESTIONS.md`
11. recent entries in `AI_LOG.md` and `docs/AI_DETAILED_LOG.md`

## Non-negotiable rules

- Do not assume or invent facts, requirements, decisions, repository history, API behavior, or test results.
- If a missing answer materially changes implementation, ask the user. Otherwise mark it `TBD` and do not turn it into behavior.
- Inspect existing code and tests before proposing a change.
- Preserve the original MVP and working behavior. Do not erase or rewrite code without a focused reason, acceptance criteria, and tests.
- Keep changes small, understandable, and junior-developer-friendly.
- Keep SRT/subtitle domain logic independent of React and network providers.
- Keep Cloud Translation model details behind the translation-provider interface.
- Use Ant Design as the first choice for application layout, standard controls, feedback, navigation, spacing, and generic panels. Retain semantic HTML and focused custom CSS where the subtitle-review interface needs domain-specific behavior or performance control; do not add generic `div` wrappers when an appropriate Ant Design component exists. Follow `docs/UI_COMPONENT_GUIDE.md`.
- Verify the rendered DOM of library layout components before styling their child spacing or fixed regions. For the desktop translator sidebar, apply a visible 20 px gap to the actual control container and keep loaded-file actions in a stationary bottom group outside the scrollable controls. Keep the subtitle-preview heading and its column labels compact and sticky at the top of the scrollable content pane.
- Never use or describe the MVP's undocumented Google consumer endpoint as production-ready.
- Never expose, commit, persist, log, or place secrets in public Vite environment variables.
- Translation is owner-funded through a server-side gateway. Never expose, commit, persist in browser storage, log, or place the project-owner key in URLs, downloaded files, public Vite variables, or frontend source.
- The browser must call only the project gateway. The gateway reads its local development credential from gitignored `.env`; production uses the deployment secret manager. Enforce a documented cost/abuse limit before public deployment.
- Developer-owned local server secrets belong in a gitignored `.env`; production secrets belong in the deployment secret manager. `VITE_*` values are public and must never contain secrets. Commit only placeholder names in `.env.example`.
- Never claim frontend translation is guaranteed to continue after a tab is frozen, discarded, or closed.
- Current cloud scope is telemetry only: location, target language, and movie identity. Never upload source/translated subtitle text, completed SRT files, raw filenames, or API keys as telemetry. Sending required subtitle text to the chosen translation provider is a separate translation operation.
- Do not implement completed-file storage, cloud subtitle checkpoints, or cross-user subtitle reuse unless the user explicitly restores that scope. Keep downloads and checkpoints local.
- Location precision is confirmed as country and city. Acquisition method and telemetry retention/notice remain TBD; do not silently add GPS, an IP lookup service, raw IP storage, or persistent user tracking.
- Do not implement microservices merely to match a lecture topic. Discuss and document why they fit or do not fit.
- Run relevant typecheck, lint, tests, and build. Never claim they passed without current successful output.
- After every material change, update `PROJECT_STATE.md` and affected documentation, append a one-line plain-language entry to `AI_LOG.md`, and append the evidence/detail to `docs/AI_DETAILED_LOG.md`.
- After completing a user prompt that changes repository files, create one local commit for that completed logical change before reporting completion. Inspect Git status first; never include secrets, ignored files, unrelated user changes, or generated artifacts. Do not push, merge, amend published history, or use destructive Git commands unless the user explicitly asks.
- Never fabricate the human-only `kept`, `changed/rejected`, or `AI got wrong` reflection. Use `TBD - human review required` when necessary.
- Work must satisfy the Definition of Done in `docs/PRODUCT_REQUIREMENTS.md`.

## Current confirmed stack direction

- React + TypeScript using a mutually compatible stable set pinned by the lockfile.
- Vite.
- Ant Design and its theme tokens.
- GitHub Actions CI and GitHub Pages frontend deployment.
- Moderate official recommended ESLint/typescript-eslint/React Hooks rules plus Prettier.
- Exact testing and backend packages are chosen only when implemented and documented.

## Ownership and cost decisions

- Confirmed 2026-09-16: this is a solo project. Do not allocate work to assumed teammates.
- Confirmed 2026-09-18: use only Cloud Translation NMT and TLLM through an owner-funded server-side gateway. Gemini Developer API is removed from product scope. See ADR-004.
- Telemetry-only scope supersedes prior Firebase/R2 file-storage proposals. Do not provision an object bucket or add upload credentials for this scope. Billing acceptance and telemetry lifecycle remain open. Read `docs/ADR-001-TELEMETRY-ONLY.md`.
- Recheck dated pricing before implementation; distinguish a no-cost quota from a no-billing account.

## Current priority

1. Reconcile actual repository state with `PROJECT_STATE.md`.
2. Preserve/tag/deploy the standalone MVP as the before-state.
3. Replace the temporary direct-browser adapter with a server-side NMT/TLLM gateway, including a cost/abuse limit and a deployment host before public release.
4. Port contextual group handling, reliability, formatting, editing, tests, security, documentation, and CI according to the semester plan.
5. Implement the confirmed telemetry-only feature after its open data decisions are resolved; movie matching/lives remain conditional. File storage/reuse are deferred, not active stretch milestones.

## Task completion report

At the end of an AI task, report:

- exact behavior and files changed;
- verification commands and outcomes;
- unresolved limitations/TBDs;
- documentation/state changes;
- local commit hash, when the task changed repository files;
- the `AI_LOG.md` entry added.
