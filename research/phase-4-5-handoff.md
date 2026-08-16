# PartSource Prototype Discovery and External-Discovery Handoff

**Status:** Planned; not approved for production claims.

## Current prototype catalog

- Socket-head screws: 7,864 records.
- Hex-head screws: 8,850 records.
- Rounded-head screws: 10,295 records.
- All are generated local prototype configurations, excluded from static part/embed pages.
- No catalog record includes a price, stock state, supplier listing, offer, verified equivalent, or approved alternate.

## Prototype discovery workstream: shared search and filters

Goal: make the three prototype families easy to search and filter without loading a single large catalog bundle at application start.

1. Lazy-load each family catalog.
2. Add family, thread, length, material, drive, and standard filters.
3. Preserve exact identifier lookup before fuzzy/specification search.
4. Keep prototype configuration notices and supplier-site searches.
5. Add tests for filter correctness, family isolation, no commercial claims, and static-route exclusion.
6. Audit bundle size, keyboard accessibility, mobile behavior, typecheck, full tests, build, and browser smoke tests.

## External-discovery workstream: McMaster/Octopart-style direction

Goal: research/discovery workflow only; not a marketplace or price comparison system.

Preconditions before implementation:

1. Approved source record with commercial reuse, storage, transformation, and public-display permission.
2. Reviewed product-contract and production-readiness packet.
3. Canonical configuration/source/evidence schemas and review lifecycle.
4. Exact lookup returns an evidence-backed result or `No verified equivalent yet`.
5. Freshness, attribution, correction, withdrawal, and takedown controls.

Still prohibited until those gates pass: scraping, synthetic/commercial prices, inventory, lead times, supplier listings, unreviewed cross-references, equivalence claims, and approved-alternate claims.
