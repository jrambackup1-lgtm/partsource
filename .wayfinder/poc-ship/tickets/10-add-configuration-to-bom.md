# 10 — Add configuration to named BOM from detail page

**Blocked by:** 07 — Implement configuration detail and supplier handoff UI; 09 — Build named BOM manager UI

**Status:** complete

## What to build

Complete the main POC workflow.

From a configuration detail page, the user can choose or create a BOM, set quantity/notes/user cost, and save a snapshot.

## Acceptance criteria

- [x] Add-to-BOM saves the selected configuration snapshot.
- [x] When no BOM exists, user can create one in flow before adding.
- [x] Saved line preserves input text, configuration facts, supplier search destinations, source notes, and user notes.
- [x] Catalog refresh never silently rewrites a saved line.
- [x] Duplicate add behavior is explicit: append separate snapshot or deliberate quantity merge.
- [x] User cost is labelled user-entered only.
- [x] No price, stock, offer, buy, quote, equivalent, or replacement claim appears.

## Evidence

- `npm run lint && npx tsx scripts/test-bom-storage.ts && npx tsx scripts/test-bom-domain.ts` — passed.
- `npx playwright test tests/browser/bom-manager.spec.ts` — passed (3 tests), including detail-page create-BOM/add-snapshot/duplicate-append coverage.
- Runtime UI does not import `unpublishedCrossReferenceCatalog`; detail Add-to-BOM copies only frozen configuration snapshot data and supplier search destinations.

## Audit boundary — 2026-08-10

Retain `complete` as a local implementation milestone. Ticket 07 is not currently accepted for release, supplier actions are not approved, and Ticket 25 failed. No saved snapshot is qualified as a released or verified engineering selection.
