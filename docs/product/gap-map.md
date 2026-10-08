# Feature–story gap map

Updated: 2026-10-08. Read **down each evidence column**, not only across a row: code coverage, deployed behavior and human outcome are different claims. This follows the attached literature-review lecture's comparison/synthesis approach; it is not a claimed persona template.

| Story | Implemented feature IDs | Code status | Remaining evidence or work |
| --- | --- | --- | --- |
| US-01 | F-03–05 | Covered | Real-user file/error usability. |
| US-02 | F-06–09 | Partial | TLLM pair coverage; estimates are not bills. |
| US-03 | F-10–14, F-26 | Partial | Human NMT/TLLM translation and movie-timing comparison. |
| US-04 | F-15, F-21, F-25 | Covered | Representative full-film/browser responsiveness. |
| US-05 | F-16–19 | Partial | Browser-local reload checkpoint and test. |
| US-06 | F-13, F-16, F-20–21 | Covered | Human review efficiency. |
| US-07 | F-14, F-22 | Covered | Language-specific readability validation. |
| US-08 | F-19, F-23–24 | Covered | Observed edit task; Jenna remains hypothetical. |
| US-09 | F-04, F-12, F-24, F-26 | Covered | Player playback and human timing review. |
| US-10 | F-01, F-06–07 | Partial | Public language route reported working; controlled paid smoke and cost/abuse controls unverified. |

## Synthesis and next decision

The structural core is well covered by mocked tests. The highest-risk gaps are **real output quality/timing**, **public allowance and abuse controls**, and **reload recovery**. Testing more fixtures cannot by itself validate a person's understanding or a production spending ceiling. Teddy/Jenna priorities and thresholds remain provisional until interview/observation evidence exists. See [current features](features-now.md), [stories](stories.md), and [open questions](../requirements/OPEN_QUESTIONS.md).
