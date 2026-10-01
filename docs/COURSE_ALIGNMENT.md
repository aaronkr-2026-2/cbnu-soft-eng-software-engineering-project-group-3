# Course Alignment and Scope Report

Updated: 2026-09-18

## Overall assessment

SRT Translator is a strong fit for Advanced Software Engineering. It begins with a small working but technically weak MVP and naturally supports requirements work, Agile planning, architecture, cloud deployment, security/privacy, reliable programming, code style, testing/review, DevOps, documentation, licensing, and reflective AI use.

The project should be evaluated through the engineering changes made to the same running product. A long feature list is not the goal. The course guide explicitly says a smaller, well-understood, well-documented project can outscore a flashier one the team cannot explain.

## Curriculum mapping

| Course principle | Natural application in this project | Evidence to retain |
| --- | --- | --- |
| Software products | State a real translation/readability problem, user, product vision, constraints, and success measures. | Deployed MVP, product vision, baseline tag/demo. |
| Personas/features/scenarios/stories | Validate who translates subtitles and write outcome-based stories/acceptance criteria. | Interview notes, personas, story map, accepted/rejected assumptions. |
| Agile engineering | Prioritize small vertical changes and adapt from measured results. | Backlog, sprint goals, Definition of Done, reviews/retrospectives. |
| Architecture | Turn a single HTML file into separated domain, application, provider, UI, and persistence boundaries. | Before/after diagrams, critique, ADRs. |
| Cloud software | Reproducible frontend deployment and, only if needed, a small serverless boundary. | Pages workflow, deployment URL, optional backend/data-flow ADR. |
| Microservices | Analyze whether independently deployed services help. Current answer: they add complexity without demonstrated need. | A reasoned decomposition discussion/ADR rather than forced microservices. |
| Security & privacy | Protect keys, validate untrusted SRT/API data, model threats, limit abuse/cost, and govern location/movie telemetry. | Threat model, audit findings/fixes, rules tests, privacy decisions. |
| Reliable programming/style | Typed states, cancellation, bounded retries, checkpoints, validated outputs, moderate shared style rules. | Lint/typecheck output, failure tests, code-style PR. |
| Testing/code review | Test parsing/serialization and the failure-prone translation/formatting state machine. | Real fixtures, automated suite, peer-review record and fixes. |
| DevOps/code management/docs | CI gates, GitHub Pages deployment, README, API docs, ADRs, state and operations notes. | Passing workflows, release tag, documentation set. |
| Licensing/AI authorship | Review package/data/API licenses and honestly record AI use and errors. | Dependency/data source audit and complete `AI_LOG.md`. |

## Features that fit the protected core

- React/TypeScript/Ant Design migration.
- Component/domain/provider separation.
- official translation-provider adapters;
- official Cloud Translation NMT/TLLM model selection and benchmark evidence;
- owner-funded gateway, secret handling, budget, rate-limit, and abuse-control evidence;
- exact continuation-group, speaker-boundary, line-breaking, and CPS quality checks;
- elapsed-time and page-lifecycle behavior;
- editable cues and scroll-follow control;
- checkpoints, cancellation, retry, partial failure;
- testing, review, linting, CI/CD, documentation, security audit.

Each improves engineering quality in a way that can be explained and measured.

## Features that fit only as conditional extensions

- Firebase aggregate statistics.
- Movie metadata lookup and filename confidence.

Confirmed telemetry-only scope supersedes earlier file-hosting proposals. Completed-file storage/reuse and durable backend jobs requiring subtitle persistence are deferred, not current extension milestones.

These can provide useful architecture/security/cloud evidence, but only after data purposes, provider terms, privacy, retention, identity, cost, and access control are defined.

## Features that are currently out of scope or unjustified

### Microservices

Separate translation, metadata, statistics, storage, and user-limit microservices are not justified by the present scale. Provider adapters and modules already demonstrate decomposition. If a backend is added, begin with one serverless API/codebase and split only after measured independent scaling, release, or ownership needs appear.

### Kubernetes, multiple databases, elaborate authentication

The lecture explicitly warns against this accidental complexity. None is required for the confirmed core.

### Automatic public subtitle repository

It expands the project into user-generated content hosting and requires copyright/takedown, privacy, moderation, access, retention, deletion, and abuse controls. The user explicitly deferred completed-file storage/reuse on 2026-09-16. Do not implement a public or private subtitle archive under the current scope.

### IMDb/Rotten Tomatoes scraping

Scraping is not necessary to demonstrate software-engineering principles and creates fragile/legal/API-scope work. Parse an IMDb `tt...` identifier and use TMDB's supported external-ID lookup, license IMDb's official developer data if justified, or defer. Rotten Tomatoes offers data access through a business proposal rather than a public self-service developer API; accept title/year manually instead of scraping.

### Universal "nausea-safe" formatter

No universal medical standard was established. The defensible scope is configurable readability checks based on timed-text standards, language profiles, and human editing.

### Guaranteed client-only background service

Browser lifecycle rules prevent this guarantee. The appropriate course lesson is to document the limitation, implement checkpoint/resume, and add a backend job only if closed-tab completion becomes a confirmed requirement.

## Scope-control rule

Before accepting a stretch feature, answer:

1. Which course principle does it exercise?
2. What confirmed user problem does it solve?
3. What core milestone could it delay?
4. What security/privacy/cost/license obligation does it create?
5. Can every team member explain and test it?

If the answers are weak, keep it in the backlog instead of implementing it.

## Voice memo review — 2026-09-18

Checked the five-page project-guide PDF and Markdown companion. The narrowed upload → translate → review → download flow remains suitable for a solo project. Restoring actual joined provider input, isolating group failures and admitting approximate timing placement provide concrete requirements, architecture and reliability evidence. See REQUIREMENTS_REVISION_AUDIT.md.

Local implementation and passing tests alone do not satisfy the course. User/persona validation, dated sprint reviews, public working deployment, external peer review, licensing review, human AI reflections and a live code walkthrough remain required evidence. Keep the short AI_LOG.md index linked to the detailed five-field records; human reflections must be completed by the author. A paid Cloud service is a project choice, not a course requirement.
