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
