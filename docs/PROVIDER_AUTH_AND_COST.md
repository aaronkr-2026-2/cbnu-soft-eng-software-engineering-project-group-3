# Cloud Translation access, models, and cost

Status: Owner-funded gateway selected on 2026-09-18. See [ADR-004](ADR-004-OWNER-FUNDED-CLOUD-TRANSLATION.md).

The product uses only official Google Cloud Translation models. Gemini Developer API is not a product provider.

| Option | Product explanation | Request model |
| --- | --- | --- |
| NMT | Fast general-purpose translation of the supplied text. It translates sentences/text, not individual dictionary words. | `nmt` |
| TLLM | Google's specialized Translation LLM. Google positions it for higher quality. It can only use context that the request actually supplies; the current one-cue-per-string implementation does not supply cross-cue context. Test language coverage, quality, speed, and cost before making it the default. | `projects/PROJECT_ID/locations/REGION/models/general/translation-llm` |

The project owner pays Cloud Translation costs. A visitor never creates, enters, or sees an API key. The browser sends only an authenticated job request to the project's gateway. The gateway sends the chosen model request to Google using `GOOGLE_CLOUD_API_KEY` from a local ignored `.env` or production secret manager.

Never pass the key through `VITE_*`, browser storage, URLs, logs, telemetry, downloaded files, source code, or Git. GitHub Pages alone cannot host this private gateway.

## Cost controls required before public release

- Set a monthly budget and billing alerts in the Cloud project.
- Set Cloud Translation quota limits.
- Set gateway request-size, rate, and concurrency limits.
- Decide the public allowance and the response when it is exhausted.
- Record actual NMT/TLLM usage separately from estimates.

The current NMT UI estimate is historical implementation evidence only: it counts pending provider-bound input code points at `$20 / 1,000,000`. It cannot see credits, trial balance, TLLM output characters, or actual billing. Current pricing must be rechecked before release. [Cloud Translation pricing](https://cloud.google.com/products/translate/pricing).

## Development configuration

The local gateway needs these values in ignored `.env`:

```text
GOOGLE_CLOUD_API_KEY=replace-with-your-key
GOOGLE_CLOUD_PROJECT_ID=replace-with-your-project-id
GOOGLE_TRANSLATE_TLLM_LOCATION=us-central1
```

The project ID and location are needed for TLLM's full model name. Do not add any value with a `VITE_` prefix.

## Sources

- [Cloud Translation Basic v2](https://docs.cloud.google.com/translate/docs/reference/rest/v2/translate)
- [Translation LLM](https://docs.cloud.google.com/translate/docs/translation-llm)
- [Cloud Translation model comparison](https://docs.cloud.google.com/translate/docs/advanced/compare-models)
- [Cloud Translation pricing](https://cloud.google.com/products/translate/pricing)
