---
title: Run the post-POC UX-delta release gate
status: complete
label: wayfinder:implementation
created: 2026-08-13
source-spec: docs/specs/partsource-progressive-catalog-poc.md
---

# 42 — Run the post-POC UX-delta release gate

**What to build:** One repeatable local audit that proves the approved UX delta is deterministic, synthetic-only, accessible, fail-closed, and free of prohibited claims, controls, routes, metadata, and network activity.

**Blocked by:** 39 — Ratify the post-POC UX-delta acceptance corpus and domain review; 40 — Extend the deterministic resolver and synthetic contract for the UX delta; 41 — Render the traceable, comparison-ready catalog workspace.

**Status:** complete — passed 2026-08-14. Evidence: [Ticket 42 post-POC UX-delta release gate](../evidence/ticket-42-post-poc-ux-delta-release-gate.md).

- [x] One audit runs the approved deterministic benchmark, validator and resolver checks, browser acceptance, responsive/focus/history checks, claim/control checks, route/metadata checks, and network-boundary checks against the built local artifact.
- [x] Resolver and browser evidence passes exact-ID `unique`, `unknown`, and `non_unique`; highlight versus selection; recognized/unsupported/conflict traces; typed filter visibility and safe zero states; unit/datum truth; provenance; and comparison-ready rows.
- [x] Adversarial checks cover identifier-like text, unsupported units and bare numbers, OR/negation, malformed or repeated URL fields, direct unsafe selected URLs, missing provenance, and prohibited equivalence, verified, supplier, BOM, and compare-control creep.
- [x] Browser evidence confirms keyboard operation, focus and scroll restoration, direct URL safety, desktop/narrow detail behavior, and 320 CSS-px rows without horizontal page scroll.
- [x] The audit fails on console/page errors, external catalog/supplier/analytics/search/AI requests, unsupported bundle fields, prohibited visible or accessible copy, prohibited controls/routes, or Product/Offer/supplier/isolated-detail metadata.
- [x] The recorded domain review from ticket 39 remains attached to the gate; passing automation does not substitute for it.
