# User-facing feature list

Updated: 2026-10-08. Eleven features, each derived from the [current inventory](features-now.md) and traced to at least one [story](stories.md). The four middle columns follow the lecture's activation / input / action / output template. These are coherent capabilities, not claims that every user will value them.

| ID · feature | Activation | Input | Action | Output | Story |
| --- | --- | --- | --- | --- | --- |
| PF-01 · Import SRT | Choose/drop file | English `.srt` | Validate and preserve cues | File/cue preview or error | US-01 |
| PF-02 · Set translation options | Use selectors | Language, model, profile | Validate choices; estimate usage | Ready state and labelled estimate | US-02 |
| PF-03 · Translate connected speech | Start | Valid file/options | Group, call gateway, validate and distribute | Original timed cues with translated text or errors | US-03 |
| PF-04 · Show job progress | Start a job | Job events | Track cue states, time and attempts | Visible progress and failures | US-04 |
| PF-05 · Stop or retry work | Cancel/Retry | Current job and retained results | Abort or process unfinished groups | Canceled/continued job without overwriting edits | US-05 |
| PF-06 · Review paired cues | Open preview / scroll | Source and available translation | Present cue pairs and follow active work | Contextual review with timing notice | US-06 |
| PF-07 · Flag readability | View translated cue | Text, duration, chosen profile | Check line/CPS/capacity limits | Warning without deleting text | US-07 |
| PF-08 · Edit one cue | Edit → Save | Corrected text | Validate and retain local edit | Edited cue for export | US-08 |
| PF-09 · Export complete SRT | Download | All valid cues | Serialize original identities/times plus edits | Local UTF-8 `.srt` | US-09 |
| PF-10 · Open workspace and help | Visit URL / open help | None | Show translator and guidance | Usable workspace | US-10 |
| PF-11 · Switch appearance | Toggle theme | Light/dark choice | Apply shared theme | Reviewable contrast mode | US-11 |

PF-03's redistribution is approximate and requires human movie-timing review. PF-05 supports only **in-tab** recovery, not reload recovery. PF-10 at the live URL was reported working for language discovery, but paid translation and public cost controls are unverified. F-25 virtualization and F-26 automated tests are implementation/evidence for these features, not extra product features.
