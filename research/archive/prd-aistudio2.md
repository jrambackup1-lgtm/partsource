# Google AI Studio Prompt: partsource.io Phase 2/3 (Next.js, Routing, pSEO & Funnel)

This document contains prompts to extend your working prototype into a full-scale Next.js App Router application with programmatic SEO (pSEO) routes and brand funnel lead forms.

---

## Stage 3: Next.js App Router Migration & Dynamic Routing

Copy and paste this prompt into Google AI Studio alongside your fully-functional `index.html` prototype to split it into a modern Next.js project structure with routable pages.

```markdown
You are a senior React and Next.js architect. Help me migrate the single-file HTML/CSS/JS prototype of **partsource.io** into a modular Next.js App Router project structure.

### Project Structure to Generate
Produce the layout and file content details for a Next.js (App Router, SSG export-friendly) codebase:

1. **`app/layout.js`**: Setup the global layout, importing the CSS variables and Google Font (Inter/Outfit).
2. **`app/page.js`**: The interactive homepage widget. Displays the Part Finder UI and the BOM Manager tab. It must read and write to LocalStorage to load/save the BOM state.
3. **`app/parts/[partNumber]/page.js`**: A dedicated product detail page for search-engine routing (e.g., `/parts/91251A242`). When loaded, it decodes the part number in the URL (using the decoder module) and displays the spec grid, comparative supplier grid, and an "Add to BOM" button that populates the global BOM state.
4. **`lib/decoder.js`**: A shared utility file containing the static JSON catalog database, the fuzzy lookup logic (using a client-side library or light custom fuzzy match), the fallback regex parser, and the distributor price/stock simulation functions.
5. **`styles/globals.css`**: The unified CSS file implementing the **Quiet Technical Light** styling (cool light-gray background, near-black ink, monospace specs, thin borders, industrial blue accents).

### Requirements
- Ensure code is fully compatible with static site generation (`output: 'export'` configuration in `next.config.js`).
- Dynamic routes `/parts/[partNumber]` must export dynamic params via `generateStaticParams()` using the static catalog.
- Convert DOM manipulation JS from the prototype into clean React state hooks (`useState`, `useEffect`).
- Make sure components are strictly client-side (`"use client"`) where they interact with LocalStorage or URL parameters.
```

---

## Stage 4: pSEO Page Template & Indexing Checklist Gate

Use this prompt to ensure all dynamic part pages generated under `/parts/[partNumber]` strictly adhere to pSEO standards and Google Helpful Content rules.

```markdown
Extend the Next.js part detail page (`app/parts/[partNumber]/page.js`) and build system configurations to enforce a strict quality gate and content floor to optimize SEO indexing.

### Specifications to Implement

1. **Content Floor Enforcement (5 of 7 Rule)**:
   Every generated part page must render at least 5 of these components based on the decoded attributes:
   - **Decoded Spec Table**: High-density monospace table of mechanical specifications.
   - **Standards Reference**: Clear mapping to standard DIN/ISO/ASME codes (e.g., "DIN 912 equivalent").
   - **Active Search Deep-Links**: Functional search-query URLs to at least 3 major distributors (Zoro, Bolt Depot, MSC, etc.).
   - **Estimated Price Grid**: Simulated discount grid and quantity price breaks.
   - **Availability Status**: Consistent simulated stock message.
   - **Internal Related Links**: A list of links to nearby sizes (e.g., if rendering M4 x 12mm, show internal links to M4 x 16mm, M4 x 20mm, M5 x 12mm).
   - **Contextual Application Note**: A short engineering description of how this fastener type is typically utilized.

2. **Index Gate & Sitemap Logic**:
   - Write a dynamic sitemap generator script (`app/sitemap.js`) that outputs URL paths only for parts that decode successfully (no "unknown" values).
   - If the regex fallback fails to resolve the part number structural specs, apply a `<meta name="robots" content="noindex">` tag to the page header to prevent search bots from indexing thin error pages.
   - Set up the page `<title>` and `meta description` tags dynamically. Titles must be comparative and generic (e.g., "M4 Socket Cap Screw Equivalents & Sourcing") to avoid McMaster-Carr trademark issues.
```

---

## Stage 5: Sourcing Lead Form & Brand Integration Funnel

Use this prompt to build the conversion funnel that captures leads and directs users to consulting services at `jayar.co`.

```markdown
Add the Lead Generation and Sourcing Funnel features to **partsource.io** to capture high-value enterprise procurement traffic.

### Features to Implement

1. **BOM Sourcing Lead Form**:
   - In the BOM Manager tab, add a prominent, professional banner: "Looking for Bulk Pricing or Custom Sourcing? Request a direct factory quote."
   - Clicking this button opens a clean, modal form capturing:
     - Full Name & Work Email
     - Company Name
     - Production Timeline (Prototype / 1-3 Months / 6+ Months)
     - Target Budget & Custom Notes
   - The form should auto-populate the table of current BOM items into a hidden field to attach the parts list.

2. **Brand Attribution & Routing**:
   - Add a professional attribution block to the global site footer: "Built by Jay. Need custom machinery or mechanical design consulting? Visit jayar.co."
   - When the sourcing lead form is submitted, package the user data and BOM list as a JSON payload, simulate a POST request to `https://jayar.co/api/sourcing-lead` with a loading state, and display a professional custom success message guiding the user to read projects/guides at `jayar.co`.
```
