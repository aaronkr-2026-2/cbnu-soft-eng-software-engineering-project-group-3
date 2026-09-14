# AI_LOG.md

Every time you update your project, please make a note of what you did in the `AI_LOG.md` file, according to the following template.

---

## Milestone 1 — September 15, 2026
**Tool(s) used:** Claude (Sonnet 5, claude.ai)

**What I asked for:** A single-page web app called SRT Translator Beta that translates English `.srt` subtitle files using the Google Translate API. Core spec included a sidebar (file picker, searchable language dropdown, translate/download buttons, progress display), a two-column live view of original vs. translated subtitle cards with gray/blue/green status colors, and a sentence-grouping algorithm that merges subtitle blocks belonging to the same spoken sentence (based on lowercase-continuation and ellipsis-continuation rules) before sending a single translation request, then splits the result back across blocks proportional to word count. I later added: custom line-formatting rules for translated text (new line on second+ "- Capital" dialogue markers, 6-word line wrapping), a "Translation engine" dropdown (Google Translate / Google Gemini, both currently backed by the same API), and a live stats panel (start time, API call count, finish time).

**What I kept as-is:** The modular architecture (SRTParser, SentenceGrouper, TranslationService, WordSplitter, ProgressManager, UIRenderer, DownloadGenerator, Utils), the proportional word-count splitting logic, and the overall sidebar/two-column layout. Kept the unofficial `translate.googleapis.com` endpoint since it requires no API key.

**What I changed or rejected, and why:** Had the AI refactor `TranslationService` into an engine registry (rather than a single hardcoded provider) so the new "Translation engine" dropdown could route to different providers later without touching the rest of the app — this was me anticipating the Gemini integration I'll need to do for real later in the semester.

**Something the AI got wrong that I had to catch:** N/A this milestone — will track going forward as I test edge cases in the sentence-grouping and word-wrapping logic more thoroughly.

---
