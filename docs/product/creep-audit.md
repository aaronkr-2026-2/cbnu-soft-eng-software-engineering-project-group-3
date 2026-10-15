# Feature-creep audit

Updated: 2026-10-08. The lecture asks four questions for every MVP feature: is it new or duplicate, will most users use it, can an existing feature be extended, and is it general or specific? Usage is **unknown** until real-person checks; “core” below means required by the confirmed flow, not measured popularity.

| Feature | New or duplicate? | Most users? | Extend/merge instead? | General or specific? | Decision and reason |
| --- | --- | --- | --- | --- | --- |
| PF-01 Import | Distinct | Core flow; unmeasured | Merged F-03–05 | General | Keep: safe file entry. |
| PF-02 Options | Related controls | Core flow; unmeasured | Merged F-06–09 | General | Keep as one setup feature; avoid separate “cost app.” |
| PF-03 Joined translation | Distinct | Core flow; unmeasured | Reuses source groups | Product-specific | Keep: central outcome; quality unproven. |
| PF-04 Progress | Distinct feedback | Long jobs; unmeasured | Part of job UI | General | Keep: makes waiting intelligible. |
| PF-05 Stop/retry | Extends job | Failures vary; unmeasured | One recovery control set | General | Keep; reload recovery remains backlog. |
| PF-06 Paired review | Distinct | Likely reviewers; unmeasured | Merged F-20–21 and F-25 support | Product-specific | Keep; validate review usefulness. |
| PF-07 Readability | Extends review | Unknown | Reuse cue warnings | Product-specific | Keep provisionally; profile is not universal. |
| PF-08 Edit | Extends review | Unknown | Reuse cue cards | General | Keep: correct important errors. |
| PF-09 Export | Distinct | Core flow; unmeasured | No duplicate | General | Keep: delivers the file. |
| PF-10 Workspace/help | Basic shell | Core access; unmeasured | Reuse existing header | General | Keep; avoid more navigation. |
| PF-11 Theme | Optional comfort | Unknown | OS theme already exists | General | Keep provisionally: owner explicitly requested switch; validate user value. |

**Actual taxonomy cuts/merges:** F-26 “automated checks” is cut from the *product feature list* because tests are evidence, not a user action. F-25 virtualization is merged into PF-06's performance responsibility. F-03–05 and F-06–09 become coherent import/setup features. No runtime feature or test was deleted by this documentation pass, and no user-visible cut is claimed. If the course expects a shipped behavior cut/merge, that remains **TBD after user validation and owner review**; removing a working control merely to fill an audit box would contradict the product requirements.
