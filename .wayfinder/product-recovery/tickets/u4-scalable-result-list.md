---
title: Scalable result list, facets, and URL correctness
status: resolved
resolved: 2026-08-16
label: wayfinder:ticket
created: 2026-08-16
updated: 2026-08-16
audit: user-perspective-issue-audit-2026-08-16.md
---

## Problem (user perspective)

Inside a real family (2,432 records in the largest subcat), the current list cannot be used: every record renders as a table row **and** an always-mounted mobile card; there is no pagination, no sorting, and filters are single-select dropdowns listing every declared value including selectable zero-count dead-ends. It is also slow: one identifier scan per projected record makes a broad search measure 18.7 s at 27k mappings, and facet recomputation (222–244 ms) runs twice per render and on every keystroke. Separately, URL state is incorrect: `?q=M4+screws&family=css` silently drops the M4 filter (results contradict the visible query), any `utm_*` param triggers a false "link could not be restored" alarm, and only five hardcoded filter params survive into shareable URLs.

## Evidence

- Audit Part 2 N3, N4, N6.
- `web/src/catalog/engine/filter-facets.ts:108-115` — O(records × mappings) per record; `:159-186` facet computation cost; called in `projectCatalogView` per render and again in the `Facets` component.
- `web/src/catalog/ui/CatalogApp.tsx` `Results` — all records mapped to rows + cards; no sort/pagination controls.
- `web/src/catalog/engine/url-state.ts:11-17,99-113` — fixed `URL_FACTS`; hydration replaces filters without a cross-family mismatch guard; unknown parameters invalidate otherwise-valid state.
- Measured figures in the architecture review (audit evidence file), all probe-derived at real-data scale.

## Scope

1. Performance: `mappingsByConfigurationRevisionId` index in `createCatalogIndex`; facet computation derived once per resolution (memoized), not per render/keystroke.
2. List usability: pagination or virtualization with a **single** DOM representation per breakpoint; user-controlled sorting with numeric awareness; multi-select facets (OR within a fact, AND across facts) with disjunctive counts; zero-count options rendered inert or hidden.
3. Schema-driven result columns per family (replacing the hardcoded header; contract already promises family-specific columns).
4. URL correctness: versioned parameter vocabulary covering all family filters plus pagination/sort; fix the q+family filter-drop hydration bug; tolerate inert unknown parameters (e.g. `utm_*`) without invalidating valid state.

## Out of scope / boundaries

- Numeric range facets and saved views (recorded LATER in the audit).
- No change to fail-closed filter semantics (unsupported values still reject cleanly).

## Acceptance

- At real-data scale (u1 package): family list interactions stay interactive (<200 ms commit); broad search returns in interactive time; DOM row count bounded by page/window.
- Multi-select + sort round-trip through URLs and history.
- The q+family URL no longer silently contradicts the shown query; `utm_*`-style links hydrate without warnings.

## Dependencies

u1 (real-scale data to verify against), u2 (category/family states this builds on).

## Resolution (2026-08-16)

Resolved in full.

- **Performance:** the per-record identifier scan index landed with u1 (broad query 18.7 s to sub-second; representative query set 0.40 s). Facets are computed once per resolution and fed to the UI from the view model (the duplicate per-render computation in the Facets component is gone), and facet counts use a single histogram pass per facet instead of a value-by-value family scan. Largest real family (2,376 rows): filter + facets + projection measured **41 ms** (asserted under 200 ms in `scripts/catalog/test-real-package.ts`).
- **List usability:** pagination (50/page, bounded DOM — verified 50 rows and zero ghost mobile cards on a 196-record family at real scale), numeric sort with asc/desc from the schema's varying numeric facts, multi-select checkbox facets (OR within a fact, AND across facts) with disjunctive self-excluding counts, zero-count non-active options hidden (no dead-ends), and a single DOM representation per breakpoint via matchMedia.
- **Schema-driven columns:** columns are the facts that vary within the family (capped at seven); constant facts render as family identity chips instead of dead columns — the contract's family-specific columns promise (audit N16).
- **URL v3:** versioned parameter vocabulary — repeatable `f_<factId>` filter parameters plus `page`/`sort`/`dir` view parameters, with legacy v2 links still hydrating. URL facts EXTEND the query interpretation (`?q=M4+screws&family=x` keeps M4 — the N6 silent-contradiction fix); contradicting URL facts invalidate honestly; `utm_*`/`gclid`/`fbclid`/`msclkid` are inert and never trigger the restoration alarm. Pagination and sort round-trip through URLs and history.
- Tests: engine multi-select / disjunctive-count / URL-v3 suites; browser schema-column, facet-OR, and sort tests; real-scale performance and DOM assertions. Full `release:audit` green.
