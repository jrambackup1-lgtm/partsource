# PartSource POC completion discovery

**Date:** 2026-08-09

**Status:** Superseded product framing. Repository, runtime, data-boundary, and release findings remain useful. The narrow funnel recommendation does not define the intended product. Continue from `.wayfinder/poc-ship/poc-ship-map.md`.

## Verdict

PartSource has a credible product core and a good visual base.

It is not a release candidate and is not ready for a public demo.

The shortest route is to finish the existing sourcing-research product. Do not revive the verified-equivalent product. Do not redesign the whole app.

## What the product is now

The intended POC route is:

`search clue -> configuration result -> supplier search handoff -> named browser-local BOM -> export`

The current working tree contains:

- Vite/React/TypeScript frontend.
- A 589-record static standards catalog.
- A Supabase catalog search service for a larger configuration dataset.
- Supplier-site search links. They are not listings or offers.
- Named browser-local BOMs with CSV/PDF/JSON portability.
- Reference pages and static route metadata.
- GitHub Pages deployment and release identity plumbing.

The public site is an older release. Its `release.json` reports `dd0be4f6debc345eef8e64b52cba345a51a975ef`, built on 2026-07-12. It does not contain the current local POC.

## What is already good

- The product contract has the right honest boundary: configurations and supplier search handoffs, not equivalence or commerce.
- The UI looks modern, restrained, and technical. It avoids generic flashy SaaS styling.
- Exact known-identifier lookup works against the locally configured Supabase service.
- Configuration details contain useful engineering fields.
- Supplier handoffs are clearly labelled for independent verification.
- Named BOM creation, persistence, rename, duplicate, delete, quantity changes, and portability are implemented.
- BOM snapshots preserve configuration facts and supplier-search destinations.
- Supabase database access is isolated from anonymous browser access. The Edge Function validates input and bounds results.
- TypeScript typecheck passed on this working tree.
- Focused catalog API, catalog boundary, BOM storage, BOM domain, and prohibited-claim checks passed.
- The public site returned no JavaScript runtime errors in the audited journeys.

## Release blockers

### 1. No reproducible candidate

`master` has a very large mixed staged, unstaged, and untracked checkout. The current implementation cannot be reproduced from `HEAD`.

A dirty local build stamped with the `HEAD` SHA is not a candidate under `research/release-truth.md`.

### 2. Product authority contradicts the execution plan

`research/product-contract.md` prohibits current equivalence claims.

`research/production-readiness-plan.md` and `research/production-readiness-checklist.md` still center a `verified-equivalent` workflow.

The product contract wins. The plan and checklist must be rewritten around configuration research before implementation resumes.

### 3. Deployment architecture is unresolved

The contract says the runtime has no backend or server database.

The current POC depends on a Supabase Edge Function for the larger catalog. The GitHub Pages deploy workflow does not inject the required Vite catalog URL/key.

Local Supabase success does not prove the production artifact can search the catalog.

### 4. The promised generic search does not work against the live development API

Direct checks on 2026-08-09 returned:

- `91290A115`: HTTP 200, one result.
- `screws`: HTTP 200, 25 results.
- `M4 screws`: HTTP 200, zero results.
- `M5 socket head cap screw`: HTTP 200, zero results.

The staged browser test mocks `M4 screws`; it does not prove the deployed frontend/backend path.

The active product contract explicitly promises generic text such as `M4 screws`.

### 5. Provenance and verification state are lost

Supabase returns demo/provenance/verification fields in the planned API shape, but `web/src/lib/catalogApi.ts` drops them when converting a result to a `Part`.

`web/src/pages/PartDetail.tsx` then saves every indexed configuration to a BOM as `verified`.

A reviewed configuration is not a verified equivalent. The current code conflates these states.

### 6. Raw/public data boundary is unsafe

The approved cofounder dataset may supply technical configuration fields. Its confidential origin and raw files must remain private.

The current tree stages raw CSV files and large generated TypeScript catalogs. `data/README.md` also retains stale SKDIN lineage language that conflicts with the active source register.

Do not push this state. Define a public-field allowlist and keep raw snapshots outside the public application repository/history.

### 7. Detail-page first impression is weak

The current local detail page gives nearly the full first screen to a generic schematic and blank space. Specifications, trust copy, supplier handoffs, and Add to BOM are below the fold.

The labels `CAD Schematic Viewer`, `Scale 1:1`, and `Orthographic` overstate a generic illustration. This is a demo credibility risk.

### 8. Search and result UX are incomplete

The live public app routes a broad query to one arbitrary first match. The local POC uses an autocomplete dropdown but has no real guided family/type/size/material/finish selection.

The landing grid is dominated by the first 24 static records and understates catalog breadth.

Unsupported text can still become a product-like generated detail in old paths. Invalid, unsupported, empty, and unavailable states need one consistent fail-closed UX.

### 9. Catalog model and search will become fragile with more data

The current Supabase table treats source rows as canonical configurations and stores external identifiers on the same row.

Search is a wide `ILIKE` scan with no deterministic ranking, no useful indexed text strategy, and no stable ordering.

Before adding another dataset, separate:

- source/import record,
- canonical configuration,
- external identifier/reference.

Use exact indexed identifier lookup separately from ranked configuration search. Do not build marketplace-scale infrastructure.

### 10. Public launch proof is incomplete

The public site is stale. `partsource.io` is not live. Legal/operator/correction pages, production catalog integration, mobile visual verification, accessibility audit, monitoring of the Edge Function, and end-to-end production smoke remain incomplete.

## Agent disagreement and synthesis

### Public deployment vs local completion

The prior Wayfinder map says the local POC is closed because a dirty-tree local audit passed.

The release audit disagrees: that proves local behavior only. It cannot establish a candidate, release, or production verification.

**Decision:** treat the previous closure as a local milestone, not ship completion.

### Static catalog vs Supabase

A pure static catalog is simpler.

The current 27,009-row dataset and future growth make a bounded server search service the better route. Shipping generated catalog source to the browser/repository is the wrong trade.

**Recommendation:** keep GitHub Pages as the static shell and Supabase as the public read-only search service. Update the architecture contract and deployment gate to say this clearly.

### Full canonical data model now vs direct-row POC

A full multi-source catalog platform is unnecessary for the POC.

The current direct-row model cannot safely absorb more data or corrections.

**Recommendation:** add only the minimum three-way separation: import/source record, canonical configuration, external identifier. Add versioned atomic publication and withdrawal. Defer richer supplier/listing/offer models.

### UI redesign vs surgical polish

The product already has a strong visual language.

**Recommendation:** preserve the shell and design tokens. Rework only the core journey: search/results, detail hierarchy, BOM action, mobile shell, empty/error states, and misleading controls/copy.

## Recommended POC scope

### Build now

1. Reconcile product authority around configuration research only.
2. Recover the approved code into a clean, reproducible candidate branch/worktree.
3. Keep GitHub Pages frontend plus Supabase configuration search.
4. Move raw confidential data out of public repository history and define the public field allowlist.
5. Preserve provenance and configuration-review state end to end.
6. Fix exact identifier lookup and ranked generic search such as `M4 screws`.
7. Add a focused result-selection UI with family/type/size/material/finish filters.
8. Make the detail first screen show identity, key specs, trust state, supplier handoff, and Add to BOM. Compact or remove the fake-CAD hero.
9. Keep named local BOMs. Simplify controls and make local/user-entered status obvious.
10. Verify real frontend-to-Supabase behavior, fail-closed states, 320 px reflow, keyboard flow, accessibility, bundle/performance budgets, clean build, and production smoke.
11. Deploy the committed candidate to the canonical GitHub Pages URL and prove its release SHA.

### Defer

- Exact or verified equivalents.
- Approved alternates and replacements.
- Supplier listings, price, stock, lead time, offers, quote submission, and checkout.
- Accounts, cloud BOM sync, teams, approvals, ERP, and punchout.
- Full supplier ingestion platform.
- Bulk SEO and generated indexed SKU pages.
- CAD downloads, calculators, and extra reference tools.
- `partsource.io` custom-domain launch until the GitHub Pages POC is production-verified.
- Analytics unless a controlled public pilot needs it; then use a strict event allowlist with no BOM contents.

## Decisions Jay must approve

1. Product claim: configuration research only; no equivalence workflow.
2. Architecture: GitHub Pages shell plus Supabase search service.
3. Data: public technical-field allowlist; raw confidential data stays outside public repo/history.
4. UX: surgical core-flow polish, not a full redesign.
5. Launch target: production-verified GitHub Pages POC first; custom domain later.
6. Scope: the Build now / Defer split above.

After approval, convert this direction into the authoritative spec, then implementation tickets. Do not use the contradictory production-readiness plan as the build brief.
