# Cloud Translation gateway setup

Updated: 2026-09-18

The project owner funds translation. Visitors need neither a Google account nor an API key.

## Local development

1. Enable **Cloud Translation API** and billing in the owner's Cloud project.
2. Create a key restricted to that API. The gateway is server-to-server; a Websites/referrer application restriction does not match local gateway calls. Choose appropriate server restrictions for the deployment when available. Never solve a blocked key by sending it to the browser.
3. Create ignored `.env` from `.env.example`; set `GOOGLE_CLOUD_API_KEY` and `GOOGLE_CLOUD_PROJECT_ID`. Do not share the values in prompts, screenshots or logs.
4. Keep `GOOGLE_TRANSLATE_TLLM_LOCATION=us-central1` unless a different exact model/location has been verified. The earlier local smoke test succeeded there; `asia-northeast3` returned `400 Invalid Value`. This is observed evidence, not a claim about all future regional availability.
5. Run `npm ci`, then `npm run dev` to start both Vite and the Node gateway.
6. Open `http://localhost:5173`. Languages load automatically. Choose an English SRT, NMT/TLLM, target language and reading profile, then Start. The separate paid Check service probe has been removed.

The Vite dev server proxies `/api` to the gateway. Only the gateway reads `.env`. `npm run dev:client` starts Vite alone and cannot translate without a running gateway. Restart `npm run dev` after changing gateway configuration.

The Basic v2 language endpoint provides the NMT catalogue. It does not validate every TLLM language pair/model/location. An unsupported selection must return a visible error; representative TLLM coverage still needs a live benchmark.

## Troubleshooting and verification

Language-loading errors have a retry control. Translation failures appear under affected cue cards. Retry retains successful output and saved edits in the current tab. Reload recovery is not implemented. The terminal prints only upstream status plus an allowlisted category, never text, provider messages, project IDs or credentials.

`daily_quota` and `rate_limited` are different failures. Google's daily quota resets at midnight Pacific Time; per-minute limits need their quota window to recover. A quota error does not prove a DDoS shield. Consult the actual project quotas. [Google quota documentation](https://docs.cloud.google.com/translate/quotas).

Run `npm run check`, `npm run format:check`, `npm run test:e2e` and `npm run check:build` for local verification. These use mocked translations. A human should separately test a small original grouped subtitle in both engines and review timing, wording, request count and usage before running full films. Do not place live provider calls in CI.

## Public deployment

GitHub Pages can host the frontend but cannot run the private Node gateway. Select a gateway host, configure its secrets and allowed frontend origin, and implement the owner budget/allowance and abuse/rate controls before public translation. No production gateway, authentication or enforced public allowance is currently claimed. GitHub build-time environment values embedded into a Vite bundle are public.

Sources: [Cloud Translation setup](https://docs.cloud.google.com/translate/docs/setup), [v2 translate contract](https://docs.cloud.google.com/translate/docs/reference/rest/v2/translate), [API-key practices](https://docs.cloud.google.com/docs/authentication/api-keys-best-practices).
