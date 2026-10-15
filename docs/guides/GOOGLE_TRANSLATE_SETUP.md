# Cloud Translation gateway setup

Updated: 2026-10-08 — modular folders and Vercel Functions deployment

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

Vercel is the confirmed production target. The repository contains two same-origin Functions:

- `GET /api/translation/languages?model=nmt|tllm`;
- `POST /api/translation`.

The Functions and local Node server use `backend/server/translationGateway.mjs`, so provider validation and sanitized failures stay aligned. Vite builds `frontend/` into root `dist`; `vercel.json` configures both root `api/` Function entrypoints with a 30-second maximum duration. This single-project layout preserves same-origin routes.

Deployment checklist:

1. Sync the desired Classroom repository commit into the personal fork connected to Vercel; verify the deployed commit before testing. This local refactor is not automatically published.
2. Confirm Vercel detects Vite, runs `npm run build`, and uses `dist` as the output directory.
3. In Vercel Project Settings, add `GOOGLE_CLOUD_API_KEY`, `GOOGLE_CLOUD_PROJECT_ID`, and `GOOGLE_TRANSLATE_TLLM_LOCATION` to the required Production/Preview environments. Never use `VITE_*` and never commit or print their values. Environment changes apply only to a new deployment.
4. Leave `TRANSLATION_GATEWAY_ENABLED` absent or `false` initially. A production Function then returns the sanitized `gateway_disabled` category without calling Google.
5. Choose the monthly owner budget, public allowance, and exhaustion behavior. Configure Google Cloud quota/budget controls and publish a Vercel Firewall rate-limit rule covering `/api/translation` and `/api/translation/languages`. The exact allowance remains an owner decision; do not invent it. CORS is not a rate limit and does not stop direct scripted calls.
6. Set `TRANSLATION_GATEWAY_ENABLED=true` in the intended Vercel environment and redeploy.
7. Verify the language route, then perform one controlled minimal NMT and TLLM smoke translation. Record the deployment URL, commit, date, status, request count and sanitized failure category. Do not record subtitle text, keys, project identifiers, or raw provider errors.

The browser uses relative `/api` paths, so frontend and Functions are same-origin and no production CORS allowlist is required. The former hardcoded `http://localhost:5173` CORS header has been removed; local development continues through Vite's proxy.

Official references: [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite), [Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js), [environment variables](https://vercel.com/docs/environment-variables), [Function limits](https://vercel.com/docs/functions/limitations), and [Vercel rate limiting](https://vercel.com/kb/guide/add-rate-limiting-vercel).

Google sources: [Cloud Translation setup](https://docs.cloud.google.com/translate/docs/setup), [v2 translate contract](https://docs.cloud.google.com/translate/docs/reference/rest/v2/translate), [API-key practices](https://docs.cloud.google.com/docs/authentication/api-keys-best-practices).
