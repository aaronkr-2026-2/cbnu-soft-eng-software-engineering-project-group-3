# SRT Translator

Translate an English `.srt` file, review the result, and download subtitles with the original cue numbers and timing. Visitors do not need an API key; the project owner funds official Google Cloud Translation through a private gateway.

## Product vision

**FOR** tech-savvy movie viewers who already obtain and use subtitle files,

**WHO** want to enjoy movies in their preferred or mother language,

**THE SRT Translator IS AN** online subtitle translation and review tool

**THAT** joins continuing speech before translation and produces an editable SRT with preserved timing.

**UNLIKE** manually copying subtitle fragments into a general translation website,

**OUR PRODUCT** handles continuation grouping, subtitle readability, progress, editing and download in one workflow.

[Syed G Akbar's subtitle translator](https://www.syedgakbar.com/projects/dst) remains a comparison product. Its internal translation mechanism is not verified here. Grouping is a heuristic; improved translation quality and accurate placement against the movie audio require human review.

## Use the app

1. Choose or drop an English UTF-8 SRT, up to 5 MiB.
2. Select NMT or TLLM, a target language, and Adult (20 CPS) or Children (17 CPS).
3. Start translation. Progress, elapsed time and translation request attempts appear at the sidebar bottom. A Google per-minute limit triggers a visible, cancelable cooldown before a bounded automatic retry.
4. Review the paired cards. Edit translations, check readability warnings and review redistributed speech against the movie. Retry unfinished work if a request fails.
5. Download when every cue is ready. Saved edits are included.

Languages load automatically. No paid test translation or separate Check service step is required. Keep the tab open; reload recovery is not implemented yet.

## Translation behavior and cost

- **NMT:** fast general translation of the supplied text.
- **TLLM:** Google's specialized Translation LLM, positioned for higher quality; results vary by language and input. This is not Gemini Developer API.
- Both engines receive joined continuation speech. Cues starting with lowercase text or an ellipsis extend the preceding group within technical bounds. Soft wraps become spaces; known speaker, sound and music boundaries are preserved.
- Joined results are distributed into their original time slots using reading capacity and language-aware breaks, then wrapped. This is approximate placement, not guaranteed semantic or audio alignment. Unallocatable groups fail visibly instead of losing text.
- The selected engine's cost card estimates the whole file and remaining work from list prices. TLLM's estimated output length is an explicit assumption. The app cannot see your Cloud credits or actual bill.

## Run locally

```sh
npm ci
# Create .env from .env.example and configure it locally.
npm run dev
```

Open `http://localhost:5173`. `npm run dev` starts Vite and the Node translation gateway. The gateway reads `GOOGLE_CLOUD_API_KEY`, `GOOGLE_CLOUD_PROJECT_ID`, and optional `GOOGLE_TRANSLATE_TLLM_LOCATION` from ignored `.env`. The browser never receives the key. See [setup instructions](docs/GOOGLE_TRANSLATE_SETUP.md).

```sh
npm run check
npm run format:check
npm run test:e2e
npm run check:build
```

Routine tests use mocked provider responses, never a live key. Actual results are recorded in [BUILD_LOG.md](BUILD_LOG.md).

## Deploy with Vercel

Vercel is the production target for both the Vite frontend and the same-origin `/api/translation` Functions. `vercel.json` uses `npm run build`, serves `dist`, and gives each translation Function a 30-second maximum duration. The Functions and local Node server reuse the same validated gateway core.

Configure `GOOGLE_CLOUD_API_KEY`, `GOOGLE_CLOUD_PROJECT_ID`, and `GOOGLE_TRANSLATE_TLLM_LOCATION` as server-side Vercel environment variables. Never use `VITE_*` for them. Production translation fails closed until `TRANSLATION_GATEWAY_ENABLED=true` is configured. Enable it only after applying an owner-approved Vercel Firewall rate limit to `/api/translation*` and setting Google Cloud budget/quota controls. See [gateway setup](docs/GOOGLE_TRANSLATE_SETUP.md).

If Vercel is connected to a personal fork because the Classroom organization cannot grant the required role, sync this repository change into that fork before redeploying. A successful frontend build alone does not prove that the Functions, secrets, limits, NMT, or TLLM work in production.

## Scope and evidence

The React/TypeScript/Vite/Ant Design app includes local parsing, supported i/b/u markup, grouped provider input, readable output checks, editing, cancellation, retry and virtualized review. Statistics, metadata, lives and cloud subtitle storage are outside the active increment. Local checkpoint/resume remains a later course milestone.

The repository now contains Vercel Function adapters for the private gateway, but a working public frontend-to-gateway deployment is not claimed until the personal fork is synchronized, environment variables and abuse controls are configured, the gateway is explicitly enabled, and live smoke checks pass. Live grouped-translation quality review also remains open. The [archived MVP](archive/mvp/srt-translator-beta-3.html) preserves the before-state and is excluded from the production build.

## Project records

- [AGENTS.md](AGENTS.md): canonical working rules; `GEMINI.md` and `CLAUDE.md` point coding assistants here and are not product integrations.
- [PROJECT_STATE.md](PROJECT_STATE.md): current implementation and evidence limits.
- [Current features](docs/product/features-now.md), [provisional personas](docs/product/personas.md), [user stories](docs/product/stories.md), and [feature-to-story gap map](docs/product/gap-map.md): the Week 4 product-discovery record and its outstanding validation gaps.
- [Week 2](docs/sprints/WEEK_02.md), [Week 3](docs/sprints/WEEK_03.md), [Week 4](docs/sprints/WEEK_04.md), and [Week 5](docs/sprints/WEEK_05.md) sprint records: evidence-based summaries with unrecorded human review and validation left explicitly TBD.
- [Revision prompt](docs/REQUIREMENTS_REVISION_PROMPT.md) and [revision audit](docs/REQUIREMENTS_REVISION_AUDIT.md): the voice memo translated into work and its implementation findings.
- [Product requirements](docs/PRODUCT_REQUIREMENTS.md), [formatting specification](docs/SUBTITLE_FORMATTING_SPEC.md), and [architecture](docs/ARCHITECTURE.md): the current contract.
- [AI_LOG.md](AI_LOG.md): short classroom summary; [detailed AI log](docs/AI_DETAILED_LOG.md): course-format evidence and human reflections.
- [Semester plan](docs/SEMESTER_PLAN.md) and [course alignment](docs/COURSE_ALIGNMENT.md): milestones and remaining evidence.
