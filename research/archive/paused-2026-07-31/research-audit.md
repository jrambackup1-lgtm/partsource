# Research Audit & Gap Analysis — partsource.io

**Date:** 2026-07-11
**Purpose:** Comprehensive inventory of all existing research, identification of gaps, and a cleanup/consolidation plan for the pre-rebuild phase.

> Implementation correction (2026-07-11): the shipped app is Vite/React on GitHub Pages, includes Playwright launch-flow tests, has no auth or public admin, and does not use the legacy scraper in production. Older rows below are retained as research-history observations.

---

## 1. Existing Research Inventory (10 Files)

| # | File | Size | Status | Summary | Quality |
|---|------|------|--------|---------|---------|
| 1 | `research/prd.md` | 156 lines | ✅ Active | Product Requirements Document: problem statement, user stories, implementation decisions, testing framework, pSEO constraints, out-of-scope items. | ⭐⭐⭐⭐⭐ — Complete and well-structured |
| 2 | `research/grill-decisions.md` | 31 lines | ✅ Active | Finalized decisions from pair-programming grill: scope, supplier strategy, tech stack, UX flows. | ⭐⭐⭐⭐ — Concise but thin; overlaps heavily with PRD |
| 3 | `research/business-plan.md` | 103 lines | ✅ Active | Three pillars, brand architecture, target audience, pricing tiers, build phases (0–3). | ⭐⭐⭐⭐⭐ — Solid strategic foundation |
| 4 | `research/market-research.md` | 54 lines | ✅ Active | TAM/SAM/SOM sizing, industrial e-com penetration, comparables (Xometry, Fictiv, SendCutSend), VC landscape. | ⭐⭐⭐⭐ — Good data but light on SOM bottom-up |
| 5 | `research/customer-and-vendor-insights.md` | 66 lines | ✅ Active | Verbatim customer pain quotes, affiliate program matrix, factual corrections (McMaster ownership, Octopart, OSH Cut). | ⭐⭐⭐⭐⭐ — Strong evidence, well-cited |
| 6 | `research/pseo-risk-audit.md` | 71 lines | ✅ Active | Google HCU risk rubric, content floor (5 of 7 rule), phased rollout strategy, indexing checklist gate. | ⭐⭐⭐⭐⭐ — Actionable and specific |
| 7 | `research/aistudio_checklist.md` | 94 lines | ✅ Active | Living ship log: shipped features, launch blockers, V1 plan, backlog. **Supersedes older AI Studio exports.** | ⭐⭐⭐⭐⭐ — Essential living document |
| 8 | `research/data-sourcing-decision.md` | 105 lines | ✅ Active | Legal/technical investigation into real data sources. Dead-ends evaluated. Chosen path: Zoro JSON-LD + public standards + regex. | ⭐⭐⭐⭐⭐ — Excellent rigor, well-referenced |
| 9 | `research/scrapling-setup-plan.md` | 96 lines | ⚠️ Stale / Deferred | Plan for local Scrapling-based McMaster scraper on residential IP. | ⭐⭐⭐ — Superseded by `data-sourcing-decision.md` (McMaster scraping ruled out). Keep as reference but mark deprecated. |
| 10 | `research/details.md` | 135 lines | ⚠️ Overlaps | Expanded feature requirements, pSEO rules, technical specs, factual guardrails. | ⭐⭐⭐ — 80% overlaps with `prd.md` and `grill-decisions.md`. Consider merging into PRD or archiving. |

### Archive Files (Referenced in `AGENTS.md` but do not exist on disk)

| File | Status | Note |
|------|--------|------|
| `research/archive/prd-aistudio.md` through `prd-aistudio8.md` | ❌ Missing | Google AI Studio prompt templates (Phases 1–18). These were exported checklists. Should either be recovered or formally declared obsolete. |
| `research/aistudio_checklist.md` explicitly states: *"that era is done — the app is exported, rebuilt on Vite/React, and live."* | | |

---

## 2. Research Coverage Map — All Aspects

A complete research foundation for a hardware-sourcing product requires coverage across **12 domains**. Below is a checklist of each domain, its sub-topics, and whether we have research for it.

### 2.1 Product & UX Research
| Sub-Topic | Status | File | Gap |
|-----------|--------|------|-----|
| Problem statement & user personas | ✅ Covered | `prd.md` | — |
| User stories (functional) | ✅ Covered | `prd.md` | — |
| User journey / flow maps | ⚠️ Partial | `grill-decisions.md` | No visual journey map; no onboarding flow research |
| UX benchmark / competitive UI audit | ❌ Missing | — | No teardown of McMaster, Octopart, Zoro, Misumi UI patterns |
| Accessibility (a11y) requirements | ❌ Missing | — | No WCAG or keyboard-nav research |
| Mobile/responsive usage patterns | ❌ Missing | — | Do engineers use this on mobile? |
| JTBD (Jobs-to-be-Done) interviews | ❌ Missing | — | No primary research; only Reddit quotes (secondary) |
| Persona deep-dives (procurement vs. engineer) | ⚠️ Partial | `business-plan.md` | 4 tiers listed but no detailed profiles |

### 2.2 Technical Architecture Research
| Sub-Topic | Status | File | Gap |
|-----------|--------|------|-----|
| Tech stack decision (Next.js → Vite pivot) | ✅ Covered | `prd.md`, `grill-decisions.md` | Vite pivot not documented in research; only in ship log |
| Client-side storage strategy | ✅ Covered | `prd.md` | — |
| Search engine (Fuse.js) | ✅ Covered | `prd.md` | — |
| CSV parsing (PapaParse) | ✅ Covered | `prd.md` | — |
| Static catalog data structure | ⚠️ Partial | `data-sourcing-decision.md` | No schema design doc; catalog lives in code only |
| API design (scraper → frontend) | ✅ Covered | `scrapling-setup-plan.md`, `aistudio_checklist.md` | — |
| Build & deployment pipeline | ⚠️ Partial | `aistudio_checklist.md` | CI/CD details in GitHub Actions, not in research docs |
| Performance budgets (bundle size, TTI) | ❌ Missing | — | No target metrics |
| Testing strategy | ✅ Covered | `prd.md` | — |
| Security model (CORS, CSP) | ❌ Missing | — | No threat model or security research |
| i18n / localization architecture | ❌ Missing | — | `prd-aistudio5.md` (Stage 9 & 10) referenced localization; no standalone research |

### 2.3 Data & Sourcing Research
| Sub-Topic | Status | File | Gap |
|-----------|--------|------|-----|
| McMaster part-number decoding rules | ✅ Covered | `prd.md`, `data-sourcing-decision.md` | — |
| Regex engine spec (fallback parser) | ✅ Covered | `prd.md`, `details.md` | — |
| Live data sources (legal audit) | ✅ Covered | `data-sourcing-decision.md` | ⭐ Excellent |
| Affiliate program matrix | ✅ Covered | `customer-and-vendor-insights.md` | — |
| Distributor API availability | ⚠️ Partial | `customer-and-vendor-insights.md` | Only Zoro/MSC/Global Industrial listed; no Misumi, Fastenal, Bolt Depot API research |
| ISO/DIN/ASME standards mapping | ⚠️ Partial | `prd.md` | Mentioned but no standards research doc (no DIN 912 vs ISO 4762 equivalence table, etc.) |
| Image / CAD data sourcing | ❌ Missing | — | No research on where CAD schematics, photos, 3D models come from |
| Catalog scaling strategy (30 → 600K) | ⚠️ Partial | `business-plan.md`, `pseo-risk-audit.md` | No technical plan for how 600K pages are generated |

### 2.4 Market Research
| Sub-Topic | Status | File | Gap |
|-----------|--------|------|-----|
| TAM (Total Addressable Market) | ✅ Covered | `market-research.md` | — |
| SAM (Serviceable Addressable) | ⚠️ Partial | `market-research.md` | Fasteners $20–26B; no narrowing to online/fastener-specific |
| SOM (Serviceable Obtainable) | ❌ Missing | — | No bottom-up calculation (engineers × searches × conversion × commission) |
| Market growth trends | ✅ Covered | `market-research.md` | — |
| Digitization gradient | ✅ Covered | `market-research.md` | — |
| Comparable company analysis | ✅ Covered | `market-research.md` | — |
| Exit strategy / M&A landscape | ⚠️ Partial | `market-research.md` | Fictiv exit noted; no broader M&A thesis |
| Geographic market breakdown | ❌ Missing | — | US-only? EU? Asia? |
| Customer segmentation (size/industry) | ⚠️ Partial | `business-plan.md` | 4 tiers but no quantified sizing |

### 2.5 Competitive Intelligence
| Sub-Topic | Status | File | Gap |
|-----------|--------|------|-----|
| Direct competitors (part-number tools) | ⚠️ Partial | `customer-and-vendor-insights.md` | Reddit thread says no tool exists; no formal competitor list |
| Adjacent competitors (MRO platforms) | ❌ Missing | — | No Grainger, MSC, Amazon Business, Kimball Midwest analysis |
| Competitive moat analysis | ⚠️ Partial | `business-plan.md` | "Regex engine + pSEO" mentioned; no deep moat doc |
| Feature parity matrix | ❌ Missing | — | No side-by-side feature comparison vs. competitors |
| Pricing comparison (competitor pricing) | ❌ Missing | — | No research on what competitors charge for similar tools |
| Octopart deep-dive | ❌ Missing | — | Only ownership history; no product analysis |
| ThomasNet / Kinaxis / others | ❌ Missing | — | No coverage of legacy/industrial platforms |

### 2.6 Business Model & Monetization Research
| Sub-Topic | Status | File | Gap |
|-----------|--------|------|-----|
| Three-pillar model | ✅ Covered | `business-plan.md` | — |
| Brokerage commission model | ✅ Covered | `business-plan.md` | — |
| Affiliate economics | ✅ Covered | `customer-and-vendor-insights.md` | — |
| SaaS pricing tiers | ✅ Covered | `business-plan.md` | — |
| Unit economics (CAC, LTV) | ❌ Missing | — | No cost-to-acquire an engineer; no lifetime value model |
| Churn / retention benchmarks | ❌ Missing | — | No research on tool stickiness for engineers |
| Freemium conversion benchmarks | ❌ Missing | — | No data on 5-searches/day → Pro conversion expectations |
| Payment processing (Stripe, etc.) | ❌ Missing | — | No research on B2B payment flows |
| Tax / sales tax (industrial MRO) | ❌ Missing | — | No research on tax-exempt purchasing for manufacturers |

### 2.7 Go-to-Market (GTM) & Growth Research
| Sub-Topic | Status | File | Gap |
|-----------|--------|------|-----|
| Programmatic SEO strategy | ✅ Covered | `pseo-risk-audit.md`, `prd.md` | — |
| Content marketing / blog strategy | ⚠️ Partial | `pseo-risk-audit.md` | "10 hand-written articles" mentioned; no topic list or calendar |
| Backlink acquisition plan | ⚠️ Partial | `pseo-risk-audit.md` | "20+ backlinks" target; no specific outreach list or tactics |
| Engineering community mapping | ❌ Missing | — | No list of r/engineering, Eng-Tips, HN, Discord, Slack communities |
| Reddit / forum marketing playbook | ❌ Missing | — | No research on how to post without violating subreddit rules |
| Paid advertising (Google Ads, LinkedIn) | ❌ Missing | — | No keyword CPC research, no audience targeting research |
| Email marketing / newsletter | ❌ Missing | — | No lead-nurture sequence research |
| Partnership / integration GTM | ❌ Missing | — | No research on CAD plugin integrations (SolidWorks, Onshape, Fusion) |
| Referral / viral loops | ❌ Missing | — | No research on how engineers share tools |

### 2.8 SEO & Content Research
| Sub-Topic | Status | File | Gap |
|-----------|--------|------|-----|
| Google HCU compliance | ✅ Covered | `pseo-risk-audit.md` | — |
| Content floor (5 of 7) | ✅ Covered | `pseo-risk-audit.md`, `prd.md` | — |
| Index gating strategy | ✅ Covered | `pseo-risk-audit.md` | — |
| Sitemap / crawl budget | ⚠️ Partial | `pseo-risk-audit.md` | Phased rollout mentioned; no technical sitemap generation spec |
| Keyword research (long-tail part queries) | ❌ Missing | — | No keyword volume data for "McMaster 91251A242 equivalent" etc. |
| Search intent mapping | ⚠️ Partial | `pseo-risk-audit.md` | High-level; no keyword → page type mapping |
| Schema.org / structured data | ❌ Missing | — | No JSON-LD spec for product pages |
| Rich snippets / Google Shopping | ❌ Missing | — | No research on eligibility |
| Domain authority building | ⚠️ Partial | `pseo-risk-audit.md` | 20-backlink target; no DA score target or timeline |
| International SEO (if localized) | ❌ Missing | — | No hreflang or country-specific strategy |

### 2.9 Legal & Compliance Research
| Sub-Topic | Status | File | Gap |
|-----------|--------|------|-----|
| McMaster ToS / scraping legality | ✅ Covered | `data-sourcing-decision.md` | ⭐ Excellent |
| Trademark risk (using "McMaster" in titles) | ✅ Covered | `pseo-risk-audit.md`, `prd.md` | — |
| Affiliate disclosure (FTC) | ⚠️ Partial | `customer-and-vendor-insights.md` | Affiliate programs listed; no disclosure language researched |
| Data privacy (GDPR / CCPA) | ❌ Missing | — | No privacy policy research; localStorage usage may trigger consent requirements |
| Terms of Service for partsource.io | ❌ Missing | — | No ToS template or liability research |
| Liability (sourcing recommendations) | ❌ Missing | — | No research on liability if a recommended part fails |
| LLC / corporate structure | ❌ Missing | — | No research on whether to operate under Afterconcept LLC or separate entity |
| Patent / IP freedom-to-operate | ❌ Missing | — | No FTO search |

### 2.10 Financial & Funding Research
| Sub-Topic | Status | File | Gap |
|-----------|--------|------|-----|
| VC landscape | ✅ Covered | `market-research.md` | — |
| Comparable valuations | ✅ Covered | `market-research.md` | — |
| Bootstrap vs. VC path | ⚠️ Partial | `business-plan.md` | Phase plan implies bootstrap; no explicit funding decision doc |
| Revenue model projections | ❌ Missing | — | No 3-year P&L projection |
| Burn rate / runway planning | ❌ Missing | — | No monthly cost estimate (hosting, domains, tools, time) |
| Pricing sensitivity research | ❌ Missing | — | No survey or interview data on what engineers will pay |
| Grant / SBIR opportunities | ❌ Missing | — | No research on non-dilutive funding for manufacturing tools |

### 2.11 Customer & User Research
| Sub-Topic | Status | File | Gap |
|-----------|--------|------|-----|
| Secondary pain-point research (Reddit, HN) | ✅ Covered | `customer-and-vendor-insights.md` | ⭐ Excellent verbatim quotes |
| Primary interviews (1-on-1) | ❌ Missing | — | No interview transcripts or synthesis |
| Survey data | ❌ Missing | — | No quantitative validation |
| Usage analytics / heatmaps | ❌ Missing | — | No post-launch analytics plan (Plausible, PostHog, etc.) |
| NPS / satisfaction tracking | ❌ Missing | — | No feedback loop design |
| Customer support channel research | ❌ Missing | — | No research on how engineers prefer to get help |

### 2.12 Vendor & Partnership Research
| Sub-Topic | Status | File | Gap |
|-----------|--------|------|-----|
| Affiliate program details | ✅ Covered | `customer-and-vendor-insights.md` | — |
| Distributor partnership outreach | ⚠️ Partial | `aistudio_checklist.md` | "Ask Zoro/Fastenal/Grainger" is a task, not research |
| Wholesale / manufacturer network | ❌ Missing | — | No research on who the actual fastener manufacturers are |
| API partnership tiers | ❌ Missing | — | No research on what data partners require (volume commitments, rev share) |
| Dropship / fulfillment partners | ❌ Missing | — | No research on fulfillment for brokerage model |
| CAD library partners (3D models) | ❌ Missing | — | No research on TraceParts, GrabCAD, or supplier CAD programs |

---

## 3. Gap Summary: 12 Critical Missing Research Areas

### 🔴 Must-Have (Blocks Rebuild or Launch)

| # | Gap | Why It Matters | Priority |
|---|-----|---------------|----------|
| 1 | **Bottom-up SOM calculation** | Needed for any investor pitch, pricing justification, and feature prioritization. | P0 |
| 2 | **Competitive feature parity matrix** | Must know what competitors offer to define differentiation for the rebuild. | P0 |
| 3 | **Keyword research (long-tail volume)** | pSEO is the core growth engine. Need validated search volume for part-number queries. | P0 |
| 4 | **Unit economics (CAC, LTV, conversion)** | Needed to know if the business model works. $19/mo Pro tier is a guess without data. | P0 |
| 5 | **JSON-LD / Schema.org spec for pages** | Technical requirement for rich snippets and Google Shopping eligibility. | P1 |
| 6 | **Privacy policy / GDPR / CCPA compliance** | LocalStorage + analytics + affiliate links = legal exposure. | P1 |
| 7 | **Engineering community map + outreach playbook** | Need specific subreddits, forums, Discords, and how to post without getting banned. | P1 |
| 8 | **Liability / ToS research** | Recommending parts that fail in production creates liability. Need limitation language. | P1 |
| 9 | **Revenue model projections (3-year)** | Even for bootstrapping, need to know if this pays for itself. | P2 |
| 10 | **Post-launch analytics plan** | Need to measure what's working. No research on Plausible vs PostHog vs GA4. | P2 |
| 11 | **Mobile usage patterns** | Engineers may use tablets on the shop floor. Need responsive usage data. | P2 |
| 12 | **Wholesale manufacturer network** | Brokerage model (Phase 3) is dead in the water without actual manufacturers to broker to. | P2 |

---

## 4. Cleanup & Consolidation Plan

### 4.1 Files to Merge / Consolidate

| Action | Files | Reason | Into What |
|--------|-------|--------|-----------|
| **Merge** | `grill-decisions.md` + `details.md` | Both are expanded versions of PRD content. Heavy overlap. | Merge into `prd.md` as appendices or fold into sections |
| **Deprecate** | `scrapling-setup-plan.md` | McMaster scraping ruled out by `data-sourcing-decision.md`. Plan is dead. | Move to `research/archive/deprecated-scrapling-plan.md` |

### 4.2 Files to Keep As-Is

| File | Reason |
|------|--------|
| `prd.md` | Core document. Well-structured. Keep as master spec. |
| `business-plan.md` | Strategic foundation. Keep. |
| `market-research.md` | TAM/comparables/VC data. Keep. |
| `customer-and-vendor-insights.md` | Voice-of-customer and affiliate matrix. Keep. |
| `pseo-risk-audit.md` | SEO compliance and rollout strategy. Keep. |
| `data-sourcing-decision.md` | Legal/technical audit trail. Keep. |
| `aistudio_checklist.md` | Living ship log. Keep. |

### 4.3 Files to Create (New Research)

| New File | Contents | Priority |
|----------|----------|----------|
| `research/keyword-research.md` | Long-tail keyword volumes, competition scores, SERP analysis for fastener queries. | P0 |
| `research/competitive-matrix.md` | Side-by-side feature comparison: PartSource vs. direct & adjacent competitors. | P0 |
| `research/unit-economics.md` | Bottom-up SOM, CAC, LTV, conversion funnel math, pricing sensitivity. | P0 |
| `research/seo-schema-spec.md` | JSON-LD Product schema, breadcrumb, FAQ schema, technical structured data spec. | P1 |
| `research/legal-compliance.md` | Privacy policy, ToS, liability disclaimer, affiliate disclosure, GDPR/CCPA. | P1 |
| `research/gtm-playbook.md` | Community map, outreach templates, content calendar, backlink tactics. | P1 |
| `research/financial-projections.md` | 3-year P&L, burn rate, bootstrap vs. VC decision framework. | P2 |
| `research/wholesale-network.md` | Fastener manufacturers, distributors, dropship partners for Phase 3 brokerage. | P2 |
| `research/ux-benchmark.md` | UI teardowns of McMaster, Octopart, Zoro, Misumi. Design patterns inventory. | P2 |
| `research/analytics-plan.md` | Tool selection, event tracking spec, conversion funnel definition. | P2 |

### 4.4 Archive Files to Recover or Declare Obsolete

| File | Action | Note |
|------|--------|------|
| `research/archive/prd-aistudio.md` through `prd-aistudio8.md` | **Declare obsolete** | The `aistudio_checklist.md` explicitly states the AI Studio era is over. These are historical artifacts. No need to recover unless you want them for nostalgia. |
| `research/archive/` | **Create** | Use for deprecated/stale documents. |

---

## 5. Recommended Execution Order

### Phase A: Consolidation (This Week)
1. Merge `grill-decisions.md` and `details.md` into `prd.md`.
2. Move `scrapling-setup-plan.md` to `research/archive/deprecated/`.
3. Update `AGENTS.md` to reflect the cleaned-up file list.

### Phase B: Critical Research (Pre-Rebuild)
4. **Keyword Research** — Use Google Keyword Planner, Ahrefs, or SEMrush to validate long-tail fastener query volumes. This determines whether 600K pages is even worth building.
5. **Competitive Matrix** — Teardown 3–5 direct competitors and adjacent platforms. Define the "only we do this" feature list for the rebuild.
6. **Unit Economics** — Build a bottom-up model. If the numbers don't work, the product scope changes.

### Phase C: Supporting Research (Pre-Launch)
7. **SEO Schema Spec** — Write the JSON-LD templates before any page is built.
8. **Legal Compliance** — Draft privacy policy, ToS, and affiliate disclosure before launch.
9. **GTM Playbook** — Build the community outreach list and content calendar.

### Phase D: Growth Research (Post-MVP)
10. **Financial Projections** — Model out brokerage commission economics.
11. **Wholesale Network** — Start conversations with fastener manufacturers.
12. **Analytics Plan** — Instrument the app before any marketing spend.

---

## 6. Quick Stats

| Metric | Value |
|--------|-------|
| Total research files | 10 (active) |
| Archive files referenced | 9 (all missing/obsolete) |
| Research domains covered (of 12) | 7 (58%) |
| Research domains fully covered | 3 (Product, Data/Sourcing, pSEO) |
| Research domains with critical gaps | 4 (GTM, Financial, Competitive, Legal) |
| Missing files to create | 10 |
| Files to merge/deprecate | 3 |
| Estimated research hours remaining | 20–30 hours |
