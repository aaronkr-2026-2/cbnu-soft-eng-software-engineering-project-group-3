# Open Questions - Human Decisions Required

Do not infer answers from this document. Record decisions in requirements and an ADR, then update `PROJECT_STATE.md`.

## Blocking before production API implementation

1. Resolved 2026-09-16: one developer; this is a solo project. The developer must be able to explain all shipped work.
2. Resolved 2026-09-16: each visitor owns provider credentials and cost; no project-funded public calls.
3. Is a billing-enabled Google Cloud/Firebase project acceptable for the semester, and what monthly budget is acceptable? Researching the free tier does not answer this.
4. Resolved 2026-09-16: no. Google Translate requires the visitor's session-only Cloud Translation Basic key.
5. Resolved for the current release: Gemini uses a visitor's session-only AI Studio API key. Consumer subscription login is not an API billing mechanism; OAuth is deferred.

## Telemetry decisions and deferred file questions

6. Resolved 2026-09-16: completed SRT cloud storage/upload is deferred; collect telemetry only.
7. Deferred: stored-file access and provider selection do not apply to current scope.
8. How long are raw telemetry events and aggregate statistics retained?
9. What telemetry opt-out/deletion controls are needed without full accounts? File deletion is deferred with file storage.
10. Deferred: subtitle sharing/takedown policy is outside the current scope.
11. Partially resolved 2026-09-16: collect country and city. Still decide how to obtain them (user selection or an approved approximate lookup) and what happens when unavailable. Do not assume GPS permission or an IP service.
12. What user-facing privacy notice/consent is required by the target deployment audience?

## Blocking before the three-life feature

13. What problem do the lives solve: API cost, metadata quality, abuse, or gamification?
14. Is the count per browser, session, day, anonymous UID, account, IP-derived identity, or something else?
15. When and how does it reset?
16. Does an API failure, cancellation, invalid SRT, or app crash consume a life?
17. What happens at zero lives?
18. If a filename does not match but the user confirms it is correct, can they override without spending a life?
19. Should Start be disabled on mismatch, or enabled while a remaining life can be spent? The current wording says both.

## Blocking before movie metadata/matching

20. Partially resolved: accept an IMDb URL/ID for automatic lookup and manual title/year when no permitted automatic provider exists. Whether the UI keeps a Rotten Tomatoes hint field is TBD; do not scrape it.
21. Are TV series/episodes supported, or movies only?
22. Proposed semester default: TMDB Find-by-external-ID for IMDb `tt...` identifiers, subject to key/attribution approval. IMDb's licensed API is optional; Rotten Tomatoes requires a business agreement. Final TMDB account/key ownership is TBD.
23. What title/year confidence is sufficient to count as a match?
24. How are alternate/localized titles handled?
25. Deferred: timing/source fingerprints for cross-user subtitle reuse are outside current scope.
26. Deferred: reused-translation behavior is outside current scope.

## Product and quality decisions

27. Which modern desktop browsers are required? Is mobile a graded target?
28. What maximum input size should be supported and benchmarked?
29. Are source subtitles always English, or should auto-detect/manual source language become future scope?
30. Which subtitle formatting tags must round-trip?
31. Should automatic retiming/cue splitting ever be included, or only quality warnings/manual edits?
32. Which language-specific readability profiles are required beyond an English-derived default?
33. Does the Statistics tab ship empty/placeholder before backend data exists, or remain hidden until implemented?
34. Which Gemini model is the tested default, and what token/character budget passes the translation fixtures?
35. Should the subtitle profile default to adult 20 CPS, ask adult/children per job, or infer nothing and expose a setting?
