# Ticket 40 — deterministic resolver and synthetic contract gate

**Date:** 2026-08-14
**Ticket:** [40 — Extend the deterministic resolver and synthetic contract for the UX delta](../tickets/40-extend-deterministic-resolver-and-synthetic-contract.md)
**Status:** **PASS**
**Scope:** `PS-POC-SYNTHETIC-V1` local synthetic fixture only.

## Boundary

This gate covers only the resolver/synthetic contract boundary. It does not implement Ticket 41 rendering changes and does not authorize deployment, publication, source ingestion, real catalog claims, supplier/BOM flow, comparison workspace, or external action.

## Implemented

- Whole-query synthetic-ID detection stays strict: trim + ASCII case-fold only.
- Unique exact-ID query resolution returns the mapped family full ordered list with one highlight and no automatic selection/detail.
- Exact-ID `unknown` and `non_unique` return no records, no highlight, no selection, no detail, and no inferred family.
- Resolver view model now includes a structured factual trace with original query, normalized query, recognized values, applied values, unsupported terms, conflicts, exact-ID state, stop reason, and provenance references.
- Synthetic records now carry separate record provenance and displayed-fact provenance; mappings keep separate mapping provenance.
- Bundle validation fails closed for unknown root/record/nested provenance fields, missing displayed-fact provenance, absent mappings, bad collisions, invalid typed fields, and invalid unique mappings.
- Filter domains are derived from family-scoped synthetic records; invalid URL/filter states clear unsafe list/highlight/selection/detail state.
- Metric-only units and family datum remain in the synthetic contract: `shcs`/`bhss` under-head, `css` overall.

## Files changed for Ticket 40

- `web/src/poc/types.ts`
- `web/src/poc/fixture.ts`
- `web/src/poc/validator.ts`
- `web/src/poc/resolver.ts`
- `web/scripts/poc/test-bundle.ts`
- `web/scripts/poc/test-resolver.ts`
- `web/scripts/poc/test-url-state.ts`

`web/src/poc/url-state.ts` was inspected and remains compatible with the final contract: query resolution does not auto-select exact IDs; explicit direct selected URLs can still open valid in-list detail while preserving highlight/selection distinction.

## Subagent challenge

Two implementation-review passes were run:

1. Initial challenge found gaps in exact-ID selection behavior, structured trace, family-scoped filters, displayed-fact provenance, and validator strictness.
2. Post-implementation challenge found three blocking gaps:
   - highlight persisted when filters removed the highlighted record;
   - invalid URL/filter state could retain highlight/selection/detail;
   - root bundle unknown fields were accepted.

All three were fixed and covered by tests/probes before this gate was recorded.

## Verification

Command:

```text
npm run release:audit
```

Working directory:

```text
C:\Users\jayar\Projects\partsource\web
```

Result: **PASS**

Evidence from final run:

- `npm run lint`: PASS (`tsc --noEmit`)
- `npm test`: PASS
  - `POC bundle contract passed.`
  - `POC resolver Ticket 40 contract passed.`
  - `POC URL-state contract passed.`
- `npm run test:documents`: PASS (`POC authority document guard passed.`)
- `npm run build`: PASS (`✓ built`)
- `npm run test:browser`: PASS (`20 passed`)
- `npm run test:boundary`: PASS (`POC static boundary guard passed.`)

Additional targeted probe:

```text
{"exactQueryDetailOpen":false,"invalidUrl":{"state":"invalid_url_state","records":0,"highlight":null,"detailOpen":false},"directExactSelected":"ready"}
root-field rejected
```

`git diff --check`: PASS.

## Gate decision

**Ticket 40 PASS.** Stop here. Ticket 41 is next and not started.
