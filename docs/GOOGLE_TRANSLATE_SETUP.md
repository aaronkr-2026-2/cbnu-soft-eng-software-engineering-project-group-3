# Cloud Translation gateway setup

The product owner funds translation. Visitors never need a Google account or API key.

## Local development

1. Enable **Cloud Translation API** and billing in your Google Cloud project.
2. Create a Cloud Translation-restricted API key.
3. Copy `.env.example` to `.env` without committing it.
4. Set `GOOGLE_CLOUD_API_KEY` and the non-secret `GOOGLE_CLOUD_PROJECT_ID`. The gateway defaults TLLM to `asia-northeast3` (Seoul); set `GOOGLE_TRANSLATE_TLLM_LOCATION` only to override it after confirming TLLM availability in that region.
5. In one terminal run `npm run dev:gateway`.
6. In another terminal run `npm run dev`.
7. Open `http://localhost:5173`, choose NMT or TLLM, and click **Check service**.

The Vite client proxies `/api` to the local gateway. The gateway reads the key; Vite does not load `.env`, and the browser never receives the key.

## Public deployment

GitHub Pages cannot safely run the gateway. Deploy the gateway separately and store the key in that platform's secret manager. Before public traffic, define a monthly budget, Cloud quota, gateway rate limits, request limits, and an abuse policy. Do not put the key in GitHub Pages secrets, frontend variables, or `VITE_*` variables.

## TLLM

TLLM needs an API key plus a full project/location model resource. The gateway builds that resource from `GOOGLE_CLOUD_PROJECT_ID` and `GOOGLE_TRANSLATE_TLLM_LOCATION`. Test NMT and TLLM on subtitle fixtures before selecting the default.

Sources: [Cloud Translation setup](https://docs.cloud.google.com/translate/docs/setup), [Translation LLM](https://docs.cloud.google.com/translate/docs/translation-llm), [API-key best practices](https://docs.cloud.google.com/docs/authentication/api-keys-best-practices).
