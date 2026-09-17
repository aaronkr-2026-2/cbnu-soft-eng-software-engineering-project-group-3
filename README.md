# SRT Translator - Project Documentation Baseline

Status: Documentation draft; solo ownership and telemetry-only cloud scope confirmed

Prepared: 2026-09-15

Course: Advanced Software Engineering, CBNU, Fall 2026

## Product vision

SRT Translator helps a person turn an English SubRip (`.srt`) subtitle file into a readable subtitle in another language while preserving cue timing, showing progress, allowing corrections, and producing a downloadable `.srt` file.

The semester goal is not merely to add features. It is to preserve the original vibe-coded prototype as evidence, then demonstrate how software-engineering practices make the product safer, clearer, testable, deployable, and maintainable.

## Confirmed product direction

- Frontend: React + TypeScript using mutually compatible current stable versions at scaffold time.
- Build tool: Vite is the recommended fit for a client-side React application and GitHub Pages.
- Component library: Ant Design, including its theme system for light and dark modes.
- Main modes: Translator and Statistics.
- Translator layout: header, 20% control sidebar, and 80% side-by-side original/translated subtitle area; no footer.
- Engines: Google Translate and Google Gemini behind one provider interface.
- Delivery: CI checks every change; pushes to `main` build and deploy the production frontend to GitHub Pages.
- Code: junior-developer-readable organization, focused comments, normal linting, tests, and documented decisions.

## Semester-safe scope

The core semester product is:

1. Preserve the standalone MVP as the before-state.
2. Port it to React + TypeScript without changing behavior unintentionally.
3. replace the unofficial translation call with a documented provider boundary;
4. improve subtitle segmentation, readability checks, editing, progress, retry, and resumability;
5. add a real Gemini integration safely;
6. add tests, code review, security work, documentation, CI, and deployment.

Confirmed 2026-09-16: cloud collection is telemetry only (user location, target language, movie identity). Completed SRT upload/storage and reuse of other users' translations are deferred and excluded from current milestones. Local SRT downloads remain. Movie metadata and the three-life rule still need their open decisions resolved. Telemetry location precision is confirmed as country and city. The acquisition method, retention, and collection controls must still be settled without delaying the graded core. See [ADR-001](docs/ADR-001-TELEMETRY-ONLY.md).

## Read this documentation in order

1. [`PROJECT_STATE.md`](PROJECT_STATE.md) - what is actually known today.
2. [`docs/PRODUCT_REQUIREMENTS.md`](docs/PRODUCT_REQUIREMENTS.md) - confirmed requirements, proposed requirements, and acceptance criteria.
3. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) - target architecture and boundaries.
4. [`docs/DEVELOPMENT_RULES.md`](docs/DEVELOPMENT_RULES.md) - rules for humans and AI coding tools.
5. [`docs/SEMESTER_PLAN.md`](docs/SEMESTER_PLAN.md) - week-by-week deliverables and evidence.
6. [`docs/COURSE_ALIGNMENT.md`](docs/COURSE_ALIGNMENT.md) - what fits, what is stretch scope, and what is unjustified.
7. [`docs/FEASIBILITY_RESEARCH.md`](docs/FEASIBILITY_RESEARCH.md) - API, browser, subtitle, Firebase, and metadata findings.
8. [`docs/SUBTITLE_FORMATTING_SPEC.md`](docs/SUBTITLE_FORMATTING_SPEC.md) - exact cue grouping, dialogue, CPS, and line-breaking rules.
9. [`docs/PROVIDER_AUTH_AND_COST.md`](docs/PROVIDER_AUTH_AND_COST.md) - user-funded Google credentials, secret handling, quotas, and cost behavior.
10. [`docs/GEMINI_TRANSLATION_PROMPT.md`](docs/GEMINI_TRANSLATION_PROMPT.md) - versioned contextual translation contract and schema.
11. [`docs/OPEN_QUESTIONS.md`](docs/OPEN_QUESTIONS.md) - decisions that must not be guessed.
12. [`AI_LOG.md`](AI_LOG.md) - the course-required AI collaboration record.

`AGENTS.md` is the canonical cross-model working memory. `CLAUDE.md`, `GEMINI.md`, and `.github/copilot-instructions.md` direct model-specific tools to the same source so the rules do not drift.

## Source material reviewed

- `1. CBNU - Eng Soft Prod Intro.pdf` - schedule and grading overview.
- `2. CBNU - Git, GitHub, MVP.pdf` - Git workflow, MVP expectations, AI prompting, verification, and persistent project instructions.
- `software-engineering-project-guide.pdf` - exact milestones, rubric, AI policy, and `AI_LOG.md` template.
- `srt-translator-beta-3.html` - 1,187-line standalone MVP supplied with the assignment request.

The supplied GitHub repository URL could not be authenticated in the review environment. Therefore, this pack makes no claim about repository files, branches, issues, commits, settings, or deployment state that were not visible in the attached MVP.
