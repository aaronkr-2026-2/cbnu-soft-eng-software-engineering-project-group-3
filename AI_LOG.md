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
**What I changed or rejected, and why:** Added docs/GOOGLE_TRANSLATE_SETUP.md, linked it from docs/PROVIDER_AUTH_AND_COST.md, and reconciled PROJECT_STATE.md with local repository evidence. The guide covers billing/API setup, restricted Basic v2 keys, development quotas, budget alerts, and the future local browser test. No Google resources were configured and no key or paid API call was used. Human acceptance/rejection of the setup recommendations is TBD - human review required.
**Something the AI got wrong that I had to catch:** TBD - human review required. No human-reported error was supplied. The credential field and browser compatibility test are explicitly recorded as pending, not implemented or passed.


## Trial billing and missing Translation API troubleshooting — 2026-09-17

**Tool(s) used:** ChatGPT/Codex; official Google Cloud trial, billing, payment-method, and Translation setup documentation.
**What I asked for:** Explain whether recovering a reported signup payment or removing a card affects the $300 trial, and help configure a key when only Google Cloud APIs appears in the restriction picker.
**What I kept as-is:** TBD - human review required. The official Basic v2 direction, visitor funding, and session-memory-only key design remain unchanged.
**What I changed or rejected, and why:** Expanded docs/GOOGLE_TRANSLATE_SETUP.md with conditional billing troubleshooting and same-project API enablement/restriction steps. Updated PROJECT_STATE.md to record user-reported trial activation and the subsequent confirmation that the signup amount is on hold, consistent with a verification authorization; API setup remains unverified. No billing, refund, key, or application operation was performed. Human acceptance/rejection is TBD - human review required.
**Something the AI got wrong that I had to catch:** TBD - human review required. The user confirmed that the amount is on hold. Its actual release has not been verified; no account-specific refund guarantee is recorded.


## Local development credential file protection — 2026-09-17

**Tool(s) used:** ChatGPT/Codex; local filesystem metadata and Git checks.
**What I asked for:** Report completed Google Cloud project/key setup and a local environment variable named GOOGLE_TRANSLATE_API_KEY, in preparation for the React migration.
**What I kept as-is:** TBD - human review required. The credential file contents were not read or modified; the memory-only visitor credential design remains unchanged.
**What I changed or rejected, and why:** Added .gitignore rules for local environment files and the mentioned .nev spelling, allowing a future placeholder-only .env.example. Updated PROJECT_STATE.md and docs/GOOGLE_TRANSLATE_SETUP.md to distinguish reported credential preparation from a working integration. The existing .env was untracked and previously not ignored. No key was printed, used in a request, or included in the app. Human acceptance/rejection is TBD - human review required.
**Something the AI got wrong that I had to catch:** TBD - human review required. Key validity and restrictions remain unverified; no successful provider test is claimed.


## React migration plan and provider distinction — 2026-09-17

**Tool(s) used:** ChatGPT/Codex; official Cloud Translation and Gemini documentation; local repository inspection.
**What I asked for:** Plan the React migration and official Google Translate integration, and explain whether Cloud Translation also calls Gemini for translation.
**What I kept as-is:** TBD - human review required. The accepted stack, visitor-funded session credentials, subtitle requirements, and deferred cloud storage remain unchanged.
**What I changed or rejected, and why:** Added docs/REACT_MIGRATION_PLAN.md with ordered issues, acceptance checks, credential boundaries, user participation, and unresolved decisions. Linked the plan from PROJECT_STATE.md and docs/SEMESTER_PLAN.md and clarified provider/model and welcome-credit distinctions in docs/PROVIDER_AUTH_AND_COST.md. The plan proposes Basic v2 NMT first and a separate future Gemini adapter. No application implementation, credential reading, or paid API calls occurred. Human acceptance/rejection is TBD - human review required.
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
