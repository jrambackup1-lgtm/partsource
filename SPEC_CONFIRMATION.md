# PartSource Product Specification

## Purpose

PartSource helps an engineer navigate a mechanical-component catalog.

It turns a query into the deepest supported catalog view and a relevant result list.

## Catalog flow

`query → catalog level → family → filters → result list`

Examples:

- `screws` → Screws list.
- `socket head screws` → Socket-head screw list.
- `countersunk socket screws` → Countersunk socket screw list.
- `M6 A2 stainless socket head cap screws` → Socket-head screw list filtered by M6 and A2 stainless.
- Broad `stainless` alone stays unsupported; it does not become A2.
- Broad `button head` or `countersunk` stays unsupported; it does not prove internal-hex drive.

The category hierarchy, family, active filters, and result list stay visible.

## Product surface

- Home starts search and catalog browsing. It is not a dashboard.
- Catalog shows category/family context, typed constraints, family-specific facets, and an aligned technical table.
- Explicit selection opens contextual detail without losing the family list.
- Concise source state is visible. Claim-level evidence is available on request. Raw traces are diagnostics.
- Synthetic catalog status remains visible on every primary surface.

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

The application release and catalog release have separate identities. The application exposes closed release metadata (`sourceSha`, `builtAt`, and its artifact manifest); the Catalog UI separately exposes the catalog `releaseId` and finalized SHA-256 digest. Local candidate verification is not a claim that production has been deployed.

## Evidence status

- The active package is synthetic and remains visibly labelled synthetic.
- The lawful pilot is an aggregate-only, permission-attested schema/audit proxy. No real family has completed mechanical review, exact-digest publication approval, or publication.
- Automated engine and browser scenarios are proxy evidence only. No external practicing engineer has validated usability or repeated value; that human gate is open.
- Workspace/BOM is **DEFERRED** and has no implementation or product authority. Reconsideration requires real-family and direct-engineer evidence plus an explicit reviewed change to `research/product-contract.md`.

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
