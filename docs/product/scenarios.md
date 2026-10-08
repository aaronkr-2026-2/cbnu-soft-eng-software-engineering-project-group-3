# Two use scenarios

Updated: 2026-10-08. These are **proposed narratives**, not observed sessions. Each names the persona, objective, steps, problem and possible way forward as requested in the Features, Scenarios & Stories lecture. They deliberately avoid implementation details.

## Teddy — understanding a difficult scene

Teddy finds an English SRT for a science-fiction or historical film, but the dialogue is too difficult for his conversational English. He wants to understand the whole movie without spending a long time copying fragments into another tool. He brings the file to SRT Translator, chooses a language, and starts the translation. He watches whether the work is moving, then compares difficult translated lines with the English cues while the movie is available.

If a request stalls or the wording looks plausible but wrong, Teddy needs to know what failed and which parts still need attention. A visible progress/retry path and connected-cue review may help him finish and download a usable SRT. Whether this workflow is fast enough or improves comprehension is **TBD by observation**.

## Jenna — preparing family movie night

Jenna has a movie and an English SRT before her family's weekly viewing. Her parents cannot follow English dialogue, so she wants subtitles in their mother tongue that preserve enough of the plot to include them. She translates the file, reviews important lines beside the originals, and corrects mistakes she can recognize before downloading the SRT for movie night.

Automatic wording may be awkward, and a correct phrase may land in the wrong time slot after redistribution. Jenna needs to see uncertainty and edit the lines that matter without losing the source timing. How long she can review, what errors she can reliably repair, and whether her parents can follow the result are **TBD by real-user review**.

| Required scenario element | Teddy | Jenna |
| --- | --- | --- |
| Name and persona | Difficult scene; Teddy | Family movie night; Jenna |
| Objective | Understand difficult dialogue. | Help parents follow the plot. |
| Involved steps | Find SRT → translate → inspect difficult lines → download. | Find SRT → translate → review/edit key lines → download. |
| Problem | Language barrier plus dislike of wasted time. | Parents' English barrier plus imperfect automatic output. |
| Way forward | Progress, recovery and contextual cue review. | Paired review, warnings and local edits. |

The lecture asks for an additional role and scenario in its homework. The owner chose to leave that role **TBD**, so this file does not claim full role coverage.
