# Development Rules

Version: 0.1

Date: 2026-09-15

These rules apply to humans and AI coding tools.

## 1. Truth and scope

1. Inspect the relevant code, tests, documentation, and Git state before proposing changes.
2. Do not invent requirements, repository state, API behavior, test results, user decisions, or past events.
3. When information is missing and changes the design, ask. If work can continue safely, mark the item `TBD` and keep it out of committed behavior.
4. Treat this precedence order as authoritative:
   1. the user's latest explicit instruction;
   2. verified code and passing tests;
   3. confirmed requirements/ADRs;
   4. current project-state documentation;
   5. proposals and open questions.
5. Do not describe planned behavior as implemented.

## 2. Before changing code

1. Read `AGENTS.md`, `PROJECT_STATE.md`, the relevant requirements, architecture, and recent `AI_LOG.md` entries.
2. State the goal, constraints, acceptance criteria, and verification commands.
3. Identify existing behavior that must not change.
4. Prefer a focused change that can be run, verified, reviewed, and committed independently.
5. Do not rewrite or delete working code merely to match a preferred style. Explain and test any replacement.

## 3. Implementation style

- Prefer plain, readable TypeScript and React patterns.
- Use meaningful names and small functions with one clear responsibility.
- Keep domain logic outside React components.
- Keep network details inside provider adapters.
- Avoid premature abstractions, generic frameworks, service locators, and unnecessary state libraries.
- Avoid `any`; use `unknown` plus validation at trust boundaries.
- Make impossible states difficult to represent with discriminated unions where this improves clarity.
- Comments explain why, invariants, or non-obvious trade-offs. Do not narrate obvious syntax.
- Do not leave dead code, duplicate logic, commented-out implementations, or placeholder providers presented as real.
- Preserve user-edited subtitle text unless an explicit action authorizes replacement.
- Treat file content, API output, metadata, and restored local state as untrusted input.

## 4. Dependencies

1. Add a dependency only when its value exceeds the maintenance, bundle, security, and learning cost.
2. Prefer official, maintained packages with compatible licenses and documentation.
3. Record why a significant dependency is needed.
4. Pin the resolved dependency graph with the chosen package-manager lockfile.
5. Do not perform casual major-version upgrades inside unrelated work.
6. Never add a package only because generated code happens to use it.

## 5. Linting and formatting

Use ESLint flat configuration with official recommended rules as the baseline:

- ESLint JavaScript recommended;
- typescript-eslint recommended, adding type-checked rules when the project configuration supports them;
- React Hooks recommended rules;
- a React/JSX accessibility plugin if selected by the team;
- Prettier for formatting, with style-conflicting lint rules disabled.

This is intentionally moderate. Start with warnings where a new rule would create broad unrelated churn, then tighten deliberately. Do not adopt a branded maximum-style preset merely because it is popular.

## 6. Tests and verification

Minimum local/CI gates:

```text
install from lockfile
typecheck
lint
unit/integration tests
production build
```

Suggested tools: Vitest, React Testing Library, and a request-mocking tool compatible with the chosen stack. Exact tools are confirmed when scaffolding occurs.

Test the behavior most likely to corrupt output:

- SRT parse/serialize round trips;
- malformed/empty/unusual cue fixtures;
- sentence/dialogue grouping;
- provider batching and ID mapping;
- timeout, cancellation, retry, and partial failure;
- line breaking, two-line maximum, and CPS warnings;
- edit protection and download output;
- checkpoint/resume;
- Start/Download enablement rules.

Never claim a command passed unless it was run successfully in the current source state. Report skipped checks and why.

## 7. Security and privacy

- Non-negotiable: never hard-code, commit, print, log, analyze, place in URLs, send to telemetry, or persist API keys, passwords, service-account files, database credentials, OAuth tokens, or private tokens.
- The browser must never receive a provider key. The owner-funded gateway reads local development secrets from gitignored `.env` and production secrets from its secret manager. Never place either in browser storage, URLs, logs, telemetry, downloads, or autofill-enabled application state.
- Developer-owned local server secrets belong in a gitignored `.env`. Commit only `.env.example` with placeholders. Production secrets belong in the deployment platform's secret manager/environment configuration.
- Public Vite `VITE_*` environment variables are compiled into the browser bundle and are never secret.
- Production Cloud Translation secrets belong behind the gateway's secret manager.
- Validate file size/type/content and provider response shape.
- Escape/render subtitle text as text, not trusted HTML.
- Use least-privilege Firebase/Cloud rules, quotas, rate limits, and App Check where applicable.
- Cloud collection is telemetry only: country and city, target language, and movie identity, with minimal event ID/time fields for statistics. Location precision is decided; settle the acquisition method, retention, deletion, and collection controls before implementing the unresolved portions.
- Do not upload completed SRTs or subtitle text into telemetry, logs, project databases, or object storage. Translation-provider requests and browser-local job checkpoints are distinct from telemetry.
- Completed-file storage, sharing, cloud subtitle checkpoints, and cross-user reuse are deferred under `ADR-001-TELEMETRY-ONLY.md`. Do not restore them merely because older research described them.
- Do not log subtitle text or secrets by default.
- Redact credential-shaped values from handled errors before logging/display. Do not include credential objects in serializable job state or React debugging snapshots.

## 8. Git and review

- One logical change per commit.
- Use a feature/fix/docs branch and pull request for reviewed work unless the course workflow says otherwise.
- Do not mix broad formatting with functional changes.
- A reviewer checks correctness, readability, tests, security/privacy, requirements alignment, and documentation impact.
- Preserve meaningful Git history; do not overwrite the original MVP baseline.
- Never use destructive Git operations on another person's work without explicit authorization.

## 9. Mandatory documentation updates

After every material code, configuration, dependency, test, architecture, deployment, or requirements change:

1. update `PROJECT_STATE.md` to reflect what is now true;
2. update requirements/architecture/ADR when behavior or a decision changed;
3. append an honest one-line `AI_LOG.md` entry and the supporting detail/evidence in `docs/AI_DETAILED_LOG.md`;
4. do not fabricate human reflections - use `TBD - human review required` for anything only the team can answer.

The course requires the AI log at every milestone; this project intentionally applies the same format to every material change so no AI-assisted work is lost between milestones.

## 10. AI coding workflow

Every AI-assisted task follows:

1. Inspect.
2. Explain the current behavior and risk.
3. Plan a focused change.
4. Implement without erasing unrelated work.
5. Run relevant verification.
6. Summarize exact files/behavior changed and remaining limitations.
7. Update state/decision documentation.
8. Append `AI_LOG.md` in the required format.

If an AI cannot access a referenced repository/file/service, it must say so and continue only with evidence it can inspect.

## 11. Definition of Done

Use the Definition of Done in `PRODUCT_REQUIREMENTS.md`. "The code looks right" or "the AI says it should work" is not completion evidence.
