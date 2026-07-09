# PartSource — Ship Checklist & Log

Living checklist for partsource.io. Supersedes the old AI Studio export checklist
(that era is done — the app is exported, rebuilt on Vite/React, and live).

**Live site:** https://jrambackup1-lgtm.github.io/partsource/
**Scraper:** https://partsource-scraper.onrender.com (Render free tier, auto-deploys on push)

---

## 1. Shipped ✅

### 2026-07-09 — Made it functional & deployed
- [x] Fixed router basename vs `/partsource/` base path (blank-page bug, dev + prod)
- [x] SPA `404.html` fallback so deep links work on GitHub Pages
- [x] CI: decoder tests + build + deploy on every push; `workflow_dispatch` for manual rebuilds
- [x] Zoro pricing scraper deployed to Render; `VITE_SCRAPER_URL` baked into the Pages build
- [x] End-to-end verified: live Zoro badge works from residential IPs; honest estimated fallback in prod

### 2026-07-10 — Real catalog & honesty pass (audit-doc pivot)
- [x] 585-part catalog: 60 hand-verified McMaster crosses + ~525 generated from public
      DIN/ISO standards (DIN 912/7991/933, ISO 7380, DIN 934/985, DIN 125A/127B; M2–M12; steel + A2)
- [x] Own part numbers are primary identity (e.g. `DIN912-M4X12-A2`); McMaster PN is a reference field only
- [x] Unknown part numbers: honest "Not Indexed" state — no fabricated specs/prices/stock,
      raw-PN supplier search links, request-indexing mailto CTA
- [x] Removed all fake stock counts; estimated rows say "Check site"; McMaster row only on verified crosses
- [x] Exact-match catalog lookup (unknown numbers can no longer fuzzy-match a wrong part)
- [x] Images fixed: per-category CAD schematic + SVG glyphs; Photo toggle & stock photos removed
- [x] "Not affiliated with McMaster-Carr" disclaimer in footer; unindexed pages noindexed, no JSON-LD offers
- [x] Scraper accepts spec-derived `q` query for generated parts
- [x] 17 decoder tests + 19-check Playwright smoke, green locally and on production
- [x] Data sourcing locked: NO McMaster/skdin/Source-Search/distributor bulk scraping
      (see `research/data-sourcing-decision.md` + audit-doc guardrails); Fastener Superstore
      audited — no JSON-LD/affiliate/API → not viable

---

## 2. Remaining — Launch Blockers

- [ ] **Buy partsource.io** → GitHub Pages custom domain + CNAME → flip vite build `base` to `/`
      (sitemap + embed snippets already resolve correctly once on the domain)
- [ ] **Decide on prod live pricing**: Zoro 403s Render's datacenter IP, so prod shows estimates.
      Options: (a) accept estimates for launch, (b) paid residential proxy (~$1–5/GB),
      (c) home-PC scraper + Cloudflare tunnel. Recommendation: (a) for launch.

## 3. Remaining — V1 Plan (per `mcmaster-tool-audit-and-v1-plan`)

- [ ] Grow verified McMaster cross-references toward top 500–1,000 SKUs (manual curation,
      validate against parts you own; crowdsource submissions later)
- [ ] "Quote my BOM" lead form wired to email/Slack webhook (early brokerage validation —
      the strongest revenue path per the audit doc)
- [ ] 10–20 deep reference pages (DIN 934 size chart, socket-cap torque specs by size,
      material selection notes) — real evergreen content, not page-per-SKU
- [ ] Email eProcurement@mcmaster.com about the cross-reference API use case (expect "no", closes ambiguity)
- [ ] Ask Zoro/Fastenal/Grainger partnerships about affiliate/data-feed programs
- [ ] Outreach in Eng-Tips / r/engineering threads where the demand quotes came from
- [ ] Indexing gate before any SEO push: on partsource.io + ≥20 organic backlinks +
      content floor per `research/pseo-risk-audit.md` (NO bulk page-per-SKU indexing)

## 4. Backlog / Polish

- [ ] Imperial (ASME B18.3 / B18.2.1) generated catalog coverage (#4-40 … 1/2"-13)
- [ ] Verify legacy prototype features still unproven: currency propagation everywhere,
      admin ↔ customer order sync, compliance toggles ↔ SVG chart sync, BOM optimizer
      split modes ($9.99/warehouse consolidation math)
- [ ] Decide fate of prototype-era leftovers not in the Vite app: CAD/STEP download, torque calculator
- [ ] Regenerate sitemap for partsource.io after domain purchase (respect indexing gate)
- [ ] Order data still localStorage-only (no DB/auth) — fine for MVP, revisit with brokerage

---

## 5. Log

| Date | What happened |
|---|---|
| 2026-07-07 | Base-path commit broke routing; site deployed but rendered blank |
| 2026-07-09 | Routing fixed, local + Pages verified, scraper live on Render, `VITE_SCRAPER_URL` wired; Zoro 403s Render IP → honest estimated fallback in prod |
| 2026-07-10 | Audit-doc pivot: 585-part standards catalog, honest unindexed UX, fake stock/photos removed, disclaimer added, Fastener Superstore ruled out, 19/19 prod checks |
