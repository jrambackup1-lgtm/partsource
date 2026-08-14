---
title: Render the traceable, comparison-ready catalog workspace
status: complete
label: wayfinder:implementation
created: 2026-08-13
source-spec: docs/specs/partsource-progressive-catalog-poc.md
---

# 41 — Render the traceable, comparison-ready catalog workspace

**What to build:** A keyboard-operable catalog workspace and in-workspace detail surface that render the new deterministic view model: strict exact-ID states, factual interpretation trace, visible typed filters, truthful unit/datum labels, separated provenance, and comparison-ready rows—without turning any result into a recommendation or compare workflow.

**Blocked by:** 40 — Extend the deterministic resolver and synthetic contract for the UX delta.

**Status:** complete — passed 2026-08-14. Evidence: [Ticket 41 traceable comparison-ready workspace gate](../evidence/ticket-41-traceable-comparison-ready-workspace-gate.md).

- [x] Every submitted query visibly exposes a keyboard-reachable deterministic trace using factual labels and a clear stop reason; it preserves original input and separates recognized, unsupported, and conflicting content.
- [x] Unique, unknown, and non-unique exact-ID states visibly match the resolver contract. Non-unique mapping evidence never marks a record preferred, selected, approved, equivalent, replacement, or alternate.
- [x] Active filters, valid values, disabled/removed impossible values, and zero-result constraints remain visible. Controls and URL-driven state do not silently broaden, drop, or invent a filter.
- [x] Rows and detail show family, thread/pitch, length plus correct datum, material, finish, drive, head profile, and distinct record/fact/mapping provenance with the persistent synthetic-data notice.
- [x] Exact highlight and explicit selection have different non-colour meaning. Any visible row can be activated; selecting another row retains the unique exact highlight as identity evidence.
- [x] Rows remain first-pass comparison-ready only: no compare mode, workspace, shortlist, favorite, cart, BOM, export, supplier, price, availability, quote, or procurement control appears.
- [x] Desktop detail preserves catalog context and operable filters; narrow detail is an accessible modal. Keyboard activation, Close, Escape, focus return, filter-driven selection invalidation, and 320 CSS-px stacked rows work without horizontal page scrolling.
