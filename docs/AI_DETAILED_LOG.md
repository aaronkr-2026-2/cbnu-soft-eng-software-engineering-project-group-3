# AI Collaboration Log

Use the exact entry structure required by the course guide. Add an entry at every milestone and after every material AI-assisted code, configuration, dependency, test, architecture, deployment, or requirements change. Be honest; do not backfill invented reflections.

## [Milestone name] — [Date]

**Tool(s) used:**

**What I asked for:**

**What I kept as-is:**

**What I changed or rejected, and why:**

**Something the AI got wrong that I had to catch:**

---

## Standalone MVP baseline review — 2026-09-15

**Tool(s) used:** Claude (exact Claude product/model not provided); ChatGPT/Codex (documentation review)

**What I asked for:** Claude was asked to build a standalone HTML/CSS/JavaScript SRT translator with a 20/80 dual-column UI, sentence grouping, Google Translate/Gemini selector, progress, subtitle formatting, error handling, and download. ChatGPT/Codex was asked to inspect the resulting file against the written description and course documents.

**What I kept as-is:** The submitted baseline contains a modular parser, sentence grouper, provider registry, translated-word splitter, formatter, progress UI, card renderer, and SRT download. Which parts the team intentionally accepted without changes is TBD - human review required.

**What I changed or rejected, and why:** No MVP source code was changed during this documentation review. The team must fill in any earlier Claude suggestions it rejected or modified; that history was not provided and must not be invented.

**Something the AI got wrong that I had to catch:** The `google-gemini` option is only another instance of the Google Translate provider. The reviewed file also lacks the described `StatsManager` and Started/API calls/Finished panel. It contains duplicated statements, uses an undocumented translation endpoint, and its universal six-word/proportional-split heuristics are not defensible as general subtitle rules.

## Requirements, architecture, and semester plan baseline — 2026-09-15

**Tool(s) used:** ChatGPT/Codex

**What I asked for:** Read three course PDFs and the standalone MVP; research feasibility of Google Translate, Gemini, subtitle readability, browser background execution, Firebase statistics/storage, movie metadata, React/TypeScript/Ant Design, linting, CI/CD, and GitHub Pages; create complete project documentation, weekly milestones, cross-model memory, and the mandatory AI-log rule without inventing facts.

**What I kept as-is:** TBD - human review required. The generated pack is a draft until the team confirms it and copies/merges it into the actual repository.

**What I changed or rejected, and why:** TBD - human review required. The draft deliberately separates confirmed requirements from proposals/open questions and keeps high-risk Firebase/storage/lives/metadata work out of the protected semester core.

**Something the AI got wrong that I had to catch:** The AI could not authenticate to the supplied GitHub repository, so repository-specific state could not be verified. The documentation explicitly limits its code claims to the attached `srt-translator-beta-3.html`; the team must reconcile the pack with the repository before treating it as current.

## Solo scope and Firebase storage cost review — 2026-09-16

**Tool(s) used:** ChatGPT/Codex; official Firebase, Google Cloud, and Cloudflare documentation

**What I asked for:** Clarify feasibility of the Firebase free tier for this solo project, student offers, storing every translated SRT, and using Firestore telemetry with separate cheaper file storage.

**What I kept as-is:** TBD - human review required. The user's solo-project clarification is recorded as confirmed; storage/billing recommendations remain proposals.

**What I changed or rejected, and why:** Documentation records solo ownership, current quotas and student offers, sample storage arithmetic, Firebase versus R2 trade-offs, and unresolved cost/collection choices. No application code or cloud configuration was changed. Human acceptance/rejection of the recommendations is TBD.

**Something the AI got wrong that I had to catch:** Human reflection is TBD. During this follow-up, the AI corrected its earlier unsupported duplicate-statement finding: direct source inspection shows no duplicated return, progress-width statement, or target-header statement at the cited locations. The earlier claim is superseded; no source-code fix was required.

## Telemetry-only cloud scope — 2026-09-16

**Tool(s) used:** ChatGPT/Codex

**What I asked for:** Remove completed SRT storing for now; collect telemetry such as user location, target language, and translated movie identity.

**What I kept as-is:** The user's explicit decision retains telemetry and defers completed-file storage. Local download remains in the product. Any further human reflection is TBD - human review required.

**What I changed or rejected, and why:** The user deferred completed SRT storage. Documentation removes active storage/reuse milestones and cloud file architecture, records ADR-001, updates AI memory, and limits telemetry to approved dimensions with a proposed minimal event envelope. Location precision/method and retention remain open. No application code or Firebase configuration was changed.

**Something the AI got wrong that I had to catch:** TBD - human review required. No new human-reported AI error was provided; do not invent one.

## Country-and-city telemetry decision — 2026-09-16

**Tool(s) used:** ChatGPT/Codex

**What I asked for:** Confirm that location telemetry should include country and city.

**What I kept as-is:** The telemetry-only boundary, target-language and movie fields, local SRT download, and deferred completed-file storage/reuse remain unchanged. Further human reflection is TBD - human review required.

**What I changed or rejected, and why:** Documentation now treats country-and-city precision as confirmed. The acquisition method, behavior when location is unavailable, retention, deletion, and user-facing collection controls remain open because the user did not select them. No application code or Firebase configuration was changed.

**Something the AI got wrong that I had to catch:** TBD - human review required. No new human-reported AI error was provided; do not invent one.

## Provider funding, subtitle UX, and formatting specification — 2026-09-16

**Tool(s) used:** ChatGPT/Codex; official Google Gemini API, Google Cloud Translation, Netflix timed-text, TMDB, IMDb, Rotten Tomatoes, and Chrome lifecycle documentation

**What I asked for:** Add visual grouping for connected subtitle blocks and hover/edit states; start an elapsed timer and warn users to keep the tab active; determine whether visitors can use their own Gemini/Google account or API key; explain Gemini prompting/context, Cloud Translation cost/quota, exact subtitle readability rules, mandatory multi-speaker line breaks, and official movie-metadata routes; make secret handling non-negotiable.

**What I kept as-is:** The existing React migration, provider abstraction, local SRT processing/download, telemetry-only cloud boundary, editable translated cues, and checkpoint/resume direction remain. Human acceptance of the detailed defaults is TBD - human review required.

**What I changed or rejected, and why:** Documentation now requires visitor-funded, session-memory-only credentials; rejects consumer Google login/subscriptions as API billing; replaces an endless Gemini chat with stateless bounded structured batches using `store: false`; replaces proportional word splitting and universal six-word wrapping with cue-preserving speaker boundaries, at most two lines, a default 42-visible-grapheme line cap, and CPS warnings; defines group spacing/labels, paired hover/edit highlighting, an elapsed timer, and an active-tab warning. It also records TMDB external-ID lookup/IMDb licensed API and rejects Rotten Tomatoes scraping. No application code, provider account, or cloud configuration was changed.

**Something the AI got wrong that I had to catch:** TBD - human review required. No new human-reported AI error was provided; do not invent one.

## Google Cloud Translation development key setup — 2026-09-17

**Tool(s) used:** ChatGPT/Codex; official Google Cloud setup, authentication, API-key, quota, pricing, and budget documentation.

**What I asked for:** Provide step-by-step instructions to obtain an official Google Translate API key for development of the planned React app, and update AI_LOG.md.

**What I kept as-is:** TBD - human review required. Existing visitor-funded, memory-only credential requirements and application source were preserved.

**What I changed or rejected, and why:** Added docs/guides/GOOGLE_TRANSLATE_SETUP.md, linked it from docs/guides/PROVIDER_AUTH_AND_COST.md, and reconciled PROJECT_STATE.md with local repository evidence. The guide covers billing/API setup, restricted Basic v2 keys, development quotas, budget alerts, and the future local browser test. No Google resources were configured and no key or paid API call was used. Human acceptance/rejection of the setup recommendations is TBD - human review required.

**Something the AI got wrong that I had to catch:** TBD - human review required. No human-reported error was supplied. The credential field and browser compatibility test are explicitly recorded as pending, not implemented or passed.

## Trial billing and missing Translation API troubleshooting — 2026-09-17

**Tool(s) used:** ChatGPT/Codex; official Google Cloud trial, billing, payment-method, and Translation setup documentation.

**What I asked for:** Explain whether recovering a reported signup payment or removing a card affects the $300 trial, and help configure a key when only Google Cloud APIs appears in the restriction picker.

**What I kept as-is:** TBD - human review required. The official Basic v2 direction, visitor funding, and session-memory-only key design remain unchanged.

**What I changed or rejected, and why:** Expanded docs/guides/GOOGLE_TRANSLATE_SETUP.md with conditional billing troubleshooting and same-project API enablement/restriction steps. Updated PROJECT_STATE.md to record user-reported trial activation and the subsequent confirmation that the signup amount is on hold, consistent with a verification authorization; API setup remains unverified. No billing, refund, key, or application operation was performed. Human acceptance/rejection is TBD - human review required.

**Something the AI got wrong that I had to catch:** TBD - human review required. The user confirmed that the amount is on hold. Its actual release has not been verified; no account-specific refund guarantee is recorded.

## Local development credential file protection — 2026-09-17

**Tool(s) used:** ChatGPT/Codex; local filesystem metadata and Git checks.

**What I asked for:** Report completed Google Cloud project/key setup and a local environment variable named GOOGLE_TRANSLATE_API_KEY, in preparation for the React migration.

**What I kept as-is:** TBD - human review required. The credential file contents were not read or modified; the memory-only visitor credential design remains unchanged.

**What I changed or rejected, and why:** Added .gitignore rules for local environment files and the mentioned .nev spelling, allowing a future placeholder-only .env.example. Updated PROJECT_STATE.md and docs/guides/GOOGLE_TRANSLATE_SETUP.md to distinguish reported credential preparation from a working integration. The existing .env was untracked and previously not ignored. No key was printed, used in a request, or included in the app. Human acceptance/rejection is TBD - human review required.

**Something the AI got wrong that I had to catch:** TBD - human review required. Key validity and restrictions remain unverified; no successful provider test is claimed.

## React migration plan and provider distinction — 2026-09-17

**Tool(s) used:** ChatGPT/Codex; official Cloud Translation and Gemini documentation; local repository inspection.

**What I asked for:** Plan the React migration and official Google Translate integration, and explain whether Cloud Translation also calls Gemini for translation.

**What I kept as-is:** TBD - human review required. The accepted stack, visitor-funded session credentials, subtitle requirements, and deferred cloud storage remain unchanged.

**What I changed or rejected, and why:** Added docs/requirements/REACT_MIGRATION_PLAN.md with ordered issues, acceptance checks, credential boundaries, user participation, and unresolved decisions. Linked the plan from PROJECT_STATE.md and docs/planning/SEMESTER_PLAN.md and clarified provider/model and welcome-credit distinctions in docs/guides/PROVIDER_AUTH_AND_COST.md. The plan proposes Basic v2 NMT first and a separate future Gemini adapter. No application implementation, credential reading, or paid API calls occurred. Human acceptance/rejection is TBD - human review required.

**Something the AI got wrong that I had to catch:** TBD - human review required. No human-reported error was supplied. Planning, mocked verification, live browser authentication, and deployment are distinguished; none is claimed complete without evidence.

## React migration and official Cloud Translation implementation — 2026-09-17

**Tool(s) used:** ChatGPT/Codex; local Git/npm; TypeScript, ESLint, Prettier, Vitest/Testing Library, Playwright; official Google Cloud, Vite, React, Ant Design, and GitHub documentation.

**What I asked for:** Implement and continue the React migration and official Google Translate integration; keep the credential out of Git; update the AI log. During implementation the user selected hidden Statistics, required Adult/Children profile selection, a 5 MiB UTF-8 SRT limit, current desktop browser targets, and balanced i/b/u-only formatting.

**What I kept as-is:** TBD - human review required. Factual preservation: the original HTML remains unchanged, with local mvp-baseline tag at b64bc59. The visitor-funded credential boundary and deferred cloud-file/telemetry scope are retained.

**What I changed or rejected, and why:** TBD - human review required. Implementation supplied for review: locked React/TypeScript/Vite/Ant Design app, pure SRT and subtitle modules, official Basic v2 NMT adapter, volatile credential testing, batching/response validation, cancellation/retry, cue editing/quality warnings/download, and CI/Pages configuration. Added solo Agile/sprint documents, ADR-003 and BUILD_LOG; updated README, PROJECT_STATE, setup, requirements, architecture, semester plan, and open decisions. Local clean install, typecheck/lint, 56 tests, formatting, production build/artifact checks pass; four mocked Chromium browser flows pass under the Pages subpath. No real key was read or used and no commit/push/deployment occurred. Gemini, reload checkpoints, full multilingual grammar analysis, other-browser/live API verification, remote issues/CI/Pages, and human review remain pending. Build size warning is documented.

**Something the AI got wrong that I had to catch:** TBD - human review required. No human-reported implementation error was supplied. AI-detected failures and fixes are recorded separately in BUILD_LOG, including stale development-server assets, icon accessibility names, sidebar shrinking, test-query typing, Node script lint configuration, and mismatched build/preview subpaths. These are not fabricated human reflections.

## Product vision and documentation workflow review — 2026-09-17

**Tool(s) used:** ChatGPT/Codex; local repository documentation inspection.

**What I asked for:** Confirm that the project updates its agent instructions, project state, AI log, and affected documentation after updates; add a structured product vision to the README for tech-savvy movie viewers facing a language barrier.

**What I kept as-is:** TBD - human review required. `AGENTS.md` remains the canonical AI working agreement; `CLAUDE.md` and `GEMINI.md` already point to it without conflicting rules. Its required read order and its rule to update project state, affected documentation, and AI_LOG after every material change remain in force.

**What I changed or rejected, and why:** Added the requested structured vision to README.md and aligned PROJECT_STATE.md and PRODUCT_REQUIREMENTS.md with the intended audience and connected-conversation differentiator. The vision is limited to a product direction: the current Basic v2 NMT implementation still sends one string per cue and does not claim cross-cue semantic context. The product avoids proportional word redistribution and preserves visible continuation groups/speaker boundaries today; a future Gemini adapter requires separate validation before it can provide context-aware group translation.

**Something the AI got wrong that I had to catch:** TBD - human review required. No human-reported error was supplied. The comparison is framed as the product's intended difference and does not assert unverified details about the alternative service.

## Documentation reconciliation and feature-branch publication — 2026-09-17

**Tool(s) used:** ChatGPT/Codex; local Git and GitHub remote.

**What I asked for:** Continue the requested README/product-vision work, verify the documentation-update workflow, update today's logs, and push the updates to remote origin.

**What I kept as-is:** TBD - human review required. The canonical AGENTS.md workflow and model pointers remain unchanged because they already require PROJECT_STATE.md, affected documentation, and AI_LOG.md updates after every material change.

**What I changed or rejected, and why:** Reconciled README.md, PROJECT_STATE.md, PRODUCT_REQUIREMENTS.md, BUILD_LOG.md, and this log with the completed React migration evidence and product vision. Staged files were checked for ignored credential files/key-shaped values, committed as the React migration increment, and published to origin/feat/react-official-translate. The product is not represented as deployed and no pull request was created.

**Something the AI got wrong that I had to catch:** TBD - human review required. The first published commit left older local-evidence language saying no push had occurred. This follow-up corrects that documentation before the final branch update.

## Ignore rules and AI-log Markdown readability — 2026-09-17

**Tool(s) used:** ChatGPT/Codex; local repository inspection.

**What I asked for:** Populate the Git ignore file with appropriate project files/folders and fix the AI-log formatting that GitHub rendered as one large block.

**What I kept as-is:** TBD - human review required. Existing protection for `.env`, `.env.*`, `.nev`, node_modules, production output, test artifacts, and `.env.example` was retained.

**What I changed or rejected, and why:** Added targeted ignores for local service-account credential filenames, package-manager/tool caches, Playwright blob reports, logs, and IDE/OS files. Reworked the Markdown structure so each course-required AI-log field is separated by a blank line. VS Code extension/settings files remain eligible for version control because they can be shared project configuration.

**Something the AI got wrong that I had to catch:** TBD - human review required. No human-reported AI error was supplied. The prior adjacent field lines were valid Markdown source but were not separated into paragraphs, so GitHub displayed them as a single block.

## Translation feasibility, pricing, and product-gap review — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; local source/Git inspection; official Google Cloud and Gemini documentation; the named competitor's own product page and explanation for its published claims only.

**What I asked for:** Explain visitor API keys, official translation models, free tiers, welcome credits, prices, context/prompting, competitor speed/free access, and the app's current estimate; assess feasibility and plan corrections to the intended upload-to-quality-subtitle experience.

**What I kept as-is:** TBD - human review required. Application code, local credentials, ADR-002 visitor funding, and canonical agent/model instructions are unchanged.

**What I changed or rejected, and why:** TBD - human review required. Added docs/TRANSLATION_FEASIBILITY_REVIEW.md with verified code gaps and a proposed sequence for funding choice, quality benchmarking, context/cue alignment, measured performance, and release evidence. Updated PROJECT_STATE.md, docs/guides/PROVIDER_AUTH_AND_COST.md, and docs/requirements/REACT_MIGRATION_PLAN.md to distinguish the implemented NMT port from the incomplete product vision and to record current Basic v2 TLLM support. Corrected the assumption that movie duration determines request fit. Documentation-only verification uses git diff --check and local link checks; no new application-test or live-provider success is claimed. No credential contents were read, paid calls made, or changes pushed.

**Something the AI got wrong that I had to catch:** The user reported that the project's functionality does not match their plan. Inspection confirms that the port's visual continuation groups do not provide conversation context to the provider and that formatting does not perform semantic cue alignment. Any additional human reflection is TBD - human review required.

## Owner-funded NMT/TLLM gateway and documentation cleanup — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; local source, Git, Node/npm, Vitest, Playwright, and official Google Cloud research already recorded in the feasibility review.

**What I asked for:** Remove Gemini Developer API and visitor API keys from the product, use only NMT/TLLM with the owner project key in `.env`, clean obsolete project records, move the MVP, remove `.DS_Store`, and create short and detailed AI logs.

**What I kept as-is:** TBD - human review required. The original MVP remains preserved at `docs/mvp/srt-translator-beta-3.html`; local subtitle processing, telemetry-only cloud scope, and the ignored credential boundary remain.

**What I changed or rejected, and why:** Added ADR-004, a local Node gateway that reads `GOOGLE_TRANSLATE_API_KEY` outside Vite, NMT/TLLM UI selection, gateway tests/mocks, `.env.example`, and gateway setup documentation. Moved the detailed AI history to this file and replaced the root AI log with short entries. Removed tracked `.DS_Store`, obsolete PROJECT.md, and the Gemini prompt contract; moved the MVP from the repository root. Updated current-state, requirements, architecture, plan, course, sprint, setup, and provider records. `npm run check`, formatting, Node syntax check, and four mocked Chromium flows passed. No `.env` value was read or used.

**Something the AI got wrong that I had to catch:** The earlier direct-browser implementation did not meet the requested owner-funded design. The new gateway keeps the key out of the browser, but it has not yet been live-tested or deployed. Human review of model quality, budget, rate limiting, abuse controls, and production host is TBD - human review required.

## Local gateway environment-name alignment — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; redacted local environment-variable-name inspection; local source/documentation checks.

**What I asked for:** Reflect the updated local `.env` configuration.

**What I kept as-is:** TBD - human review required. `.env` remains ignored, no value was printed, and the browser key-exposure boundary remains unchanged.

**What I changed or rejected, and why:** Changed the local gateway and current setup/state/provider documentation to use the configured `GOOGLE_CLOUD_API_KEY` name instead of the obsolete `GOOGLE_TRANSLATE_API_KEY` name. Confirmed the non-secret project-ID variable is present. The TLLM location is not configured in `.env`, so the documented/server default `us-central1` remains in use. Updated the build artifact check to detect either key-name marker.

**Something the AI got wrong that I had to catch:** The earlier gateway configuration expected a different variable name from the developer's actual `.env`. No credential value, live API result, or billing result was inspected; human review is TBD - human review required.

## Seoul TLLM-location default — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; official Google Cloud documentation and local configuration/source inspection.

**What I asked for:** Make the TLLM location close to Seoul and push the changes.

**What I kept as-is:** TBD - human review required. The configured key/project values remain private and no live provider request was made.

**What I changed or rejected, and why:** Set the local gateway and `.env.example` default to `asia-northeast3`, Google's Seoul Cloud region. Updated setup/current-state records and the short log. Google's TLLM guide uses a configurable technical region but does not publish a Seoul-specific availability assertion in the reviewed page, so this is a requested default, not a verified TLLM-availability claim.

**Something the AI got wrong that I had to catch:** TBD - human review required. The live Check service result remains required to confirm this model/region/project combination.

## Local 502 diagnosis and development command fix — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; local application, gateway, Vite configuration, and npm-script inspection.

**What I asked for:** Explain the local `Google returned HTTP 502` Check service error and the gateway-help text.

**What I kept as-is:** TBD - human review required. The key remains outside Vite/browser code, and no credential value or live provider response was inspected.

**What I changed or rejected, and why:** The 502 was diagnosed as the Vite client running without its local gateway because `npm run dev` previously started only Vite. Added a development launcher that starts both processes, changed `npm run dev` to use it, retained `npm run dev:client` only for client-only work, and added a clear 502 recovery message. Rewrote the UI explanation in plain language: no visitor key is needed, and Check service makes a tiny translation test that may count a few characters. Updated README, setup, project state, and both logs.

**Something the AI got wrong that I had to catch:** The earlier setup documentation told the developer to start two terminals while the primary `npm run dev` command still started only one process. Human review of the live provider result is TBD - human review required.

## Live Cloud Translation diagnosis and TLLM location correction — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; official Google Cloud Translation and API-key documentation; redacted local live requests.

**What I asked for:** Explain why the local gateway reported Google request failures.

**What I kept as-is:** The provider key and project ID remain ignored and were never printed, logged, committed, or sent to the browser. The two-engine NMT/TLLM product decision remains unchanged.

**What I changed or rejected, and why:** Google reported that the initial key request was blocked because it had no HTTP referrer; the gateway is server-to-server, so the developer must not use a Websites application restriction for this local server key. After that restriction was corrected, a minimal NMT request succeeded. TLLM failed at the requested `asia-northeast3` (Seoul) location with `400 Invalid Value`, while the same minimal request succeeded at `us-central1`. Changed the gateway and example configuration default to `us-central1`. Also stopped passing the full TLLM model resource to the Basic v2 languages endpoint because Google rejected that value; the picker uses the NMT language catalogue and the TLLM Check service performs the real model request. Updated state and setup records.

**Something the AI got wrong that I had to catch:** The earlier requested Seoul default was applied before live availability was confirmed. It was not a working TLLM configuration. Human review of translation quality, realistic-file cost, and production controls is still TBD - human review required.

## Safe live-gateway failure diagnostics — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; local source/test inspection; official Google Cloud quota documentation; redacted minimal live provider request.

**What I asked for:** Explain why a TLLM job stopped after partial progress and distinguish visible browser requests from the private provider credential.

**What I kept as-is:** The browser continues to call only the project gateway. The key and the gateway-to-Google request remain server-side. A failed job still preserves completed cues in the current tab for an explicit remaining-cues retry.

**What I changed or rejected, and why:** Source inspection found that one failed batch stops the sequential job and the old client reduced every 403 to one generic message. Added a server-generated, allowlisted failure category for key restriction, billing, API enablement, quota, rate limiting, invalid request, or general access denial. The client maps only those category names to fixed messages, so it never displays arbitrary upstream text. The gateway terminal records only HTTP status and category, never subtitle text, request bodies, provider messages, keys, or project identifiers. A direct minimal TLLM request succeeded at the current configuration, so this does not claim that a particular subtitle batch or the full job is healthy.

**Something the AI got wrong that I had to catch:** A prior generic 403 message was insufficient evidence to call the partial-job failure a Google DDoS control. Google documents quota errors separately; the exact category must be captured from the failed batch. Human review of the resulting category and any TLLM timeout/batch-size adjustment is TBD - human review required.

## Expanded repository demonstration subtitle — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; local fixture and repository-state inspection.

**What I asked for:** Replace the very short demonstration SRT with a more realistic full-length movie subtitle file if appropriate.

**What I kept as-is:** The developer's downloaded full subtitle file remains a local manual stress-test input. It was not moved, uploaded, or added to Git.

**What I changed or rejected, and why:** Replaced the previous three-cue repository fixture with a 40-cue original fictional SRT. It includes realistic timing, multiline text, two-speaker cues, sound descriptions, and all three supported formatting tags. Rejected committing the complete third-party movie subtitle because a public repository fixture should be independently reusable and should not distribute a complete external subtitle work.

**Something the AI got wrong that I had to catch:** The earlier three-cue fixture was too small to demonstrate the normal subtitle review experience. It has been expanded, but it is still not a substitute for controlled local stress and quality testing on a full file. Human review is TBD - human review required.

## Full-file UI responsiveness and context-strategy correction — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; local React/job/domain inspection; official Google Cloud Translation method, model, and quota documentation.

**What I asked for:** Investigate a white-screen/freeze during a full NMT run and determine whether visual continuation groups are sent as translation context.

**What I kept as-is:** NMT/TLLM provider calls keep the existing stable one-input/one-result mapping. Completed cues remain in the current tab after a failed job, and no whole-movie request or proportional target-text split was introduced.

**What I changed or rejected, and why:** Confirmed that the UI previously rendered every cue pair and reevaluated every cue row after each batch, while the job could immediately begin the next batch before a browser paint. Memoized cue rows, used a `Set` for active IDs, added browser containment for off-screen cue cards, and yielded after each batch. Changed UI/provider wording so TLLM is no longer presented as contextual when the request still contains separate cue strings. Added proposed ADR-005: NMT remains the reliable independent-cue baseline; a contextual TLLM path requires a bounded group, a provider-preserved structural mapping, validation, and a human-reviewed benchmark before enabling it.

**Something the AI got wrong that I had to catch:** The visual continuation-group treatment was previously easy to mistake for provider context. Source inspection proved it did not alter the `q` request array. The current performance work improves rendering but does not prove the large-file white screen is fully resolved; human stress testing is TBD - human review required.

## Ant Design shell and component standard — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; the user-supplied Ant Design component reference; local React, CSS, documentation, and test inspection.

**What I asked for:** Replace unnecessary generic `div`-plus-CSS application structure with Ant Design layout components and record Ant Design as the UI standard for future work.

**What I kept as-is:** The subtitle editor's product-specific paired-cue structure, semantic text rendering, editing behavior, continuation labels, and off-screen rendering containment remain. These do not have an equivalent ready-made Ant Design component.

**What I changed or rejected, and why:** Replaced the page shell with Ant Design `Layout`, `Header`, `Sider`, and `Content`; replaced generic action/form arrangements with `Flex`; and changed original/translated cue surfaces to Ant Design `Card`. Added `docs/guides/UI_COMPONENT_GUIDE.md` and made it part of the required AI read order. Kept focused CSS only for visual identity, responsive behavior, and subtitle-specific interaction/performance needs. `npm run check` passed TypeScript, ESLint, 59 Vitest tests, and the production build; `npm run format:check` passed; and `npm run test:e2e` passed all four Chromium workflows. The build retains the pre-existing Vite warning for a JavaScript chunk above 500 kB.

**Something the AI got wrong that I had to catch:** The existing React port used Ant Design controls but did not use its layout primitives for the application shell. The user identified this mismatch. Human review of the final visual layout is TBD - human review required.

## Sidebar spacing and long-list rendering — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; local React/CSS inspection, `@tanstack/react-virtual`, Vitest, and Playwright.

**What I asked for:** Add visible vertical space between sidebar controls, confirm whether cue surfaces use Ant Design, and prevent blank cue cards during rapid scrolling through a full subtitle file.

**What I kept as-is:** Original and translated cue surfaces remain Ant Design `Card` components. Cue editing, quality warnings, local output, and active-cue follow behavior remain intact.

**What I changed or rejected, and why:** Increased the sidebar's flex gap to 20 px. Rejected the prior `content-visibility: auto` approach because it deferred off-screen drawing and produced visible blank cards during rapid scrolling. Added `@tanstack/react-virtual` for measured, variable-height cue virtualization with an eight-row overscan buffer. An editing row remains in the rendered range to preserve an unsaved draft. Added a 2,500-cue Chromium test that checks the final cue after a bottom scroll while fewer than 40 rows are mounted. `npm run check`, `npm run format:check`, and all five Chromium browser tests passed. The production bundle remains above Vite's 500 kB warning threshold.

**Something the AI got wrong that I had to catch:** The first long-list browser assertion used an ambiguous accessible-label query because the cue section and both cards include the cue number. The test now targets the cue section's `region` role. This was a test-selector correction, not an application failure. Human testing on the developer's full local SRT is still required.

## Compact sticky translator layout and cost explanation — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; local React/CSS and request-estimate inspection; Vitest; Playwright.

**What I asked for:** Reduce header/body whitespace, remove the `YOUR WORKSPACE` label, fix absent sidebar spacing, keep loaded-file progress/download actions at the desktop sidebar bottom, make the NMT cost card understandable, and use a compact sticky subtitle-preview header with source/translation labels.

**What I kept as-is:** The 20/80 desktop split, official NMT/TLLM selection, existing request calculation, translation/edit/download behavior, and responsive mobile layout remain. TLLM is not given an invented cost estimate.

**What I changed or rejected, and why:** Removed the `YOUR WORKSPACE` label; reduced header height and content padding; and moved the sidebar flex layout to Ant Design's rendered `.ant-layout-sider-children` wrapper, which corrects the previously invisible gap. It now gives controls a 20 px vertical rhythm. The initial sticky bottom-region attempt overlaid the configuration controls in a visual check, so the final layout separates a scrollable controls area from the stationary cost, Start/Cancel, progress, Download, and Reset region. The content title is the centered, compact, sticky `Subtitle preview`, with source/translation labels directly below; the former marketing headline is removed. Replaced the estimate's unexplained numbers with a whole-file NMT total, character count, request count, explicit non-per-request explanation, and a three-attempt ceiling. Added structural rules and requirements. `npm run check`, `npm run format:check`, and all five Chromium tests passed; the browser test covers the new CSS/wording. The build still has Vite's existing JavaScript chunk warning above 500 kB.

**Something the AI got wrong that I had to catch:** The previous 20 px gap was added to the outer `Sider`, but Ant Design wraps supplied children in an internal element; the rule did not produce the intended visible spacing. The corrected selector targets the rendered wrapper. Human visual review at the developer's screen size is still TBD - human review required.


## Wider cue cards and scrollable cost explanation — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; local React/CSS inspection; Vitest; Playwright; generated loaded-file screenshot inspection.

**What I asked for:** Remove the estimate from the stationary sidebar region, add bottom breathing room to scrollable settings, remove shadows, and maximize subtitle-card width by removing the vertical rail and excess horizontal padding.

**What I kept as-is:** The stationary action region continues to expose Start/Cancel, progress, Download, and Reset. Card pairing, continuation labels, virtual scrolling, and accessible status information remain unchanged.

**What I changed or rejected, and why:** Moved the cost estimate and estimate error into the scrollable settings area and added 36 px bottom padding. Removed the action-region shadow. Reduced content-side padding to 6 px, removed the cue-row left border and left padding, and removed column-label side padding so paired cards use more of the content pane. The Playwright test verifies that the estimate is in `.sidebar-controls`, absent from `.sidebar-actions`, and that cue rows have no left border. `npm run check`, `npm run format:check`, and five Chromium workflows passed. A generated loaded-file screenshot confirmed the final arrangement.

**Something the AI got wrong that I had to catch:** The first stationary sidebar design placed the estimate there, which made the action panel unnecessarily tall. The user requested that it return to scrollable settings. Human visual review at other screen sizes remains TBD - human review required.


## Compact header and contextual help — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; local React/CSS inspection; Ant Design `Modal` and `Popover`; Vitest; Playwright; generated screenshot inspection.

**What I asked for:** Remove the header and sidebar introductory text, reduce header size, add a question-mark workflow help modal, and replace the service-card paragraph with a compact help popover.

**What I kept as-is:** The header retains product identity, theme switching, and a repository link. The Check service action and its safety/usage explanation remain available. No provider credential is added to the browser.

**What I changed or rejected, and why:** Reduced the header to 52 px, removed its marketing subtitle and redundant mode label, and made its controls compact. Added an accessible question-mark button that opens a modal explaining upload, configuration, translation, review/editing, download, and the active-tab limitation. Removed `Translate subtitles` and `English in. Your language out.` in favor of `Select your English subtitle` above the picker. Replaced the service-card paragraph with a question-mark `Popover` that opens on hover or click. `npm run check` and five Chromium browser workflows passed. The browser test opens both help surfaces; a generated screenshot was inspected.

**Something the AI got wrong that I had to catch:** The prior explanatory text used permanent screen space even though the user only needs it when deciding how to use the app. It is now available through explicit help controls. Human review of the final wording is TBD - human review required.


## Local commit completion rule — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; local Git and repository-rule inspection.

**What I asked for:** Make a local Git commit automatic after every completed file-changing prompt, then record the policy in the project rules and logs.

**What I kept as-is:** Existing one-logical-change-per-commit, secret-protection, review, and explicit remote-publishing rules remain.

**What I changed or rejected, and why:** Added the completion-commit requirement to `AGENTS.md` and `docs/DEVELOPMENT_RULES.md`; added the expected commit hash to the task report; and recorded the policy in project state and the short AI log. The rule requires documentation and verification first, Git-status inspection before staging, and one local commit for the completed logical change. It explicitly rejects automatic pushes, merges, rebases, resets, history rewriting, and committing ignored/generated/unrelated files.

**Something the AI got wrong that I had to catch:** Earlier completed prompts left verified local work uncommitted. The user identified that the repository workflow needed an explicit completion rule. The policy applies from this task forward; human review of commit grouping remains TBD - human review required.

## Theme cue and compact help surfaces — 2026-09-18

**Tool(s) used:** ChatGPT/Codex; local React/CSS and Playwright inspection; Ant Design `Switch`, `Tooltip`, `Modal`, and `Popover`.

**What I asked for:** Make the top-right theme switch self-explanatory, remove the workflow modal's Cancel button, and make the service-check question-mark help compact.

**What I kept as-is:** The compact header, dark-theme state, help content, service-check action, and owner-funded gateway boundary remain unchanged.

**What I changed or rejected, and why:** Added sun/moon icons to the Ant Design switch and a tooltip that states the next theme. Replaced the modal's default two-action footer with a single explicit `OK` button. Kept the service explanation but gave its popover content a 210 px maximum width so it reads as a small help surface. `npm run check`, `npm run format:check`, and five Chromium browser workflows passed; the browser test covers the missing Cancel action and compact popover width. The production build retains Vite's existing JavaScript-chunk warning above 500 kB.

**Something the AI got wrong that I had to catch:** The compact header initially provided a small theme switch without clearly showing its purpose, and the default modal footer exposed an unnecessary Cancel button. The user identified both usability issues. Human visual review across target screen sizes remains TBD - human review required.

## Joined-speech revision verification and GitHub preparation — 2026-10-01

**Tool(s) used:** ChatGPT/Codex; local Git/npm; TypeScript; ESLint; Prettier; Vitest; Playwright Chromium.

**What I asked for:** Push the current code to GitHub.

**What I kept as-is:** The current React/Ant Design interface, owner-funded gateway boundary, joined-speech behavior for NMT/TLLM, approximate cue redistribution, user edits, and unresolved production/live-quality limits remain. The ignored `.env` and provider credentials were not read, staged, logged, or sent to automated tests.

**What I changed or rejected, and why:** Verified the complete current worktree before publication. Fixed the stale 40-cue assertion for the now 43-cue demo, made the fixture path work under jsdom, and preserved the separator between a leading speaker hyphen and a protected annotation. Updated browser assertions to validate the full provider payload, per-cue failure display, and cue-text conservation after SRT download. `npm run check` passed typecheck, zero-warning lint, 83 tests, and the production build; `npm run format:check` passed; and all 10 mocked Chromium workflows passed. The existing bundle-size warning remains documented.

**Something the AI got wrong that I had to catch:** The initial publication check found stale test expectations for the expanded fixture, the complete gateway payload, per-cue error count, and raw-SRT conservation. These were corrected before publication. Human translation/timing review and production deployment evidence remain TBD - human review required.

## Upload filename containment and Google quota cooldown — 2026-10-01

**Tool(s) used:** ChatGPT/Codex; local Git/npm; TypeScript; ESLint; Prettier; Vitest; Playwright Chromium; official Google Cloud Translation quota/troubleshooting documentation; GitHub issue/PR workflow.

**What I asked for:** Follow the lecture workflow for a long uploaded filename that escaped its card and a full-file translation that stopped after Google reported a per-minute quota limit: create an issue with the screenshot, implement on a branch, record the work, and prepare a pull request.

**What I kept as-is:** Both NMT and TLLM still use the shared joined-speech pipeline, sequential batches, stable cue mapping, local redistribution, existing edits, original cue order/timecodes, the owner-funded gateway boundary, and a maximum of three attempts per submitted batch. No concurrency, cloud subtitle persistence, credential exposure, live paid request, or arbitrary delay after every successful batch was added.

**What I changed or rejected, and why:** Created GitHub issue #2 with the supplied screenshot and acceptance criteria on branch `fix/upload-name-and-quota-cooldown`. Constrained Ant Design's rendered upload drag container, clamped long names to three lines, used anywhere wrapping, and kept the complete name in a tooltip. Google documents per-minute quota exhaustion as HTTP 403, but the client previously retried only 429/5xx and waited only 0.5/1 seconds. The gateway now returns a safe bounded retry delay for allowlisted `rate_limited` failures, using a usable numeric `Retry-After` or 60 seconds. The browser shows the cancelable cooldown and retry time, then retries the same batch; other transient failures use short bounded exponential backoff, while daily quota, permission, billing, and invalid requests still stop. `npm run check` passed typecheck, zero-warning lint, 84 tests and the build; formatting, Node syntax, artifact inspection and all 12 mocked Chromium workflows passed. The build retains its existing >500 kB chunk warning.

**Something the AI got wrong that I had to catch:** TBD - human review required. The reported `rate_limited` result after two application requests does not establish whether the cause was a reduced project quota, other same-project usage, or a model-specific limit. The project's actual Cloud quota configuration, a live full-file rerun, external peer feedback, and human UI review remain required.

## Product feature, persona, story, and gap documentation — 2026-10-08

**Tool(s) used:** ChatGPT/Codex; local repository, source, test, build-log, project-state, requirements, architecture, ADR, and Git inspection.

**What I asked for:** Inventory the user-visible MVP features actually present in the current repository; record the owner-supplied Teddy and Jenna persona hypotheses without inventing research; derive prioritized, testable user stories; map every story to current features and evidence gaps; update project records; verify, commit, and publish the documentation to `origin/main`.

**What I kept as-is:** TBD - human review required

**What I changed or rejected, and why:** TBD - human review required

**Something the AI got wrong that I had to catch:** TBD - human review required

## Retrospective Week 2-4 sprint summaries — 2026-10-08

**Tool(s) used:** ChatGPT/Codex; local Git history; current and historical project records; semester plan; course guide; build log; source/test evidence; AI logs.

**What I asked for:** Summarize the work from the weeks before the existing Week 5 sprint record and add those summaries under `docs/sprints/`.

**What I kept as-is:** TBD - human review required

**What I changed or rejected, and why:** TBD - human review required

**Something the AI got wrong that I had to catch:** TBD - human review required

## Vercel translation gateway deployment adapters — 2026-10-08

**Tool(s) used:** ChatGPT/Codex; local source, test, Git and documentation inspection; read-only deployed-route checks; official Vercel Vite, Functions, environment, limits and Firewall documentation; Vitest, ESLint, TypeScript, Prettier and Playwright.

**What I asked for:** Convert the local owner-funded translation backend into Vercel-compatible same-origin Functions, preserve local development, document secure environment and cost/abuse setup, create a branch and pull request, verify it, and merge it to `main`.

**What I kept as-is:** TBD - human review required

**What I changed or rejected, and why:** TBD - human review required

**Something the AI got wrong that I had to catch:** TBD - human review required

## Responsive feedback and layout containment — 2026-10-08

**Tool(s) used:** ChatGPT/Codex; user-supplied production screenshot; local React/CSS and Ant Design rendered-DOM inspection; Playwright Chromium; TypeScript, ESLint, Prettier and Vitest.

**What I asked for:** Repair the language-loading error card whose message collapsed into one-character columns and whose retry button escaped the card, then make the surrounding components and layout resilient at desktop and mobile widths.

**What I kept as-is:** TBD - human review required

**What I changed or rejected, and why:** TBD - human review required

**Something the AI got wrong that I had to catch:** TBD - human review required

## Modular code and documentation refactor — 2026-10-08

**Tool(s) used:** ChatGPT/Codex; local Git/source/test inspection; Swift PDFKit extraction of the supplied lecture PDF; official Vercel Vite/configuration documentation; TypeScript, ESLint, Prettier, Vitest and mocked Playwright Chromium.

**What I asked for:** Separate frontend/backend code without disturbing professor/Classroom50 starter files; move the archived MVP into docs; audit obsolete and fragile code and malformed API behavior; simplify README with a screenshot; organize documents; convert product personas/stories/gaps to a concise, lecture-informed format; update project memory and logs.

**What I kept as-is:** TBD - human review required. Verified technical preservation: the same-origin `/api` contract, joined-speech NMT/TLLM flow, SRT cue/timing invariants, owner-only credential boundary, Classroom50 configuration/workflow/resources, and historical ADR/AI evidence remain.

**What I changed or rejected, and why:** TBD - human review required. The code now lives under `frontend/` and `backend/`; only the two Vercel-required Function exports remain in root `api/`. The unchanged MVP HTML moved to `docs/mvp/`. Documentation now has topic folders, navigation and a README screenshot from a mocked test. Persona scenarios and comparison tables distinguish assumptions, implementation and human evidence. The attached PDF was a literature-review lecture, not a persona template, so only its relevant synthesis/comparison approach was used. The obsolete no-op provider `clear()` method was removed. Function body streaming is size-bounded before full buffering; empty inputs and English-only language responses fail safely. Malformed successful JSON unit and browser cases were added. `npm run format:check`, `npm run check` (108 tests and documentation links), `npm run check:build`, Node syntax checks and all 15 mocked Chromium workflows passed; Git whitespace check passed before logging. No live provider cost or quality claim is made.

**Something the AI got wrong that I had to catch:** TBD - human review required. During verification, the first browser attempt was blocked by sandbox localhost permissions; it passed with local socket permission. A retained test mock still declared the removed `clear()` method, which typecheck caught and was fixed before the final suite. The live budget, rate limit, paid smoke, server-side upstream deadline and human timing/language review remain open.

## Correct Features, Stories lecture alignment — 2026-10-08

**Tool(s) used:** ChatGPT/Codex; the owner-supplied *5. Features, Stories* PDF read with Swift PDFKit and visually checked as page images; local product/source/test records; TypeScript, ESLint, Vitest, Vite, Prettier and Markdown-link/build-artifact checks.

**What I asked for:** The owner corrected the lecture attachment for the previous product-document refactor and explicitly chose to leave the lecture's additional persona/scenario TBD. Align the affected records to that correct lecture without inventing human validation or changing application behavior.

**What I kept as-is:** TBD - human review required. The source-checked current-app inventory, owner-supplied Teddy/Jenna hypotheses, existing app behavior, archived MVP, original course files and earlier audit history were preserved.

**What I changed or rejected, and why:** TBD - human review required. The product folder now separates two four-aspect proto-personas, two narratives with the lecture's scenario elements, 11 provisional user stories, 11 traced feature cards, a feature/story/issue gap map and a four-question creep audit. The taxonomy folds UI observations into coherent features and removes automated tests as a user-facing feature; no runtime cut or new GitHub issue is claimed. Project state, open questions, requirement links, sprint snapshot note and the earlier audit correction point to the new records. `npm run check` passed typecheck, zero-warning lint, 108 tests, build and links across 45 Markdown files; formatting, build-artifact and whitespace checks passed. Browser workflows were not rerun for the docs-only change.

**Something the AI got wrong that I had to catch:** TBD - human review required. The preceding refactor used the supplied *Literature Review* PDF as its available course source; the owner then supplied the intended *Features, Stories* PDF. Real-person checks, three corrections, the third role/scenario, issue trace and any shipped feature cut remain outstanding. The existing bundle-size warning is unchanged.

## PR publication and commit-traced issue backlog — 2026-10-09

**Tool(s) used:** ChatGPT/Codex; local Git/history and repository docs; npm/TypeScript/ESLint/Vitest/Vite/Playwright; GitHub CLI with the existing Git credential for single commands; read-only GitHub connector inspection.

**What I asked for:** Resume the PR/merge request, remove the now-empty root `archive/`, confirm project-state upkeep rules, turn previously completed work into GitHub issues marked by implementing commit, and build a useful open backlog.

**What I kept as-is:** TBD - human review required. The existing canonical `AGENTS.md` rule already puts `PROJECT_STATE.md` first in the reading order and updates it after material changes, so no duplicate rule was added. The Classroom50 starter files, archived MVP content, application behavior and ignored `.env` were untouched.

**What I changed or rejected, and why:** TBD - human review required. Removed only an ignored `.DS_Store` from root `archive/` and removed the empty local directory; neither was tracked by Git. Published the branch and opened PR #5. Created retrospective GitHub issues for commit-backed implementation milestones, added the implementation commit to already-closed issue #2, and left unresolved production/quality/recovery/validation/reliability/review work open in #17–#22. Added a backlog index and connected it to the README, docs map, product gap map, state and open questions. Local verification before these documentation edits passed formatting, typecheck, lint, 108 tests, build, build-artifact scan and 15 mocked Chromium workflows; the first browser attempt hit sandbox-only localhost `EPERM`, then passed with local socket permission. Documentation links across 46 Markdown files and whitespace checks passed after the edits. The initial PR `verify` workflow passed before this final documentation commit.

**Something the AI got wrong that I had to catch:** TBD - human review required. The GitHub connected app returned 403 for writes and the local `gh` stored token was invalid; the existing Git credential worked for single GitHub commands without exposing its value. Retrospective issues document past work, not contemporaneous planning or missing human/production evidence. PR merge and remote CI results must be verified separately.

## Restore README product vision — 2026-10-09

**Tool(s) used:** ChatGPT/Codex; local Git and Markdown inspection; repository documentation and automated checks.

**What I asked for:** Bring back the specified FOR/WHO/THAT/UNLIKE Product vision section in the root README because it is a weekly lecture requirement.

**What I kept as-is:** TBD - human review required. The concise public description, live URL, screenshot, architecture/run guidance, links and application code remain unchanged.

**What I changed or rejected, and why:** TBD - human review required. Restored the owner's exact six-part product-vision wording after the screenshot so the lecture artifact is visible without displacing the short README opening. Updated project state and short AI log. `npm run format:check`, `npm run check` (typecheck, zero-warning lint, 108 tests, build and 46 documentation links), `npm run check:build` and whitespace validation passed. Browser workflows were not rerun because only documentation changed; the existing bundle warning remains.

**Something the AI got wrong that I had to catch:** TBD - human review required. The earlier README simplification removed this course-required vision; the owner identified the omission. No new user research or translation-quality claim is made.
