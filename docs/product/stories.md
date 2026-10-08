# Prioritized user stories

Updated: 2026-10-08. Eleven **provisional** stories derive from the owner-supplied [personas](personas.md), their [scenarios](scenarios.md), and confirmed product requests. Priorities have not been validated with real users. Each row states role, action and reason; detailed technical acceptance stays in the [requirements](../requirements/PRODUCT_REQUIREMENTS.md).

| ID | Priority | One role, action and reason | Check / current gap |
| --- | --- | --- | --- |
| US-01 | Must | As a viewer with an English SRT, I want to load it safely so that corrupt input does not waste a translation attempt. | Valid ≤5 MiB UTF-8 loads; invalid input fails without partial import. |
| US-02 | Must | As a viewer, I want to configure the destination and translation options so that the output fits my language, audience and likely cost. | Language, model, profile and estimate exist. **Epic candidate:** split language, model/cost and audience choice when planning work. |
| US-03 | Must | As Teddy, I want connected dialogue translated together so that split cues retain useful context. | Both engines send joined speech; human language/timing quality is unverified. |
| US-04 | Must | As Teddy, I want to see translation progress so that I know whether waiting is worthwhile. | Cues, state, elapsed time and attempts shown. |
| US-05 | Must | As a viewer whose work stops, I want to continue without repeating completed groups so that I do not waste time or paid attempts. | In-tab retry works; **reload recovery is backlog**. Epic candidate: separate in-tab from reload recovery. |
| US-06 | Should | As Jenna, I want original and translated cues together so that I can judge important lines in context. | Paired cards and redistribution notice exist; user efficiency untested. |
| US-07 | Should | As a subtitle reviewer, I want hard-to-read cues flagged so that I can inspect them before download. | Reference-profile warnings exist; language-specific validity untested. |
| US-08 | Must | As Jenna, I want to correct one important cue so that my family sees the intended meaning. | Edit/save validation and edited download exist; observed usability untested. |
| US-09 | Must | As a viewer, I want a finished SRT download so that I can use the subtitle with my movie. | Complete-only export preserves indexes, timecodes and edits. |
| US-10 | Must | As a viewer, I want to open the translator online so that I do not need a local developer setup. | Public frontend/language route reported; paid smoke and abuse controls unverified. |
| US-11 | Should | As a subtitle reviewer, I want to switch between light and dark appearance so that I can read cues in different viewing conditions. | Theme switch exists; persona need is a hypothesis, though the owner requested the control. |

No new GitHub issues or interview evidence are claimed here. The [gap map](gap-map.md) shows which story outcomes are covered, partial or still backlog; the [feature list](features.md) traces current capabilities back to these stories.
