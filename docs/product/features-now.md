# Current feature inventory

Updated: 2026-10-08. IDs remain stable for the [story map](gap-map.md). “Present” means implemented in this repository; routine automated translation tests mock the provider.

| IDs | What the app currently provides |
| --- | --- |
| F-01–02 | Compact workspace/help/reset and OS-initialized light/dark theme. |
| F-03–05 | Local UTF-8 SRT choose/drop, strict 5 MiB/structure/markup validation, preserved source identity/timing, contained filename. |
| F-06–09 | Gateway language lookup and retry, NMT/TLLM choice, explicit Adult/Children profile, guarded Start, labelled cost/request estimates. |
| F-10–14 | Bounded continuation groups, joined input for both engines, response validation, approximate text-conserving redistribution, readability wrapping without retiming. |
| F-15–19 | Progress and request count, per-cue status/failure, bounded retry/quota cooldown, cancellation, in-tab recovery and edit protection. |
| F-20–24 | Virtualized paired review, scroll-follow, readability warnings, local editing and complete-only SRT download. |
| F-25–26 | 2,500-cue mocked browser virtualization workflow and structural/integrity automated tests. |

## Evidence boundary

The public URL and language route were reported working on 2026-10-08, but that does not prove paid NMT/TLLM output quality, every language/model pair, an owner allowance, or abuse controls. Reload recovery, telemetry, metadata, lives, Gemini, cloud subtitle storage, automatic retiming and closed-tab continuation are absent or deferred. See [project state](../../PROJECT_STATE.md), [build log](../../BUILD_LOG.md) and [requirements](../requirements/PRODUCT_REQUIREMENTS.md) for exact constraints.
