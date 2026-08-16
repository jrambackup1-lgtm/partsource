---
title: Honest detail view and UI language pass
status: resolved
resolved: 2026-08-16
label: wayfinder:ticket
created: 2026-08-16
updated: 2026-08-16
audit: user-perspective-issue-audit-2026-08-16.md
---

## Problem (user perspective)

The product's most confident moment — an exact match — is wrapped in machine identifiers ("Mapping evidence: synmap-v1-01 · prov.mapping.synthetic.v1") above the results, which the contract explicitly forbids ("Raw resolver traces and internal identifiers belong in optional diagnostics, not above the result task"). The banner also makes false statements: it claims "the mapped configuration is selected" when the user selected a *different* row, and keeps claiming a highlighted row after a filter excluded it. Counts, table columns, and the browse tree are hardcoded literals ("View all 30 configurations") that will silently lie at any data change. The vocabulary ("configurations", "A2 stainless", "exact synthetic ID") is PLM-speak rather than engineer language, and the synthetic story is told four times over while the hero copy sells the test harness ("small, deterministic… synthetic evidence") instead of the user's job.

## Evidence

- Audit Part 1 issue 4 (detail), issue 5 (shell decision D1); Part 2 N9, N11, N12, N13, N16.
- `web/src/catalog/ui/CatalogApp.tsx:190-191` — banner branches on `selectedRecordId != null` (not selected == mapped) and prints mapping evidence inline; `:170-173,208-209` — hardcoded counts/tree; `Results` — hardcoded columns.
- `research/product-contract.md` "Provenance presentation" — diagnostics placement rule; "Synthetic catalog status remains visible" (visibility stays; redundancy goes).
- Engineer review: detail view lacks the part-title/standards block; PN prominence arrives with u3.

## Scope

1. Banner honesty: state the exact match in user terms ("Part 91290A331 matches — highlighted below"); fix the selected-branch condition (selected == mapped); state plainly when the user's own filter removed the highlighted row; move mapping/namespace/provenance identifiers into the inspector's evidence section or diagnostics.
2. Derive all counts, family labels, tree structure, and table columns from the loaded package (no literals).
3. Terminology decision (record it): user-facing "part"/"part number" vs "configuration"; display mapping for material designations (A2 ↔ 18-8 ↔ 304 per family data) so vocabulary matches the dataset and the audience; rewrite placeholder/hero copy in value language while keeping required synthetic-status visibility (once, prominent, per surface — not four times).
4. Detail content order for the "open a part" job: identifier (PN) first, then the technical facts, then standards/specs block, then evidence — internal revision/namespace IDs demoted to diagnostics.
5. Optional minimal shell affordance per decision D1: a "Browse catalog" link in the topbar; no new surfaces.

## Out of scope / boundaries

- No new surfaces (no dashboard, cart, workspace) — decision D1.
- No removal of synthetic-data disclosure — consolidation only.
- PN display itself lands with u3; this ticket assumes it where dependent.

## Acceptance

- No internal identifiers above the result task; banner never asserts a false state (verified for: select-other-row, filter-excludes-exact, close-inspector paths).
- All counts/columns/tree render from package data; changing the catalog package changes them.
- Terminology decision recorded and applied consistently (search placeholder, banner, table, inspector, Home).

## Dependencies

u3 for PN-first detail ordering; items 1–2 (banner honesty, derived counts) and copy work are independent and can start anytime.

## Resolution (2026-08-16)

Resolved in full. Decisions: [decisions/u5-terminology-and-presentation.md](../decisions/u5-terminology-and-presentation.md).

- **Banner honesty (N9/N11):** the exact-match banner speaks in user terms ("Part 92655A331 matches — highlighted below"); the selected branch fires only when the selected row *is* the mapped row (select-other-row no longer claims selection); a filter that excludes the match states "filtered out" with a plain explanation that the mapping is unchanged. Mapping/namespace/provenance identifiers and the internal revision id moved to the inspector's "Diagnostics: identity and mapping evidence" section — nothing internal renders above the result task (asserted in the browser suite).
- **Derived values (N16):** browse tree (root, categories, families, counts), Home family cards and totals, chooser counts, and result columns all render from the loaded package — no literals; loading the dev catalog changes them all.
- **Terminology (N12):** "part"/"part number" applied across placeholder, headings, counts, inspector, and empty states; material vocabulary stays raw source values (no alias layer — recorded); hero copy rewritten in value language; synthetic/dev disclosure consolidated to once per surface (T3).
- **Detail order (issue 4):** part number first, specifications with inline field evidence, a "Standards and specifications met" block (specifications_met, grade/class, tensile, hardness, RoHS), then diagnostics. Part-title field omitted by recorded decision (T5).
- **Shell (D1):** optional topbar browse link declined by recorded decision (T6) — Home's primary action already serves it.
- Tests: browser honesty paths (select-other-row, filter-exclusion, no internal ids above results), derived-value rendering, terminology assertions; full `release:audit` green.
