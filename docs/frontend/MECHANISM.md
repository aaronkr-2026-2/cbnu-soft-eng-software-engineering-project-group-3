# Frontend mechanism

Updated: 2026-10-08. `frontend/src/` is the browser app; `frontend/e2e/` holds mocked Chromium workflows.

| Layer | Path | What it owns |
| --- | --- | --- |
| App/UI | `frontend/src/app/`, `frontend/src/features/translator/` | Ant Design shell, settings, virtual paired review, editing, local job state and download. |
| SRT domain | `frontend/src/core/srt/` | Strict parse/serialize, original cue identity/time strings, safe supported markup. |
| Subtitle domain | `frontend/src/core/subtitles/` | Continuation grouping, structural units, approximate redistribution, wrapping and readability checks. |
| Provider boundary | `frontend/src/services/translation/` | `/api` calls, batching, estimates, timeout/retry, response-shape and result validation. |

## From file to download

1. Parse a local UTF-8 `.srt` (≤5 MiB) or show a visible import error; do not partially import invalid blocks.
2. Discover languages through `/api/translation/languages`, validate the JSON, exclude English, then require an explicit reading profile before Start. A malformed or empty target list keeps Start unavailable and offers Retry.
3. Build bounded groups from lowercase/ellipsis continuations. Both NMT and TLLM receive joined speech; speaker/sound/music structure may create separate inputs. Estimate cost from these prepared inputs.
4. Send batches sequentially. Timeouts, transient failures and a visible cancelable quota cooldown have bounded retries. A malformed 200 response is treated as a failure; no result is saved until count, text and structure checks pass.
5. Distribute joined output approximately across only its source cues, preserve exact original times, show review warnings and allow edits. Download only when every cue is valid. Reload/closed-tab recovery is not implemented.

`useTranslator.ts` guards stale file reads, canceled jobs and late API results. `job.ts` keeps valid sibling groups after a local redistribution error and preserves completed groups/edits during in-tab retry. The domain modules do not import React or network code. See [formatting contract](../requirements/SUBTITLE_FORMATTING_SPEC.md) and [architecture](../ARCHITECTURE.md).
