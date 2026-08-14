# 07 — Implement configuration detail and supplier handoff UI

**Blocked by:** 06 — Implement search and configuration matching

**Status:** complete

## What to build

Update the detail page.

Show the configuration clearly.

Show supplier search destinations clearly.

Do not make legal-risk claims.

## Acceptance criteria

- [x] Detail page shows configuration facts and source notes.
- [x] Page can show input context, such as McMaster number or `M4 screws`.
- [x] Supplier links say `Search this configuration on supplier site` or similar.
- [x] No equivalent, approved alternate, replacement, same-item, price, stock, buy, or quote UI appears.
- [x] Add-to-BOM is for the selected configuration snapshot.
- [ ] Current detail-page keyboard and 320px behavior is directly exercised and passes.

## Evidence

- `npm run lint` — passed (`tsc --noEmit`).
- `npm exec -- tsx scripts/test-unpublished-cross-reference-catalog.ts` — passed.
- `npm exec -- tsx scripts/test-decoder.ts` — passed, 28/28.
- `npm exec -- playwright test tests/browser/launch-critical.spec.ts tests/browser/route-containment.spec.ts` — passed, 8/8.
- `npm test` — passed.
- `npm run build` — passed; generated production bundle and 589 static metadata pages.

## Audit boundary — 2026-08-10

Retain `complete` as a bounded implementation milestone only. Ticket 06 is blocked, current detail-page 320px/keyboard proof is missing, and Ticket 25 failed. This ticket grants no release, supplier-handoff, or ship permission.
