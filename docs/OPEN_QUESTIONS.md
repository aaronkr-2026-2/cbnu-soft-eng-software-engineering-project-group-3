# Open Questions - Human Decisions Required

Do not infer answers from this document. Record decisions in requirements and an ADR, then update `PROJECT_STATE.md`.

## Blocking before production API implementation

1. Resolved 2026-09-16: one developer; this is a solo project. The developer must be able to explain all shipped work.
2. Superseded 2026-09-18: the project owner funds Cloud Translation through a gateway; visitors provide no credential.
3. What monthly translation budget and public allowance are acceptable? Researching a free tier does not answer this.
4. What production gateway host, rate limits, and abuse controls will be used?
5. Which NMT/TLLM quality, latency, and cost evidence selects the default model?

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

27. Resolved for the initial React release on 2026-09-17: current desktop Chrome, Edge, Firefox, and Safari. Mobile certification remains out of scope for this increment.
28. Resolved 2026-09-17: 5 MiB per UTF-8 SRT file. Large-file benchmarking remains pending.
29. Are source subtitles always English, or should auto-detect/manual source language become future scope?
30. Resolved for this increment on 2026-09-17: balanced i/b/u tags without attributes; unsupported formatting produces an explicit error.
31. Should automatic retiming/cue splitting ever be included, or only quality warnings/manual edits?
32. Which language-specific readability profiles are required beyond an English-derived default?
33. Resolved 2026-09-17: hide Statistics until implemented.
34. Which Cloud Translation model is the tested default, and what grouped-input/cue-alignment benchmark passes the translation fixtures?
35. Resolved 2026-09-17: require explicit Adult (20 CPS) or Children (17 CPS) profile selection before translation.
