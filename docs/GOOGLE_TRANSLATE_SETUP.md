# Cloud Translation gateway setup

The product owner funds translation. Visitors never need a Google account or API key.

## Local development

1. Enable **Cloud Translation API** and billing in your Google Cloud project.
2. Create a Cloud Translation-restricted API key.
3. Copy `.env.example` to `.env` without committing it.
4. Set `GOOGLE_CLOUD_API_KEY` and the non-secret `GOOGLE_CLOUD_PROJECT_ID`. The gateway defaults TLLM to `us-central1`, which was verified locally on 2026-09-18 with a minimal translation request. Do not set `GOOGLE_TRANSLATE_TLLM_LOCATION` to `asia-northeast3` (Seoul): the same request returned `400 Invalid Value` there. Set an override only after verifying that exact model/location combination.
5. Run `npm run dev`. It starts both the local gateway and the Vite client.
6. Open `http://localhost:5173`, choose NMT or TLLM, and click **Check service**.

The Vite client proxies `/api` to the local gateway. The gateway reads the key; Vite does not load `.env`, and the browser never receives the key. `npm run dev:client` starts only Vite and therefore cannot translate.

If a job stops, read the browser error, then read the local terminal that runs `npm run dev`. It reports only the upstream HTTP status and one safe category (`key_restriction`, `billing`, `api_not_enabled`, `daily_quota`, `quota`, `rate_limited`, `invalid_request`, or `access_denied`). `daily_quota` means wait until midnight Pacific Time; `rate_limited` means wait about one minute. It never writes subtitle text, provider error text, the key, or the project ID. Restart `npm run dev` after changing gateway code or `.env`.

## Public deployment

GitHub Pages cannot safely run the gateway. Deploy the gateway separately and store the key in that platform's secret manager. Before public traffic, define a monthly budget, Cloud quota, gateway rate limits, request limits, and an abuse policy. Do not put the key in GitHub Pages secrets, frontend variables, or `VITE_*` variables.

## TLLM

TLLM needs an API key plus a full project/location model resource. The gateway builds that resource from `GOOGLE_CLOUD_PROJECT_ID` and `GOOGLE_TRANSLATE_TLLM_LOCATION`. The Basic v2 language-list endpoint rejects a full TLLM model resource, so the picker uses the default NMT catalogue and Check service verifies the selected TLLM model with a tiny translation. Test NMT and TLLM on subtitle fixtures before selecting the default.

Sources: [Cloud Translation setup](https://docs.cloud.google.com/translate/docs/setup), [Translation LLM](https://docs.cloud.google.com/translate/docs/translation-llm), [API-key best practices](https://docs.cloud.google.com/docs/authentication/api-keys-best-practices).
