---
title: Resolve the family-first discovery interaction model
status: closed
outcome: rejected-superseded
label: wayfinder:research
created: 2026-08-09
updated: 2026-08-10
---

## Question

Which proven interaction patterns from Octopart, McMaster-Carr, MISUMI, supplier catalogs, and adjacent component platforms should PartSource use for intent-to-family search, exact-identifier-to-highlighted-variant routing, family browsing, structured configuration, detail, supplier discovery, and BOM capture?

## C rethink resolution — 2026-08-10

Rejected as an active product direction.

Family-first is an interaction pattern, not a proved recurring job, buyer outcome, or business. No more family-first product work is authorized before the paid direction decision in `27-choose-first-paid-post-ticket25-test.md`.

## Evidence so far

- `research/family-first-reference-patterns-2026-08-09.md`
- `sketches/001-family-discovery-comparison.md` — superseded static experiment
- `sketches/002-behavioral-family-workspace/` — current behavioral hypothesis
- `research/poc-family-taxonomy-audit-2026-08-09.md`
- `research/poc-discovery-benchmark.md`

Leading model:

- broad description → ranked family chooser with preserved constraints;
- family-specific description → family workspace with required selectors first;
- exact identifier → selected-configuration inspector first, family controls collapsed;
- uniqueness alone enables no downstream action; BOM or supplier action stays blocked until an approved family profile, complete supported facts, immutable release and mapping identity, valid lifecycle, and zero critical conflicts all pass;
- provenance is shown by evidence layer, not one universal badge.

## Why this remains open

No real task test has validated family granularity, required facet order, exact-path speed, mobile behavior, or supplier-action clarity.

Close only after benchmark tasks beat the current list/detail flow without increasing wrong-family or wrong-configuration outcomes. Ticket 25's 11/11 adversarial failure keeps this interaction hypothesis unapproved.
