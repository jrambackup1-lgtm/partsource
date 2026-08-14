---
title: Red-team the POC architecture and growth path
status: closed
label: wayfinder:research
created: 2026-08-09
updated: 2026-08-10
---

## Question

Which architecture, security, performance, data-lifecycle, observability, deployment, and growth failure modes could invalidate the current four-relation and GitHub-Pages-plus-Supabase direction? Which controls are fundamental now, and which should wait for measured triggers?

## Findings

Report: `research/poc-architecture-risk-red-team-2026-08-09.md`.

The four-relation public bridge survives only as append-only release versions backed by immutable private source/review evidence and family schemas. Current implementation is mutable, source-row-shaped, lossy, weakly bounded, weakly observed, and stale in production. GitHub Pages remains viable for the POC after real endpoint injection, deep-link shells, and end-to-end smoke. Anonymous Edge search must be treated as a hostile-internet public API with an explicit DTO, body/query limits, timeouts, expiring abuse budgets, release IDs, and canaries. Controlled performance and capacity evidence remains open.

## Resolution — 2026-08-10

Closed as the completed architecture/security/growth risk audit. The named runtime controls and measured gates remain open; this is not production acceptance.

Audit: `research/wayfinder-ticket-audit-2026-08-10.md`.
