---
title: Resolve exact synthetic identifiers and highlight evidence
status: complete
label: wayfinder:implementation
created: 2026-08-11
source-spec: docs/specs/partsource-progressive-catalog-poc.md
---

# 35 — Resolve exact synthetic identifiers and highlight evidence

**What to build:** Namespace-aware exact synthetic-ID lookup inside the same catalog workspace. A supported unique mapping opens its family list and highlights the mapped row; absent and collision mappings fail closed without family narrowing, a list, selection, or detail.

**Blocked by:** 33 — Build progressive catalog query and deterministic filters.

**Status:** complete — 2026-08-11

- [x] Exact-ID mode applies only to a complete trimmed, ASCII case-insensitive approved synthetic identifier; partial IDs remain text and are not routed as exact lookup.
- [x] Identifier normalization trims and ASCII-case-folds only; it preserves hyphens, punctuation, and internal whitespace.
- [x] A unique mapping opens its complete family list and highlights it without selection or detail.
- [x] Zero mappings return `exact_not_found`; collision mappings return `exact_non_unique` with safe mapping evidence only. Neither state infers family or renders a list.
- [x] `PSYN-SCR-0001` through `PSYN-SCR-0030` are the primary displayed exact IDs. `PSYN-SCR-COLLIDE` is lookup evidence only and is never presented as the singular row/detail exact ID.
- [x] Highlight is derived from the original exact query, remains visibly distinct from selection, and never appears for non-exact one-row results.
- [x] Resolver and Chromium browser tests cover unique, absent, collision, and partial-ID boundaries.
