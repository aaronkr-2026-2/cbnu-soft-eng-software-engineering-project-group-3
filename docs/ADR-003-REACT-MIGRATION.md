# ADR-003: React client and official Translation adapter

Status: Accepted for the requested implementation

Date: 2026-09-17

Decision owner: project owner (solo developer); implementation details selected within the requested migration.

## Context

The user requested implementation of the React migration and official Google Translate plan. The historical HTML conflates Gemini with the undocumented Translate endpoint, skips malformed blocks, and proportionally redistributes translated words. The user has a local Git-ignored credential file, but ADR-002 requires visitor-funded session-only browser credentials.

## Decision

Use React 19.3, Ant Design 6.6, Vite 8.3, and TypeScript 5.9 with npm's exact dependency versions and lockfile. TypeScript 5.9 is inside the installed typescript-eslint support range; the newest TypeScript major was not selected because it falls outside that range. Use supported ESLint 10 recommended rules, typescript-eslint, React Hooks, and Prettier. Initial ESLint 9 installation was replaced after npm reported it deprecated.

Use Vitest 5 + jsdom + Testing Library for domain/provider/hook tests and Playwright for production-browser workflows with intercepted HTTP. Runtime HTTP uses native fetch. No global state library, Google server SDK, backend, or Firebase package is required for this increment.

Implement the documented Cloud Translation Basic v2 NMT endpoint behind TranslationProvider. Use bounded arrays of cue strings, or separate speaker segments where required. Retain whole cue segments in one batch, with a preferred 5,000 input code-point threshold, 128-string limit, and conservative 90,000-byte request limit beneath Google's 100 KB Basic limit. A single larger cue may exceed the preferred character target if it remains under hard limits; otherwise stop with a source-edit error. Validate output count/markup and map using request IDs/order before committing a batch. Network/timeout/429/5xx errors have at most two retries; permission/client errors stop. No fallback endpoint exists.

Use a native uncontrolled password input and a private adapter field for volatile credentials. Clear the visible input when testing starts, cancel/clear on explicit action, and destroy the adapter key on successful completion/unmount. Vite env loading is disabled (`envDir: false`); no `.env` injection or project-funded proxy is permitted. Direct browser key/restriction/CORS behavior still requires live verification.

The user explicitly selected: Statistics hidden; an explicit Adult/Children profile choice; current desktop Chrome, Edge, Firefox, Safari; a 5 MiB UTF-8 input limit; and only balanced `<i>`, `<b>`, `<u>` tags without attributes. Other formatting is an import error. Source indexes/timecodes remain intact, unlike historical renumbering. Failed/cancelled jobs preserve completed work only within the current tab. Reload checkpoints remain the later milestone.

## Consequences and limits

- The original HTML remains unchanged and tagged locally, excluded from production dist.
- Unknown or malformed subtitle blocks fail import instead of silently dropping data.
- Gemini is visibly unavailable. Statistics and all project telemetry remain absent.
- Supported markup is rendered through React text nodes/styles, never trusted innerHTML. Changed provider tag structure causes batch rejection rather than a guessed repair.
- Quality formatting enforces visible-length/CPS warnings and fixed speaker breaks. General grammatical analysis across languages is not implemented; conservative English protection and punctuation/word boundaries are documented as limited.
- Tests do not prove live account compatibility, human translation quality, all-browser performance, or deployment success.
- The application currently has a >500 kB production chunk; optimization awaits measured need.
- Main-only Pages deployment is gated by checks and requires Pages to be configured for GitHub Actions. No key is a CI/deployment secret.

## Validation

Actual commands and outcomes belong in BUILD_LOG.md. Source/runtime tests use synthetic fixtures and fake keys. Human review of all implementation decisions and the live walkthrough remain pending in AI_LOG.md.

## Sources

- [Vite setup](https://vite.dev/guide/)
- [Ant Design with Vite](https://ant.design/docs/react/use-with-vite/)
- [Cloud Translation v2 translate](https://docs.cloud.google.com/translate/docs/reference/rest/v2/translate)
- [Cloud Translation quotas](https://docs.cloud.google.com/translate/quotas)
- [Cloud Translation pricing](https://cloud.google.com/products/translate/pricing)
