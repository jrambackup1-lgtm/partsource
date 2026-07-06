# Business & Build Plan — partsource.io

This document consolidates the business model, brand architecture, and phase rollout strategy for the mechanical hardware sourcing tool, **partsource.io**.

---

## 1. The Three Pillars

### Pillar 1: Sourcing Gateway (Monetization)
The primary monetization mechanism is a brokerage model rather than SaaS subscriptions or affiliate links.
- **Affiliate/Referrals (V1 Hook)**: Collect commissions via open B2B/MRO programs (e.g., Zoro). Useful for initial validation, but structurally capped.
- **BOM Order Brokerage (V2 Scale)**: Engineers upload full Bills of Materials (BOMs). The platform aggregates orders and routes them directly to wholesale manufacturers/distributors, capturing a transaction/brokerage commission (typically 10–20% on bulk hardware orders).

```
Phase 1 (Hook):      Free decoder tool — engineer uses it daily
Phase 2 (Capture):   BOM upload — engineer pastes their full parts list
Phase 3 (Monetize):  Route bulk orders to wholesale factories, capturing brokerage commission
```

### Pillar 2: Regex Engine (Efficiency)
McMaster part numbers are not random; they systematically encode part specifications. 
- **No Heavy Database**: No massive catalog database to host.
- **No Scraping**: Completely client-side JavaScript rules engine using regex maps. Keeps deployment free, fast, and legally clean.

```
McMaster #:  91251A242
             │    │└─ Diameter/Pitch variant
             │    └── Length variant  
             └──────── 9125x = Hex Socket Cap Screw, Alloy Steel, Black Oxide
```

### Pillar 3: Programmatic SEO (Traffic)
Google search queries for hyper-specific part equivalents (e.g., *"McMaster 91251A242 equivalent"*) have low competition but extremely high purchase intent.
- Instantly generate static pages for known/decoded part numbers.
- Rank #1 for long-tail part queries to capture engineers looking to buy immediately.

---

## 2. Brand Architecture & Domain Strategy

To protect the core company brand and maximize growth speed, `partsource.io` operates on a completely separate domain from `afterconcept.com`.

```
partsource.io                          afterconcept.com
─────────────────                  ─────────────────────────────
Free public tool                   Engineering services company
600K pSEO pages                    Real client work, credibility
Attracts engineers                 Converts engineers → clients
Runs independently                 Benefits from PartSource's traffic
```

### Brand Integration Funnel
1. **Footer Attribution**: Every page on `partsource.io` links back to `afterconcept.com` ("Built by Afterconcept Engineering").
2. **BOM Sourcing Lead Generation**: When an engineer compiles a BOM on `partsource.io`, they are offered custom sourcing/consulting services hosted on `afterconcept.com`.
3. **Capability Showcase**: `afterconcept.com/tools` highlights `partsource.io` as a product case study to demonstrate engineering and software capabilities to enterprise clients.

---

## 3. Target Audience

| Segment | Pain Point | Volume | Value |
|---|---|---|---|
| **Tier 1: Prototype Engineers** | Need small-batch alternatives quickly to cut prototype BOM costs | High | High (Funnels to BOM tool) |
| **Tier 1: Procurement Managers** | Force-phasing out McMaster due to enterprise billing/pricing limits | Medium | Highest (Funnels to Brokerage) |
| **Tier 2: Hardware Founders** | Need wholesale pricing for first production runs | Medium | High |
| **Tier 3: Enterprise/Defense** | Require trace audits, AVL compliance, and certified parts | Low | Extremely High (Premium Sourcing) |

---

## 4. Pricing Model

| Tier | Price | Features |
|---|---|---|
| **Free Tier** | $0 | Standard part decoder, search query generation, local BOM storage (up to 5 searches/day) |
| **Pro Tier** | $19–49/mo | Unlimited searches, bulk BOM uploads, SmartCart BOM Optimizer (cheapest/fastest multi-vendor split algorithms), savings reports |
| **Enterprise / Sourcing** | Commission % | 1-Click consolidated ordering, direct wholesale routing, and automated multi-vendor API checkout |

---

## 5. Build Phases

```
┌────────────────────────────────┐
│   Phase 0: Proof of Concept    │  ← (CURRENT PHASE) Setup Next.js flat mockup.
│   - Mock 30-40 fasteners           Verify search-to-query deep link loop.
└───────────────┬────────────────┘
                ▼
┌────────────────────────────────┐
│         Phase 1: MVP           │  ← Build trusted interactive single-page tool.
│   - Local BOM Tab (CSV export)     Publish 10 hand-written articles & earn 20+ backlinks.
└───────────────┬────────────────┘
                ▼
┌────────────────────────────────┐
│      Phase 2: pSEO Launch      │  ← Index first 10,000 fastener pages.
│   - LocalStorage/IndexedDB         Enforce strict content floor criteria.
└───────────────┬────────────────┘
                ▼
┌────────────────────────────────┐
│     Phase 3: Scale & Broker    │  ← Expand to full 600K part catalog.
│   - Integration with wholesalers   Broker production-level BOM orders via
│                                    SmartCart multi-vendor split engine.
└────────────────────────────────┘
```
