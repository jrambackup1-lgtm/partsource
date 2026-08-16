# PartSource Product-Definition Audit — 2026-08-11

**Audit result:** PASS — the approved product direction is coherent.

**Specification readiness:** NOT READY FOR `/to-spec`.

No product direction or runtime code changed. `/to-spec` did not start.

## 1. Authority

- `research/product-contract.md` is the sole authority for product purpose, behavior, claims, and boundaries.
- `research/prd.md` defines subordinate product requirements.
- `SPEC_CONFIRMATION.md` is the concise current behavior specification.
- `CONTEXT.md` defines domain language.
- `research/data-source-register.md` controls source permission and ingestion only.
- `.wayfinder/poc-ship/poc-ship-map.md` controls the current planning frontier and preserves decision history.
- `AGENTS.md` and `research/README.md` are authority indexes, not competing product contracts.

Exactly one current product model exists:

`query → catalog level → family → filters → result list`

Exact ID:

`exact ID → correct family/context → result list → exact item highlighted`

## 2. Product behavior

| Input | Required behavior | Selection state |
|---|---|---|
| `screws` | Open the Screws catalog level and show its result list. | Nothing selected. |
| `socket head screws` | Open the Socket-head screws family and show its result list. | Nothing selected. |
| `M6 stainless socket head screws` | Open the same family, apply supported M6 and stainless filters, and show the narrowed list. | Nothing selected. |
| Supported exact ID | Open the correct family and result list; highlight the uniquely mapped row. | Highlighted, not selected; detail opens only after user action. |
| Unsupported, absent, conflicting, or non-unique input | Preserve the query and fail closed without an unsupported filter, result, selection, or highlight. | Nothing selected. |

The category path, family, active filters, and result list remain visible throughout.

## 3. POC scope

### In

- Deterministic query parsing.
- Progressive category and family navigation.
- Family-scoped typed fields and filters.
- Visible result lists and catalog context.
- Supported exact-identifier mapping and row highlighting.
- Explicit user selection before detail.
- Stable record identity, provenance, synthetic labeling, and fail-closed states.
- A small mechanical-component POC corpus sufficient to demonstrate broad, family, filtered, and exact-ID paths.

### Out

- Runtime AI or agents.
- Engineering approval, application suitability, equivalence, replacement, or approved-alternate claims.
- Supplier listings, supplier handoffs, offers, price, stock, availability, lead time, ordering, checkout, quotes, or brokerage.
- BOM, procurement-system, account, team, or enterprise workflows.
- Isolated exact-result routing and automatic non-exact selection.
- Bulk/pSEO publication.

The exact POC family set is not yet approved. Screw families are the current bounded candidate, not a finalized corpus decision.

## 4. Contradiction audit

A full tracked-and-untracked scan covered 595 text files.

### Current product documents

No product-model contradiction found. Obsolete terms in the contract, PRD, spec, glossary, and indexes appear only as explicit exclusions, claim boundaries, or legacy warnings.

`research/data-source-register.md` still contains old `configuration search/detail display` and `Phase 2` wording. Its authority is permission-only, so this wording does not redefine product behavior, but it is stale implementation language.

### Unmarked active-looking data contradiction

`data/README.md` instructs scraping and anonymizing SKDIN data. This directly conflicts with `research/data-source-register.md`, which blocks collection, storage, normalization, testing, derivatives, and publication of SKDIN content.

The three checked-in CSVs are consumed by current generators and import code:

- `data/socket-head-cap-screws.csv`
- `data/hex-head-screws.csv`
- `data/rounded-head-screws.csv`
- `web/scripts/generate-*-prototype-catalog.ts`
- `web/scripts/import-catalog-to-supabase.ts`

The CSVs contain source-like category paths and McMaster identifiers. Runtime generation/import relabels them `internal-demo-seed`, `synthetic`, and a reviewed PartSource packet. Their permitted origin and truthful provenance are therefore unresolved.

### Historical/planning material

Old resolver, ambiguity, missing-fact, conflict, BOM, equivalence, supplier, commercial, pSEO, and agent concepts remain widespread in dated research, tickets, archived files, and sketches. Current authority explicitly classifies them as history. They do not conflict with the current model.

### Runtime and tests

Legacy concepts remain implemented and tested. These are runtime contradictions, not product decisions.

## 5. Runtime gaps

1. Search submits directly to an isolated part route: `web/src/pages/Home.tsx:172-176` and `web/src/components/Header.tsx:37-42`.
2. Non-exact text is converted into a part target through fallback resolution/parsing: `web/src/hooks/useCatalogSearch.ts:76-85`.
3. The router still owns isolated part detail: `web/src/App.tsx:95-99`.
4. Search UX is a flat dropdown/grid, not visible category → family → filters → result-list navigation: `web/src/pages/Home.tsx:349-455`.
5. Exact ID opens detail instead of highlighting a row in family context.
6. Runtime data uses one shared wide configuration table, not explicit category nodes plus family-schema definitions: `supabase/migrations/20260805_catalog.sql:5-20`.
7. BOM remains primary navigation and detail behavior: `web/src/components/Sidebar.tsx:17-21` and `web/src/pages/PartDetail.tsx:476-562`.
8. Supplier handoffs remain on detail and embed surfaces: `web/src/pages/PartDetail.tsx:564-586` and `web/src/pages/WidgetEmbed.tsx`.
9. Static metadata, browser tests, and monitoring still treat `/parts/:partNumber` and `?tab=bom` as canonical runtime paths.
10. The active import/generation path has unresolved data lineage and provenance.

No runtime code was changed.

## 6. Minimum POC data model

### Catalog level

- Stable level ID.
- Label and aliases.
- Parent/child relationship.
- Level type: category or family.

### Family

- Stable family ID and parent category.
- Name and query aliases.
- Explicit family-schema reference.
- Inclusion and exclusion rules.

### Family schema and filters

- Field ID, label, type, unit/system, family scope, and display order.
- Required/optional status.
- Normalization and accepted query forms.
- Filterable flag and supported values/ranges.
- Deterministic conflict and unsupported-value behavior.

### Catalog record

- Stable record identity and family identity.
- Typed family-field values.
- Display label.
- Zero or more identifier mappings with namespace and uniqueness state.
- Provenance attached to every displayed fact and mapping.
- Synthetic/demo status where applicable.

### Query and result support

- Category/family alias dictionary.
- Typed parser rules.
- Exact-identifier index.
- Deterministic filtering and stable result ordering.
- Expected fail-closed/no-results states.

A Wayfinder hypothesis proposes two or three neighboring fastener families and 24–40 deliberately selected records. This is not yet approved.

## 7. Unresolved data and UX decisions

### Material before `/to-spec`

1. Approve the exact two or three POC families and their hierarchy/inclusion rules.
2. Choose a lawful data strategy: permission-confirmed local packet or clearly synthetic fixtures. Resolve the SKDIN/CSV lineage conflict before using current files.
3. Approve the exact small record corpus, identifier namespaces, and truthful provenance labels.
4. Approve minimum family schemas, normalization/unit rules, filter semantics, and identifier collision behavior.
5. Approve the behavioral benchmark: broad, family, filtered, exact, unsupported, absent, conflicting, and non-unique cases with expected catalog depth and selection state.
6. Decide the explicit-selection transition: result-row fields and whether user action opens inline detail, a drawer, or a routed detail view while preserving return context.

### Can be resolved inside the specification

- Visual styling.
- Desktop/mobile layout details.
- Filter-control shape.
- Highlight color and animation.
- Empty-state wording.
- Pagination versus a small bounded list, after corpus size is fixed.

## 8. Readiness

The product direction passes. The repository is not ready for `/to-spec` because the POC family/corpus/schema/benchmark decisions are not approved and the active data path has a material source-permission/provenance conflict.

**NOT READY FOR `/to-spec`.**
