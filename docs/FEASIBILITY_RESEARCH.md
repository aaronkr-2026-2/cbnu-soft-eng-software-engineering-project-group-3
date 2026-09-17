# Feasibility and Research Findings

Research date: 2026-09-15; scope updated 2026-09-16

**Current decision:** cloud collection is telemetry only (location, target language, movie identity). Completed SRT storage and cross-user reuse are deferred. File-storage findings below are historical feasibility research, not instructions to implement or provision storage. See `ADR-001-TELEMETRY-ONLY.md`.

## 1. Executive conclusions

| Wishlist item | Feasible? | Correct interpretation |
| --- | --- | --- |
| React + TypeScript + Ant Design | Yes | Strong fit for interactive UI; use Vite and pin a mutually compatible stable set. |
| GitHub Pages CI/CD | Yes | GitHub Actions can build Vite and deploy `dist` on `main`; configure repository subpath base. |
| Official Google Translate | Yes, with setup/billing/auth | Replace the undocumented MVP endpoint. Official API accepts multiple input strings in one request. |
| Gemini translation | Yes | AI Studio can create a project/key; use session-only visitor-funded access, bounded context, structured cue output, and explicit browser-key risk. |
| User pastes a Gemini key | Confirmed current release model | It works technically, but a browser-delivered app cannot make the key secret. Hold it only in memory, never persist/log it, and require a fresh key after reload. |
| More text for better context | Sometimes | It reduces request overhead; Google NMT does not promise document context across separate `contents`. Gemini can use neighboring cues/context when prompted. |
| Movie/plot context | Optional and useful | Title/year/genre/short synopsis/names can reduce ambiguity; a full IMDb page or full plot is unnecessary. |
| Readable subtitle formatting | Yes, with warnings/editor | Use max lines, characters/graphemes, CPS, linguistic break preferences, and manual repair - not six words universally. |
| Keep translating in another tab | Best effort only in frontend | Hidden pages can be frozen; checkpoint/resume is feasible. Guaranteed closed-tab completion needs backend jobs. |
| IMDb/Rotten Tomatoes page scraping | Poor choice | CORS, markup changes, and data terms make it fragile. Parse IDs and call a permitted metadata API instead. |
| Firebase statistics | Yes | Store minimal events/aggregates; decide privacy and access before collecting location. |
| Store translated SRTs | Deferred by user | Use object storage, but consent, copyright, security, deletion/retention, matching, and a billing plan are required. |
| Reuse same movie/language subtitle | Deferred by user | Title/language is not enough; releases have different cue timings. Require a source/timing fingerprint and consent. |
| Three lives | Only with a defined backend rule | Client-only counters are easily reset. Identity, reset, failure, and privacy rules are presently missing. |
| Microservices | Technically yes, unjustified | Provider adapters and an optional serverless backend give useful decomposition without accidental complexity. |

## 2. Current Google Translate mechanism

The MVP calls:

```text
https://translate.googleapis.com/translate_a/single?client=gtx...
```

This is not the documented Cloud Translation integration. It is acceptable only as clearly disclosed MVP debt; it should not be called correct, stable, supported, or production-ready.

The official Cloud Translation API requires a Google Cloud project, API enablement, authentication, and potentially billing. Cloud Translation v3 accepts multiple strings in `contents` and returns translations in corresponding order. Google's quota page says the service is optimized for smaller requests, recommends about 5,000 code points per synchronous request, and caps a Cloud Translation Advanced request at 30,000 code points. More content increases latency.

For the confirmed visitor-funded static-app design, Cloud Translation Basic v2 is the practical key-based adapter; Advanced v3 does not accept API keys. A visitor must create a Google Cloud project, enable billing/API access, restrict the key, and paste it for the current session. Ordinary Google sign-in does not transfer a consumer Google/Translate subscription or the visitor's billing project to this app.

Published pricing currently applies a monthly $10 credit covering the first 500,000 translated characters, followed by $20 per million input characters for standard NMT. Charge by the actual source character count, not movie duration. For illustration, 100,000 source characters beyond an exhausted credit is about $2 at list price. Default content quota is 6,000,000 characters per minute per project and per user, with daily quota unlimited by default. A two-hour subtitle is therefore normally a sequence of bounded synchronous requests, not one giant call and not a half-day wait; actual project quotas, billing state, retries, and provider errors still govern completion.

Recommended strategy:

- batch enough cue/sentence units to approach a configurable few-thousand-character target;
- never exceed the provider/model limit;
- maintain stable IDs and validate result count/order;
- retry only failed batches;
- benchmark quality/latency/cost with representative English -> Mongolian and another language fixture;
- do not add a fixed 120 ms timer as the scheduling mechanism;
- use provider quotas and exponential backoff for actual rate control.

Sending multiple `contents` values improves network efficiency. The official page does not promise that the NMT model treats them as one document context. If context must cross cues, use an LLM-style structured request, a supported long-form model, or a tested grouping/alignment strategy.

## 3. Gemini integration plan

### Setup

Google AI Studio can automatically create a project and API key for a new Gemini developer. A special paid developer membership is not required just to prototype, but model availability, rate limits, data-use terms, and pricing depend on the selected tier/model.

Use the official `@google/genai` JavaScript/TypeScript SDK or current documented REST interface. Do not hard-code a model name forever; centralize it in provider configuration and record it with job results.

### Credential modes

1. Confirmed current release: the visitor enters their own Gemini API key for the current page session. Keep it in memory only and clear it on reload/close. Never put it in LocalStorage, SessionStorage, IndexedDB, Cache Storage, cookies, autofill, analytics, logs, URLs, crash reports, Firebase, source code, or telemetry.
2. Gemini OAuth is not a shortcut to a consumer subscription. It requires a Cloud project, enabled API, OAuth consent configuration, scopes, a client, and often app verification. Google AI Pro/Ultra benefits apply in AI Studio, while direct API calls from this external app use API-project quota/billing. OAuth is deferred until it provides a demonstrated advantage over BYOK.
3. A browser key is visible to the visitor and potentially to malicious dependencies, XSS, browser extensions, and developer tools. Be explicit about this residual risk; minimize dependencies and provide a clear/remove-key control.
4. Developer-only local server credentials belong in a gitignored `.env` file and production secrets belong in a secret manager. A visitor-pasted key must never be written to `.env`. Never expose secrets through `VITE_*`; Vite embeds those values into the public bundle.

### Request design

Use a bounded window of ordered cues with IDs and structured JSON output. A conceptual instruction should include:

- translate English into the specified target language/locale;
- use neighboring cues only as context;
- return exactly one result for every requested cue ID;
- preserve meaning, tone, intent, names, numbers, and profanity severity;
- preserve approved formatting/dialogue markers;
- do not add explanations, markdown, or missing dialogue;
- keep output concise enough for subtitle timing without deleting plot-critical content;
- follow an optional glossary for character/place/term consistency;
- report inability rather than silently omitting an ID.

Validate JSON/schema, ID set, duplicates, missing/extra results, empty output, and maximum output size before accepting a batch. Retry a smaller batch or offer manual recovery after validation failure.

Use the current Interactions API with structured output and `store: false` for the privacy-minimized stateless design. Do not depend on `previous_interaction_id`: stored interactions have provider retention and are unnecessary here. Repeat the compact fixed instruction and movie metadata for each bounded batch, include complete continuation groups, and add only a small read-only neighboring context window. This gives the model enough context for idioms such as “break a leg” while keeping cue-to-output alignment testable.

### Context metadata

Useful optional metadata: canonical title, year, media type, genre, short synopsis, character names, and a small glossary. It can improve ambiguous names, pronouns, idioms, and tone. It is not a prerequisite and should not block ordinary translation.

Do not send an entire IMDb/Rotten Tomatoes page. Resolve permitted structured metadata first. Avoid spoilers or overly long plot context unless the user explicitly wants it. Measure whether metadata improves a human-reviewed fixture before making it mandatory.

### Do not use asynchronous Gemini Batch API for the live UI

Google documents an up-to-24-hour service objective for Batch API jobs. That is useful for offline bulk work and lower cost, not the expected live card-by-card experience. Use synchronous bounded requests; consider server jobs only for durable background work.

## 4. Subtitle readability

There is no formal "nausea-safe subtitle" standard identified in the reviewed sources. Professional timed-text guidance focuses on readability, eye travel, line treatment, segmentation, and reading speed.

Netflix's English guide specifies:

- 42 characters per line;
- maximum two lines;
- normally one line unless the limit is exceeded;
- prefer breaks after punctuation and before conjunctions/prepositions;
- avoid separating grammatical units such as article+noun, adjective+noun, name parts, subject+verb, and auxiliary+verb;
- one speaker per line for two-speaker cues;
- up to 20 CPS for adult programs and 17 CPS for children's programs.

Implementation consequences:

- Six words is not a reliable universal limit. Word widths and scripts vary.
- Count Unicode grapheme clusters/display units, not UTF-16 code units.
- Use a language profile; a value derived from English guidance must be configurable and labeled.
- Generate at most two balanced lines.
- Preserve two-speaker structure based on source parsing, not target capitalization.
- Compute CPS as visible characters divided by cue duration.
- If translated text cannot satisfy both length and CPS without changing meaning/timing, flag it for editing; do not silently make three or more lines.
- Retiming and splitting one cue into new cues are separate advanced features because they can create overlaps and synchronization errors.

## 5. Background-tab feasibility

Chrome's page-lifecycle documentation states that browsers may freeze or discard background pages. In a frozen page, timers and fetch callbacks do not run; discarded pages run no JavaScript. Therefore a frontend cannot honestly guarantee continuous translation after tab suspension or closure.

Frontend improvement:

- remove unnecessary timer dependency;
- start a visible elapsed timer when a valid translation job starts; derive elapsed time from `Date.now() - startedAt` so throttled display ticks do not corrupt the duration;
- show a persistent warning card while a job is active telling the user to keep the tab open and active because the browser may suspend it;
- persist validated batches;
- save state at the hidden/freeze lifecycle boundary;
- restore and resume idempotently;
- stop invisible UI work while preserving job state;
- optionally use a Worker for CPU-heavy parsing/formatting, without promising it survives page freeze.

Guaranteed background service:

- submit a job to a backend;
- persist input/progress/results server-side;
- process idempotent batches with quotas/retries;
- let the UI reconnect to status;
- define cancellation, expiry, deletion, cost, authentication, and privacy.

## 6. Firebase and statistics — updated scope

Current plan uses Firestore for telemetry and aggregate statistics only. No subtitle object bucket or artifact collection is needed. Completed-file storage and reuse have been deferred by the user.

Recommended data design:

- `translationEvents/{eventId}`: minimal server-written completion metadata.
- `dailyAggregates/{date}` or dimension-specific aggregate documents: counts by country/language/title.
- No artifact collection or cloud SRT objects in current scope. Event fields must follow the telemetry-only requirements; movie/location values may be unknown.

Do not let public clients write arbitrary "successful" statistics. Validate completion server-side or accept that statistics are untrusted. Protect Firebase resources with restrictive rules, App Check, rate limits, and an identity plan. Anonymous Firebase Auth can provide a pseudonymous UID but is not proof of a unique person and does not stop determined abuse alone.

The user confirmed country-and-city telemetry on 2026-09-16. If derived from IP, it remains approximate and can be wrong due to VPNs/mobile networks. The acquisition method is still undecided. Never store the full IP for this feature. Disclose the purpose, minimize data, set retention, and provide a deletion/opt-out approach before collection.

## 7. Movie URLs and metadata

Direct browser scraping is blocked by CORS in many cases, breaks when page markup changes, and may violate service/data terms. A URL should be used only to extract a recognized title identifier after strict validation.

Practical route:

- IMDb URL -> extract `tt...` title ID -> use a permitted metadata provider.
- TMDB's official Find endpoint explicitly supports IMDb external IDs and can return matching movie/TV data.
- IMDb's current official developer API is a licensed GraphQL product delivered through AWS Data Exchange; its non-commercial datasets may be evaluated separately against the project's intended use.
- Rotten Tomatoes does not provide a public self-service API for this use. Its official help directs data/API requests to a business proposal. Accept the URL only as a hint and ask for title/year or use a permitted canonical provider; do not scrape it.

Filename match should normalize punctuation, release tags, separators, case, Unicode, and year, then show a confidence result. It cannot prove release/cut/timing compatibility.

## 8. CI/CD and linting

Vite's official deployment guide documents GitHub Pages deployment through Actions, including setting `base` to `/<REPO>/` for a project page. GitHub requires Pages deployment permissions such as `pages: write` and `id-token: write`.

CI should install from the lockfile and run typecheck, ESLint, tests, and build. Deployment uses the already checked `dist` artifact. Add a post-deploy smoke check if the course environment permits it.

For linting, use official recommended flat configs rather than chasing a popularity ranking. typescript-eslint documents recommended type-aware presets; these are more powerful but slower, so introduce them deliberately. Use React Hooks rules and Prettier for formatting.

## 9. Sources

- Google Cloud Translation: [Translating text](https://cloud.google.com/translate/docs/advanced/translating-text-v3)
- Google Cloud Translation: [Quotas and limits](https://cloud.google.com/translate/quotas)
- Google Cloud Translation: [Pricing](https://cloud.google.com/translate/pricing)
- Google Cloud Translation: [Authentication](https://cloud.google.com/translate/docs/authentication)
- Google Cloud Translation: [Supported languages](https://cloud.google.com/translate/docs/languages)
- Google Cloud: [API key best practices](https://cloud.google.com/docs/authentication/api-keys-best-practices)
- Gemini: [Using API keys](https://ai.google.dev/gemini-api/docs/api-key)
- Gemini: [OAuth quickstart](https://ai.google.dev/gemini-api/docs/oauth)
- Gemini: [Google AI plans and API billing](https://ai.google.dev/gemini-api/docs/google-ai-plans)
- Gemini: [Interactions API](https://ai.google.dev/gemini-api/docs/interactions-overview)
- Gemini: [Getting started](https://ai.google.dev/gemini-api/docs/get-started)
- Gemini: [Structured output](https://ai.google.dev/gemini-api/docs/structured-output)
- Gemini: [Batch API](https://ai.google.dev/gemini-api/docs/batch-api)
- Firebase: [Cloud Storage](https://firebase.google.com/docs/storage)
- Firebase: [App Check for web](https://firebase.google.com/docs/app-check/web/recaptcha-provider)
- Firebase: [Anonymous Auth for web](https://firebase.google.com/docs/auth/web/anonymous-auth)
- Chrome: [Page Lifecycle API](https://developer.chrome.com/docs/web-platform/page-lifecycle-api)
- Netflix: [English (USA) Timed Text Style Guide](https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide)
- TMDB: [Find by external ID](https://developer.themoviedb.org/reference/find-by-id)
- IMDb: [Developer metadata offering](https://developer.imdb.com/)
- IMDb: [Developer API sample queries](https://developer.imdb.com/documentation/api-documentation/sample-queries/)
- Rotten Tomatoes: [Help desk and business proposals](https://www.rottentomatoes.com/help_desk)
- Vite: [Deploying a static site](https://vite.dev/guide/static-deploy.html)
- GitHub: [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- typescript-eslint: [Linting with type information](https://typescript-eslint.io/getting-started/typed-linting)


## 10. Historical cost comparison — 2026-09-16

**Superseded scope:** the user subsequently removed completed SRT storage/reuse. Retain this research for reference only. Do not follow its file-upload recommendations unless the user restores that scope.

The user confirmed solo ownership and asked whether Firebase can be free, whether student credits exist, and whether file storage should be separate. The following are researched options and recommendations, not an approved deployment or collection policy.

### Firebase at no cost

Spark needs no payment method. Analytics is no-cost. Firestore Standard includes one free database with 1 GiB stored, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day, and 10 GiB outbound/month. These are operation limits, not user counts. See [Firebase pricing](https://firebase.google.com/pricing) and [Firestore quotas](https://firebase.google.com/docs/firestore/quotas).

Cloud Storage for Firebase requires Blaze, including existing buckets under the requirement effective from February 3, 2026. Blaze can still have a zero-dollar bill within included usage; it is not a fixed-price subscription. See [Storage billing changes](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024).

For new buckets, eligible US regions (us-central1, us-east1, us-west1) provide 5 GB-month storage, 5,000 Class A operations/month, 50,000 Class B operations/month, and 100 GB/month outbound from North America excluding destinations in China and Australia. Seoul-region storage does not get this regional storage allowance. These allowances are shared within the applicable billing-account scope, not multiplied by creating buckets. See [Google Cloud free tier](https://docs.cloud.google.com/free/docs/free-cloud-features).

Ordinary budget alerts do not stop spending. The currently documented Firebase spend-cap services do not include Firestore or Storage. Restrict uploads/reads and implement appropriate application limits; an email alert alone is not a storage spending ceiling. See [Avoid surprise bills](https://firebase.google.com/docs/projects/billing/avoid-surprise-bills).

### Is every translated SRT too much data?

Illustration only: assume 200 KB per final UTF-8 file, decimal units, one retained copy, no backups/versions. Measure real translated byte sizes before sizing production.

| Retained files | Approximate object data |
| --- | --- |
| 1,000 | 0.2 GB |
| 10,000 | 2 GB |
| 25,000 | 5 GB |
| 50,000 | 10 GB |
| 100,000 | 20 GB |

Thus even tens of thousands of files are technically modest. Storage is retained inventory, not a fresh monthly allowance of files. Requests, repeat downloads, retries, versions, and metadata incur separate usage. For example, 10,000 new uploads in a month can exceed the new Firebase bucket's free write-operation allowance even when the files total only 2 GB.

Recommendation: store one finalized artifact per opted-in result; do not upload after each translated cue/keystroke. Deduplicate exact content while preserving ownership and deletion semantics. Do not deduplicate solely by movie/language because releases have different timing. Let download succeed even if optional cloud saving fails. Rights to share, consent, retention, and access still need a decision before collecting every user's subtitle.

### Hybrid: Firestore metadata + Cloudflare R2 objects

R2 Standard includes 10 GB-month, 1 million Class A operations/month, 10 million Class B operations/month, and no direct egress charge. Additional Standard storage is $0.015/GB-month. An illustrative 20 GB retained all month costs approximately $0.15 in storage after the free 10 GB, assuming the allowance is otherwise unused; operations, API compute, and other services are separate. See [R2 pricing](https://developers.cloudflare.com/r2/pricing/).

R2 requires an account subscription/checkout and bills overages. It is not an unlimited or inherently no-billing option. See [R2 setup](https://developers.cloudflare.com/r2/get-started/).

The hybrid is feasible but adds cross-provider authentication, upload authorization, CORS, and metadata/object cleanup. Proposed flow: browser requests upload authorization from a trusted API; API validates identity/limits; browser uploads through an authorized route; verified completion records the object key in Firestore. R2 credentials stay server-side. The API has its own deployment and usage budget. This is an option, not implemented code.

### Telemetry and dashboard design

Firebase Analytics and custom Firestore events are different systems. For this app's Statistics tab, propose one minimal completion event and bounded aggregate summaries; never query the entire event history on every visit. For example, 10 aggregate document reads per visit and 1,000 visits/day use about 10,000 reads/day before other traffic. Avoid per-cue telemetry. A Spark client-only prototype cannot make its reports trustworthy merely with App Check or anonymous identity; label them client-reported. Trusted ingestion/aggregation requires backend execution, and Firebase Functions need Blaze ([pricing](https://firebase.google.com/pricing)). Country-and-city precision is confirmed; its acquisition method, retention, and collection controls remain open.

### Student support

No dedicated Firebase student pricing tier was found on its official pricing page. Eligible faculty can apply for teaching credits of up to $50 per student and $100 per teaching staff; ask the instructor whether this course can participate. Eligibility and applicable services must be checked, not assumed. See [Google Cloud for faculty](https://cloud.google.com/edu/faculty).

Eligible new customers can receive $300 of Google Cloud trial credit valid for 90 days, with payment verification. This is temporary and not student-specific. Verify coverage for each billed service ([trial terms](https://docs.cloud.google.com/free/docs/free-cloud-features)). Students can also request 200 Google Skills credits, which are for learning resources rather than this app's hosting bill ([student program](https://cloud.google.com/edu/students)). Do not treat consumer Gemini subscription offers as API or hosting funds.

### Earlier recommendation — superseded by telemetry-only scope

1. Keep GitHub Pages, local file download, and the translation core as the protected scope. Translation API charges are separate from storage.
2. Add minimal Firestore statistics when its data rules are settled; a Spark prototype is possible with explicitly untrusted client events.
3. For shared files, prefer Firebase Storage initially if billing is acceptable: fewer services to operate alone. Choose R2 when expected downloads/retained volume justify its extra integration work.
4. Keep storage provider, monthly budget, upload consent, retention, and deletion as open decisions. No claim that an unlimited public service will remain free.
