# SRT Translator

SRT Translator converts an English `.srt` subtitle file into a selected language while preserving cue order and timing. It is designed for tech-savvy movie viewers who can obtain subtitle files but want to watch in their preferred or mother language.

## Product vision

**For** tech-savvy movie viewers with a language barrier, **who** want to enjoy downloaded, burned, or ripped movies in their preferred language, **SRT Translator** is an online subtitle translation tool **that** turns an English `.srt` file into an editable, ready-to-use subtitle file while preserving its timing. **Unlike** [Syed G Akbar's Subtitle Translator](https://www.syedgakbar.com/), **our product** is designed to translate connected conversation with context and preserve the resulting text in the correct subtitle cues instead of chopping a conversation into disconnected fragments.

## Translation models

The product will offer two official Cloud Translation choices:

- **NMT:** fast, general-purpose translation of the supplied sentence/text.
- **TLLM:** Google's specialized Translation LLM, intended for higher-quality, context-aware translation. It must be benchmarked on representative subtitles before it becomes the default.

Gemini Developer API is not part of this project.

## Security and cost

Visitors never enter API keys. The project owner funds translation through a server-side gateway. The local gateway reads `GOOGLE_CLOUD_API_KEY` from ignored `.env`; production must use a hosting secret manager. The React/Vite browser client must never receive the key.

The public release is blocked until the gateway host, monthly budget, rate limits, and abuse controls are selected. See [ADR-004](docs/ADR-004-OWNER-FUNDED-CLOUD-TRANSLATION.md) and [provider/cost details](docs/PROVIDER_AUTH_AND_COST.md).

## Current state

The React client currently supports local UTF-8 SRT import (up to 5 MiB), parsing/serialization, supported `<i>`, `<b>`, and `<u>` tags, profile-based readability warnings, editing, cancellation, progress, and download. Its current direct-browser NMT/key UI is obsolete and must be replaced by the owner-funded gateway before public release.

The historical MVP is preserved at [archive/mvp/srt-translator-beta-3.html](archive/mvp/srt-translator-beta-3.html). It uses an undocumented endpoint and is not built or deployed.

## Records and development guidance

[AGENTS.md](AGENTS.md) is the canonical working agreement. [PROJECT_STATE.md](PROJECT_STATE.md) records what is currently true. `GEMINI.md` and `CLAUDE.md` are small pointers that tell those coding tools to read `AGENTS.md`.

[AI_LOG.md](AI_LOG.md) is a short professor-readable record. [docs/AI_DETAILED_LOG.md](docs/AI_DETAILED_LOG.md) contains detailed historical evidence. [BUILD_LOG.md](BUILD_LOG.md) contains check results.
