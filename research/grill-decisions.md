# Finalized Grill Decisions — partsource.io

These are the finalized requirements and configuration options decided during the initial pair-programming grill session.

## 1. Product Scope & Vision
- **Core Vision**: "Octopart for Mechanical Hardware".
- **Wedge / Highlight Feature**: McMaster-Carr part number spec decoding and alternative finder.
- **Initial Category**: Fasteners only (screws, bolts, nuts, washers, pins).

## 2. Supplier & Data Strategy
- **Data Aggregation**: Hybrid Decoder Engine. A static lookup table of ~30-40 common McMaster fasteners is used for instant high-fidelity specs, combined with a fallback regex engine to dynamically "guess-spec" and generate query links for other fastener part numbers.
- **Supplier Grid UI**: Realistic simulated/mocked stock levels and price breaks for aesthetics, coupled with fully active and functional "Buy/Search" deep-links to Zoro, MSC, Fastenal, Misumi, and Bolt Depot.
  - *Pricing Simulation*: Dynamic markup model. Base simulated price on McMaster price, applying realistic discounts (e.g., Zoro -15%, Bolt Depot -30%, MSC -5%).
  - *Stock Simulation*: Randomized but realistic levels (e.g., "In stock: 450", "2-3 days: 2000").
- **Link Generation**: Pure Search Query URLs. Generate search query deep-links (e.g., `zoro.com/search?q=...`) for all parts (both static and guessed) to keep the URL generation logic uniform, robust, and maintainable. No live scrapers or central database initially.



## 3. Architecture & Tech Specs
- **Tech Stack**: Next.js (App Router, SSG export-friendly).
- **Utility Libraries**: Fuse.js (for client-side fuzzy-searching of part numbers) and PapaParse (for CSV import/export parsing).
- **User Authentication**: Client-side storage (LocalStorage/IndexedDB) only. No registration/login required for basic usage or local BOM lists. Auth is deferred for future cloud-sharing or brokerage phases.
- **Styling**: Vanilla CSS. Clean, high-contrast light-mode theme mimicking the high-information-density layouts of McMaster-Carr and Octopart. No external UI component libraries.


## 4. User Experience & Flows
- **Search & Decode Flow**: Single-page utility/widget flow for the prototype. Search, decoding, spec display, and supplier links all happen in-place on the homepage to validate the core loop (decode → specs → links) quickly.
- **BOM View**: A dedicated tab/view on the main screen. Toggling between the "Search/Decoder" view and a full-page "BOM List" table. In the BOM view, users can accumulate parts, edit quantities, see total estimated costs, and upload/export CSV files.
- **Post-Prototype Migration**: Plan to migrate to a fully routable, indexable path structure (e.g. `/parts/[part-number]`) to support programmatic SEO once the prototype loop is validated.


