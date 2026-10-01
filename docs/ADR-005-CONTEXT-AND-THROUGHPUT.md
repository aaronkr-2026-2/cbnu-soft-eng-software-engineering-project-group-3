# ADR-005: Context and throughput strategy

Status: Superseded by ADR-006 on 2026-09-18. The content below records an earlier proposal, not current instructions.

Date: 2026-09-18

## Problem

The current gateway sends one `q` string per cue or speaker segment. Cloud Translation returns one response per supplied `q` item. The UI's continuation-group label changes only presentation; it does not change the request. Therefore neither NMT nor TLLM currently receives cross-cue dialogue context.

Sending the entire movie as one request is not an acceptable fix. It risks provider limits and latency, cannot reliably assign reordered target text to the original timecoded cues, and would repeat the retired proportional-splitting error.

## Proposed direction

Keep the current one-cue-per-result path as the reliable NMT baseline. It is the speed-oriented choice and must not claim connected-dialogue context.

Add a separate TLLM contextual path only after a proof-of-mapping spike. It will:

1. build a bounded connected-dialogue group in domain code;
2. preserve each source cue ID using an internal structural representation that the provider demonstrably preserves;
3. submit that group as one provider input, not an unrelated `q` array of cues;
4. validate every returned cue ID, count, supported formatting tag, and nonempty result before committing any result in the group;
5. fail the group safely rather than guessing how to split a changed or missing marker.

The structural representation, group maximum, time-gap rule, and fallback behavior are `TBD` until a representative live proof confirms that NMT/TLLM retain the required markers. The initial experiment must use a small original fixture, not a full third-party subtitle file.

## Throughput and UI plan

- Keep bounded requests. Google recommends smaller translation requests and notes that larger input increases latency.
- Measure NMT sequential throughput before adding concurrency. If a rate limit and budget are defined, test a small bounded server-side concurrency level with stable cue-ID mapping and cancellation.
- Do not infer another website's provider, terms, concurrency, or cost model from its apparent speed.
- The current UI optimization memoizes cue rows, skips off-screen layout/paint, and yields after each batch. If a full-file profile still shows long tasks or excessive DOM memory, introduce a windowed list after lifting per-row edit drafts into parent state.

## Acceptance evidence before enabling contextual TLLM

- A fixture proves that a multi-cue group is returned with every structural marker intact.
- Tests reject missing, duplicated, reordered, or altered markers without corrupting completed cue output.
- A human compares NMT independent-cue output, TLLM independent-cue output, and TLLM contextual-group output for the same fixtures.
- Record latency, requests, input/output character use, quota errors, and user-visible quality findings.
- Contextual TLLM is enabled only if the measured quality improvement justifies the additional cost and latency.

## Sources

- [Cloud Translation Basic v2 translate method](https://docs.cloud.google.com/translate/docs/reference/rest/v2/translate)
- [Cloud Translation quotas and request-size guidance](https://docs.cloud.google.com/translate/quotas)
- [Translation LLM](https://docs.cloud.google.com/translate/docs/translation-llm)
