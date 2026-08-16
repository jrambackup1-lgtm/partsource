---
title: Real-catalog ingestion pipeline and scalable package loading
status: resolved
resolved: 2026-08-16
label: wayfinder:ticket
created: 2026-08-16
updated: 2026-08-16
audit: user-perspective-issue-audit-2026-08-16.md
---

## Problem (user perspective)

The product shows 30 synthetic demo rows while the approved cofounder dataset of 27,009 real screw records (26,953 unique McMaster PNs, 192 subcat families) sits unloaded in the repo. The current architecture cannot load it: parser budgets reject the package outright (~81 MB vs 2 MB cap; 27k-item arrays vs 10k cap; ~4.5M structural nodes vs 100k cap), the catalog is a TypeScript module parsed at import time inside the JS bundle, and digest verification re-serializes and hashes the full graph in pure JS (~43 s projected at 27k records). No builder exists to turn the CSVs into a `CatalogPackage` at all.

## Evidence

- `.wayfinder/product-recovery/user-perspective-issue-audit-2026-08-16.md` — Part 1 issue 1, Part 2 N1/N2/N5, Part 3 root causes 1 and 4.
- Budgets: `web/src/catalog/parse-catalog-package.ts` (2 MB / 25k rows / 10k per array / 100k nodes; digest seam re-serializes twice).
- Catalog shipping: `web/src/catalog/synthetic-package.ts` exports a module-load parsed package; no fetch seam, no build artifact.
- Dataset: `archive/legacy-runtime-2026-08-12/data/*.csv` (internal only; confidential origin must never be published). 56 rows with blank PN + part number must fail closed. Inch/metric mixed in every file; `thread_system` enum is metric-only today; material strings embed finish; per-category schema forks exist.
- Gates: `research/data-source-register.md` (cofounder row) and Phase 6 evidence — real-data **publication** remains blocked; this ticket builds the pipeline and a dev-loadable catalog release only.

## Scope

1. **Decision gate (must be recorded before ETL code):** family granularity — subcat-as-family vs head-form-family vs hybrid (e.g. head-form family + typed material/grade/profile facts); shared vs family-scoped fact split; inch/mm strategy (dual facts or build-time normalization); material/finish decomposition; McMaster PN normalization policy; handling of the 56 blank-PN rows (fail closed) and mixed-unit fields.
2. Build-time Node ETL: CSVs → canonical `CatalogPackage` JSON artifact(s) + SHA-256 digest computed **at build time**; hierarchy/families/schemas/facts/facets generated from `subcat`; `mcmaster_pn` identifier namespace + one mapping per non-blank row; provenance records; lexicon generated from the resulting taxonomy.
3. Runtime loading: fetch seam replacing the module-load TS catalog; per-collection budgets re-scoped deliberately (not just raised); app keeps working on the synthetic package by default.
4. Verification: aggregate import counts and samples recorded as evidence; `npm run release:audit` green with both packages.

## Out of scope / boundaries

- No production publication of real data (mechanical review, field adjudication, publication approval remain external gates — decision D2 in the audit).
- No confidential-origin exposure in any artifact, log, or UI string.
- No UI redesign (u2/u4/u5 handle presentation).

## Acceptance

- A dev/local catalog release built from the real CSVs loads and is queryable in the dev app with deterministic behavior preserved.
- Budgets, digest, and release identity are enforced at build time with a documented rationale.
- The decision record (family granularity + schema split) is written and linked from this ticket.

## Dependencies

None. Unblocks u3 (PN mappings) and u4 (scale). u2 and u6 are independent and parallel.

## Resolution (2026-08-16)

Resolved in full. Decision record: [decisions/u1-real-catalog-data-decisions.md](../decisions/u1-real-catalog-data-decisions.md) (family granularity = subcat-as-family; dual inch/metric numeric facts; raw-string enums with no field adjudication; 56 blank-PN rows excluded fail-closed; `mcmaster_pn` namespace with zero duplicate PNs; generated lexicon with recorded collision skips).

- **ETL:** `web/scripts/catalog/build-real-package.ts` (`npm run catalog:build-real`) → deterministic `web/catalog-releases/real-screws-v1.json` (109.5 MB, 26,953 configurations, 192 families, 1,110 facets, 265 lexicon rules; digest computed at build time with Node crypto; rebuild reproduces the same digest).
- **Schema:** new honest dev-release literals (`cofounder_private_dev` / `private_dev_only` / `dev_release`) — no public approval metadata; synthetic and public-projection states unchanged.
- **Budgets:** re-scoped ≥2× the measured release shape with documented rationale; the parser's quadratic configuration-revision scan fixed to a grouped map (27k configs validate linearly).
- **Runtime:** app-layer source seam `web/src/dev-catalog-source.ts` (kept outside `src/catalog` so the catalog runtime stays network-free per the boundary guard); `?catalog=real` loads the release with a pinned digest; synthetic remains the default; Vite **dev-server-only** middleware serves the artifact — `vite build`/`preview` never include it.
- **Verification:** `web/scripts/catalog/test-real-package.ts` in `test:catalog` (canonical-digest verification, tampered-digest rejection, count reconciliation, chooser/exact/material queries; queries 0.45s at 27k — the per-record identifier scan now uses an index, fixing the 18.7s broad-query measurement). Evidence: [evidence/u1-real-catalog-release.md](../evidence/u1-real-catalog-release.md) including live dev-server Playwright verification. Full `npm run release:audit` green with both packages.
