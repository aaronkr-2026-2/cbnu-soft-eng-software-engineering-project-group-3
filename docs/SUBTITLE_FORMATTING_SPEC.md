# Subtitle Grouping and Formatting Specification

Status: Accepted baseline

Date: 2026-09-16

This specification replaces the MVP's universal six-word wrapping and proportional translated-word splitting. It defines deterministic behavior that can be tested. Values are an initial profile based on Netflix's English timed-text guidance; later language profiles may override them through a documented decision.

## 1. Terms

- **Cue:** one numbered SRT block with one start/end timecode.
- **Continuation group:** two or more adjacent cues that form one continuing utterance. Grouping never removes or changes their cue IDs or timecodes.
- **Dialogue segment:** speech attributed to one speaker inside a cue.
- **Visible grapheme:** a user-perceived character after supported SRT formatting tags are excluded. Spaces and punctuation count for line length and CPS because viewers must scan them.

## 2. Continuation-group presentation

- Connected cues stay in one visible group in both original and translated columns.
- Use the normal compact gap between cues inside a group and a clearly larger vertical gap after the last cue of a group. Use Ant Design spacing tokens rather than unexplained pixel constants; the inter-group gap must be at least twice the intra-group gap.
- A non-color-only group indicator, such as a shared left rail or group label, spans the connected cues.
- Hovering either the original or translated card highlights the whole paired cue row.
- Edit mode applies a stronger persistent background/border state to the translated card until Save or Cancel. Hover must not hide the edit state. Light/dark themes and keyboard focus require equivalent visible states.

## 3. Fixed cue boundaries

- Preserve the input cue count, order, indexes, and timecodes.
- Do not merge several SRT cues into one output cue.
- Do not translate a whole group and divide the target text by source word-count ratios.
- Gemini receives a continuation group and bounded neighboring context but must return one structured result for each requested cue ID.
- Google Cloud Translation NMT receives one translatable string per cue, batched in one request where possible. This preserves alignment; batching must not be described as cross-cue context.
- If provider output cannot be mapped one-to-one to every requested cue, reject that batch instead of guessing boundaries.

## 4. Exact default readability profile

For each translated cue:

1. `durationSeconds = (endMilliseconds - startMilliseconds) / 1000`.
2. Count visible grapheme clusters after excluding supported formatting tags.
3. `cps = visibleGraphemes / durationSeconds`.
4. Adult default: maximum 20 CPS. Children's profile: maximum 17 CPS.
5. Maximum two display lines.
6. Default maximum 42 visible graphemes per line.
7. Effective text capacity is `min(84, floor(durationSeconds * cpsLimit))` visible graphemes.

If the cue text is no longer than 42 graphemes, keep one line unless a required dialogue boundary exists. If it exceeds 42 but can fit into two lines, select one break that keeps both lines at or below 42 and is as balanced as the grammatical rules permit.

Line-break candidate priority:

1. required speaker boundary;
2. after sentence-ending or clause punctuation;
3. before a conjunction;
4. before a preposition;
5. another word boundary that best balances the lines.

Never deliberately split an article from its noun, adjective from noun, first from last name, subject/pronoun from verb, auxiliary/negation from verb, or a phrasal/prepositional verb from its particle when the language profile can identify that relationship.

If total text exceeds 84 graphemes, either line exceeds 42, or CPS exceeds the selected limit after the best break, mark the cue `needs-review`. A line break cannot fix excessive CPS. The core release does not silently delete meaning, create a third line, or modify timecodes. The editor shows the measured reason and lets the user shorten the translation. Retiming/new-cue creation requires separate approval.

## 5. Non-movable dialogue rule

The user's dialogue rule is mandatory:

- Detect source speaker markers before translation when a dialogue segment begins with a hyphen followed by whitespace and a Unicode uppercase letter (`- <Capital...>`).
- The first marker may begin line one. Every later detected marker forces a newline immediately before its hyphen.
- Preserve the segments separately through provider requests so the rule does not depend on capitalization in the target language.
- A two-speaker cue has exactly one speaker per line; the forced boundary cannot be moved by balancing logic.
- More than two detected speakers cannot satisfy the two-line baseline. Preserve the content and flag the cue for review instead of silently discarding a speaker or generating unlimited lines.

## 6. Context-aware Gemini repair

Gemini receives per-cue capacities, durations, speaker segments, and stable cue IDs. It may phrase the translation so a continuing utterance flows naturally across the existing cues, but it must keep semantic order, return every ID once, and omit nothing plot-relevant. If the first response violates cue capacity, the application may make one bounded repair request containing the group, violations, and limits. A remaining violation becomes `needs-review`.

## 7. Acceptance fixtures

Automated fixtures must cover:

- single-line text at 42 and 43 graphemes;
- two balanced lines and every protected grammatical boundary;
- 20 CPS and a value immediately above it;
- adult and children's profiles;
- two `- <Capital...>` speakers and a three-speaker overflow;
- scripts without case, proving source-detected speaker boundaries survive translation;
- a continuation group whose translated word order differs from English;
- missing, duplicated, and reordered provider cue IDs;
- hover, keyboard focus, edit-state persistence, and light/dark theme contrast.

## References

- [Netflix English (USA) Timed Text Style Guide](https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide)
- [Netflix Subtitle Template Guide](https://partnerhelp.netflixstudios.com/hc/en-us/articles/219375728-Timed-Text-Style-Guide-Subtitle-Templates)
