# 08 — Implement R4 named BOM model and validators

**Blocked by:** 03 — Lock exact lookup result-state contract

**Status:** closed

## What to build

Replace the flat BOM model with the R4 local named BOM domain model and full-store validation. This makes later UI/import/export safe instead of patching legacy state.

## Acceptance criteria

- [x] Persist `partsource_boms:v1` as `{ version: 1, activeBomId, boms }`.
- [x] BOM has immutable UUID, unique trimmed case-insensitive name, createdAt, updatedAt, and items.
- [x] BOM item has immutable UUID, quantity, notes, user/imported USD cost, origin, verificationStatus, and immutable selection snapshot.
- [x] All writes validate the complete resulting store before mutation.
- [x] Storage failure keeps in-memory state and exposes a visible persistence warning.

## Evidence

- `npm run lint` — passed (`tsc --noEmit`).
- `npm exec -- tsx scripts/test-bom-storage.ts && npm exec -- tsx scripts/test-bom-domain.ts` — passed.
- `npm test` — passed.
- `npm run build` — passed, generated production bundle and static metadata.

## Audit resolution — 2026-08-10

Closed as a bounded local named-BOM domain milestone. Current focused BOM storage/domain tests pass. This closure does not imply catalog, supplier-handoff, or release readiness.

Audit: `research/wayfinder-ticket-audit-2026-08-10.md`.
