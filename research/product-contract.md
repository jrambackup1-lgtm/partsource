# PartSource Authoritative Product Contract

**Status:** Authoritative — sole current source of truth
**Effective:** 2026-08-10

## Authority

1. This contract controls current product purpose, behavior, terminology, claims, and boundaries.
2. `research/prd.md` gives the current product requirements.
3. `SPEC_CONFIRMATION.md` gives the concise current product specification.
4. `CONTEXT.md` gives the current domain language.
5. `research/data-source-register.md` controls source permission and ingestion.
6. The shipped runtime and tests are implementation evidence. They do not change this contract.
7. Wayfinder, dated research, prototypes, old plans, and archived files are historical evidence. They do not define current product behavior.

## Product purpose

PartSource is a deterministic mechanical-component catalog navigator.

It helps an engineer move from a query to the correct catalog depth and a relevant result list while keeping catalog context visible.

## Product surface

The current product has two primary surfaces:

- **Home** — a start surface for global search, supported examples, and catalog browsing. It is not a KPI dashboard.
- **Catalog** — the active category or family workspace with visible hierarchy, typed constraints, family-specific filters, an aligned result table, and contextual selected-record detail.

Broad catalog input makes the family step explicit. A family view uses its own schema and result columns.

The default workflow shows concise interpretation and source state. Raw resolver traces and internal identifiers belong in optional diagnostics, not above the result task.

While the active catalog is synthetic, its synthetic status must remain visible on Home, Catalog, and selected-record detail.

## Core interaction contract

`query → catalog level → family → filters → result list`

**Search determines catalog depth. Catalog context stays visible. Filters narrow the list. Exact ID highlights the matching item. User selects.**

Non-exact search never auto-selects a part.

## Exact identifier contract

`exact ID → correct family/context → result list → exact item highlighted`

An exact identifier:

- opens the correct category and family context;
- keeps the relevant result list visible;
- highlights the supported exact match;
- does not open an isolated detail page;
- requires user selection before detail opens;
- highlights nothing when the mapping is absent or not uniquely supported.

## Deterministic catalog contract

The runtime uses no AI or agents.

The runtime uses:

- typed mechanical fields;
- category hierarchy;
- family schemas;
- deterministic parsing;
- deterministic filters;
- deterministic matching;
- provenance;
- fail-closed states.

Only supported typed fields can become filters.

Family-specific fields stay inside their family schema.

Matching rules must not guess missing values or convert unsupported terms into facts.

A broad material or form term must not become a narrower fact. In particular, `stainless` does not prove `A2 stainless`, and `button head` or `countersunk` alone does not prove an internal-hex drive.

## Result contract

A result list contains catalog records inside visible category and family context.

Each record must keep:

- stable record identity;
- family identity;
- typed technical fields;
- identifier mappings, when supported;
- provenance for displayed facts and mappings.

A result row is not an approval, suitability decision, supplier listing, offer, equivalent, or replacement.

Results should use an aligned, family-specific technical table when variants need comparison. Explicit user selection may open contextual detail while preserving the family and result-list state.

## Provenance presentation

Displayed technical facts and identifier mappings retain claim-level provenance.

The default UI shows a concise source summary and honest unknown states. A user may inspect field or mapping evidence. Raw traces remain available only as diagnostics.

Provenance supports what a source or declared fixture states. It does not establish suitability, approval, equivalence, manufacture, supply, or availability.

## Release identity

Application release identity and catalog release identity are separate:

- the application release identifies the exact deployed code artifact;
- the catalog release identifies the exact hierarchy, schemas, configurations, mappings, lexicon, and provenance package.

Public release claims require independently fetchable application metadata and visible catalog release metadata. Synthetic package identity must not be presented as real engineering authority.

## Fail-closed contract

PartSource must:

- preserve the original query;
- apply only supported typed filters;
- invent no facts, records, mappings, or attribute values;
- silently resolve no conflicting values;
- use no first-result fallback;
- show a clear no-results state when no safe list exists;
- highlight no exact item without a supported unique mapping.

## Product truth

| Term | Meaning |
|---|---|
| Query | Original user text or identifier. |
| Catalog level | Deepest supported category or family view selected from the query. |
| Category hierarchy | Ordered structure from broad component class to product family. |
| Family | Components that share one functional type and one field schema. |
| Family schema | Typed fields valid for one family. |
| Filter | Supported typed value applied to the current result list. |
| Result list | Catalog records inside the visible category and family context. |
| Exact identifier match | Supported unique mapping that highlights one row in the relevant result list. |
| Selection | Explicit user action that chooses a result or opens detail. |
| Provenance | Source or declared synthetic origin of a fact or identifier mapping. |
| Fail-closed state | State that shows no unsupported result, filter, selection, or highlight. |

## Claim boundaries

PartSource does not claim:

- engineering approval;
- application suitability;
- manufacture or supply;
- supplier listing identity;
- equivalence;
- replacement;
- approved alternate status;
- certification;
- price;
- stock;
- availability;
- lead time.

PartSource does not provide ordering, checkout, quote, brokerage, BOM, account, or procurement-system workflows in the current product model.

## Source boundary

- No source may be ingested or published without approval in `research/data-source-register.md`.
- No McMaster API dependency is assumed.
- No supplier scraping or copied supplier catalog data is permitted without explicit approval.
- Synthetic records must be labeled synthetic.
- Public facts and identifier mappings must retain provenance.

## Change rule

Change this contract only through an explicit reviewed product decision.

A prototype, old plan, runtime leftover, test, or research report does not become product behavior until this contract changes.
