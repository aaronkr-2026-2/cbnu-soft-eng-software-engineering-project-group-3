# Translation Provider Authentication and Cost

Status: User-funded provider usage accepted; implementation design accepted for the current release

Date: 2026-09-16

Development setup guide added 2026-09-17: [Google Cloud Translation key setup](GOOGLE_TRANSLATE_SETUP.md). It covers account setup and the local test flow. The official Basic v2 NMT adapter is implemented; live key/restriction/CORS verification remains pending.

Provider distinction checked 2026-09-17: Cloud Translation offers NMT and Translation LLM, while the general Gemini API used by this project's prompt contract is a separate integration. The [migration plan](REACT_MIGRATION_PLAN.md) proposes Basic v2 NMT first and keeps Gemini unavailable until its adapter is implemented. Keep credentials restricted to their provider. Google currently excludes newly granted $300 welcome credits from Gemini API/AI Studio usage; a shared billing account does not imply credit eligibility. Sources: [Cloud Translation models](https://docs.cloud.google.com/translate/docs/translate-text), [Gemini billing](https://ai.google.dev/gemini-api/docs/billing).

Implementation update 2026-09-17: the React app uses a native uncontrolled credential input, a private in-memory adapter field, header-only credentials, API language lookup plus a six-character translation test, bounded NMT requests, and no fallback. Its cost estimate uses exact encoded input code points and distinguishes automatic retry allowance from manual retries. No developer `.env` value enters Vite. Gemini is still unavailable.

## 1. Product decision

The project owner will not fund public Google Translate or Gemini calls. A visitor must provide credentials for the selected provider for the current browser-tab session. Ordinary Google Sign-In and consumer Google AI/Gemini subscriptions are not substitutes for API credentials or API billing.

Current release:

- Gemini: user supplies a current Gemini API authorization key created in Google AI Studio.
- Google Translate: user supplies an API key from a Google Cloud project with Cloud Translation Basic enabled and billing configured as required by Google.
- The key remains only in application memory for the current tab. Reloading or closing the page clears it.
- OAuth is not part of the current public-web release. Google's Gemini OAuth quickstart still requires a Cloud project, OAuth client configuration, scopes, and production authorization work. It does not make the user's consumer Gemini subscription pay for direct API calls.

## 2. Credential UI

- Selecting a provider displays its masked credential field, provider setup link, short cost warning, Test key action, and Clear key action.
- Use a password-style input outside an ordinary login form and request autocomplete off. The application must never copy the key to localStorage, sessionStorage, IndexedDB, cookies, Cache Storage, Firebase, telemetry, URLs, logs, exceptions, analytics, checkpoints, downloaded files, or source code.
- The Start action remains disabled until the selected provider credential passes a minimal validation request and other job inputs are valid.
- Changing provider or clearing/reloading the page destroys the in-memory reference. Completion should clear it when no retry/resume operation still needs it; if resume needs a provider call after reload, the user must enter the key again.
- Tell the user that browser JavaScript must access the temporary key to call Google and that installed extensions/devtools can observe page memory/network traffic. Do not claim stronger protection than a public browser can provide.

## 3. Secret rule

This rule is non-negotiable:

- Never hard-code, commit, print, log, analyze, transmit as telemetry, or persist any API key, token, password, service-account file, or client secret in application data.
- Never store a visitor-entered key in browser persistence or autofill-enabled application state. Hold it only in volatile memory and send it only to the selected official provider endpoint.
- Developer-owned secrets used by server code belong in a local `.env` file that is gitignored. Commit only an `.env.example` containing names and placeholders.
- Production developer secrets belong in the hosting platform's secret manager/environment configuration, not in a deployed `.env` file.
- Vite `VITE_*` variables are bundled into public frontend JavaScript and can never contain a secret.

The browser cannot write a visitor's key into the developer's `.env`, and doing so would violate the no-persistence requirement. Therefore user BYOK credentials are memory-only; `.env` applies to local server-side developer secrets.

## 4. Gemini request lifecycle

Do not emulate one endless informal chat. Use bounded, stateless translation requests so retries and cue mapping remain predictable and so the project does not opt into stored Interaction history.

1. Build one `MovieContext` from permitted metadata: canonical title, year, media type, genres, short synopsis, character names, and optional glossary. Do not send an entire IMDb/Rotten Tomatoes page.
2. Build a bounded batch of complete continuation groups. Include stable cue IDs, timecodes/durations, source dialogue segments, per-cue capacities, and a small preceding/following context window.
3. Send the fixed system instruction plus the batch with `store=false` using the current Google Gen AI interface supported at implementation time.
4. Require JSON Schema output containing exactly one translation for every requested cue ID.
5. Validate schema, IDs, emptiness, dialogue boundaries, and size/CPS constraints. Retry only the failed batch; use one constrained repair request before marking cues for review.

The prompt instructs Gemini to translate meaning, intent, tone, idioms, jokes, profanity severity, and character relationships rather than literal word sequences. For example, “break a leg” must be translated as a wish for good luck when that is its contextual meaning.

Google's current Interactions API stores interactions by default and documents retention of 55 days on paid tier or one day on free tier. `store=false` avoids Interaction storage but also prevents `previous_interaction_id`. This project therefore repeats bounded movie/context data instead of keeping a server-side movie-long conversation.

## 5. Gemini subscription limitation

Google documents that Google AI Pro/Ultra benefits apply inside the AI Studio Playground/Build interfaces. Direct Gemini API usage from an external application is billed and managed separately. A “Sign in with Google” button would identify/authorize the person; it would not automatically transfer their consumer Gemini allowance to this app.

## 6. Google Cloud Translation sizing and cost

Cloud Translation does not translate a two-hour SRT in one synchronous call. The API recommends about 5,000 code points per request; Advanced has a 30,000-code-point hard limit and Basic a 100 KB request-size limit. The application should use bounded batches and retry failed batches.

Current official NMT pricing provides the first 500,000 input characters per month free through a monthly credit, then charges $20 per million input characters. The default general-model quota is 6,000,000 characters per minute and daily characters are unlimited unless the project owner lowers the quota.

Example, not a promise: if the actual provider-bound subtitle text is 100,000 characters, its list-price usage above an exhausted free credit is about `$2.00` (`100,000 / 1,000,000 × $20`). A typical movie is therefore not expected to trigger a half-day wait under default quota, but actual character count, the user's remaining monthly credit, configured quotas, retries, target count, and current pricing control the result.

Before Start, show:

- exact source characters that this job will send to Cloud Translation;
- estimated number of batches;
- official list-price worst-case estimate for one target language;
- a note that the app cannot see the user's remaining credit or billing agreement;
- a link to Google's current pricing/quota pages.

The app must not promise that a job is free.

## 7. Why ordinary Google login is insufficient for Translate

Cloud Translation API calls belong to a Google Cloud project for quota and billing. Basic v2 accepts API keys; Advanced v3 uses Google Cloud credentials rather than API keys. A consumer Google account login alone does not supply a billed Translation project. A user-owned OAuth/ADC flow would require the user to own/configure a Cloud project and quota project, which is unsuitable as a one-click public-web login.

The current public BYOK design uses Basic v2 with the visitor's project key. The user should restrict the key to Cloud Translation and, when supported by the credential type, to the deployed website origin. If secure browser use proves incompatible with current provider requirements, disable that provider rather than silently falling back to the undocumented `translate_a/single` endpoint.

## References

- [Gemini API keys](https://ai.google.dev/gemini-api/docs/api-key)
- [Gemini OAuth quickstart](https://ai.google.dev/gemini-api/docs/oauth)
- [Google AI plans and API limitation](https://ai.google.dev/gemini-api/docs/google-ai-plans)
- [Gemini Interactions storage](https://ai.google.dev/gemini-api/docs/interactions-overview)
- [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output)
- [Cloud Translation authentication](https://cloud.google.com/translate/docs/authentication)
- [Cloud Translation quotas](https://cloud.google.com/translate/quotas)
- [Cloud Translation pricing](https://cloud.google.com/translate/pricing)
- [Google Cloud API-key practices](https://cloud.google.com/docs/authentication/api-keys-best-practices)
