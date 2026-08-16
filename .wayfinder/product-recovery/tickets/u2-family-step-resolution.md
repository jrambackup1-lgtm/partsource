---
title: Family-step resolution for broad queries
status: resolved
resolved: 2026-08-16
label: wayfinder:ticket
created: 2026-08-16
updated: 2026-08-16
audit: user-perspective-issue-audit-2026-08-16.md
---

## Problem (user perspective)

Searching `M4 screw` or `screws` drops the user into a flattened table of mixed individual screws across families — 6 undifferentiated rows today, ~990 at real scale — with no filters at that level. The user is never shown "these are the screw types that match; pick one," which is exactly what the product rule promises. Clicking a family then silently discards the query's constraints (M4 is lost). The contract states "Broad catalog input makes the family step explicit"; the runtime violates it because no category-level resolution state exists.

## Evidence

- Audit Part 1 issue 2; Part 2 N10; Part 3 root cause 2. UX and engineer reviews both ranked this CRITICAL.
- `web/src/catalog/engine/resolver.ts` — broad queries resolve to a category node with `familyId: null`; `filterConfigurations` then concatenates all families; `projectCatalogView` yields `facets: []` when `familyId` is null.
- `web/src/catalog/ui/CatalogApp.tsx` `browseFamily` — re-resolves from the family label, dropping active query filters (verified live: M4 constraint disappears).
- Recovery ledger R5 recorded an "explicit family step" as closed — contradicted by every live user-path test (internal evidence ≠ user experience).
- Adversarial nuance: an unconditional interstitial taxes the single-family case; at real scale "M4" spans all three categories, so a chooser (or grouped presentation) is unavoidable. Competitor evidence: McMaster-Carr lands broad terms on category/subcategory pages, never flat mixed lists.

## Scope

1. New resolution state for category-level results: render the matching **families with live counts** (carrying any typed constraints from the query, e.g. M4) instead of a flattened record table. URL/history encoding for the new state.
2. Family selection is a context switch: entering a family **preserves query-derived filters** and shows them as removable active constraints.
3. Single-match shortcut decision: when exactly one family matches (or a threshold is met), open its list directly with context visible — no forced extra click. Record the rule.
4. Partial-application decision (reviewed, contract-aligned): recognized typed facts apply while unrecognized terms remain visible query text — replacing today's whole-query failure on one unknown token (`M6 socket head cap screw 20mm A2` → nothing). Fail-closed semantics preserved: no guessed facts, no auto-select.
5. Constraint visibility/removability at category level (the implicit "Nominal diameter: 4 mm" chip is currently display-only).

## Out of scope / boundaries

- Category-level facet engine (full cross-family faceting) — decided inside this ticket only if required for the chooser counts; full treatment lives in u4.
- No auto-selection of any record (contract).

## Acceptance

- `M4 screw` shows matching screw families with counts (M4-aware), not mixed rows; selecting a family opens its list still filtered by M4.
- `screws` shows the family set; single-family-match shortcut behaves per the recorded rule.
- Tests cover: broad query → chooser; chooser → family with constraints preserved; conflict/unsupported behavior unchanged; URL round-trips.

## Dependencies

None. Unblocks u4; u1 and u6 are independent and parallel.

## Resolution (2026-08-16)

Resolved in full.

- **New `catalog_chooser` resolution state:** broad queries resolving to a category node render matching families with live constraint-aware counts (`resolveFamilyChoices`; `familyChoices` on resolution and view model) — never a flattened mixed-family table. Recorded rule: exactly one matching family opens its list directly (no forced extra click; proven on a purpose-built single-family fixture since the synthetic fixture's three families are data-identical).
- **Family selection is a context switch:** entering a family (chooser card or browse tree) preserves query-derived filters via `applyCatalogFilters` and shows them as removable active-constraint chips; the URL round-trips chooser state (`q` + filters, no `family`) and chosen-family state (`family` present).
- **Partial application (contract-aligned):** recognized typed facts/phrases apply while unrecognized terms remain visible query text (`.uninterpreted` strip, "no fact was inferred"). Whole-query failure is preserved when nothing is recognized and for uninterpreted negation words ("not black oxide" never applies the adjacent constraint). No guessed facts, no auto-select.
- **Constraint visibility/removability** at both category and family level (remove buttons recompute chooser counts or the family list).
- Tests: `test-engine.ts` (chooser counts, context switch, shortcut, negation, kept-text), `test-engine-url-history.ts` (chooser hydration, chosen-family round-trip, selection cannot survive at category level), Playwright `catalog-shell.spec.ts` (broad browse to chooser, M4-aware counts, constraint preservation/removal, partial queries, fail-closed states). Full `release:audit` green; verified at real scale in the u1 evidence (79 M4-matching families on the 26,953-record release).
