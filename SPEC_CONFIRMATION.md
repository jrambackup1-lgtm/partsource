# PartSource Product Specification

## Purpose

PartSource helps an engineer navigate a mechanical-component catalog.

It turns a query into the deepest supported catalog view and a relevant result list.

## Catalog flow

`query → catalog level → family → filters → result list`

Examples:

- `screws` → Screws list.
- `socket head screws` → Socket-head screw list.
- `countersunk screws` → Countersunk screw list.
- `M6 stainless socket head screws` → Socket-head screw list with matching filters.

The category hierarchy, family, active filters, and result list stay visible.

## Exact ID

`exact ID → correct family/context → result list → exact item highlighted`

Exact ID uses the same catalog view as other searches.

It does not open an isolated part page.

The user can open the highlighted item detail.

## Core rule

**Search determines catalog depth. Catalog context stays visible. Filters narrow the list. Exact ID highlights the matching item. User selects.**

Non-exact search never auto-selects a part.

## Deterministic behavior

PartSource uses:

- typed mechanical fields;
- category hierarchy;
- family schemas;
- filters;
- matching rules;
- provenance;
- fail-closed states.

Runtime behavior is deterministic. No AI or agents run in the product.

## Fail-closed behavior

- Apply only supported typed fields.
- Keep unsupported query terms as query text. Do not turn them into facts.
- Do not invent records or attribute values.
- Do not silently resolve conflicting values.
- If no safe result list exists, show a clear no-results state.
- If an exact ID has no supported match, highlight nothing.
- If an exact ID is not uniquely supported, highlight nothing.

## Product boundaries

PartSource does not claim:

- engineering approval;
- application suitability;
- equivalence;
- replacement;
- approved alternate status;
- supplier stock;
- price;
- availability.

A result is a catalog record. It is not proof that the item is correct for an application.
