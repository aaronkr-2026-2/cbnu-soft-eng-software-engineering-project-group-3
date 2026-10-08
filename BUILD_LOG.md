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
| `git diff --exit-code b64bc59 -- docs/mvp/srt-translator-beta-3.html` | Passed before the file was moved: original MVP unchanged. Local annotated mvp-baseline tag preserves b64bc59.                                                                           |
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

`npm run check`, `npm run format:check`, `node --check backend/server/index.mjs`, and `GITHUB_ACTIONS=true npm run test:e2e` passed. Unit tests use mocked gateway responses; browser tests intercept `/api` and do not start the local gateway or read `.env`. No real API key was read and no billable Google request was made. The production gateway host, rate limits, abuse controls, live-provider smoke test, and NMT/TLLM quality benchmark remain pending.

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

`npm run check` passed: TypeScript, zero-warning ESLint, 57 unit tests, and production build. `npm run format:check` and `node --check backend/server/index.mjs` passed. The build retains its existing >500 kB chunk warning. The full `git diff --check` also reports the separately modified user fixture `examples/demo.srt`; it was not changed as part of the gateway diagnosis.

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

## 2026-09-18 — Theme cue and compact help surfaces

`npm run check` passed: TypeScript, zero-warning ESLint, 59 Vitest tests, and the production build. `npm run format:check` passed. `npm run test:e2e` passed five Chromium workflows, including assertions that the help modal has no Cancel button and that the service help content is bounded to 210 px. The production build retains Vite's existing JavaScript-chunk warning above 500 kB.

The theme switch now shows sun/moon visual cues and a tooltip describing the next theme. The workflow modal uses one explicit `OK` button. The service-check popover keeps the same explanation in a compact, controlled reading width.

## 2026-10-01 — Joined-speech revision publication check

The current joined-speech and approximate-redistribution revision passed `npm run check`: TypeScript, zero-warning ESLint, 83 Vitest tests, and the production build. `npm run format:check` passed after formatting the changed application and test files. `npm run test:e2e` passed all 10 mocked Chromium workflows, including joined NMT/TLLM payloads, fixed-cue download conservation, group-specific failures, retries, cancellation, theme/reset behavior, long-list virtualization, and the mobile scroll container. Automated tests intercepted provider requests and made no paid Google call.

Verification found and corrected stale expectations before publication: the demo fixture now contains 43 cues; a jsdom test now reads it from the repository path; protected leading annotations retain the space after a speaker hyphen; browser payload assertions include the complete `source`, `target`, and `format` contract; per-cue group errors expect four affected cards; and downloaded-text conservation parses cue text instead of comparing through SRT metadata. The production build is approximately 826 kB JavaScript (266 kB gzip) and retains Vite's existing chunk-size warning. Live grouped translation quality, additional target browsers, the production gateway, and remote deployment behavior remain unverified.

## 2026-10-01 — Upload filename and quota-cooldown fix

Branch: `fix/upload-name-and-quota-cooldown`. GitHub issue: #2 with the user-supplied bug screenshot. Automated provider requests were mocked; no `.env` value was read and no paid Google call was made.

| Command/check                   | Outcome                                                                                                                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`                 | Passed: TypeScript, zero-warning ESLint, 84 Vitest tests across seven files, and production build.                                                                                          |
| `npm run format:check`          | Passed.                                                                                                                                                                                     |
| `node --check backend/server/index.mjs` | Passed.                                                                                                                                                                                     |
| `npm run check:build`           | Passed: no legacy endpoint, environment-key marker, key-shaped literal, source maps, or historical HTML in `dist`.                                                                          |
| `npm run test:e2e`              | Passed all 12 mocked Chromium workflows in 9.4 seconds. New coverage verifies the long filename's rendered bounds/full-name tooltip and the visible quota cooldown before same-batch retry. |
| `git diff --check`              | Passed before the task commit.                                                                                                                                                              |

The gateway now treats only its sanitized per-minute `rate_limited` category as a long cooldown retry, forwards a usable numeric `Retry-After` with a 120-second cap, and defaults to 60 seconds. The client keeps the existing three-attempt ceiling and lets cancellation interrupt the wait. Successful batches are not artificially delayed. Long upload names stay inside Ant Design's actual drag container and expose the full value in a tooltip.

The production build is approximately 827 kB JavaScript (267 kB gzip) and retains the existing >500 kB chunk warning. The observed live account's quota configuration, other same-project traffic, a paid full-file rerun, additional browsers, production allowance/abuse controls, and external human review remain unverified.

## 2026-10-08 — Vercel translation gateway adapters

Branch: `feat/vercel-translation-gateway`. The existing Vercel frontend returned HTTP 200 while its language route returned Vercel `404 NOT_FOUND` before this change. Automated provider requests were mocked; no `.env` value was read and no paid Google call was made.

| Command/check | Outcome |
| --- | --- |
| `npm run format:check` | Passed. |
| `npm run check` | Passed: TypeScript, zero-warning ESLint, 94 Vitest tests across nine files, and the production build. |
| Node syntax checks | Passed for the local adapter, shared gateway core, Vercel adapter, and both Function entry points. |
| `npm run check:build` | Passed: no legacy endpoint, environment-key marker, key-shaped literal, source maps, or historical HTML in `dist`. |
| `npm run test:e2e` | Passed all 12 mocked Chromium workflows in 12.0 seconds. The first sandboxed attempt could not bind localhost; the permitted rerun passed. |
| `git diff --check` | Passed before the task commit. |

The Vite client now builds at the Vercel root and calls same-origin Function routes. Local Node and Vercel adapters share the same request validation, Cloud Translation model selection, safe error mapping, request-size limits, and bounded rate-limit metadata. Deployment fails closed with `gateway_disabled` unless `TRANSLATION_GATEWAY_ENABLED=true`; the Vercel environment is detected even if `NODE_ENV` is not set as expected. GitHub Actions remains as CI and no longer attempts the retired GitHub Pages deployment.

The production build is approximately 827 kB JavaScript (267 kB gzip) and retains the existing >500 kB chunk warning. The personal fork synchronization, Vercel server-only variables, Firewall rate rule, owner allowance, Google budget/quota controls, explicit enablement, new deployment, live Function smoke test, paid provider behavior, and human translation/timing review remain unverified.

## 2026-10-08 — Responsive feedback and layout containment

Branch: `fix/responsive-feedback-layout`. The owner supplied a production screenshot showing the language-load Alert description collapsed into one-character columns while its retry button consumed the same row. The reproduced Ant Design 6 DOM left about 70 px for `.ant-alert-section` beside a 187 px `.ant-alert-actions` region.

| Command/check | Outcome |
| --- | --- |
| `npm run format:check` | Passed. |
| `npm run check` | Passed: TypeScript, zero-warning ESLint, 94 Vitest tests across nine files, and the production build. |
| `npm run check:build` | Passed: no legacy endpoint, environment-key marker, key-shaped literal, source maps, or historical HTML in `dist`. |
| `npm run test:e2e` | Passed all 13 mocked Chromium workflows in 11.1 seconds. New coverage verifies readable stacked language-error feedback, a contained retry action, the 240 px desktop sidebar minimum, full-width mobile stacking, and no horizontal overflow in major regions at 1024 px and 390 px. |
| `git diff --check` | Passed before the task commit. |

The language-load Alert now uses the inspected icon/section/action structure: readable content on the first row and a full-width wrapping retry button below it. Major app flex/grid children, Ant Design cards and feedback surfaces have scoped minimum-width and wrapping containment. The desktop sidebar uses a 240-384 px responsive width. The responsive audit also found that Ant Design's `Layout` row and zero-width `Content` selectors overrode the intended mobile stack; focused higher-specificity rules now make both sidebar and preview full-width below 640 px. Temporary desktop/mobile screenshots were visually inspected and were not committed.

The production build is approximately 827 kB JavaScript (267 kB gzip) and retains the existing >500 kB chunk warning. Provider traffic was mocked; no `.env` value was read and no paid translation request was made. Firefox, Safari, Edge and human review on additional device sizes remain unverified.

## 2026-10-08 — Modular folder and documentation refactor

Branch: `fix/responsive-feedback-layout`. This local refactor was not pushed or deployed. The professor/Classroom50 `.classroom50.yaml`, `.github/` workflow and `resources/` were not edited. The historical MVP HTML was moved unchanged to `docs/mvp/`; a screenshot generated from a mocked Chromium workflow was added to the README. No `.env` value was read, and no paid provider call was made.

| Command/check | Outcome |
| --- | --- |
| `npm run format:check` | Passed. |
| `npm run check` | Passed: TypeScript, zero-warning ESLint, 108 Vitest tests across nine files, production build and local Markdown-link check across 42 files. |
| `npm run check:build` | Passed: no legacy endpoint, credential/configuration marker, source map or historical HTML in `dist`. |
| Node syntax checks | Passed for the local adapter, gateway core, Vercel adapter and both Function entrypoints. |
| `npm run test:e2e` | Passed all 15 mocked Chromium workflows in 12.9 seconds, including irregular language/translation JSON recovery. The sandbox-only localhost restriction required a permitted rerun. |
| `git diff --check` | Passed before logging; repeat before commit. |

The browser code and tests now live under `frontend/`; the gateway core/local adapter/tests live under `backend/`. Root `api/` remains a pair of thin Vercel entrypoints so same-origin Function discovery continues. The Function adapter now bounds streamed request bytes, the gateway rejects empty translation inputs, and an English-only catalogue cannot mark the language setup ready. Malformed 200 translation JSON is rejected before download; no-op `TranslationProvider.clear()` was removed as obsolete visitor-key-era code.

The build remains approximately 828 kB JavaScript (267 kB gzip) and retains Vite's >500 kB chunk warning. The code audit does not certify absence of every hang or malformed provider case: local upstream fetch has no independent server timeout, provider output size is not capped here, public allowance/rate controls are unresolved, and paid/human language-timing review has not been performed. See `docs/audits/CODE_AUDIT_2026-10-08.md`.

## 2026-10-08 — Correct Features, Stories lecture alignment

The owner supplied the intended *5. Features, Stories* lecture after the refactor. The earlier *Literature Review* PDF was the wrong template for product discovery. I checked the new lecture's persona, scenario, story, feature and creep-audit examples against the current product records. The two owner-supplied personas now use its four-aspect card, and each has a short proposed scenario. Eleven provisional role/action/reason stories trace to eleven activation/input/action/output features. The gap map shows partial outcomes and leaves GitHub issue numbers unclaimed. The creep audit records a real documentation-taxonomy merge and removal of engineering checks from the user-feature list; it does not claim a shipped behavior cut. The owner chose to leave the lecture's third role and scenario TBD. No interview, three human corrections or user validation has been fabricated. AI observation: treating virtualization and automated tests as standalone user features had blurred the earlier inventory. Human surprise and kept/rejected reflection: `TBD - human review required`.

Verification after this documentation edit: `npm run check` passed TypeScript, zero-warning lint, 108 Vitest tests, production build and Markdown links across 45 files. `npm run format:check`, `npm run check:build` and `git diff --check` passed. Browser workflows were not rerun because application code did not change. The existing >500 kB JavaScript-chunk warning remains.

## 2026-10-09 — PR and GitHub backlog preparation

Branch `fix/responsive-feedback-layout` was pushed and [PR #5](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/pull/5) opened against `main`. The local `gh` login token was invalid and the connected GitHub app could read but not write this repository; remote writes used the existing Git credential only for each command, without printing or saving it. Retrospective issues [#6–#16](https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3/issues) cite implementing commits; existing #2 received its missing commit trace. Six open issues (#17–#22) keep unverified work open. [Backlog index](docs/planning/BACKLOG.md) records the scope and limits.

| Command/check | Outcome |
| --- | --- |
| `npm run format:check` | Passed. |
| `npm run check` | Passed: TypeScript, zero-warning ESLint, 108 Vitest tests, production build and local Markdown links. |
| `npm run check:build` | Passed: no legacy endpoint, credential marker, source map or historical HTML in `dist`. |
| `npm run test:e2e` | Passed all 15 mocked Chromium workflows after a sandbox-only localhost `EPERM` on the first attempt. |
| `npm run check:docs` | Passed after the backlog documentation edits: local Markdown links resolve across 46 files. |
| `git diff --check` | Passed after the backlog documentation edits; repeat on the staged diff. |

The initial PR `verify` workflow passed on the published branch before the backlog documentation commit. Its final CI/merge result and the deployed Vercel state must be checked separately. This run made no paid provider request and did not read `.env`.
