# 09 — Build named BOM manager UI

**Blocked by:** 08 — Implement R4 named BOM model and validators

**Status:** closed

## What to build

Add minimal high-density UI to create, switch, rename, duplicate, and delete named local BOMs. This must stay boring and useful, not dashboard cosplay.

## Acceptance criteria

- [x] Empty state starts with no BOM and asks user to create one.
- [x] Create uses next available `BOM n` name.
- [x] Rename rejects blank/colliding names.
- [x] Duplicate deep-copies item snapshots with new UUIDs and unique copy name.
- [x] Delete requires confirmation and selects next/previous BOM or leaves `activeBomId: null` after final deletion.
- [x] All operations address BOM UUIDs, not list indexes.

## Evidence

- `npm run lint && npx tsx scripts/test-bom-domain.ts && npx tsx scripts/test-bom-storage.ts` — passed.
- `npx playwright test tests/browser/bom-manager.spec.ts` — passed, 2/2.

## Audit resolution — 2026-08-10

Closed as the bounded named-BOM manager milestone. Its local UI/domain evidence is sufficient for the listed criteria; it does not clear blocked catalog or release dependencies.

Audit: `research/wayfinder-ticket-audit-2026-08-10.md`.
