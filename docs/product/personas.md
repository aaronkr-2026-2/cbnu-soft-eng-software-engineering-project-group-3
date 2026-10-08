# Persona hypotheses and scenarios

Updated: 2026-10-08. Teddy and Jenna were supplied by the project owner, **not interviewed**. These are design hypotheses, not research findings. Unknown languages, devices, occupations and wait-time thresholds are deliberately omitted.

| | Teddy | Jenna |
| --- | --- | --- |
| Situation | Mid-teens, tech-savvy movie lover; conversational English learned largely from movies. | Early thirties; weekly movie night with parents who do not understand English. |
| Can already do | Find movies and English subtitle files; search online. | Find a movie and English subtitle, then upload the file. |
| Friction | Science-fiction and historical dialogue exceeds his conversational English; slow internet and wasted time frustrate him. | English subtitles do not let her parents follow the plot. |
| Desired outcome | Understand difficult dialogue and the whole movie. | Give her parents reasonably cohesive subtitles in their mother tongue; correct important mistakes first. |
| Quality expectation | Not yet stated. | Knows automatic output will not be cinema-grade. |

## Scenario A — Teddy checks difficult dialogue

Teddy has found an English SRT for a science-fiction or historical movie. He loads it, chooses a target language and reading profile, and watches progress. He reviews connected dialogue in context, checks uncertain cue placement, then downloads the SRT. **Failure to investigate:** a slow or failed request might make him abandon the workflow; a fluent-looking but wrong translation might still obscure the scene. This scenario describes intended use, not an observed session.

## Scenario B — Jenna prepares movie night

Jenna finds an English SRT before family movie night. She translates it into the family's mother tongue, reviews important plot lines against the movie, edits mistakes she can identify, and downloads the completed SRT. **Failure to investigate:** she may lack time to review every cue, or the app's approximate redistribution may put a correct phrase in the wrong time slot. No observation has established how much review is feasible.

## Validation plan

| Question | Evidence still needed |
| --- | --- |
| Does English-SRT-first match real viewing habits? | Interview or observed task with intended users. |
| Which target languages and error types matter? | Representative files, languages and human NMT/TLLM review. |
| Is the wait/review time acceptable? | Timed user sessions; no threshold is currently confirmed. |
| Can Jenna find and repair important errors? | Observed edit-to-download task. |

See [stories](stories.md) for proposed outcomes and the [gap map](gap-map.md) for implementation versus evidence.
