---
title: Explore the mechanical search and discovery frontier
status: closed
label: wayfinder:research
created: 2026-08-09
updated: 2026-08-10
---

## Question

Which search modes, query understanding, terminology normalization, identifier handling, dimension parsing, standard lookup, family ranking, geometry/context inputs, and failure recovery materially improve mechanical-part discovery? Which need the POC, which are later opportunities, and which are gimmicks?

## Findings

Report: `research/mechanical-search-discovery-frontier-2026-08-09.md`.

Use deterministic family-aware parsing, exact namespace-scoped identifiers, typed hard predicates, PostgreSQL FTS, narrow typo suggestions, family facets, stable ordering, and explicit absence/error states. Hard constraints filter or abstain; they never become ranking boosts. Search must preserve input and explain parsed, unresolved, conflicting, and ignored spans.

Defer external search engines, embeddings, LLM parsing, BOM batches, and geometry search behind measured triggers. Remaining evidence gates are the reviewed family grammar, identity profiles, golden corpus, and target-user benchmark.

## Resolution — 2026-08-10

Closed as the completed search-frontier build/defer/reject research. Search quality, family grammar, golden answers, and user improvement remain unapproved.

Audit: `research/wayfinder-ticket-audit-2026-08-10.md`.
