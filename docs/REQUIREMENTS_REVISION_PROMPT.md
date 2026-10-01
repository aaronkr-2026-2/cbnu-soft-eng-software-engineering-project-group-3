# Voice memo revision — executable implementation prompt

Date: 2026-09-18

## Goal

Reconcile the React implementation and current project documents with the owner's revised voice memo. Restore the original product flow: choose an English SRT, select NMT or TLLM, target language and reading profile, translate connected speech, review/edit, and download with the original cue count, indexes and timecodes.

## Interpret the transcription

- The engine names are NMT and TLLM; “LTTM” refers to TLLM; “guitar” means GitHub; “dot NF” means the ignored `.env` file.
- Retain the previously confirmed 5 MiB UTF-8 limit and Children 17 CPS / Adult 20 CPS. “5 megabits” and “same team” are transcription errors in this context.
- The intended desktop split is 20% controls / 80% preview. “20, 90” is a transcription error.
- Keep the existing sun/moon switch and next-theme tooltip. No extra animation package is needed.
- This memo supersedes the previous decision to leave NMT cue-by-cue and reserve grouped text for TLLM. Both models must receive normalized continuation text.

## Work to execute

1. Read the canonical agreement, requirements, architecture, development rules, semester/course plan, formatting specification, provider/setup guidance, ADRs, questions and recent logs. Inspect the original MVP, React code, tests and original demo fixture. Preserve historical evidence and user work.
2. Implement shared domain grouping: start with a cue; append adjacent cues whose visible text starts with lowercase or an ellipsis (`...` or `…`); stop before other starts. Join soft wraps with spaces. Preserve punctuation, supported i/b/u markup, speaker turns, bracketed descriptions and music symbols. Keep structural boundaries separate from ordinary display wraps. Send one string for each uninterrupted connected speech segment, for both models, using bounded batches.
3. Redistribute each joined translation into its contributing original cues, then wrap each cue using the documented readability profile. Use available reading capacity and language-aware boundaries, not source-word ratios. Never delete text, rewrite timecodes, or duplicate output to fill an empty cue. Report unallocatable output as a recoverable group failure. Mark redistribution as approximate for review; it cannot prove semantic/audio alignment. Do not rely on invented cue markers surviving Google translation.
4. Preserve the compact header, workflow modal with X and OK only, repository link, stationary Start/progress/download controls, scrollable settings and virtualized paired cards. Make the brand reset the workspace. Initialize the theme from the OS. Load the language catalogue automatically without a paid Hello check. Start requires file, model, language and explicit profile. Show the selected language, cue IDs/timecodes, edit/save controls, progress, elapsed time and cumulative translation-request attempts across retries. Attribute failures to affected cues; leave unattempted cues waiting. Retry must preserve completed work and edits.
5. Show both engines' character/request estimates and honest list-price cost information. NMT uses input characters; TLLM includes an explicitly labelled output-length assumption. Never claim estimated cost equals billing, credits, or a guaranteed ceiling.
6. Use Ant Design controls/layout/feedback first. Centralize theme and component tokens in a shared module consumed by ConfigProvider. Use a documented spacing scale; focused CSS remains appropriate for sticky/responsive/virtual subtitle layout. Research official Ant Design guidance, Google request/pricing documentation and Netflix readability guidance before changing related behavior.
7. Keep owner-funded server-only credentials and the official API. Do not expose `.env`, add Gemini, revive visitor keys, use the archived consumer endpoint, or expand scope into statistics, metadata, lives, storage, or microservices. Preserve existing security, cancellation, editing and course obligations omitted from the memo.
8. Reconcile README, project state, requirements, architecture, formatting, setup/cost, UI/development rules, affected ADRs, open questions and semester/course evidence. Remove obsolete active instructions; retain clearly labelled historical ADRs and coding-tool pointers. Record what is implemented versus still unverified, and concrete remaining owner/course decisions.
9. Add meaningful regression coverage for grouped request payloads, redistribution, markers/markup, cancellation, failures/retry, downloaded edits and theme/reset flow. Run typecheck, lint, tests, build, format/build checks and browser tests. Update both AI logs with honest human-review placeholders, then create one local commit. Do not push without a fresh request.

## Acceptance and limits

The pizza continuation example must reach NMT and TLLM as joined speech without artificial cue markers or source soft newlines. Original SRT identities/times and every returned translated token must survive distribution. Grouping and distribution are deterministic heuristics, not speaker recognition or guaranteed translation quality. A human live benchmark and production hosting/budget/abuse decisions remain explicit follow-up work. The class milestones remain in force; passing local tests does not complete external review, deployment or a human code walkthrough.

## Execution assignment

The owner requested Astra planning and GPT-5.6 Terra at high reasoning effort for implementation. Astra reviewed the plan and in-progress diff; Terra completes code and tests. The coordinating agent maintains the documentation and final integration/commit. This assignment is specific to this task, not an invented permanent workflow rule.
