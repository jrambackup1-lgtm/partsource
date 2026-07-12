# details

---

## 1. Product Sourcing & Vision (The Three Pillars)

**partsource.io** is a lightweight, high-performance, single-page client-side web utility that helps mechanical engineers inspect candidate fastener configurations, open supplier searches, and accumulate parts into a local Bill of Materials (BOM). Supplier results require independent verification.

### Pillar 1: Sourcing Gateway & Monetization
1. **Affiliate/Referrals (V1 Hook)**: Generate commissions through open MRO/B2B affiliate networks (e.g., Zoro).
2. **BOM Order Brokerage (V2 Scale)**: Engineers upload complete BOMs. The platform aggregates, quotes, and routes orders to wholesale partners/manufacturers, capturing a 10–20% brokerage transaction fee.

```
Phase 1 (Hook):      Free decoder tool — engineer uses it daily
Phase 2 (Capture):   BOM upload — engineer pastes their full parts list
Phase 3 (Monetize):  Route bulk orders to wholesale factories, capturing brokerage commission
```

### Pillar 2: Regex Decoder Engine
No heavy central databases or web scraping. A hybrid client-side rules engine decodes specifications directly in the browser:
- **Static Lookup**: A high-fidelity dataset of 30–40 common fastener part numbers mapped to exact specs.
- **Fallback Regex Guesser**: Rules mapping McMaster part number structures to fastener thread, pitch, length, material, and type.

### Pillar 3: Programmatic SEO (pSEO)
Targeting low-competition, high-intent queries (e.g., *"McMaster 91251A242 equivalent"*):
- Free public tool on a separate domain (`partsource.io`) to shield the main services brand (`afterconcept.com`).
- **Brand Integration Funnel**:
  - Footer link back to `afterconcept.com` ("Built by Afterconcept Engineering").
  - Sourcing lead generation: Offer custom consulting/sourcing for complex/bulk BOMs via `afterconcept.com`.
  - Case study showcase at `afterconcept.com/tools`.

---

## 2. Scope of MVP (Fasteners Only)

### In-Scope
- **Fastener Categories**: Screws, bolts, nuts, washers, pins.
- **Tabs**: Double-tab structure: **Part Finder** and **BOM Manager**.
- **Fuzzy Matching**: Fuse.js client-side matching against the static fastener catalog.
- **Supplier Searches**: Specification-led search handoffs to Zoro, MSC, Fastenal, Misumi, and Bolt Depot, with identity, price, availability, and specifications verified on the supplier site.
- **Deep Search Links**: Clean search query redirect links (uniform query generation).
- **Persistent Storage**: Client-side storage (LocalStorage/IndexedDB) to persist the active BOM without user accounts.
- **CSV Handling**: PapaParse integration for importing McMaster lists and exporting BOMs.
- **Design**: Industrial high-density, light-mode layout mimicking McMaster-Carr and Octopart (Vanilla CSS).

### Out-of-Scope (Post-MVP)
- Live distributor catalog scraping/APIs.
- Non-fastener categories (bearings, pneumatics, raw stock).
- User authentication, profiles, or server-side databases.
- Multi-currency support (USD only).

---

## 3. Detailed Feature Requirements

### 3.1 Search & Hybrid Decoder Engine
- **Fuzzy Search Input**: Multi-match support utilizing Fuse.js against static catalog.
- **Static Lookup Table**: Pre-defined 30–40 common McMaster parts with verified properties.
- **Fallback Parser**: Standard regex patterns to parse part attributes if not in lookup:
  - **Material**: Alloy Steel, Stainless Steel (18-8, 316), Brass.
  - **Head/Drive**: Socket Head Cap, Hex Head, Flat Head, Pan Head; Hex, Torx, Phillips, Slotted.
  - **Thread & Pitch**: Metric (e.g., M3x0.5, M4x0.7) and Imperial (e.g., 1/4"-20, 10-24).
  - **Length**: e.g., 12mm, 1/2", 1".
- **Decoded Spec Grid Display**:
  - Thread Size & Pitch
  - Length
  - Material & Grade
  - Finish (e.g., Black-Oxide, Zinc-Plated, Plain)
  - Head Style & Drive Type

### 3.2 Supplier Search UI
Search handoffs containing:
- **Suppliers**: Zoro, MSC Industrial, Fastenal, Misumi, Bolt Depot.
- **Commercial Data Boundary**: No invented pricing, inventory, availability, lead time, approval, or match status.
- **Deep Search Query Links**:
  - **Zoro**: `https://www.zoro.com/search?q=[URL_ENCODED_QUERY]`
  - **MSC**: `https://www.mscdirect.com/browse/tn?searchterm=[URL_ENCODED_QUERY]`
  - **Fastenal**: `https://www.fastenal.com/products/search?term=[URL_ENCODED_QUERY]`
  - **Misumi**: `https://us.misumi-ec.com/vona2/result/?Keyword=[URL_ENCODED_QUERY]`
  - **Bolt Depot**: `https://www.boltdepot.com/Product-Search.aspx?txt=[URL_ENCODED_QUERY]`

### 3.3 Dedicated BOM Tab/View
- **BOM Accumulator**: Add parsed/decoded part to BOM with custom quantities.
- **Editable Table**: Real-time quantity adjustment, item deletion, unit cost, and sum totals.
- **CSV Export**: Clean download of BOM attributes via PapaParse.
- **CSV Import**: Upload McMaster part lists to instantly parse, fetch specs, and bulk-load into the BOM grid.

---

## 4. Programmatic SEO (pSEO) & Quality Control

To prevent Google HCU penalties, all programmatic part pages must meet a strict quality and checklist gate before indexing.

### 4.1 Page Content Floor (5 of 7 Rule)
Every part page must render at least **5 out of these 7 components**:
1. **Decoded Spec Table**: Mechanical properties.
2. **Standards Reference**: DIN, ISO, ANSI, or ASME standard alignments (e.g., "DIN 912 equivalent").
3. **Active Search Deep-Links**: Dynamic search query URLs to at least 3 major distributors.
4. **Supplier Searches**: Search handoffs labeled as candidates, not offers or listings.
5. **Verification Warning**: Verify identity, price, availability, and specifications on the supplier site.
6. **Internal Links Grid**: Links to similar sizes/threads (e.g., M4x10, M4x12, M4x16).
7. **Application Note**: A contextual description of typical engineering use cases for that fastener category.

### 4.2 Indexing Checklist Gate
No page is listed in `sitemap.xml` or indexable unless:
- Root domain has accumulated **20+ organic backlinks**.
- The regex engine successfully decodes the part (no "unknown" attributes).
- At least 3 distributor query URLs are generated.
- Title tags are comparative (e.g., "M4 Socket Cap Screw Equivalents & Sourcing") to avoid trademark infringement.

---

## 5. Technical & Design Specifications

- **Framework**: Next.js (App Router, SSG export-friendly).
- **Styling**: Vanilla CSS. High-density, high-contrast light-mode utility layout (light gray backgrounds, thin borders, monospace data tables).
- **Libraries**:
  - `fuse.js` (fuzzy search).
  - `papaparse` (CSV handling).
- **State & Storage**: Client-side (LocalStorage/IndexedDB) only. No database or Auth.

---

## 6. Factual Constraints & Guardrails

To maintain project integrity, verify implementation details against these verified corrections:
1. **McMaster-Carr Independent**: McMaster is private, family-owned, and **NOT owned by Hillman Solutions** (HLMN).
2. **Octopart Ownership**: Octopart was acquired by **Altium Limited in August 2015** (not Nexar in 2021). Altium was subsequently acquired by Renesas Electronics in August 2024.
3. **OSH Cut Independence**: OSH Cut is fully independent and was **NOT acquired by Protolabs**.
