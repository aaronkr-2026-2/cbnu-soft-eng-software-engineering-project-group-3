# Small English → Mongolian subtitle review

Date: 2026-10-09. Evidence: the owner-supplied 301-cue English crop and its translated `.mn-2.srt` file, inspected locally. Neither movie subtitle file is copied into this repository. The owner described this as a Google translation test, but the files do not identify NMT versus TLLM, request settings, or any manual edits. No movie-audio review or controlled model comparison was performed here.

The two files contain 301 cues with matching indexes and exact start/end time strings. This is structural evidence only; it does not establish fluent Mongolian or semantic alignment within a cue.

| Source cue/time | Owner's assessment | Follow-up interpretation |
| --- | --- | --- |
| 56 · 00:03:11–00:03:14 | Good. | Positive example; the following emotional phrase spans cue 57, so assess 56–57 together during playback. |
| 77 · 00:04:11–00:04:13 | Understandable but not how a native speaker would count/phrase this family situation. | Native phrasing/ordinal-child-count review needed; code cannot infer the preferred Mongolian wording from the SRT alone. |
| 132 · 00:06:33–00:06:35 | “Absolute masterpiece.” | Positive example as reported by the owner. |
| 151 · 00:07:22–00:07:23 | Good. | Positive example as reported by the owner. |
| 189 · 00:08:59–00:09:00 | Good. | Positive example as reported by the owner. |
| 207 · 00:10:09–00:10:10 | Roughly 4/5. | Sound-description wording may benefit from an edit; this is not a failing case by the owner's rating. |
| 246 · 00:11:31–00:11:33 | Expressive/meaning nuance not right. | Keep the owner's observation; exact preferred correction and root cause are TBD. |
| 250–252 · 00:11:39–00:11:46 | The owner flagged cue 251's speaking perspective/person as wrong (their note also mentions “213”). | The English first-person sentence spans these three cues. Review both the provider's joined output and local redistribution before attributing the error to either one. Cue 213 itself is a music-description cue, so the “213” reference remains ambiguous. |

These are qualitative spot checks, not a pass rate or proof that a particular model will always make the same mistake. The owner can edit the affected cues before download. Better results may also depend on model, context and input; no automated fix or model switch is justified by this sample alone.

Eight new, **original fictional** cues were appended to `examples/demo.srt` to exercise the observed categories: sound-label wording (44), emotion across a continuation (45–46), natural family counting (47), first-person perspective across redistributed cues (48–50), and conversational commitment (51). They use the demo's own story and time sequence, not movie dialogue or movie timecodes. Parsing/round-trip and continuation-group tests cover the added fixture structurally; they cannot judge Mongolian fluency.

Next quality test: retain model, language, request date, source group, joined provider output, redistributed cues, and a human correction for a small licensed/original sample. Keep subtitle text in local test material only, never telemetry or logs. Compare against playback before changing grouping or mapping logic.
