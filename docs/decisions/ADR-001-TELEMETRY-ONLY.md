# ADR-001: Telemetry-only cloud persistence

Status: Accepted

Date: 2026-09-16

Decision owner: project owner (solo developer)

## Context

The user reviewed Firebase/R2 file-storage options and explicitly decided to remove completed SRT storing for now. Cloud collection should contain user location, target language, and movie identity. No application or cloud deployment changes have been made in this documentation task.

## Options considered

### Option A — telemetry and stored subtitle files

- Benefit: enables future cross-user subtitle reuse.
- Cost: adds file hosting, access/deletion, and billing responsibilities.
- Evidence: retained architecture and cost rationale in ADR-004 and docs/guides/PROVIDER_AUTH_AND_COST.md.

### Option B — telemetry only

- Benefit: supports the Statistics view with a smaller solo-project scope.
- Cost: no saved-file retrieval or cross-user subtitle reuse.
- Evidence: explicit user instruction on 2026-09-16.

## Decision

Choose Option B. Defer completed SRT cloud upload/storage and cross-user reuse. Keep local download and browser-local checkpoints. Approved telemetry dimensions are country and city, target language, and movie identity. A minimal event ID/completion-time envelope is proposed for deduplication and the existing 30-day statistics; do not interpret this as permission for persistent user tracking.

No subtitle text/files may be stored as telemetry or project cloud artifacts. Required translation-provider requests are a separate purpose; this decision does not mean translation runs offline or change the provider's own data policies.

## Consequences

- No Firebase Storage/R2 integration, object credentials, artifact records, or file-hosting milestones are needed now.
- Use Firestore metadata/aggregates for the Statistics design.
- Country-and-city precision is confirmed. The acquisition method, telemetry retention, and collection controls remain open.
- Keep unavailable movie/country/city values unknown; do not invent values or collect full filenames as a shortcut.
- Telemetry errors must not prevent local download.
- Durable jobs requiring cloud subtitle persistence need a new user decision.
- Implementation verification must inspect telemetry payloads for subtitle leakage and check duplicate-event handling and failure isolation. No such implementation tests have been run yet.

## Validation/revisit trigger

Revisit only when the user explicitly requests cloud file storage/reuse or another feature requiring persisted subtitle data. A past research recommendation is not a revisit trigger.

## AI involvement

AI updated the documentation to reflect the user's decision. See `../../AI_LOG.md`, entry "Telemetry-only cloud scope — 2026-09-16". Storage proposals were deferred by the user; unresolved details were left open.
