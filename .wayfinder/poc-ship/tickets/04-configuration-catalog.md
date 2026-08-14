# 04 — Build hardware configuration catalog

**Blocked by:** 03 — Lock sourcing research result states

**Status:** closed

## What to build

Create the safe catalog used by the POC.

It stores hardware configurations.

It does not store supplier offers.

It does not say two parts are equivalent.

## Acceptance criteria

- [x] Catalog records store configuration facts: family, type, thread, pitch, length, head, drive, material, finish, strength, standard.
- [x] Catalog can support McMaster-number input as a known search clue when allowed.
- [x] Catalog supports generic queries like `M4 screws`.
- [x] Catalog supports guided selection filters.
- [x] Supplier search destinations are generated from configuration facts.
- [x] Tests fail if catalog records include price, stock, availability, buy, quote, or equivalent claims.
- [x] Synthetic/demo records are marked clearly.

## Resolution

Closed on 2026-08-09.

- Expanded prototype catalog/import shape with `type`, `head`, `strength`, demo/synthetic/provenance/review fields.
- Added safe catalog migration and search RPC for configuration facts, tokenized generic search, and guided filters.
- Added client-side boundary checks and supplier-search-destination helper.

## Evidence

- `npm run lint` — passed.
- `npm test` — passed.
- `npm run build` — passed, including product-truth bundle scan.
- `npm run test:browser` — 9 passed.
- `npm run test:catalog-boundary` — passed; deployed live endpoint still returns legacy field shape until migration/function deployment.

## Audit boundary — 2026-08-10

Retain closed as a local implementation milestone only. The legacy deployed endpoint, unapproved family truth, missing immutable release controls, and Ticket 25 failure block deployment and ship acceptance.
