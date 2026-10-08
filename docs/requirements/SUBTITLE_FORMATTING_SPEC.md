# Subtitle Grouping and Formatting Specification

Status: Accepted product direction; deterministic implementation, human translation-quality review pending.

Updated: 2026-09-18 — voice memo / ADR-006 supersedes the independent-cue rule.

## 1. Data and invariants

A cue is one numbered SRT block with original start/end strings and text. A continuation group is a bounded list of adjacent cues. A translation unit is one uninterrupted speech or explicit structural section; it may span several cues. A visible grapheme is one user-perceived character after markup is excluded.

Preserve cue count, source order, index strings and exact time strings. Preserve source display text for the original column. Normalize only translation input. Never silently omit returned words, duplicate translated text to fill a cue, change timing, or merge source cues into a single output cue.

## 2. Gather and normalize before translation

1. Start a group at the first cue.
2. Inspect the next cue's visible text through i/b/u markup and leading whitespace.
3. Append it when it begins with a Unicode lowercase letter, three dots (`...`) or the ellipsis character (`…`). Otherwise begin a new group. Capitals, square brackets, speaker hyphens and music symbols at the start are boundaries.
4. Bound a group to 64 cues and a preferred 5,000 normalized source characters. A single larger cue can exceed the preferred size but must still pass hard request limits. These are technical bounds, not subtitle standards.
5. Recognize source speaker/annotation/music sections before flattening display newlines. Line-leading `- ` is a speaker heuristic even before lowercase speech; an inline `- <Uppercase>` is also a heuristic. Do not split ordinary hyphenated words.
6. Treat bracketed descriptions such as `[sighs]` and music sections as meaningful content. Translate descriptions/lyrics while preserving brackets/music symbols; do not silently strip them.
7. Replace soft wraps within speech with spaces. Join the continuing speech parts across cues with spaces. Preserve punctuation, including commas and ellipses; do not insert newlines after every comma.
8. Preserve balanced supported markup. Explicit structural boundaries can produce separate provider inputs. The final speaker's continuing speech can join the following continuation cue; known speaker turns must not be merged.

The UI and request builder use the same bounded source groups. This is a deliberately simple heuristic: it can miss a capitalized continuation or group unrelated lowercase speech. It is not speaker recognition and has no claimed 100% linguistic accuracy. No additional invented time-gap threshold is applied in this revision.

## 3. Translate and validate

Both NMT and TLLM receive one `q` input for each joined speech/structural unit. Several independent units may share a HTTP request; a shared request does not itself imply shared context. Retain cue membership and stable unit IDs locally. Do not send arbitrary cue-ID markers and assume Google will preserve them.

Keep at most 128 strings and a conservative 90,000-byte client body, with a preferred 5,000-character batch target; reject oversized units/groups explicitly. TLLM also has a 30,000-code-point total input ceiling enforced by the client and gateway. Validate response count, local mapping, nonempty text, supported tag structure, brackets and music symbols. A malformed result must never reach output as successful translation.

## 4. Distribute, then wrap

The owner explicitly requested joined translation followed by local redistribution. Source-word-count splitting and six-word line wrapping remain retired.

Allocate a joined result among only its contributing original cue slots. Use available reading capacity and target-language word boundaries, preferring nearby punctuation. Sections sharing a cue share its capacity. `Intl.Segmenter` supports words/graphemes in scripts that do not use English-style spaces. Keep supported markup balanced when slicing. Keep all translated text in its returned order.

This distribution is a layout approximation, not semantic alignment to speech. Mark multi-cue redistribution for review against the movie. If there are too few safe pieces to populate every contributing cue, fail the group; never copy text into several cues or silently create empty output.

After distribution, combine inline non-speaker sections without creating unnecessary display lines. Retain required speaker breaks. Apply the readability profile to each cue separately. More than two genuine speakers can conflict with the two-line target: preserve them and report the conflict.

A local distribution failure affects its group; successfully validated sibling groups remain available. A transport/provider failure can affect the whole submitted request. Retry only failed/unattempted original groups, preserving completed groups and edits. Do not regroup a filtered cue list across completed gaps.

## 5. Readability reference profile

- Adult maximum: 20 visible characters per second. Children: 17.
- At most two display lines where structure allows; 42 visible graphemes per line.
- `durationSeconds = (endMs - startMs) / 1000`.
- `cps = visibleGraphemes / durationSeconds`.
- Capacity: `min(84, floor(durationSeconds × cpsLimit))`.
- Keep short text on one line unless a mandatory speaker break exists.
- Prefer natural language/word boundaries and punctuation when wrapping; use conservative English phrase protection where supported.

These are an English-derived reference, not fully implemented grammatical rules for every language. Do not claim a universal or medically “nausea-safe” formatter. A newline does not reduce CPS or create time. Flag excessive length, lines, capacity and CPS for editing; no automatic deletion, shortening or retiming.

## 6. Presentation

Keep paired original/translated cards, group labels, compact within-group spacing and at least twice that gap between groups. Preserve hover/focus pairing and a persistent edit state in both themes. Failed cues carry their error below the pair; unattempted cues remain waiting. All saved edits appear in output.

## 7. Required evidence

Tests must cover joined pizza-style continuation payloads for both models; lowercase, dots, Unicode ellipsis and markup; source speaker/sound/music boundaries; bounded groups; complete returned-text conservation; stable cue IDs/times; balanced markup and graphemes; unallocatable output; failure isolation; retry/edit protection; long scripts without spaces; 42/43 grapheme and 20/17 CPS boundaries; partial download prevention; and browser edit/export.

Automated mapping and readability evidence does not establish live language quality. A human should compare the original movie timing and translated grouped output for representative NMT/TLLM language pairs.

## Sources

Verified for this revision: [Google v2 translate](https://docs.cloud.google.com/translate/docs/reference/rest/v2/translate), [Google request-size guidance](https://docs.cloud.google.com/translate/quotas), [Netflix English timed-text guidance](https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide).
