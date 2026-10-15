# Cloud Translation access, models and cost

Updated: 2026-10-08. Current decisions: [ADR-004](../decisions/ADR-004-OWNER-FUNDED-CLOUD-TRANSLATION.md), [ADR-006](../decisions/ADR-006-JOINED-SPEECH-REDISTRIBUTION.md).

## Models and requests

| Option | Meaning | Google model |
| --- | --- | --- |
| NMT | Fast general-purpose translation of supplied text. | `nmt` |
| TLLM | Specialized Translation LLM; quality must be reviewed for the selected language. | `projects/PROJECT_ID/locations/REGION/models/general/translation-llm` |

Both receive normalized joined continuation speech under the same domain rules. Batching several independent strings is a transport optimization, not a promise of context between them. Local distribution preserves cue identities/times but approximates placement of translated words. Gemini Developer API is excluded.

The browser calls only same-origin `/api` routes without a provider credential. Locally, Vite proxies those routes to the Node adapter. On Vercel, Functions invoke the same gateway core directly. The core reads `GOOGLE_CLOUD_API_KEY` from ignored `.env` or Vercel environment variables and adds it to Google's `x-goog-api-key` header. There is currently no application authentication layer; do not describe these browser requests as authenticated jobs. [Google key guidance](https://docs.cloud.google.com/docs/authentication/api-keys-best-practices).

## Estimates shown in the app

List prices verified for this revision: NMT $20 per million input characters; standard TLLM $10 per million input characters plus $10 per million output characters. The app counts the actual prepared input strings in Unicode code points, including encoded markup/entities, as an estimate. JSON envelope bytes are separate request-size accounting. [Official pricing](https://cloud.google.com/products/translate/pricing).

The selected-engine card displays a stable whole-file estimate and clearly identifies remaining work. For TLLM, preflight output characters are assumed equal to input characters; this is an explicitly labelled estimation assumption, not a measured expansion ratio or upper bound. Actual output, retries, account credits, discounts and billing can change the final charge. The app cannot read the owner's $300 trial balance or Cloud bill. Do not advertise a guaranteed maximum cost.

Request count means planned HTTP translation batches. During the job, the actual counter includes automatic and manual translation attempts. Automatic language discovery sends no translated Hello probe and is not counted as a translation attempt.

## Limits and production controls

Google recommends approximately 5,000 code points per request; Basic permits at most 100K bytes. TLLM also has a 30,000-character request limit. The app uses smaller preferred batches and a 90,000-byte client margin. Rate and quota limits still apply; grouping or concurrency does not bypass them. [Quotas and limits](https://docs.cloud.google.com/translate/quotas).

Google documents per-minute quota exhaustion as HTTP 403 `User Rate Limit Exceeded`, not only HTTP 429. The gateway therefore maps only the allowlisted per-minute category to `rate_limited`, forwards a numeric `Retry-After` when usable, and otherwise supplies 60 seconds. The browser shows the cooldown and retries the same batch at most twice after the initial attempt; Cancel interrupts the wait. Ordinary transient failures use short bounded exponential delays. Daily quota, billing, permission and invalid-request categories still stop immediately.

This recovery does not prove why one account reached its limit, change the Cloud project's quota, or enforce the future public allowance. The observed run reported a rate limit after two application requests, so the project's actual quota configuration and other same-project usage must be checked in Google Cloud before interpreting request count alone. Adding a fixed pause after every successful batch would reduce throughput without reliably matching a character- or request-based quota window.

Vercel is the selected gateway host. Production code fails closed unless `TRANSLATION_GATEWAY_ENABLED=true`, but that flag is not a usage limit. Before setting it, define a monthly owner budget, public allowance and exhaustion behavior; publish a Vercel Firewall rate limit for the Function paths; and configure appropriate Google quotas/budget alerts. Budgets/alerts alone are not an application spending stop. Keep the API key out of `VITE_*`, browser persistence, URLs, telemetry, logs and downloads.

## Local configuration

Only placeholder names belong in the repository:

```text
GOOGLE_CLOUD_API_KEY=replace-with-your-key
GOOGLE_CLOUD_PROJECT_ID=replace-with-your-project-id
GOOGLE_TRANSLATE_TLLM_LOCATION=us-central1
TRANSLATION_GATEWAY_ENABLED=false
```

See [setup](GOOGLE_TRANSLATE_SETUP.md). Prior minimal NMT/TLLM connectivity evidence is recorded separately from this revision's mocked tests. Full grouped-subtitle quality and the model-specific language catalogue still need human/live verification.
