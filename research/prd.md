# Product Requirements Document (MVP Prototype) — partsource.io

This document outlines the product requirements, user stories, implementation decisions, and testing framework for **partsource.io**, a lightweight client-side mechanical hardware sourcing gateway.

---

## Problem Statement

Mechanical engineers face significant friction when sourcing fasteners and hardware for prototypes and low-volume production:
1. **High Pricing Markups & Opaque Shipping**: Purchasing directly from McMaster-Carr is convenient but carries heavy markups. Furthermore, shipping costs are hidden until checkout, resulting in small orders costing more in shipping than the physical parts.
2. **Hidden Sourcing Alternatives**: McMaster-Carr's interface does not allow sorting by price or searching for cheaper equivalents, forcing engineers to manually cross-reference parts across different supplier websites.
3. **Corporate Procurement Barriers**: Enterprise finance departments frequently block McMaster-Carr purchases due to lack of open billing accounts, forcing engineers to identify equivalents on approved supplier platforms like Zoro, MSC Industrial, Fastenal, Misumi, or Bolt Depot.

---

## Solution

**partsource.io** is a high-performance, single-page, client-side utility ("Octopart for mechanical hardware") that allows engineers to:
1. Decode McMaster-Carr part numbers instantly to view precise specifications using a local regex/lookup engine.
2. Open specification-led searches across five major distributors (Zoro, MSC, Fastenal, Misumi, Bolt Depot).
3. Verify candidate identity, price, availability, and specifications on those distributor websites.
4. Accumulate parts into a persistent local Bill of Materials (BOM) with options to adjust quantities, view total estimates, and import/export CSV files.
5. Provide a Programmatic SEO (pSEO) foundation on a separate domain (`partsource.io`) that funnels users to consulting services at `jayar.co`.

---

## User Stories

### Search & Decoding
1. As an engineer, I want to input a McMaster-Carr part number, so that I can instantly see its decoded mechanical specifications (thread size, pitch, length, material, head style, finish, and drive type).
2. As an engineer, I want to search using fuzzy or partial part numbers, so that I can find matching parts from the system's static catalog.
3. As an engineer searching for a part not in the static catalog, I want a fallback regex parser to guess its attributes, so that I can still get structural specs and search links.
4. As an engineer, I want the decoded specs to display in a high-density, readable grid, so that I can quickly verify the properties of the part.
5. As an engineer, I want standard alignments (like DIN, ISO, ANSI, or ASME standard numbers) to be shown for the part, so that I can easily look up standard engineering specifications.

### Supplier Comparison
6. As a procurement manager, I want supplier-site search links for the decoded configuration, so that I can investigate candidates without treating them as confirmed listings.
7. As a buyer, I want a clear warning to verify identity, price, availability, and specifications on the supplier site.
8. As an engineer, I want technical configuration details to remain separate from commercial supplier information.
9. As an engineer, I want a clickable supplier search for the part's specifications, so that I can continue research on the supplier site.

### BOM Management
10. As an engineer, I want to click an "Add to BOM" button from the search result, so that I can save the decoded part into my current working Bill of Materials.
11. As an engineer, I want to view my accumulated BOM in a dedicated tab/view, so that I can review all the hardware needed for my project in one place.
12. As a project manager, I want to adjust quantities of individual parts in the BOM table, so that the line items and total estimated cost recalculate in real-time.
13. As an engineer, I want to delete parts from my BOM table, so that I can remove items I no longer need.
14. As a user, I want my BOM list to persist in local browser storage (LocalStorage/IndexedDB), so that I do not lose my data when I refresh the page or return later.
15. As an engineer, I want to export my BOM table as a CSV file, so that I can import it into other CAD tools, spreadsheets, or procurement systems.
16. As a buyer, I want to upload a CSV list of McMaster part numbers, so that the tool parses and loads them into my BOM in bulk.

### SmartCart BOM Optimization (Paid Features)
Future-only concept, not current MVP behavior. It remains blocked until PartSource has sanctioned supplier data with price and availability provenance.
17. As a purchasing manager, I want the system to calculate the optimal split-order routing of my BOM across Zoro, Bolt Depot, MSC, etc., so that I get the lowest total price including shipping.
18. As a buyer, I want to define an "Administrative Friction Cost" per supplier (e.g., $15 per PO), so that the algorithm doesn't split a tiny item to a new supplier unless the savings exceed the overhead.
19. As an engineer, I want to specify a "Maximum Number of Suppliers" constraint, so that my parts list isn't split across more than my preferred number of packages.
20. As a procurement officer, I want to compare "Cheapest Split", "Single-Vendor Winner", and "Fastest Delivery" options side-by-side, so that I can make the best tradeoff decision.

### Branding & pSEO
21. As a visitor on `partsource.io`, I want to see a footer link and attribution to Jay, so that I can learn about the developer who built the tool.
22. As an engineer with custom or bulk procurement needs, I want an option to submit my BOM for custom sourcing consulting, so that I can offload complex procurement to `jayar.co`.
23. As a search engine bot, I want every part page to render useful technical content (spec table, standard reference, supplier searches, internal related links, and application notes), so that the page is categorized as high-quality helpful content.

---

## Implementation Decisions

### 1. Architectural Decisions & Tech Stack
- **Framework**: Next.js (App Router, SSG export-friendly to allow high-speed hosting and pre-rendered programmatic SEO pages).
- **Styling**: Pure Vanilla CSS following the **Quiet Technical Light** design system lane for a lightweight, high-contrast, high-density layout inspired by McMaster-Carr and Octopart. No heavy UI component libraries.
  - **Canvas & Ink**: Light-first canvas using cool neutrals for base surfaces (low-chroma gray scale). High-readability near-black ink instead of pure black.
  - **Typography**: Sans-serif-led hierarchy paired with monospace font for all part numbers, dimensions, mechanical specifications, and comparative data tables.
  - **Structure**: Explicit section boundaries, thin borders, and muted fills/chips to group components. Spacing and structure prioritize hierarchy before color accents.
  - **Accents**: Restrained, functional accent color used strictly for interactive elements (such as links and state highlights), avoiding decorative color styling.
  - **Motion**: Minimal motion, used strictly for user state transitions (e.g., hover states or tab selection).
- **Client-Side Libraries**:
  - `fuse.js` for client-side fuzzy searching against the static fastener catalog.
  - `papaparse` for processing CSV file uploads and generation.
- **Data Persistence**: LocalStorage or IndexedDB for storing the active BOM. No server-side database, user accounts, or authentication.

### 2. Sourcing & Decoding Engines
- **Hybrid Rules Engine**: Combines a static JSON catalog of 30-40 common McMaster parts (verified for high fidelity) with a fallback regex engine to parse and "guess-spec" other fasteners.
- **Uniform URL Generation**: Generate clean query search URLs redirecting to suppliers based on part specifications rather than maintaining live scrapers or real APIs.
- **Supplier Search Boundary**: Generate specification-led search URLs only. Do not invent pricing, inventory, lead time, approval, or match status.

### 3. Programmatic SEO (pSEO) Page Constraints
To ensure crawl eligibility and combat search engine penalties, all generated part pages must implement:
- **Strict Content Floor**: Every part page must render a decoded spec table, standard reference (DIN/ISO/ASME), active supplier-search links, internal links, and a short application note.
- **Index Gate**: Prevent indexing (omit from `sitemap.xml` and apply `noindex`) unless:
  - Root domain has accumulated **20+ organic backlinks**.
  - The regex engine successfully decodes the part (no "unknown" attributes).
  - Title tags avoid trademarked name violations (e.g., "M4 Socket Cap Screw Equivalents & Sourcing" instead of "McMaster-Carr 91251A242").

### 4. SmartCart Optimization Engine
Future-only concept, not current MVP behavior. Do not expose optimization or cheapest-supplier claims until sanctioned supplier data is available.
- **Client-Side Optimization Engine**: For rapid UI updates and low operational cost, run the optimization algorithm client-side in JS (heuristic or dynamic programming approach).
- **Optimization Strategy**: Use a greedy heuristic with local search improvement to find the optimal split combination under 100ms for up to 100 BOM line items.
- **Variables & Inputs**:
  - User-entered or imported unit pricing per line item; missing prices remain blank/zero.
  - Bulk discount tiers (e.g. 100+, 500+ packs).
  - Shipping fees (e.g. Zoro: $0 if order $\ge$ $75, else $10 flat fee; Bolt Depot: $6.95 flat fee; MSC: $15 flat fee).
  - Administrative friction penalty ($C_{admin}$): Configurable cost added per additional supplier (default $15/supplier) to balance shipping vs. purchasing effort.
- **Outputs**:
  - *Cheapest Split*: Absolute lowest total cost (including shipping and friction costs).
  - *Single-Vendor Winner*: Sourced entirely from one supplier (minimizing POs).
  - *Fastest Delivery*: Optimized for lead times, utilizing stock availability.

---

## Testing Decisions

### Test Quality & Guidelines
A high-quality test must verify **external behavioral outcomes** rather than internal implementation details.
- Avoid testing private functions, regex helper internals, or specific CSS selectors unless they bind to user-facing roles.
- Focus on testing page transitions, parsing accuracy, BOM state changes, and CSV import/export output.

### Proposed Testing Seams

To maintain high coverage with minimal complexity, we will implement testing at two key seams:

1. **Seam 1: Decoder Engine Unit/Integration Tests (Module Seam)**
   - **Target**: The parsing module (`decodePartNumber` function).
   - **Approach**: Feed a suite of test part numbers (both from the static lookup catalog and simulated fallback regex patterns) and verify the returned specifications match expected dimensions, materials, and sizes.
   - **Verification**: Run unit tests in Vitest/Jest to assert input-output correctness without rendering a browser.

2. **Seam 2: User Action DOM Integration Tests (UI Seam - Highest Seam)**
   - **Target**: Main single-page interactive container.
   - **Approach**: Use a JSDOM or E2E browser context (e.g., Playwright or React Testing Library) to simulate:
     - Searching for a part number and verifying the supplier table updates.
     - Clicking "Add to BOM", modifying quantity, and verifying totals update.
     - Persisting data to LocalStorage (mocked) and confirming it reloads.
     - Simulating a CSV upload and verifying table rows populate correctly.
   - **Prior Art**: This is a greenfield implementation; these seams will serve as the initial testing blueprint.

---

## Out of Scope

- **Supplier Commercial Data**: The MVP does not provide live or synthetic pricing, inventory, availability, or confirmed supplier listings.
- **Non-Fastener Products**: Bearings, pneumatics, raw stock, and electrical parts are out of scope for the MVP.
- **Server Databases & Auth**: No registration, login, cloud sync, or server database storage will be implemented.
- **Multi-currency**: Only USD prices will be handled.

---

## Further Notes

### Industry Corrections & Guardrails
To prevent spreading common misconceptions, the application copy and documentation must adhere to these verified facts:
1. **McMaster-Carr** is private, family-owned, and **NOT owned by Hillman Solutions** (HLMN).
2. **Octopart** was acquired by **Altium Limited in August 2015** (not Nexar). Altium was subsequently acquired by Renesas Electronics in August 2024.
3. **OSH Cut** is fully independent and **NOT acquired by Protolabs**.
