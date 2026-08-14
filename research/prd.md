# PartSource Product Requirements Document

## 1. Product

PartSource is a deterministic mechanical-component catalog navigator.

It helps an engineer move from a query to the correct catalog depth and a relevant result list.

## 2. User

Primary user: an engineer searching for a mechanical component from broad text, partial specifications, or an exact identifier.

The user needs catalog context, useful filters, traceable facts, and control of final selection.

## 3. Product flow

`query → catalog level → family → filters → result list`

Search selects the deepest supported catalog level.

The catalog hierarchy remains visible.

Filters narrow the current result list.

The user selects an item before PartSource opens its detail.

## 4. Exact ID flow

`exact ID → correct family/context → result list → exact item highlighted`

Requirements:

- Open the correct catalog and family context.
- Show the relevant result list.
- Highlight the supported exact match.
- Keep hierarchy and active filters visible.
- Do not open an isolated detail page automatically.
- Let the user open the highlighted item detail.
- Highlight nothing when the mapping is absent or not uniquely supported.

## 5. Non-exact query flow

Requirements:

- Parse supported terms into typed fields.
- Select the deepest supported category or family.
- Apply supported typed fields as filters.
- Show the filtered result list.
- Keep catalog context visible.
- Never auto-select a part.

Examples:

- `screws` → Screws list.
- `socket head screws` → Socket-head screw list.
- `countersunk screws` → Countersunk screw list.
- `M6 stainless socket head screws` → Socket-head screw list filtered by M6 and stainless steel.

## 6. Catalog model

The catalog must contain:

- typed mechanical fields;
- an explicit category hierarchy;
- family schemas;
- deterministic filters;
- deterministic matching rules;
- result records with provenance;
- fail-closed states.

A family schema defines the fields that can filter and describe that family.

A field from one family must not silently become a field in another family.

## 7. Provenance

Each displayed technical fact and identifier mapping must retain its source or declared synthetic origin.

The UI must not upgrade catalog membership into verification, approval, equivalence, stock, or suitability.

## 8. Fail-closed rules

- Do not invent facts, records, mappings, or attribute values.
- Do not apply unsupported query terms as filters.
- Do not silently resolve conflicting values.
- Do not choose the first result as a fallback.
- Do not highlight an exact item without a supported unique mapping.
- Show a clear no-results state when no safe list exists.

## 9. Product boundaries

PartSource does not provide:

- engineering approval or application suitability;
- equivalence, replacement, or approved-alternate claims;
- supplier listings, price, stock, availability, or offers;
- ordering, checkout, or quote workflows;
- BOM management;
- automatic selection.

## 10. Acceptance criteria

The product meets this PRD when:

- broad queries open the correct catalog level;
- family queries open the correct family and result list;
- supported typed fields become visible active filters;
- filters narrow the list deterministically;
- catalog context remains visible after every query;
- exact ID opens the correct family list and highlights the item;
- exact ID does not auto-open item detail;
- non-exact input never selects an item;
- unsupported or unsafe inputs fail closed;
- displayed facts and mappings retain provenance;
- prohibited claims do not appear.
