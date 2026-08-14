---
title: Establish the local POC runtime and validated synthetic bundle
status: complete
label: wayfinder:implementation
created: 2026-08-11
source-spec: docs/specs/partsource-progressive-catalog-poc.md
---

# 32 — Establish the local POC runtime and validated synthetic bundle

**What to build:** A launchable local PartSource POC that begins in the approved `initial` catalog state. It reads only the complete `PS-POC-SYNTHETIC-V1` blank-slate bundle, visibly labels the data as synthetic, and refuses all catalog content when the bundle is invalid. Legacy catalog data, APIs, generators, suppliers, and blocked CSV derivatives remain outside this runtime path.

**Blocked by:** None — can start immediately.

**Status:** complete — 2026-08-11

- [x] A valid bundle contains exactly the approved three families, 30 typed records, 32 mappings, provenance, and the persistent synthetic-data notice.
- [x] The bundle validator rejects every prohibited, unknown, malformed, duplicate, incomplete, inconsistent, or incorrectly mapped datum before any catalog record renders.
- [x] Invalid bundles render only `catalog_unavailable`; no records, filters, highlight, selection, or detail are available.
- [x] Initial load renders the search form, Screws root context, and synthetic notice without resolving a catalog list.
- [x] The POC build and test path makes no catalog, supplier, analytics, or external search request and does not read blocked CSVs or their derivatives.
- [x] Validator and initial browser behavior are covered by automated tests (`npm test`, `npm run lint`, `npm run build`, and Chromium POC test).
