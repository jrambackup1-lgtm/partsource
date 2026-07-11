# PartSource Production Refactor Checklist

Created: 2026-07-11

Purpose: handoff checklist for a new session to execute the production-readiness refactor from the engineering review.

## North Star

Ship PartSource as a trusted catalog, search, BOM, export, and quote-lead tool first.

Do not ship fake commerce, fake admin, fake tracking, fake compliance, or unverified live supplier data.

## Source Review Artifacts

- Full visual review: `C:\Users\jayar\AppData\Local\Temp\architecture-review-partsource-20260711-023042.html`
- Key product docs:
  - `research/prd.md`
  - `research/grill-decisions.md`
  - `research/aistudio_checklist.md`
  - `research/business-plan.md`
  - `research/pseo-risk-audit.md`

## Facts From Code

- Frontend is Vite/React, not Next/SSG.
- Production `base` is `/partsource/`.
- Public routes include parts/search/BOM/admin/widget flows.
- BOM, orders, and quote-like state are browser-local only.
- `/admin` is client-side and unauthenticated.
- Live scraper exists as a public Python service.
- Current live scrape can return `403`/estimated data while UI still presents supplier-like results.
- Sitemap generator can produce hundreds of URLs, but tracked sitemap is stale.

## Inferences

- The product has drifted from trusted MVP into a demo-commerce facade.
- Biggest production risk is not missing features; it is false confidence.
- The safest refactor is deletion/de-risking first, then deeper catalog/BOM correctness.
- A rewrite is not justified yet. A simpler modular monolith is enough.

## Assumptions

- MVP goal is still buyer trust and lead generation, not full checkout.
- Compliance claims require SKU/order-level evidence before visible use.
- Live supplier data should be disabled unless source permission, identity validation, and rate limits exist.
- User wants next session to implement incrementally, not re-analyze from scratch.

## Needs Verification

- Business decision: exact MVP promise on homepage and CTAs.
- Domain decision: whether `partsource.io` should be live now or GitHub Pages remains canonical.
- Scraper decision: remove entirely vs keep disabled for internal experiments.
- Backend decision: only after real brokerage/quote workflow demand is validated.

## P0 Checklist: Stop Unsafe Promises

- [x] Remove or hide public `/admin`.
  - Success: no unauthenticated admin UI reachable from production navigation or direct route.

- [x] Remove mock order/tracking behavior from brokerage flow.
  - Success: no random tracking IDs, no simulated order creation, no language implying placed orders.

- [x] Convert checkout/brokerage UI into quote-lead capture or export-only flow.
  - Success: UI says quote/request/export, not order/buy/track.

- [x] Fix order total math if any quote summary remains.
  - Success: one shared calculation path; brokerage/duty/tax values cannot change between UI surfaces.

- [x] Disable live scraper usage in production UI.
  - Success: supplier offers are labeled catalog/estimated only unless verified by approved data source.

- [x] Remove visible compliance/verified claims that are not evidence-backed.
  - Success: no DFARS/ISO/USA/verified badges drive ranking or locking without per-SKU evidence.

- [x] Fix route/domain contradictions.
  - Success: app base, widget links, canonical URLs, and sitemap target one chosen production host.

- [x] Refresh sitemap from the current generator after host decision.
  - Success: sitemap URL count matches generated catalog routes and resolves to canonical host.

## P1 Checklist: Make Trusted MVP Coherent

- [x] Centralize part identity resolution.
  - Success: exact, suggested, decoded, and unknown states are explicit and reused by Home/Header/PartDetail.

- [ ] Tighten fuzzy matching thresholds.
  - Success: unknown or low-confidence query never silently maps to the wrong SKU.

- [ ] Version and validate local persisted BOM data.
  - Success: bad/stale local JSON cannot crash or corrupt BOM totals.

- [ ] Replace index-based BOM/order identity with stable IDs.
  - Success: delete/update/reorder cannot mutate the wrong line item.

- [ ] Move BOM totals into pure shared functions with tests.
  - Success: pricing, quantities, multipliers, and export totals have deterministic unit coverage.

- [ ] Make CSV/PDF/export the primary conversion path.
  - Success: buyer can complete useful work without fake checkout.

- [ ] Add browser tests for launch-critical flows.
  - Success: tests cover search, part page, BOM add/edit/export, and bad-query handling.

- [ ] Make CI run typecheck/lint/build/tests/browser smoke.
  - Success: main branch cannot pass with TypeScript or launch-flow breakage.

## P2 Checklist: Publishing And Operations

- [x] Choose canonical deployment target.
  - Success: GitHub Pages/custom domain/config/docs agree.
  - Decision: GitHub Pages at `https://jrambackup1-lgtm.github.io/partsource/`
    remains canonical. `partsource.io` is deferred until purchased and configured.

- [ ] Generate static metadata per part page where possible.
  - Success: crawlers receive canonical title/description/schema without relying only on client runtime.

- [ ] Add lightweight production monitoring.
  - Success: uptime, build status, and broken route checks are visible.

- [ ] Write runbook.
  - Success: new owner can deploy, regenerate sitemap, verify core flows, and rollback.

- [ ] Reconcile research docs with implementation state.
  - Success: checklist/docs stop claiming browser tests, Next, auth, or live APIs that do not exist.

## Demand-Gated Backend Checklist

Only start this if quote/brokerage demand is validated.

- [ ] Define quote/order state machine.
  - Success: quote requested, supplier contacted, quoted, accepted, ordered, fulfilled, cancelled are distinct.

- [ ] Add auth and role model.
  - Success: admin/customer access is server-enforced.

- [ ] Add persistent database.
  - Success: quote/order/BOM state survives devices and has migration path.

- [ ] Server-own all totals and immutable snapshots.
  - Success: final quote/order totals cannot be altered by client storage.

- [ ] Add idempotency and audit log.
  - Success: duplicate submit cannot create duplicate quote/order; admin actions are traceable.

- [ ] Use sanctioned supplier feeds only.
  - Success: no public arbitrary scraper endpoint powers production buyer promises.

## Recommended Target Architecture

- Keep: React UI, static catalog, exact search, part pages, BOM, export, quote lead capture.
- Deepen: catalog resolver, BOM domain module, publishing/sitemap pipeline, CI.
- Delete/defer: fake checkout, fake orders, fake tracking, fake admin, fake compliance, public scraper.
- Add backend later only for real quote/order operations.

## Suggested First Session Prompt

Start with `research/production-refactor-checklist.md`. Execute P0 only. Do not rewrite architecture. Make surgical changes. Before edits, identify exact files/routes/components for each P0 item. After edits, verify with tests/build and a quick production-flow smoke check.
