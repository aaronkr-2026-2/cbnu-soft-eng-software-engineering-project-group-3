# ADR-006: Joined speech for both models and local redistribution

Status: Accepted direction from the owner's voice memo; algorithm details are implementation choices requiring human quality review.

Date: 2026-09-18

## Context

The original MVP joined continuing speech before translating. The React port preserved only visual groups and instead submitted each cue separately. The owner explicitly requires restoration of join → translate → distribute → wrap for both NMT and TLLM. This supersedes ADR-005's proposal to keep NMT independent and investigate marked TLLM output.

## Decision

Use one shared domain grouping/normalization pipeline for both official models. Append cues beginning with a lowercase letter or `...` / `…`; other starts begin a new group. Inspect visible text through supported markup. A technical bound of 64 cues and a preferred 5,000 normalized source characters prevents unbounded groups. Oversized single inputs still receive explicit request-limit validation.

Remove soft display newlines, joining words with spaces. Preserve punctuation and meaningful annotations. Explicit source speaker turns and bracket/music sections have their own translation units; an uninterrupted speech unit can span several cues. Request batching may pack many such units together but does not join their contexts.

After validated provider results, distribute a joined translation over its contributing cues using available reading capacity and language-aware boundaries. Then apply line wrapping. Keep source cue numbers, order, count and timecodes. Keep all returned text, balanced supported markup, bracket descriptions and music markers. Never use source-word ratios or duplicate a short result to populate empty cues.

Distribution is a deterministic layout approximation. It does not infer which translated words were spoken at each timestamp. Mark redistributed speech for review. If one group's response cannot populate every cue safely, retain valid sibling groups, fail that group visibly and allow retry; transport failures apply to the submitted batch. Preserve edits and completed original groups during retry.

No invented `CUE:101` marker is sent to Google. The documented API maps input strings to results; it does not promise preservation or semantic alignment of arbitrary internal cue markers. Earlier assistant advice overstated what those markers could guarantee.

## Consequences

- Both NMT and TLLM now receive connected speech instead of only visual grouping.
- Group detection can mistake lowercase dialogue or miss continuation beginning with a capital letter. This is the owner's chosen heuristic, not speaker recognition.
- Technical bounds can split long continuing speech; the UI and provider use the same bounded group definition.
- Reordering by the target language can shift meaning between original time slots. Human review remains necessary; preserving text/timing cannot prove perfect synchronization.
- The 42-grapheme / two-line / Adult 20 CPS / Children 17 CPS reference remains. Overflow is visible and editable; automatic retiming and silent shortening remain excluded.
- Concurrency is not introduced in this revision. Benchmark sequential grouped throughput before changing request scheduling.

## Verification

Automated evidence must cover joined payloads for both engines, speaker/sound boundaries, Unicode and markup, output conservation, timecode preservation, insufficient output, group-specific failure, edit-safe retry and downloaded output. Live subtitle quality is separate human evidence, not a mocked-test claim.

Sources: [Google v2 translate contract](https://docs.cloud.google.com/translate/docs/reference/rest/v2/translate), [Google quotas](https://docs.cloud.google.com/translate/quotas), [Netflix English timed-text guidance](https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide).
