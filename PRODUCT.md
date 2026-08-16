# Product

## Name

PartSource

## User

Mechanical engineers and hardware builders searching for a component from broad text, partial specifications, or an exact identifier.

## Purpose

PartSource is a deterministic mechanical-component catalog navigator.

`query → catalog level → family → filters → result list`

Exact ID opens the correct family context and result list, then highlights the matching item.

The user selects what to open.

## Core rule

**Search determines catalog depth. Catalog context stays visible. Filters narrow the list. Exact ID highlights the matching item. User selects.**

Non-exact search never auto-selects a part.

## Runtime

PartSource uses typed fields, category hierarchy, family schemas, filters, deterministic matching, provenance, and fail-closed states.

No AI or agents run in the product.

## Trust boundary

PartSource does not invent facts or silently resolve conflicts.

Catalog results do not claim engineering approval, suitability, equivalence, replacement, stock, price, or availability.

## Product principles

- Keep catalog context visible.
- Show active filters.
- Keep result lists dense and comparable.
- Separate highlight from selection.
- Keep provenance near supported facts.
- Fail closed when safe matching is not possible.

## Brand personality

- Professional.
- Precise.
- Trust-first.
- Dense, not cluttered.

## Accessibility

- Meet WCAG AA text contrast.
- Support reduced motion.
- Support keyboard navigation.
- Keep focus and selection states distinct.
