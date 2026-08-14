---
title: Enforce fail-closed query interpretation
status: complete
label: wayfinder:implementation
created: 2026-08-11
source-spec: docs/specs/partsource-progressive-catalog-poc.md
---

# 34 — Enforce fail-closed query interpretation

**What to build:** Deterministic query interpretation that preserves the original submission while safely exposing recognized typed values, conflicting values, and unsupported constraints. Unsafe text never produces a list, implicit filter, highlight, selection, or detail.

**Blocked by:** 33 — Build progressive catalog query and deterministic filters.

**Status:** complete — final release audit passed on 2026-08-12; B08–B14 resolver/browser checks, conflict and unsupported fail-closed states, and safe URL hydration passed.

- [x] Interpretation trims and collapses whitespace only for parsing; displayed and serialized query text remains exactly as submitted.
- [x] Only approved aliases and typed values can be recognized. Unknown constraints, ranges, units, standards, materials, finishes, drives, typos, OR, negation, and bare numbers remain visible unsupported text.
- [x] Accept explicit pitch only as `M<size>x<pitch>` (ASCII `x` or multiplication sign), or `pitch <pitch> mm`; a bare pitch number is unsupported. Other syntax is not guessed.
- [x] Multiple distinct values for one supported field return `query_conflict`, show all conflicting values, and apply none of them.
- [x] Unsupported constraints return `query_unsupported`, show recognized values and unsupported terms separately, and render no result list.
- [x] Safe zero results remain distinct from unsafe-query states.
- [x] Resolver and Chromium browser tests cover conflicts, unsupported terms, and exact-pitch grammar without fallback behavior.
