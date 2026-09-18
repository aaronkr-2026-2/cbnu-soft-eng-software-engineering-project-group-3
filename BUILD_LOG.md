# Build log

## 2026-09-17 — React and official Cloud Translation increment

Local branch: `feat/react-official-translate`. Node 24.19.0 / npm 11.17.0. This records local evidence, not remote CI or deployment.

| Command/check                                                            | Outcome                                                                                                                                                                                 |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                                                                 | Passed: 306 packages installed; audit reported zero vulnerabilities. npm reported a pending optional fsevents install-script policy warning; no blanket script approval was added.      |
| `npm run check`                                                          | Passed: TypeScript, ESLint with zero warnings, 56 tests across six files, and production build.                                                                                         |
| `npm run format:check`                                                   | Passed.                                                                                                                                                                                 |
| `GITHUB_ACTIONS=true npm run test:e2e`                                   | Passed: four Chromium browser workflows against the production build under the repository subpath; final run 7.6 seconds. Light/dark screenshots inspected in test-results.             |
| `npm run check:build`                                                    | Passed: no legacy endpoint, environment-key marker, key-shaped literal, source maps, or historical HTML in dist. This is a targeted artifact check, not a comprehensive security audit. |
| `git diff --exit-code b64bc59 -- archive/mvp/srt-translator-beta-3.html` | Passed before the file was moved: original MVP unchanged. Local annotated mvp-baseline tag preserves b64bc59.                                                                           |
| `git check-ignore .env .nev` / tracked-file query                        | Both ignored; .env is untracked. No secret file content read.                                                                                                                           |
| `git diff --check`                                                       | Passed.                                                                                                                                                                                 |

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

## 2026-09-18 — Live gateway configuration diagnosis

The local server made redacted minimal `Hello.` requests to the official Cloud Translation Basic v2 endpoint. It never printed, committed, or sent `GOOGLE_CLOUD_API_KEY` or the project ID to the browser.

| Check                                                                                                   | Outcome                                                                                                                            |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| NMT translation with the corrected server key restriction                                               | Passed: HTTP 200.                                                                                                                  |
| TLLM translation at `asia-northeast3`                                                                   | Failed: HTTP 400 `Invalid Value`. This location is not a usable configuration for this request.                                    |
| TLLM translation at `us-central1`                                                                       | Passed: HTTP 200.                                                                                                                  |
| Basic v2 language-list request with a full TLLM model resource                                          | Failed: HTTP 400 `Invalid Value`; the gateway now validates the engine but obtains the picker list from the default NMT catalogue. |
| `npm run check` / `npm run format:check` / Node syntax checks / `git diff --check` after the correction | Passed. Production build retains Vite's existing >500 kB chunk warning.                                                            |

This confirms only minimal provider connectivity. It is not real-subtitle quality, cost, rate-limit, security, production-host, or public-deployment evidence.

## 2026-09-18 — Gateway error-category verification

`npm run check` passed: TypeScript, zero-warning ESLint, 57 unit tests, and production build. `npm run format:check` and `node --check server/index.mjs` passed. The build retains its existing >500 kB chunk warning. The full `git diff --check` also reports the separately modified user fixture `examples/demo.srt`; it was not changed as part of the gateway diagnosis.

The gateway now writes only a sanitized Cloud Translation HTTP status/category on upstream failure and returns an allowlisted category to the client. A unit test verifies that arbitrary upstream error text is not echoed. Restarting the local development command is required before this new diagnostic is active.

## 2026-09-18 — Full-file UI responsiveness and quota-category refinement

`npm run check` passed: TypeScript, zero-warning ESLint, 59 unit tests, and production build. `npm run format:check`, Node syntax check, and the scoped diff whitespace check passed. The production build retains its existing >500 kB chunk warning.

Cue rows now skip unchanged React renders, off-screen layout/paint, and repeated active-ID scans; the sequential job yields after each completed batch so the browser can paint progress. This is a responsiveness improvement, not evidence that a 2,000+ cue file can never require a windowed list. The gateway maps Google's daily and per-minute quota wording to separate sanitized categories, but the exact category from the developer's next live failure remains unrecorded.

## 2026-09-18 — Ant Design layout refactor

`npm run check` passed: TypeScript, zero-warning ESLint, 59 Vitest tests, and the production build. `npm run format:check` passed. `npm run test:e2e` passed all four Chromium workflows after permission to bind the local preview port. The production build retains the existing Vite warning for a JavaScript chunk above 500 kB.

The browser shell now uses Ant Design `Layout`, `Header`, `Sider`, and `Content`; cue surfaces use `Card`; and simple control/metadata arrangements use `Flex`. The subtitle-specific row layout and its off-screen containment remain custom because they are not generic application UI. This is automated interaction evidence, not a human visual design review.

## 2026-09-18 — Long-list virtualization

`npm run check` passed: TypeScript, zero-warning ESLint, 59 Vitest tests, and the production build. `npm run format:check` passed. `npm run test:e2e` passed five Chromium workflows, including a 2,500-cue fixture that verifies fewer than 40 cue rows are mounted before and after a jump to the bottom. The production build retains the Vite warning for a JavaScript chunk above 500 kB; the virtual-list dependency increased the output from approximately 729 kB to 756 kB before gzip.

The delayed `content-visibility` rendering strategy was removed because the developer observed blank cards after rapid scrolling. The list now uses measured viewport virtualization through `@tanstack/react-virtual`, retains editing rows outside the normal viewport range, and scrolls to the active cue through the virtualizer. This proves the synthetic 2,500-cue interaction flow, not subjective translation-job responsiveness on the developer's full local subtitle file.

## 2026-09-18 — Compact sticky translator controls and clearer NMT estimate

`npm run check` passed: TypeScript, zero-warning ESLint, 59 Vitest tests, and the production build. `npm run format:check` passed. `npm run test:e2e` passed five Chromium workflows. The browser test verifies the 20 px gap on Ant Design's actual control wrapper, the stationary sidebar action group, the sticky content heading, and the plain-language NMT total-cost explanation. The production build retains Vite's JavaScript-chunk warning above 500 kB.

The outer `Sider` was previously given a flex gap even though Ant Design renders the supplied controls inside `.ant-layout-sider-children`; moving the flex layout to that wrapper makes the requested vertical rhythm effective. The first bottom-region attempt overlaid the configuration controls; the final layout separates scrollable controls from the stationary action group. Header/content padding was reduced, and the preview heading and column labels are now sticky. This is browser interaction/CSS evidence; visual review at the developer's preferred screen size remains pending.

## 2026-09-18 — Wider cue cards and scrollable cost explanation

`npm run check` passed: TypeScript, zero-warning ESLint, 59 Vitest tests, and the production build. `npm run format:check` passed. `npm run test:e2e` passed five Chromium workflows. The browser test confirms that the estimate is in the sidebar controls rather than the stationary action panel and that cue rows have no left border.

Moved the cost card and estimate error into the scrollable configuration area, added 36 px bottom padding there, and removed the action-panel shadow. The content pane now has 6 px side padding; the cue-row vertical rail and its left inset are removed so cards use the available width. A loaded-file screenshot was visually inspected. This is visual/browser evidence at the test viewport, not a substitute for review on every target screen size.

## 2026-09-18 — Compact help controls and header

`npm run check` passed: TypeScript, zero-warning ESLint, 59 Vitest tests, and the production build. `npm run test:e2e` passed five Chromium workflows. The browser test opens the header help modal and the service-check help popover before running the normal upload-to-download flow.

The 52 px header removes the marketing subtitle and mode label, using compact theme, help, and GitHub controls. The sidebar now begins with `Select your English subtitle`; the verbose service-card help paragraph is replaced by a question-mark popover. A generated loaded-file screenshot was visually inspected. The build retains Vite's existing JavaScript-chunk warning above 500 kB.
