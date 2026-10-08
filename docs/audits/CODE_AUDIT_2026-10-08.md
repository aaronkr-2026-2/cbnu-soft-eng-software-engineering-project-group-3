# Code and documentation audit — 2026-10-08

Scope: tracked application code, adapters, tests, build/deploy configuration, current product documents and the original MVP's Git provenance. This is a static/code-and-mocked-test evaluation, **not** a live provider, penetration, cost-control or human translation-quality audit. The attached “5. Literature Review” PDF is a research-methodology lecture; its comparison/evidence/gap approach informed the product tables, but it supplies no persona template.

Correction after this dated audit: the owner supplied the intended *5. Features, Stories* lecture later on 2026-10-08. The product documents were then revised to its persona/scenario/story/feature/gap/creep-audit structure; see [product index](../product/README.md). The original audit findings below remain a historical snapshot.

## Findings and action

| Area | Evidence | Result / action | Residual limit |
| --- | --- | --- | --- |
| Repository ownership | Initial commit contains README/resources; Classroom50 commit adds `.classroom50.yaml` and feedback/autograde history. | Left those starter files, `.github/` and `resources/` in place. Moved only application code and student documentation. | Do not infer permission to alter course-owned files later. |
| Old product code | Search of active `frontend/src`, `backend/server`, `api`: no Gemini, visitor-key, Firebase, Statistics or undocumented consumer endpoint implementation. | Removed the no-op `TranslationProvider.clear()` contract, a remnant of the old visitor-key design. Retained explicitly superseded ADRs as history, not instructions. | No broad deletion of working SRT logic was justified. |
| Structural separation | Typecheck/build and same-origin Function tests after moves. | `frontend/` contains browser code and e2e tests; `backend/` contains the gateway/local adapter; root `api/` contains only Vercel-discovered entrypoints. Root npm/config/docs remain orchestration. | Two independently deployed services would require a new decision and add CORS/operations cost. |
| Invalid API success JSON | Provider adapter validates envelope, list/count, strings, markup and source structure before saving. New null/array/number/object fixtures and Chromium failure/retry flows. | Malformed 200 language JSON shows a recoverable error; malformed translation JSON cannot enable download or crash the page. An English-only language list no longer marks setup ready. | This is structural safety, not a guarantee of semantic correctness or browser behavior for every possible payload size. |
| Request-size abuse | Local Node reads with a 100 kB limit. The Function adapter previously called `arrayBuffer()` before checking actual size when `Content-Length` was absent. | Function adapter now stops reading after the byte limit and returns 413; irregular/empty request JSON is rejected before Google. | Provider output size, public request rate and monthly spending are not yet server-enforced. |
| Deadlocks/hangs | No locks, shared-memory waits or circular request dependency in the inspected flow; client calls are sequential with bounded retries and a 15 s attempt timeout. | No reproducible deadlock found. Cancellation/stale-result checks and retry tests remain. | A local upstream fetch has no separate server-side timeout and can occupy work after client timeout; Vercel's 30 s Function maximum is not a local-server bound. Do not claim deadlock-free under every runtime failure. |
| Build/unused code | TypeScript `noUnusedLocals`/`noUnusedParameters`, zero-warning ESLint, artifact scan, code search and tests. | No other demonstrably unreachable active feature branch was removed. The archived MVP is outside `dist`. | Static checks cannot prove every path reachable or every failure mode tested. |
| Deployment/docs | Root `/api` location checked against [Vercel's Vite guidance](https://vercel.com/docs/frameworks/frontend/vite) and [project configuration](https://vercel.com/docs/project-configuration/vercel-json). | Kept two thin root adapters, Vite output at root `dist`, same-origin URLs and a single shared core. Reorganized docs and added local-link verification. | This refactor has not itself been deployed or paid-smoke-tested. |

## Remaining work, in priority order

1. Owner-defined public allowance/exhaustion and Vercel Firewall/Google quota/budget evidence before claiming controlled production use. The existing enablement switch is not a limit.
2. Controlled live NMT/TLLM tests and human translation/timing review on a small original fixture; do not use mocked results as quality evidence.
3. Add a measured server-side upstream deadline/cancellation policy if real latency or duplicate-cost observations justify it; do not arbitrarily shorten TLLM requests.
4. Implement browser-local reload checkpoints at the scheduled milestone. In-tab retry is not durable recovery.
5. Validate Teddy/Jenna stories with real users and obtain external peer review. The attached PDF is not evidence that this happened.
