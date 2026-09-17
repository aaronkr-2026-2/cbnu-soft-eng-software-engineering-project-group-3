# SRT Translator

A React application for translating English `.srt` subtitles with the official Google Cloud Translation Basic v2 API. Supply your own temporary provider key, preview aligned cues, edit the translation, and download an SRT with the original cue numbers and timestamps.

The original `srt-translator-beta-3.html` is preserved unchanged at the local `mvp-baseline` tag (`b64bc59`). It is historical evidence, uses an undocumented endpoint, and is not included in the React production build. Its Gemini option is a placeholder. The React app has no undocumented fallback and clearly disables Gemini.

## Product vision

**For** tech-savvy movie viewers who know how to download, rip, burn, or play movies but face a language barrier—or simply want to enjoy a film in their preferred or mother language—**who** need an understandable subtitle translation without losing the timing and flow of a conversation, **SRT Translator** is an online subtitle-translation tool **that** takes an English `.srt` file, lets the viewer choose a target language, and produces an editable, downloadable subtitle file with the original cue timing intact.

**Unlike** [Syed G Akbar's Subtitle Translator](https://www.syedgakbar.com/), a primary alternative for translating subtitle files, **our product** is designed around the fact that one spoken conversation or sentence can continue across several subtitle cues. It preserves those connected cues as a visible group, preserves speaker boundaries, and avoids splitting a translated result back across cues by source word count. The aim is a translation that reads as one natural conversation instead of chopped or nonsensical fragments.

The current Google Cloud Translation NMT implementation keeps one provider string per cue so that cue IDs and timing remain exact; it does not claim cross-cue semantic context. Context-aware continuation-group translation is planned only for a future, separately validated Gemini provider.

## Run locally

Use Node.js 24 and npm (the lockfile was generated with npm 11).

```sh
npm ci
npm run dev
```

Open **http://localhost:5173/**. The port is fixed so the key's website restriction can match it. If the port is occupied, stop the other server instead of silently switching ports.

1. Load `examples/demo.srt`, an original synthetic fixture, or your own English SRT.
2. Paste your Cloud Translation Basic key into the masked field and click **Test key**. This fetches supported languages and translates `Hello.` (6 input characters before retries).
3. Choose a target language and an **Adult (20 CPS)** or **Children (17 CPS)** reading profile.
4. Review the exact provider-bound character count, batch count, and NMT list-price estimate, then start translation.
5. Review warnings and use **Edit → Save** to correct cues. Unsaved edits are not included in download.
6. Download after every cue has a validated result. Warnings require human review but do not silently remove content.

See [Google Cloud setup](docs/GOOGLE_TRANSLATE_SETUP.md). A website-restricted key should allow `http://localhost:5173/*`. Actual key validity, billing, browser CORS, and restriction compatibility require a live test in your browser; automated tests use fake keys and mock Google responses.

## Credentials and cost

The credential input is a native uncontrolled password field. Its value is cleared when testing starts; the adapter holds the credential in a private in-memory field outside React job state. Clear key cancels active requests. Credentials are cleared on provider change, unmount/reload, and successful completion; failed/cancelled jobs retain the key for in-tab retry unless explicitly cleared. Browser extensions and developer tools can still observe page memory/network traffic.

Your `.env` is ignored by Git and **not loaded by Vite**. Do not rename keys to `VITE_*`, inject them in build configuration, or ship developer credentials. The app has no local server/proxy that reads `.env`. Each visitor funds their own calls. Keys go only to Google through `x-goog-api-key`; subtitle content goes in a POST body.

NMT list pricing checked on 2026-09-17 is $20 per million input characters above applicable credits. The estimate does not know your remaining credits. Automatic retries can triple an attempt's input usage; manual retries and key tests add usage. Quota/permission failures stop the job. See [provider authentication and cost](docs/PROVIDER_AUTH_AND_COST.md).

## Implemented behavior

- React 19, TypeScript, Vite 8, Ant Design 6 and token-based light/dark themes.
- Local UTF-8 SRT file selection/drop, a 5 MiB limit, and explicit malformed-file diagnostics.
- Preserved cue order, source indexes (including repeated/nonsequential indexes), timecodes, multiline source text, and balanced `<i>`, `<b>`, `<u>` tags. Attributes, other tags, and ASS formatting are rejected explicitly.
- Provider-supported language lookup, tiny key validation, and official NMT batch requests.
- Independent cue mapping; multi-speaker cues use separate balanced segments, retained together in a batch. Translation never uses proportional word redistribution or claims cross-cue context.
- Progress, request count, timestamp-based elapsed time, timeout, bounded backoff, cancellation, and in-tab retry of remaining cues.
- Continuation grouping, paired hover/focus, protected saved edits, source-derived speaker breaks, quality warnings, and scroll-follow control.
- UTF-8 SRT download gated on complete, validated output.

Current browser target: current desktop Chrome, Edge, Firefox, and Safari. Recorded automated browser evidence currently covers Chromium only; other browsers still need verification. Narrow-screen layouts are provided without claiming mobile certification.

## Limits and pending work

- Gemini, Statistics, telemetry, movie metadata, and lives are not implemented. Statistics is hidden by user decision.
- No local checkpoint/reload recovery yet. Keep the tab open and foregrounded; backgrounding, sleeping, or closing it can pause/stop work. Reload loses current results.
- Automatic formatting uses grapheme limits and punctuation/word-boundary balancing, with conservative English break protection. It cannot reliably identify adjective/noun, subject/verb, or phrasal relationships in every language. Full language-specific grammatical profiles remain pending; quality warnings are not a guarantee of linguistic quality.
- Three or more speakers are preserved and flagged when the two-line rule cannot be met. Long/unbreakable output is kept and flagged; timing and meaning are never silently shortened to satisfy limits.
- Unusually large individual cues may be rejected by the safe request-byte limit. Large-file rendering is not yet benchmarked across supported browsers.
- The production bundle currently triggers Vite's 500 kB chunk warning. Bundle splitting/performance work should follow measurements.
- Real Google translation and deployed GitHub Pages behavior require live verification. The workflow is configured; configuration is not deployment evidence.

## Verification

```sh
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npm run check:build
npx playwright install chromium
npm run test:e2e
```

`npm run check` combines typecheck, lint, unit/integration tests, and build. Vitest covers baseline characterization, SRT round trips, formatting, batching, retries, cancellation, file races, and job integrity. Playwright uses intercepted Google responses and synthetic subtitles for upload/translation/edit/download and failure workflows. No tests read `.env` or call a paid API.

## Architecture and delivery

- `src/app`: application shell, theme, and layout.
- `src/core/srt`: parser, serializer, markup grammar.
- `src/core/subtitles`: speaker/group detection and quality formatting.
- `src/services/translation`: provider interface, Google adapter, batching/cost calculation.
- `src/features/translator`: UI, session/job state, editing, orchestration.

GitHub Actions verifies pull requests. Main-branch builds use the repository subpath; deployment uploads only `dist` after gates pass. Configure **Settings → Pages → Source: GitHub Actions** before the first deployment. No provider key is needed in GitHub Secrets. The feature branch is published for review; the app has not been deployed.

The solo development workflow and draft issue acceptance criteria are in [Agile workflow](docs/AGILE_WORKFLOW.md) and [Week 5 sprint](docs/sprints/WEEK_05.md). See [build log](BUILD_LOG.md) for actual checks and [AI_LOG.md](AI_LOG.md) for AI assistance and pending human reflection.

Read [AGENTS.md](AGENTS.md), [project state](PROJECT_STATE.md), [requirements](docs/PRODUCT_REQUIREMENTS.md), [architecture](docs/ARCHITECTURE.md), and [migration plan](docs/REACT_MIGRATION_PLAN.md) before changing the code. The developer remains responsible for understanding and explaining the implementation.
