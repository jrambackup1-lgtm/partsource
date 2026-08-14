# 06 — Implement search and configuration matching

**Blocked by:** 04 — Build hardware configuration catalog; 05 — Prepare pilot configuration packet

**Status:** closed — out of scope after C rethink 2026-08-10

**C boundary:** Closed without completion. Search, automatic matching, and supplier destinations are outside the current paid no-build decision.

## What to build

Make search work for three inputs:

1. McMaster part number.
2. Generic query like `M4 screws`.
3. Guided screw selection.

Return configurations and supplier search destinations.

Do not return equivalents.

## Acceptance criteria

- [x] Search normalizes simple text safely.
- [x] McMaster number lookup never calls a McMaster API.
- [x] McMaster number lookup never claims equivalent or replacement.
- [x] Generic query returns matching configurations.
- [x] Guided selection returns the selected configuration.
- [x] Empty or unsupported input gives useful safe copy.
- [x] Search fails closed when catalog/config is missing.
- [x] Boundary tests reject commercial fields and banned claims.

## Historical resolution

Closed on 2026-08-09.

- Added tokenized generic search support for inputs like `M4 screws` in the catalog RPC.
- Added guided filter support through the Edge Function, client API, and `useCatalogSearch`.
- Kept McMaster input as search clue only and retained fail-closed unsupported/live-unavailable behavior.
- Added supplier destination generation from configuration facts only.

## Evidence

- `npm run lint` — passed.
- `npm test` — passed.
- `npm run build` — passed.
- `npm run test:browser` — 9 passed.
- `npm run test:catalog-boundary` — passed; deployed live endpoint still returns legacy field shape until migration/function deployment.

## Reopened audit — 2026-08-10

Focused search/catalog tests still pass, but the required Ticket 05 reviewed-packet dependency is open. Later proxy/runtime audits also found unsafe handoff behavior outside a valid release. Ticket 06 is blocked; this does not erase the local implementation milestone.

Audit: `research/wayfinder-ticket-audit-2026-08-10.md`.
