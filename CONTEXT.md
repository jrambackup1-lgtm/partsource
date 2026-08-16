# PartSource Domain Language

## Query

The original text or exact identifier entered by the user.

PartSource preserves the query. Parsed fields do not replace it.

## Catalog level

The deepest supported category or family view selected from the query.

Examples: `Screws` or `Socket-head screws`.

## Category hierarchy

The ordered path from a broad component class to a product family.

The active path stays visible after search.

## Family

A group of mechanical components that share one functional type and one field schema.

Example: `Socket-head screws`.

A family is not one item, supplier page, or material variant.

## Family schema

The typed fields that are valid for one family.

A field from one family does not silently apply to another family.

## Typed field

A normalized mechanical attribute with a defined type, unit, and family scope.

Examples: thread size, pitch, length, material, finish, drive, and standard.

## Filter

A supported typed field value applied to the current result list.

Active filters stay visible and can be removed by the user.

## Result list

Catalog records inside the active catalog and family context.

A result list is not a selected part.

## Catalog record

One item represented by stable identity, family, typed fields, identifier mappings, and provenance.

Catalog membership does not imply approval, suitability, stock, or equivalence.

## Home

The start surface for global search, examples, supported catalog browsing, and data-status disclosure.

Home is not a dashboard and shows no fake activity or commercial metrics.

## Family workspace

The catalog view for one coherent family. It keeps the hierarchy, original query, typed constraints, family-specific filters, aligned result table, and contextual selected-record detail together.

## Identifier

A supported external or internal lookup key.

An identifier is not the record identity and is not an equivalence claim.

## Exact identifier match

A supported unique mapping from an identifier to one catalog record.

PartSource opens the correct family and result list, then highlights the matching row.

It does not select the row or open detail automatically.

## Highlight

A visible emphasis on the exact matching row.

A highlight is not user selection.

## Selection

An explicit user action that chooses a result or opens its detail.

Non-exact search never creates a selection.

## Provenance

The source or declared synthetic origin of a technical fact or identifier mapping.

Provenance stays attached to the fact or mapping it supports.

Default provenance is concise. Claim-level evidence is user-invoked. Raw interpretation and package references are diagnostics.

## Application release

The immutable deployed code artifact identified by `/partsource/release.json`.

## Catalog release

The immutable hierarchy, family-schema, configuration, mapping, lexicon, and provenance package used by the application.

Application and catalog releases have separate identities.

## Fail-closed state

A state that shows no unsupported result, filter, selection, or highlight.

PartSource fails closed when it cannot produce a safe deterministic catalog view.
