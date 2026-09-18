# Project State

Last updated: 2026-09-18

## Product and ownership decisions

This is a solo project. The intended audience is tech-savvy movie viewers who already obtain `.srt` subtitle files and want a translation in their preferred language.

The product will offer two official Cloud Translation choices:

- **NMT** — the fast general-purpose model. It translates the sentence/text supplied to it; it is not a word-by-word dictionary.
- **TLLM** — Google's specialized Translation LLM, intended for higher-quality translation and better use of supplied context. Its performance, language coverage, latency, and cost must be measured on representative subtitle fixtures before it becomes the default.

Gemini Developer API is removed from product scope. The app will not show a Gemini option, prompt contract, or visitor key field.

Translation is owner-funded. The React browser app must call a server-side translation gateway; the gateway reads `GOOGLE_CLOUD_API_KEY` from ignored `.env` during local development and from a secret manager in production. The key is never bundled by Vite, committed, logged, sent to telemetry, or stored in the browser. On 2026-09-18, NMT and TLLM minimal live requests succeeded using the configured local key/project without exposing either value. The requested Seoul TLLM location (`asia-northeast3`) returned `400 Invalid Value`; the gateway therefore defaults to the verified `us-central1` location. Public deployment also needs a hosting decision plus a defined budget, rate limit, and abuse-control policy. See [ADR-004](docs/ADR-004-OWNER-FUNDED-CLOUD-TRANSLATION.md).

Cloud scope remains telemetry only: country/city, target language, and movie identity after its open privacy decisions are resolved. Completed subtitle storage, sharing, cloud checkpoints, and cross-user reuse remain deferred.

## Current implementation

The React/TypeScript/Vite/Ant Design client is on local `main`. Its browser shell uses Ant Design `Layout` (`Header`, `Sider`, and `Content`), `Flex`, `Card`, `Modal`, `Popover`, and `Tooltip` rather than generic structural wrappers; subtitle-specific rows retain focused CSS for paired-cue behavior. The 52 px header has no subtitle text and exposes compact theme, help, and repository controls. Its theme switch displays a sun or moon and describes the next theme on hover; its workflow modal has one explicit `OK` action. The sidebar begins with `Select your English subtitle`; its service help text is replaced with a question-mark popover limited to a compact 210 px reading width. The compact desktop sidebar applies its 20 px gap to Ant Design's rendered child container. Its configuration area, including the cost explanation, scrolls separately above a stationary bottom region for action buttons, job progress, and download. The content pane has a compact sticky, centered `Subtitle preview` header with source/translation labels directly below it, 6 px horizontal content padding, and no cue-row rail or left inset. The NMT estimate labels its whole-file cost, character count, request count, and three-attempt retry ceiling; TLLM remains explicitly unquoted. The large cue list uses `@tanstack/react-virtual`, which measures cue rows and mounts only the viewport plus a small buffer; an edit in progress remains mounted while the user scrolls. It contains local UTF-8 SRT parsing/serialization, supported markup validation, subtitle quality warnings, editing, download, progress, cancellation, and the owner-funded gateway client. `npm run dev` now starts both Vite and the local Node gateway; using the old client-only command left the gateway unavailable and caused the observed 502 service-check error. The gateway reads ignored `.env`, proxies only NMT/TLLM requests, and keeps the key outside Vite and the browser. It categorizes upstream failures for the browser and writes only HTTP status/category to the local terminal; it now distinguishes per-minute from daily quota messages and never logs subtitle text, provider messages, or credentials. Cue rows are memoized and the job yields after each batch to reduce full-file UI freezes. It now has minimal live NMT/TLLM evidence; it has not been tested on a real SRT fixture or deployed publicly.

Source inspection on 2026-09-18 confirmed that continuation groups are currently visual only. The app submits separate cue/speaker strings in the `q` array, so both NMT and TLLM currently translate cues independently; neither path provides conversation-aware translation or semantic cue alignment. A bounded group request and validated structural mapping are planned before contextual-translation claims are restored. ADR-004 records the provider boundary.

The historical one-file MVP is preserved at `archive/mvp/srt-translator-beta-3.html` and local tag `mvp-baseline` (`b64bc59`). It uses an undocumented consumer endpoint and is not part of the production build.

`examples/demo.srt` is a 40-cue original demonstration fixture. It exercises multiline dialogue, speaker breaks, and the supported `<i>`, `<b>`, and `<u>` tags without bundling a complete third-party subtitle file. Full downloaded subtitle files remain local manual-test inputs and must not be committed.

## Evidence boundary

Earlier local checks recorded in [BUILD_LOG.md](BUILD_LOG.md) passed against mocked provider responses. On 2026-09-18, minimal live `Hello.` NMT and TLLM requests succeeded without exposing the key; that is service smoke-test evidence only. There is no real-SRT live test, production gateway, public deployment, remote CI/Pages evidence, or human translation-quality review. Do not describe any of those as complete.

## Next implementation steps

1. Build and test the local gateway that reads the ignored `.env` key without exposing it to Vite.
2. Select a production gateway host and define cost, rate-limit, and abuse controls before public deployment.
3. Implement NMT and TLLM model selection through that gateway and run a human-reviewed quality/cost benchmark.
4. Implement bounded connected-dialogue groups and validated cue alignment for the chosen contextual path.

## Records

[AI_LOG.md](AI_LOG.md) is the short professor-readable record. [docs/AI_DETAILED_LOG.md](docs/AI_DETAILED_LOG.md) preserves detailed evidence and historical entries. `AGENTS.md` is the canonical working agreement; `GEMINI.md` and `CLAUDE.md` only direct those tools to it.

Completed user prompts that change repository files require one verified local commit before the task report. A remote push, merge, rebase, reset, or history rewrite remains an explicit user action, not an automatic step.
