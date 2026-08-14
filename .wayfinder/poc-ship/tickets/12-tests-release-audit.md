# 12 — Align tests and release audit for POC ship

**Blocked by:** 02 — Remove commercial offer and price surfaces; 07 — Implement configuration detail and supplier handoff UI; 11 — Implement BOM import/export, backup, restore, quarantine

**Status:** closed — out of scope after C rethink 2026-08-10

**C boundary:** Closed without completion. There is no approved POC release to audit under the current destination.

## What to build

Make tests prove the new POC.

The test suite must block the old risky product shape.

## Acceptance criteria

- [x] Remove/update tests that require verified-equivalence, seeded offers, prices, stock, buy, or quote behavior.
- [x] Add unit/domain tests for result states, configuration catalog, supplier search handoffs, named BOM store, migration/quarantine, CSV/JSON behavior.
- [ ] Add browser tests for McMaster-number input, `M4 screws` search, genuine guided selection, supplier handoff, add to named BOM, reload persistence, export, mobile 320px, keyboard navigation.
- [x] Add prohibited-claim scan for runtime source and production bundle.
- [ ] Run `npm run release:audit` or equivalent against the current candidate and record exact passing command output.

## Historical verification evidence

Command run from `web/`:

```text
npm run release:audit
```

Passing output recorded 2026-08-09:

```text
> partsource-web@0.0.0 release:audit
> npm run lint && npm test && npm run test:catalog-search && npm run build && npm run test:catalog-boundary && npm run test:browser

> partsource-web@0.0.0 lint
> tsc --noEmit

... unit/domain checks passed ...
Prohibited public-claim scan passed.

> partsource-web@0.0.0 test:catalog-search
> tsx scripts/test-catalog-search.ts

> partsource-web@0.0.0 build
> npm run generate:prototype-catalogs && vite build && tsx scripts/generate-static-part-pages.ts && tsx scripts/test-product-truth-bundle.ts

✓ 1953 modules transformed.
✓ built in 10.52s
Generated static metadata for 589 part pages.
Product Truth production-bundle checks passed.

> partsource-web@0.0.0 test:catalog-boundary
> tsx scripts/test-catalog-boundary.ts

Catalog boundary checks passed.

> partsource-web@0.0.0 test:browser
> playwright test

Running 16 tests using 8 workers
...
16 passed (40.7s)
```

## Reopened audit — 2026-08-10

The recorded release audit predates the current heavily dirty workspace. The browser case named guided selection exercises text/autocomplete, not actual family/attribute controls. Dependencies 07 and 11 are not currently closable. Ticket 12 is open again; the historical output remains evidence for the old candidate only.

Audit: `research/wayfinder-ticket-audit-2026-08-10.md`.
