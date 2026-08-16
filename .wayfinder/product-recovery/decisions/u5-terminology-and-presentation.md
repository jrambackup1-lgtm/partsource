---
title: u5 terminology and presentation decisions
status: decided
created: 2026-08-16
ticket: ../tickets/u5-honest-detail-and-language.md
authority: Presentation-layer decisions only. `research/product-contract.md` remains sole product contract.
---

# u5 — Terminology and presentation decisions (2026-08-16)

## T1 — User-facing vocabulary: "part", not "configuration"

Engine, schema, and provenance vocabulary keeps the precise term *configuration* (immutable revision-addressed truth). User-facing copy (search placeholder, result headings, counts, chooser, inspector title, empty states) uses **part / part number** — the engineer's word and the dataset's word. Applied consistently across Home, Catalog, and the inspector.

## T2 — Material display vocabulary

The synthetic fixture's `a2_stainless` already renders "A2 Stainless"; the real dataset's raw values are already US-engineer vocabulary ("18-8 Stainless Steel", "Zinc-Plated Steel", "Grade 5", "Class 8.8"). No alias layer is introduced: raw source values are the display values (deciding equivalences like A2 ≡ 18-8 ≡ 304 is field adjudication — an external mechanical-review gate, not a UI mapping). The synthetic fixture's teaching example remains honest because its provenance labels it synthetic.

## T3 — Synthetic/dev disclosure: once per surface

- Catalog surface: the notice strip under the topbar (carrying release id + digest + status) is the single disclosure; hero copy and family cards no longer repeat it.
- Detail surface: the inspector notice states the package truth — "synthetic demonstration data, not an engineering reference" (synthetic package) or "cofounder dev dataset, not reviewed for public release" (dev package).
- Topbar pill names the active catalog (synthetic vs dev) — selection state, not a third disclaimer.

## T4 — Banner and diagnostics placement

The exact-match banner states only what is true (highlighted below / selected — only when the selected row *is* the mapped row / filtered out with an explanation) and carries no internal identifiers; mapping, namespace, provenance identifiers, and the internal revision id live in the inspector's **Diagnostics: identity and mapping evidence** section. Detail order: identity (part number) → specifications (with inline field evidence) → standards and specifications met → diagnostics.

## T5 — Title field omitted from the catalog release

Source `title` strings embed PN + family + attributes already carried by structured facts. Adding ~27k distinct enum values solely for display was rejected; part number + family label + facts are the identity presentation. Revisit only with a reviewed data need.

## T6 — Shell affordance (decision D1)

No topbar "Browse catalog" link added: the Home surface's primary action is already catalog browse, and adding a second affordance grows chrome without a measured need. Recorded as the D1 optional item declined, not forgotten.
