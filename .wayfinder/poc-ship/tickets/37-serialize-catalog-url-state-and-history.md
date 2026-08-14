---
title: Serialize safe catalog URL state and history restoration
status: complete
label: wayfinder:implementation
created: 2026-08-11
source-spec: docs/specs/partsource-progressive-catalog-poc.md
---

# 37 — Serialize safe catalog URL state and history restoration

**What to build:** One canonical catalog-workspace URL contract that recreates a safe query, context, filters, exact highlight, and optional selected detail. Browser Back and Close restore the correct catalog state without isolated part routes or stale selection.

**Blocked by:** 34 — Enforce fail-closed query interpretation; 35 — Resolve exact synthetic identifiers and highlight evidence; 36 — Open accessible in-workspace detail after explicit selection.

**Status:** complete — final release audit passed on 2026-08-12: canonical typed URL state, invalid-selection fail-closed behavior, direct URL hydration, Close/Back return snapshots, and B15/B18 browser coverage.

- [x] Submission pushes one catalog entry, facet edits replace the current entry, first row activation pushes one selected-state entry, and a replacement selection updates that entry without creating a stale nested-detail Back target.
- [x] URLs serialize `v=1`, preserved query, safe family/filter set, and only a valid selected record ID; exact highlight is always derived from query rather than stored separately.
- [x] `selected` accepts only an existing unique `record_id` in the encoded visible list. Identifiers, collisions, absent records, empty values, and out-of-list records return `invalid_selection` with no detail and safe catalog context retained.
- [x] Valid direct selected-state URLs open detail; direct catalog URLs hydrate deterministically and canonicalize approved pre-v1 state once.
- [x] Malformed, repeated, unsupported, inconsistent, or unsafe URL state returns `invalid_url_state`, preserves rejected-field evidence where safe, and never broadens silently.
- [x] Close and Back remove selection and restore query, path, filters, order, highlight, and focus target. Selection invalidated by a filter closes detail before the new list renders.
- [x] URL-state unit and Chromium browser tests cover direct detail, invalid state, submission, selection, Close, and Back restoration.
