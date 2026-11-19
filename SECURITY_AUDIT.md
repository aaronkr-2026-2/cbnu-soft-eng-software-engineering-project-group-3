# Security and Privacy Audit

Audit date: 2026-10-29 (Asia/Seoul).

Audited baseline: `a601f658b1f171a03287dc7ca426b6c33417f743`, synchronized from `origin/main` before inspection. This report and its supporting records are the only task changes; application behavior and dependency versions are unchanged.

## Result

No actual API key, access token, password, private key, personal email address, or developer home-directory path was detected in current application source. No credential-shaped secret was found in the reachable historical file contents or freshly generated browser bundle. Placeholder configuration and mocked test keys were inspected and classified as non-secrets.

**The repository is not free of personal information.** Existing Git author/committer metadata contains real names and email addresses. `.classroom50.yaml` contains the student's public account handle, numeric account ID and assignment acceptance timestamp. On 2026-10-29 the owner explicitly chose to preserve the course linkage and existing history, document these exceptions, and use a generic identity for this audit commit. Values are deliberately omitted from this report. No history rewrite or force-push is part of this task.

The dependency audit found six affected development packages (four high, two moderate); the production-only audit reported zero known vulnerabilities. Public translation cost/abuse controls remain unverified. These findings prevent an unconditional security approval.

## Scope and method

- Started from a clean working tree and fast-forwarded to the fetched GitHub `main`.
- Inspected all 101 tracked baseline files, including hidden configuration, frontend/backend code, tests, examples, documentation, the archived MVP and course assets.
- Enumerated all fetched local/remote refs with `git for-each-ref` and scanned `git rev-list --objects --all` through `git cat-file`: 32 reachable commits, 415 unique file blobs and 178 tree objects. The clone was not shallow; no local tag refs were present. Counts describe the baseline before this audit commit.
- Used temporary local Python scans for email addresses, home paths, known owner identifiers, private IP literals, Google/GitHub/GitLab/OpenAI/npm/Slack/Stripe/AWS credential signatures, private-key blocks, JWTs, credential-bearing URLs/query parameters and credential assignments. Output recorded locations/categories rather than sensitive values. Manually reviewed every assignment hit.
- Supplemented signatures with a quoted-literal entropy check: at least 24 token characters, mixed case plus digits, entropy at least 4.3 bits/character, excluding hexadecimal hashes and lockfile/binary payloads. It found no unclassified candidates. This heuristic does not prove that arbitrary secrets are absent.
- Checked sensitive tracked filenames and historical paths, ignore rules, Vite configuration, CI permissions and generated `dist` files. Local `.env` values, Git credentials and deployment secrets were not opened or printed.
- Extracted all five PDF pages and metadata using the bundled PDF tooling: no signature/email/known-owner matches, no author metadata and no attachments. Both binary assets have only one reachable historical version. Visually reviewed the screenshot: mocked subtitles and a generic sample filename; PNG chunks contained only image structure/data, with no text/EXIF metadata chunks.
- Queried the npm advisory service against the committed lockfile, including a separate production-only query; reviewed upstream Vite/Vitest advisories. Reviewed existing security-related tests and ran the repository checks below. No paid translation request or attack against the deployed service was made.

## Privacy and secret findings

| ID | Finding and evidence | Status |
| --- | --- | --- |
| P-01 | Git commit author/committer records expose identity and email addresses. Commit-message scans found no email or home-path matches; metadata is a separate exposure. | Retained by explicit owner choice. This audit commit uses a generic author and committer. |
| P-02 | `.classroom50.yaml`, especially its `owner` fields, links the course assignment to a public account and acceptance time. This is personal linkage, not a credential. | Retained by explicit owner choice to preserve course tooling. |
| P-03 | Current tracked file contents contained no email/home-path matches. The known owner-identifier match was the course linkage above. Fictional personas are explicitly labelled fictional; public repository/deployment URLs remain intentional project identifiers. | No incidental personal-data cleanup identified. Public handles/URLs can still link activity to an account. |
| S-01 | `.env.example` and the provider setup guide use replacement instructions. Gateway tests use an obviously synthetic credential. A historical frontend hit was a variable reference in a request header, not a literal secret. | Reviewed false positives; retained to preserve documentation and tests. |
| S-02 | Current and historical sensitive-path checks found only `.env.example`; no tracked `.env`, `.nev`, private-key or matching Google/service-account credential file was found. Ignore checks covered environment overrides, credential examples and `.vercel/project.json`. `git ls-files -ci --exclude-standard` was empty. | Passed for inspected paths. Ignore rules cannot protect an explicit force-add or an unrecognized filename. |
| S-03 | `translationGateway.mjs` reads the server environment and sends the key in Google's request header. `googleTranslate.ts` uses same-origin gateway routes. Vite disables environment-directory loading; CI grants read-only repository contents access. | Existing server/client boundary verified by source inspection and mocked tests. No real key was used in verification. |
| S-04 | Fresh `dist` scan found no email, home-path, known-owner or credential-pattern matches. `check:build` also rejected legacy endpoints, key markers, source maps and archived HTML. | Passed for this build; deployment output was not downloaded or independently audited. |

Changing a file or future commit identity does not erase older commits. GitHub documents both [commit email privacy](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address) and the consequences of [removing sensitive data from history](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository). If a credential is later discovered, revoke/rotate it first; decide separately whether coordinated history cleanup is necessary.

## Application threat review

| Threat / asset | Existing control | Remaining limitation |
| --- | --- | --- |
| Provider credential disclosure | Server environment only; fixed Google endpoint; header authentication; sanitized handled failures; no-store gateway responses. | Vercel/Google secret configuration, platform request logs and access policies were not inspected. |
| Malicious subtitle/provider markup | Strict SRT validation; attribute-free balanced i/b/u grammar; React text rendering; validated provider output. Existing tests reject script tags and unsupported formatting. | This is source/test evidence, not an exhaustive XSS penetration test. |
| Large requests and resource exhaustion | 5 MiB local file bound; gateway body bound of 100,000 bytes; streamed-body rejection; bounded string count and TLLM characters. | Upstream response buffering has no explicit size bound; the local gateway has no independent upstream timeout. The Function duration limit is not a spending cap. |
| Unauthorized paid API use | Production fails closed unless the enablement flag is explicitly true; local gateway listens on loopback. | **High priority:** no application authentication or repository-enforced public allowance/rate limit. A direct caller can bypass UI scheduling and client limits once the gateway is enabled. Verify owner allowance/exhaustion behavior, Vercel Firewall rate rule and Google budget/quota controls before public enablement. Their deployed settings remain TBD. |
| Subtitle/filename/location privacy | Subtitle state and downloads remain local; browser sends translation units rather than raw filenames to the gateway; no telemetry implementation or cloud subtitle store was found. | Translation necessarily sends subtitle text to Google. Provider/platform retention and deployed logging behavior were outside this audit. Country/city acquisition, retention and notice remain unresolved future scope. |
| Historical MVP usage | Archived HTML remains outside the production build; current browser code uses only the gateway. | The archive and older frontend designs remain public history and are not production security patterns. |

## Dependency findings

`npm audit --package-lock-only --json` reported **6 affected packages: 4 high, 2 moderate, 0 critical**. All six lockfile entries are marked development dependencies. Package counts include inherited findings and are not counts of distinct exploitable application flaws. `npm audit --omit=dev --package-lock-only --json` reported **0 known vulnerabilities**; this is not a general safety guarantee.

| Locked package | Severity | Advisory evidence / next step |
| --- | --- | --- |
| `vite` 8.3.0 | High | Registry findings include editor-launch issues and development-server file access. See the upstream [file-access advisory](https://github.com/vitejs/vite/security/advisories/GHSA-rq7h-c2jc-7f22). npm offered the non-major 8.3.5 update. |
| `vitest` 5.0.1 | Moderate | Inherits `@vitest/mocker` findings; npm offered the non-major 5.0.5 update. |
| `@vitest/mocker` 5.0.1 | Moderate | [Unauthenticated mock registration](https://github.com/vitest-dev/vitest/security/advisories/GHSA-qxg6-89mg-rqv8) and [Windows traversal](https://github.com/advisories/GHSA-xp26-3454-mjgp). Resolve through the Vitest update. |
| `source-map-js` 1.2.1 | High | [Indexed source-map denial of service](https://github.com/advisories/GHSA-68fv-2mgg-jv7q); registry affected range ends before 1.2.2. |
| `undici` 8.10.2 | High | Multiple registry findings, including [redirect/cache disclosure](https://github.com/advisories/GHSA-4w7w-5xrc-9h26) and [TLS-option validation bypass](https://github.com/advisories/GHSA-2m5v-pch6-74hx); reported affected ranges end before 8.12.2. |
| `zod` 4.6.5 | High | [Oversized collection memory exhaustion](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5); registry affected range ends before 4.6.6. |

These are recorded as open findings; no package upgrade or `npm audit fix` was applied. A focused dependency change should update the lockfile and repeat compatibility/security checks. Development dependency status does not eliminate developer/CI exposure. The server uses Node's built-in `fetch`, so this npm audit also does not assess the Node runtime's bundled HTTP implementation.

## Verification and changes

Verification used bundled Node 24.22.1 and a temporary npm 10.9.9 CLI. Initial sandbox-only DNS failures were retried with network permission. Dependencies were installed from the unchanged lockfile using `npm ci --ignore-scripts --no-audit --no-fund`; no package lifecycle scripts were run.

| Command / check | Outcome |
| --- | --- |
| `npm run check` | Passed: typecheck, zero-warning lint, 108 Vitest tests across 9 files, production build and documentation links. |
| `npm run format:check` | Passed. |
| `npm run check:build` | Passed. |
| `npm audit --package-lock-only --json` | Findings: 6 affected development packages; not a passing security gate. |
| `npm audit --omit=dev --package-lock-only --json` | Passed: 0 known production dependency vulnerabilities. |
| Tracked-file/history scan, extracted PDF, screenshot and fresh bundle review | Results and retained privacy exceptions recorded above. |
| `git diff --check` and final staged-file review | Recorded in the task's build/AI evidence before commit. |

Changes: added this report; updated project state, the documentation map, build evidence and both required AI logs; included this root report in the documentation-link checker. The scans indicated no secret or incidental personal-value removal. Course linkage and history were retained under the owner's clarification. Dependency remediation remains open.

Browser workflows were not rerun because application behavior did not change. No live provider acceptance, deployed penetration test, Firewall/budget verification or external human review is claimed. The existing production bundle-size warning remains.

## Limits and follow-up

This is a point-in-time source, reachable-history and build audit. Pattern searches cannot establish the absence of every arbitrary, encoded or unrecognized secret or personal detail. The scan did not cover unreachable/deleted Git objects, GitHub-only pull-request refs, forks/clones, issue/comment text, Actions artifacts/logs, account settings, GitHub secret-scanning status or deployment secrets/configuration. The report intentionally contains no discovered personal values or secret material.

Keep the accepted identity disclosures visible as exceptions. Resolve the development dependency findings in a focused update. Keep public translation gated until cost/abuse controls have owner-approved evidence; retain the timeout/response-bound findings for later reliability work. Previously closed issues are not reopened or represented as completed by this audit.
