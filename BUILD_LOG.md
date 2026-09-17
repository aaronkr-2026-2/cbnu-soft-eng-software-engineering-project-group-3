# Build log

## 2026-09-17 — React and official Cloud Translation increment

Local branch: `feat/react-official-translate`. Node 24.19.0 / npm 11.17.0. This records local evidence, not remote CI or deployment.

| Command/check | Outcome |
| --- | --- |
| `npm ci` | Passed: 306 packages installed; audit reported zero vulnerabilities. npm reported a pending optional fsevents install-script policy warning; no blanket script approval was added. |
| `npm run check` | Passed: TypeScript, ESLint with zero warnings, 56 tests across six files, and production build. |
| `npm run format:check` | Passed. |
| `GITHUB_ACTIONS=true npm run test:e2e` | Passed: four Chromium browser workflows against the production build under the repository subpath; final run 7.6 seconds. Light/dark screenshots inspected in test-results. |
| `npm run check:build` | Passed: no legacy endpoint, environment-key marker, key-shaped literal, source maps, or historical HTML in dist. This is a targeted artifact check, not a comprehensive security audit. |
| `git diff --exit-code b64bc59 -- archive/mvp/srt-translator-beta-3.html` | Passed before the file was moved: original MVP unchanged. Local annotated mvp-baseline tag preserves b64bc59. |
| `git check-ignore .env .nev` / tracked-file query | Both ignored; .env is untracked. No secret file content read. |
| `git diff --check` | Passed. |

Production output: approximately 640 kB JavaScript (208 kB gzip), 6.36 kB CSS. Vite reports its >500 kB chunk warning. Performance/bundle splitting remains open; the warning is not suppressed.

Tests cover historical parser characterization, current SRT round trips and invalid input, markup safety, graphemes/CPS/speaker boundaries, provider request/response validation, retry/timeout/cancellation, exact cue mapping, file-load races, credential clearing, and edit protection. Provider responses and keys in all automated tests are synthetic; tests neither read .env nor call a paid API.

Failures found and corrected during implementation:

- The first browser run used an existing development server with stale Vite dependency optimization (504). Tests now build and launch their own production preview on port 4173.
- Decorative Ant icons changed accessible button names; icons now use aria-hidden.
- Sidebar flex shrinking compressed action buttons. Children now retain their heights and the sidebar scrolls; the browser test checks the primary action height.
- Two new edit-test queries used a Playwright-only option with Testing Library; TypeScript caught it and it was removed.
- ESLint initially omitted Node globals for the new .mjs artifact checker; the configuration now includes that extension.
- The first Pages-subpath run could not load assets because build and preview used different base paths. Vite now uses the same CI base for both; all four browser tests pass with that configuration.

Historical note: the earlier direct-browser key test is superseded by ADR-004. The new local flow is `npm run dev:gateway` plus `npm run dev`, followed by **Check service** in the app. A live gateway/provider result, human translation-quality review, Firefox/Safari/Edge verification, and production deployment remain unproven.

Human walkthrough / external review / retrospective: TBD - human review required.

## 2026-09-18 — Owner-funded NMT/TLLM gateway refactor

`npm run check`, `npm run format:check`, `node --check server/index.mjs`, and `GITHUB_ACTIONS=true npm run test:e2e` passed. Unit tests use mocked gateway responses; browser tests intercept `/api` and do not start the local gateway or read `.env`. No real API key was read and no billable Google request was made. The production gateway host, rate limits, abuse controls, live-provider smoke test, and NMT/TLLM quality benchmark remain pending.
