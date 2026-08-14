# 02 — Remove commercial offer and price surfaces

**Blocked by:** 01 — Reconcile dirty tree into a POC candidate

**Status:** closed

## What to build

Remove or hard-disable every runtime path that can show supplier offers, buy buttons, stock, availability, live/synthetic price, quote submission, or commercial listing claims. Keep only user-entered/imported cost fields inside BOM.

## Acceptance criteria

- [x] No seeded supplier offers ship from `web/src/data/offers.ts` or equivalent runtime imports.
- [x] Part detail cannot render supplier offer rows, buy CTAs, stock text, retrieved price dates, or supplier listing claims.
- [x] Generated/fallback catalog parts do not expose heuristic `mcmasterPrice` as product price.
- [x] Dashboard/PDF/CSV labels say entered/imported/user cost only.
- [x] Tests fail if offer/price/stock/buy language returns to shipped runtime or bundle.

## Resolution

Closed on 2026-08-08.

- Removed seeded offer data and outbound buy helpers.
- Removed PartDetail offer UI and BOM quote mailto flow.
- Set fallback/catalog `mcmasterPrice` values to `0` only.
- Updated tests to guard no commercial offer/price UI/source/bundle terms.
- Verified with `npm run lint`, `npm test`, `npm run build`, and a source/dist prohibited-term scan.

## Audit boundary — 2026-08-10

Retain closed as a bounded implementation result. Ticket 01 has reopened, so this closure does not make the current dirty workspace a release or ship candidate.
