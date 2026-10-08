# What the current app actually has

Updated: 2026-10-08. This is the lecture's **click-through inventory**, checked against source and mocked tests, not a list of promises. [features.md](features.md) merges these smaller observations into 11 coherent user-facing features.

| ID | Present behavior | Product feature |
| --- | --- | --- |
| F-01 | Workspace, help and confirmed reset. | PF-10 |
| F-02 | OS-initialized light/dark switch. | PF-11 |
| F-03 | Choose/drop and strictly validate a local SRT. | PF-01 |
| F-04 | Preserve source cue text, indexes and exact timecodes. | PF-01 |
| F-05 | Show cue count and a contained full filename. | PF-01 |
| F-06 | Load/search target languages; retry discovery errors. | PF-02 |
| F-07 | Select official NMT or TLLM. | PF-02 |
| F-08 | Require Adult/Children profile and valid setup before Start. | PF-02 |
| F-09 | Show model-specific input, requests and estimated cost. | PF-02 |
| F-10 | Form bounded continuation groups. | PF-03 |
| F-11 | Send joined speech to either model. | PF-03 |
| F-12 | Reject malformed provider results. | PF-03 |
| F-13 | Redistribute translated text approximately into original cues. | PF-03 |
| F-14 | Wrap text without silent loss or retiming. | PF-07 |
| F-15 | Show status, cue progress, elapsed time and attempts. | PF-04 |
| F-16 | Mark per-cue state and failures. | PF-04 |
| F-17 | Bound retries and show quota cooldown. | PF-05 |
| F-18 | Cancel and ignore stale results. | PF-05 |
| F-19 | Retry unfinished groups within the tab, preserving edits. | PF-05 |
| F-20 | Show paired grouped original/translation cards. | PF-06 |
| F-21 | Follow the active cue or return to it after scrolling. | PF-06 |
| F-22 | Flag line, CPS and capacity warnings. | PF-07 |
| F-23 | Edit and save a translation locally. | PF-08 |
| F-24 | Download only a complete valid SRT. | PF-09 |

Earlier labels F-25 (virtualization) and F-26 (automated checks) describe **engineering evidence**, not separate user features. Virtualization supports PF-06; tests support confidence across features. This correction is recorded in the [creep audit](creep-audit.md), not presented as removed runtime behavior.

No reload recovery, telemetry, movie metadata, lives, Gemini, cloud subtitle storage or automatic retiming is implemented. The public language route has been observed, but paid grouped NMT/TLLM quality and spending controls still need evidence; see [project state](../../PROJECT_STATE.md).
