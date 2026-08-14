# 03 — Lock sourcing research result states

**Blocked by:** 02 — Remove commercial offer and price surfaces

**Status:** closed

## What to build

Define what the app can say after a search.

This is not a McMaster API.

This is not an equivalent lookup.

It is sourcing research.

## Acceptance criteria

- [x] Define public states: `configuration-match`, `configuration-search`, `supplier-search-destination`, `unsupported-input`, `invalid-input`, `search-unavailable`.
- [x] McMaster number input is treated as a search clue only.
- [x] Generic input like `M4 screws` works as search input.
- [x] Guided selection can create a configuration from user choices.
- [x] Supplier destinations are labelled as search handoffs only.
- [x] Copy blocks banned words: equivalent, verified equivalent, approved alternate, replacement, same item, in stock, buy, quote.
- [x] Product contract and PRD use the same language.

## Resolution

Closed on 2026-08-09.

- Locked the public result states in `research/product-contract.md` and `research/prd.md`.
- Updated runtime result-state names away from equivalence language.
- McMaster input now returns configuration-match only when the local catalog knows it, otherwise unsupported-input.
- Generic/spec input returns configuration-search.
- Supplier handoff copy stays search-only.
- Added tests that block banned public result-state copy from Home, Header, and PartDetail.

## Evidence

- `npm exec -- tsx scripts/test-offers.ts` — passed.
- `npm exec -- tsx scripts/test-decoder.ts` — 28 passed, 0 failed.
- `npm run lint` — passed (`tsc --noEmit`).
- `npm run build` — passed, including production-bundle product-truth checks.
