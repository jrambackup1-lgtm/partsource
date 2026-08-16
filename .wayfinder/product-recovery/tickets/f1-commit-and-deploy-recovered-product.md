---
title: Commit and deploy the recovered product (u1–u6 working tree)
status: resolved
resolved: 2026-08-16
label: wayfinder:ticket
created: 2026-08-16
updated: 2026-08-16
audit: ../live-product-root-cause-2026-08-16.md
fixes: RC1
---

## Problem (user perspective)

Everything the owner sees on the live site is the pre-recovery build. The u1–u6 implementation exists only as uncommitted working-tree state (19 modified + 15 untracked files); production builds from committed `master` (`01a214b`), which contains none of it — live probe: "View all 30 configurations", `M4 screw` → 6 mixed rows, real PN → "Search terms not recognized".

## Root cause

`deploy.yml` builds from committed refs only; `research/release-truth.md:50` excludes uncommitted files from production state; no ticket in u1–u6 covered committing or deploying; commit `5343aff` "production-verified" a build that predates the ticket work, and the recovery plan's status line fuses local-test greenness with that stale production verification.

## Scope

1. Review the working tree as one change set (engine + UI + tests + tickets/evidence/decisions + `real-release-identity.ts`; the gitignored 109.5 MB artifact and `catalog-releases/` stay out).
2. Run `release:audit` on a clean checkout of the candidate commit to prove committed-state greenness (not working-tree greenness).
3. Deploy and byte-verify: `release.json.sourceSha` must equal the new commit; the deployed site must show the chooser for `M4 screw` and the PSYN exact path.
4. Reconcile documents that carry the conflated claim: plan status line (§ header), `HANDOFF_NEXT_SESSION.md` (stale 8/8 vs 16/16, "synthetic only" statement). Record that the prior "production-verified" evidence referred to `01a214b`.

## Out of scope

Any behavior change (f2–f4 handle those). This ticket ships what exists.

## Verification (resolved 2026-08-16)

- Commit `a325f25` (35 files, +2715/−221) after full local audit: lint green; `npm test` green (incl. `catalog:build-real` + `test-real-package`: parse 20.4 s, queries 0.39 s); browser 16/16 (one load-flake re-verified green in isolation and on full-suite rerun; flake recorded in f5 scope).
- Workflow run 31940995125: verify + deploy jobs green (full audit re-runs in CI, including browser suite).
- Deployed `release.json.sourceSha` = `a325f251c146ae806ec446cdc2d4107586ff3d35` = commit.
- Deployed probes (live): `M4 screw` → 3-family chooser, 0 mixed rows; family entry keeps `Nominal diameter: 4 mm`; `PSYN-SCR-0001` → family list + 1 highlighted row; pill "Synthetic catalog" (production is synthetic by the publication gates).
- Plan status line corrected (names run 31926209080/`01a214b` as pre-u1–u6); §17 ledger added; handoff updated.
