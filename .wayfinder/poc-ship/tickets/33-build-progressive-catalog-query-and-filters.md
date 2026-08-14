---
title: Build progressive catalog query and deterministic filters
status: complete
label: wayfinder:implementation
created: 2026-08-11
source-spec: docs/specs/partsource-progressive-catalog-poc.md
---

# 33 — Build progressive catalog query and deterministic filters

**What to build:** The visible progressive catalog flow for safe broad, family, and typed-field queries: `query → catalog level → family → filters → result list`. The engineer sees preserved query text, path, resolved family, active filters, count, and stable ordered records, and can add or remove exact AND-only filters without automatic selection.

**Blocked by:** 32 — Establish the local POC runtime and validated synthetic bundle.

**Status:** complete — final release audit passed on 2026-08-12; deterministic progressive query, typed family context, AND-only filters, B01–B07, B17, and browser regression coverage passed.

- [x] `screws` opens the Screws context with the approved 30-record list and no family, filter, highlight, selection, or detail.
- [x] Approved family aliases resolve to their family context; supported field values without a family filter the three-family Screws list without inferring a family.
- [x] Query-derived and user-applied family, diameter, pitch, length, material, and finish filters appear together and use exact typed AND matching.
- [x] Family filters move between Screws and family context as specified; drive and head profile remain displayed facts, never duplicate filter controls.
- [x] Filter removal preserves the submitted query and updates the list synchronously; valid no-match combinations produce `catalog_empty` with visible safe context and filters.
- [x] Results use the approved family, diameter, length, material, and record-ID ordering and render every matching record.
- [x] Resolver and Chromium browser tests cover the catalog, filter, empty-result, ordering, and removal behavior.
