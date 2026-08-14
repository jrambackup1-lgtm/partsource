# 11 — Implement BOM import/export, backup, restore, quarantine

**Blocked by:** 10 — Add configuration to named BOM from detail page

**Status:** complete

**Evidence:** Implemented in `web/src/lib/bom.ts`, `web/src/hooks/useBOM.ts`, `web/src/pages/Home.tsx`; covered by `web/scripts/test-bom-domain.ts` and `web/tests/browser/bom-manager.spec.ts`. Verified with `npm run lint`, `npx tsx scripts/test-bom-storage.ts && npx tsx scripts/test-bom-domain.ts`, and `npx playwright test tests/browser/bom-manager.spec.ts`.

## What to build

Finish local persistence and portability: migration from legacy flat BOM, selected-BOM CSV import/export, full JSON backup/restore, and quarantine/recovery for malformed data.

## Acceptance criteria

- [x] Legacy `partsource_bom` array/v1/v2 migrates once only when new store is absent.
- [x] Malformed payloads or rejected rows are copied to `partsource_bom_quarantine:v1` with reason before starting empty.
- [x] CSV export includes documented R4 fields for selected BOM.
- [x] CSV import validates all rows, reports rejected rows, and appends only after confirmation.
- [x] Imported rows remain `unverified-imported` unless exact current record+revision matches.
- [x] JSON backup/restore validates entire payload atomically and replaces only after confirmation.

## Audit boundary — 2026-08-10

Retain `complete` as a local portability milestone only. Ticket 10's dependency chain is not release-approved, imported rows remain unverified, and this ticket grants no engineering-selection or ship claim.
