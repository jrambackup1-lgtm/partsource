# Pitch Cheat Sheet — partsource.io

## 1. Executive Summary & Pitch Details

* **Core Vision**: "Octopart for Mechanical Hardware." A unified sourcing search engine starting with standard fasteners (screws, bolts, nuts, washers, pins) to find equivalents, bypass McMaster markups, and resolve procurement blocks.
* **The Wedge**: McMaster part number decoder. Instead of hosting a massive, expensive database or scraping, a lightweight client-side regex engine decodes technical specifications directly from part numbers to find matching alternatives instantly.
* **The Pain Point**: McMaster-Carr is highly convenient but marks up parts significantly, has opaque post-purchase shipping fees, does not allow price sorting, and is frequently banned by enterprise finance teams due to billing limits.
* **Domain Strategy**: Host the tool on `partsource.io` as a free pSEO and sourcing tool, linking back to the parent engineering services company `afterconcept.com` for high-end lead generation and credibility.

### Market Opportunity & Sizing (US TAM)
* **Total MRO Product Distribution**: $200B – $250B (Grainger holds ~7% share).
* **Fasteners Addressable Market**: $20B – $26B.
* **Digital Penetration**: 30–50% for commodity MRO. Digital segment grows at 7.5% YoY vs. 3.4% for traditional sales.
* **Under-served Wedge**: VC funding (a16z, Bessemer, Chemistry) targets heavy enterprise/ERP AI procurement (e.g., Didero, Lio). No one is building fast, self-serve sourcing utilities for prototype engineers.

### Monetization & Three Pillars
1. **Pillar 1: Sourcing Gateway / BOM Brokerage**: Start with affiliate commissions (e.g., Zoro at 4.8%, MSC at 2%). Monetize long-term by routing bulk BOM orders to wholesale manufacturers, capturing a 10–20% brokerage/transaction fee.
2. **Pillar 2: Regex Specs Engine**: Pure JS spec generator. Ultra-low server overhead, legally clean (no scraping/IP issues), instantly scalable.
3. **Pillar 3: Programmatic SEO (pSEO)**: Automatically build and index 600K part pages targeting low-competition, high-intent queries (e.g., *"McMaster 91251A242 equivalent"*).

### Comparable Exits & Multiples
* **Xometry (XMTR)**: Public, ~$5.2B cap, ~35% take-rate, ~4-5x revenue multiple.
* **Fictiv**: Acquired by MISUMI in 2025 for $350M (~4.8x revenue).
* **SendCutSend**: Bootstrapped to $100M+ before VC round in May 2026.

---

## 2. Project Status & Roadmap Checklist

### Stage 1–10: Prototype Core (Completed)
- [x] **Core Decoder & Database**: High-fidelity spec lookup for 30-40 fasteners, fallback regex engine.
- [x] **BOM Manager Tab**: Client-side localStorage BOM builder with PapaParse CSV import/export.
- [x] **Next.js & Routing Setup**: App router architecture configured for static export compatibility.
- [x] **Dynamic pSEO Pages**: Dynamic `/parts/[partNumber]` page path and sitemap configuration.
- [x] **Brand Attribution & Modals**: Lead-gen query forms attribution linking to `jayar.co` and `afterconcept.com`.
- [x] **Visual Overhaul**: Teenage Engineering-inspired industrial bento grid design.
- [x] **Analytics & Compliance**: Responsive SVG savings chart and AVL compliance gates (ISO, DFARS).
- [x] **Checkout & Order Flow**: 4-step brokerage checkout simulation and tracking dashboard.
- [x] **Admin Portal**: Broker dashboard for managing shipping overrides and updating statuses.
- [x] **Internationalization**: Multi-currency switcher and custom duty calculator.

### Stage 11–18: Advanced Features (Pending AI Studio)
- [ ] **Sourcing Widget Embed**: Embeddable pricing tool generator for external engineering blogs.
- [ ] **Google Rich Schema**: JSON-LD structured product schema to secure search snippets.
- [ ] **BOM CSV Header Mapping**: Flexible client-side mapping for arbitrary user-uploaded CSV headers.
- [ ] **Interactive 3D CAD**: Parametric SVG/3D rendering of fasteners reacting dynamically to spec changes.
- [ ] **Engineering Calculators**: Torque tightness formulas, clearance hole specs, and tap drill selectors.
- [ ] **Material Datasheets**: PDF-exportable datasheets detailing yield and tensile strengths.
- [ ] **SmartCart BOM Optimizer**: Multi-vendor split-pricing router calculating cheapest shipping path.

---

## 3. SEO Gating & Launch Rules
* Root domain must accumulate **20+ backlinks** via the interactive home tool and articles before indexing.
* **Content Floor Compliance**: Every page must have at least 5 out of 7 elements (Spec Table, Standards mapping, 3+ Deep-Links, Price Grid, Stock Estimate, Internal Links Grid, Application Note) to avoid Google "thin content" penalties.
