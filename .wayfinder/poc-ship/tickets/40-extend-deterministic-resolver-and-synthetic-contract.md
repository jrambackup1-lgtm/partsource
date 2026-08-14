---
title: Extend the deterministic resolver and synthetic contract for the UX delta
status: complete
label: wayfinder:implementation
created: 2026-08-13
source-spec: docs/specs/partsource-progressive-catalog-poc.md
---

# 40 — Extend the deterministic resolver and synthetic contract for the UX delta

**What to build:** One validated synthetic-data and catalog view-model boundary that safely expresses strict exact-ID states, deterministic interpretation trace, family-scoped filter availability, unit/datum truth, provenance, and comparison-ready record data. The boundary remains the only place that decides parsing, matching, collision, filtering, highlight, and selection validity.

**Blocked by:** 39 — Ratify the post-POC UX-delta acceptance corpus and proxy-evidence gate. Passed in [Ticket 39 proxy-evidence gate](../evidence/ticket-39-post-poc-ux-delta-acceptance-corpus.md).

**Status:** complete — gate passed in [Ticket 40 deterministic resolver/synthetic contract gate](../evidence/ticket-40-deterministic-resolver-synthetic-contract-gate.md).

- [x] Whole-query synthetic-ID detection uses only trim plus ASCII case-fold; punctuation, internal spaces, partial IDs, prose IDs, and extra text do not enter exact-ID mode.
- [x] `unique` returns the mapped family’s complete ordered list and one highlight without selection/detail; `unknown` and `non_unique` retain Screws root with no list, highlight, selection, detail, inferred family, or first-mapping fallback.
- [x] The view model provides a deterministic, factual trace with original query, recognized/applied values, unsupported terms, conflicts, exact-ID state, stop reason, and relevant provenance references; it contains no recommendation, confidence, or implementation explanation.
- [x] Only family-scoped typed fields provide filter values. Active constraints remain visible; impossible values may be removed/disabled without dropping constraints or broadening a list; safe empty combinations remain distinct from unsafe queries.
- [x] Query, filters, result records, and detail data preserve metric-only units and family datum: `shcs`/`bhss` under-head, `css` overall. Bare numbers, inch values, ranges, and unsupported terms remain unsupported.
- [x] Each view-model record and exact-ID evidence carries separate record, displayed-fact, and mapping provenance; bundle validation fails closed if required provenance or approved synthetic schema constraints are absent.
- [x] Resolver coverage proves the approved corpus cases, URL/selection safety, stable ordering, and the absence of inferred facts, mappings, families, highlights, and selections in unsafe states.
