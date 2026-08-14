---
title: Make the PartSource restart implementation-ready
status: open
label: wayfinder:map
---

## Destination

Produce an implementation-ready handoff in `research/production-readiness-plan.md`, `research/production-readiness-checklist.md`, and `research/README.md`: a developer can start work without inventing scope, sequencing, contracts, failure behavior, or proof of completion.

## Notes

- Wayfinding is planning-only. App implementation, deployment, and real-data acquisition are outside this map.
- `research/product-contract.md` remains product-boundary authority.
- The three destination documents own implementation direction, execution status/evidence, and authority routing respectively.
- Synthetic fixtures may exercise R2-R3, but must never enter a published production catalog.
- Preserve the existing R0-R5 stage names and the current dirty checkout.
- Refer to tickets by linked title, not bare IDs.

## Decisions so far

- [Set the implementation-ready destination and operating constraints](tickets/set-implementation-ready-destination.md) - keep product authority separate, use a gate-driven rewrite, allow test-only fixtures, and require fail-closed behavior plus evidence-backed completion.
- [Define the recoverable repository baseline](tickets/define-recovery-baseline.md) - archive every ref and dirty artifact, reconcile only contract-compatible behavior in a clean worktree, and require recovery plus full verification proof.
- [Define the catalog publication contract](tickets/define-catalog-publication-contract.md) - publish only immutable, independently reviewed `verified-equivalent` records; keep synthetic fixtures and unpublished data outside the artifact.
- [Define the named-BOM state and portability contract](tickets/define-bom-state-contract.md) - use a versioned local multi-BOM store with immutable selection snapshots, fail-closed migration/restore, and CSV that cannot create verification claims.

## Not yet specified

- The final allocation of resolved detail between the plan and checklist may only become clear after catalog, lookup, BOM, and release-evidence contracts are settled.

## Out of scope

- Implementing or refactoring application code.
- Selecting or acquiring a licensed production data source and the real 25-record packet.
- Performing independent record review, production deployment, or pilot launch.
- Accounts, backend services, checkout, prices, affiliate offers, bulk SEO, and managed lead capture.
