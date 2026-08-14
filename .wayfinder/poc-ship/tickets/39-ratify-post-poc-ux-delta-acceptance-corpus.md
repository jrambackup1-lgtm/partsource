---
title: Ratify the post-POC UX-delta acceptance corpus and proxy-evidence gate
status: complete
label: wayfinder:implementation
created: 2026-08-13
source-spec: docs/specs/partsource-progressive-catalog-poc.md
---

# 39 — Ratify the post-POC UX-delta acceptance corpus and proxy-evidence gate

**What to build:** A reviewable, deterministic acceptance corpus for the approved exact-identifier-recovery UX delta, plus a proxy-evidence gate using public standards scope, manufacturer technical data, and independent adversarial challenge. This locks the synthetic POC truth boundary before the delta changes runtime behavior. It is not qualified approval.

**Blocked by:** None — can start immediately.

**Status:** complete — proxy-evidence gate passed in [Ticket 39 post-POC UX-delta acceptance corpus](../evidence/ticket-39-post-poc-ux-delta-acceptance-corpus.md). This is not qualified approval.

- [x] Define resolver and browser outcomes for exact-ID `unique`, `unknown`, and `non_unique`; highlighted evidence stays distinct from user selection and detail activation.
- [x] Define adversarial outcomes for partial, embedded, extra-text, extra-digit, internal-space, and changed-punctuation identifier-like queries; none may enter fuzzy recovery.
- [x] Define trace, typed-filter, zero-result, unsupported, conflict, unit/datum, provenance, row-field, URL, keyboard/focus, and 320 CSS-px acceptance cases.
- [x] Define and assess five proxy-evidence acceptance points: exact-ID wording; family length datum; typed filter applicability; record/fact/mapping provenance separation; and comparison-ready row boundaries.
- [x] Record public standards scope, manufacturer technical data, independent challenge findings, evidence limits, and disagreements. Label every conclusion proxy evidence; do not claim qualified approval, mechanical correctness, standards conformance, interchangeability, suitability, supplier status, or commercial status.
- [x] Pass the proxy gate only when every point has evidence that supports a bounded synthetic-catalog rule, an explicit non-implication boundary, and no unresolved contradiction that requires changing the rule.
- [x] Keep the corpus synthetic-only and exclude source, supplier, BOM, comparison-workspace, AI, and runtime-agent scope.
