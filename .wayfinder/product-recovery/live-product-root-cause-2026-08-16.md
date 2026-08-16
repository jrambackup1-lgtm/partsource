# Live-Product Root-Cause Report — 2026-08-16 (second audit)

**Type:** Root-cause report + fix-ticket basis. Not a contract change.
**Authority:** `research/product-contract.md` remains sole authority.
**Trigger:** Owner reports the live product still shows 30 synthetic parts, `M4 screw` mixed rows, no family step, broken exact PN, POC/debug detail UI — despite tickets u1–u6 marked resolved and `release:audit` green.

## Method

Live product testing by the lead agent (Playwright probes against the deployed Pages site, the local dev server default path, and the `?catalog=real` dev path), plus four parallel investigations (product/UX territory, catalog architecture, resolver/data probes, adversarial claim verification). Every finding below was reproduced by direct probe or quoted from the artifact under discussion.

## Why the reports said PASS while the product is wrong

1. **The product was never shipped.** The entire u1–u6 implementation (19 modified + 15 untracked files; resolver +184 lines, CatalogApp +457 lines vs HEAD) is **uncommitted working-tree state**. Production (GitHub Pages) builds only from committed `master`. The live site's `release.json` reports `sourceSha: 01a214b` — the pre-u1 commit containing none of the ticket work. `research/release-truth.md:50` already states uncommitted files are excluded from production state even if local tests exercise them.
2. **The "production-verified deployment" (commit `5343aff`) verified the OLD build.** That commit touches documentation only and records run 31926209080 / source `01a214b`. The plan's status line fuses three disjoint facts into one claim: u1–u6 resolved (true, in the working tree), `release:audit` green (true, against the working tree), deployed and byte-verified in production (true, of a commit that predates all of it).
3. **Ticket acceptance was dev-scoped, so "resolved" was literally true while the default experience was unchanged.** u1 scope: "app keeps working on the synthetic package by default"; decision D5: "the synthetic package remains the module-load default"; u3 acceptance: "in a dev build with the u1 package." No ticket required committing, deploying, or making the real catalog the active product catalog.
4. **Test design never exercised the user-visible real path.** Browser tests run `npm run build && npm run preview` — the Vite catalog-release middleware is dev-server-only, so the real path is structurally unreachable in the browser suite (zero `catalog=real` occurrences in either spec). Node tests assert engine internals against the real artifact, bypassing the fetch seam and UI. Two ticket citations are not backed by the file they cite (no "live dev-server Playwright verification" appears in `evidence/u1-real-catalog-release.md`; the "79 M4-matching families" figure appears nowhere in it).

## Live probe evidence (2026-08-16, lead agent)

**Deployed site (`https://jrambackup1-lgtm.github.io/partsource/`, source `01a214b`):**

| Probe | Result |
|---|---|
| Home | "View all 30 configurations →" — 30 synthetic parts |
| `M4 screw` | 0 chooser, **6 mixed rows**, "6 matching configurations" |
| `92655A331` | "Search terms not recognized" |

**Working tree, dev server, default (no params):** synthetic 30-part catalog active; `M4 screw` → chooser with 3 families (u2 works here); `92655A331` → still "Search terms not recognized" (u3's recognition is namespace-relative and the synthetic package declares no McMaster namespace); inspector shows "Diagnostics: identity and mapping evidence" with `mapping synmap-v1-01 · prov.mapping.synthetic.v1` and PSYN-SCR-0001 as the part title.

**Working tree, dev server, `?catalog=real`:** pill swaps to "Dev catalog — cofounder data" after **~34 s**; notice bar still leads with the hardcoded label "**SYNTHETIC DATA**" over the real dataset; a canonical real deep link shows a spurious "Catalog link could not be restored" warning (initial hydration runs against `SYNTHETIC_INDEX` and the real-load effect never clears it); `M4 screw` → chooser with **79 families**, entering a family keeps the M4 constraint; `92655A331` → correct family (108 parts), banner "highlighted below" — **but the highlighted row is on page 2** (108 parts ÷ 50 per page) and page 1 shows no highlight; inspector title is the real PN (`92655A656`) ✓ but Diagnostics prints `mapping map-hex-0262fa00072 · prov.mapping.hex · cofounder-csv:hex-head-screws.csv · Internal revision real-v1-hex-02`.

## Root causes (ranked)

- **RC1 — Recovered product never shipped.** All u1–u6 work uncommitted; deployment pipeline builds from committed master only; evidence chain conflated local-test greenness with production verification. This alone reproduces every symptom on the deployed site.
- **RC2 — Real catalog is gated out of the active product by four stacked gates (three of them deliberate):** gitignored 109.5 MB artifact → Vite dev-server-only middleware → manual `?catalog=real` URL param (no UI affordance) → synthetic module-load default (decision D5). Measured dev load ≈ 34 s (≈24.5 s of it `parseCatalogPackage`, ~800 MB heap). u1 delivered a pipeline, not an active catalog; no ticket covers activation.
- **RC3 — u5 relabelled internal evidence instead of removing it from the main UI.** The inspector's always-visible "Diagnostics" section (mapping IDs, provenance IDs, internal revision IDs, evidence refs), the hardcoded "Synthetic data" notice label (mislabels the real catalog), the digest chip in the main notice bar, and loading/error cards that print `npm run catalog:build-real` to users. The contract places raw identifiers in **optional** diagnostics; these are not optional.
- **RC4 — Exact-match behavior degrades at real scale (working tree).** The exact row can fall on any pagination page; the banner claims "highlighted below" while page 1 shows nothing (no jump-to-highlighted-page; the scroll-into-view only works if the row is mounted). Plus: spurious `urlWarning` on real deep links; chooser state asymmetry (filtering a live chooser down to one family stays `catalog_chooser` at `resolver.ts:340` while the same single-family condition at query time auto-opens).
- **RC5 — No test connects claims to the user-visible default or real path.** Browser suite structurally barred from the real path; no default-path PN test; `M4 screw` (singular, the owner's phrasing) untested anywhere; `catalog=real` round-trip is UI-owned and untested; nothing asserts the deployed artifact contains the ticket work.

## Fix tickets

In `.wayfinder/product-recovery/tickets/` — order below. u1–u6 ticket records stand as written (their acceptance was scoped as recorded); the gaps above are covered by the f-series.

| Order | Ticket | Fixes | Depends on |
|---|---|---|---|
| 1 | [f1](tickets/f1-commit-and-deploy-recovered-product.md) | Commit + deploy the recovered product; reconcile plan/handoff status claims | — |
| 2 | [f2](tickets/f2-real-catalog-active-dev-product.md) | Real catalog becomes the active dev product experience (D5 amendment) | f1 |
| 3 | [f3](tickets/f3-main-ui-de-diagnose.md) | Remove internal/diagnostic content from the main UI; optional provenance | f1 (parallel with f2) |
| 4 | [f4](tickets/f4-exact-match-visibility-real-scale.md) | Exact-match highlight visible at real scale; urlWarning truth | f2 (verify), f1 |
| 5 | [f5](tickets/f5-user-path-test-integrity.md) | Browser/engine coverage of default + real user paths; deploy-truth guard | f1–f4 |

## Boundaries held

- No scope change: Home + Catalog only; core model `query → catalog level → family → filters → result list` and `exact ID → correct family/list → highlight → user selects` unchanged.
- Publication gates unchanged: production keeps the synthetic catalog until mechanical review, field adjudication, and publication approval per `research/data-source-register.md`. f2 activates real data in the dev/local product only (authorized by audit decision D2).
- No implementation done in this audit. Tickets only.
