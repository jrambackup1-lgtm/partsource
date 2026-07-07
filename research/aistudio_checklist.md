# Google AI Studio Prompt & Export Checklist — partsource.io

This checklist tracks completed stages, pending prompts to run in AI Studio, and verification gates before exporting the codebase to local files.

---

## 1. Completed AI Studio Stages (Already Done)
*These prompts have been prepared and run to build the core prototype pages.*

- [x] **Stage 1**: Core Search & 10-Part Fastener Database ([prd-aistudio.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio.md))
- [x] **Stage 2**: BOM Manager Tab, LocalStorage & PapaParse CSV Import/Export ([prd-aistudio.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio.md))
- [x] **Stage 3**: Next.js App Router Page/Folder Structure Migration ([prd-aistudio2.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio2.md))
- [x] **Stage 4**: Dynamic pSEO `/parts/[partNumber]` page & dynamic `sitemap.js` ([prd-aistudio2.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio2.md))
- [x] **Stage 5**: Sourcing Lead Form Modal & `jayar.co` brand attribution ([prd-aistudio2.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio2.md))
- [x] **Stage 6**: Bento Grid layout, Teenage Engineering visual overhaul & inline BOM edits ([prd-aistudio3.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio3.md))
- [x] **Stage 7**: Responsive SVG Savings Chart & AVL compliance checks (DFARS/ISO/USA) ([prd-aistudio4.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio4.md))
- [x] **Stage 8**: 4-Step Sourcing Brokerage Checkout & Order Tracking Dashboard ([prd-aistudio4.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio4.md))
- [x] **Stage 9**: Sourcing Broker Admin Dashboard for overrides & status updates ([prd-aistudio5.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio5.md))
- [x] **Stage 10**: Multi-Currency conversion & international shipping duty calculations ([prd-aistudio5.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio5.md))

---

## 2. Pending AI Studio Stages (To Run Next in AI Studio)
*These prompts must be copied and run in AI Studio before copying the code out.*

- [ ] **Stage 11**: Sourcing Widget embed generator & preview dashboard ([prd-aistudio6.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio6.md))
- [ ] **Stage 12**: JSON-LD Structured Product Data schema for Google rich search results ([prd-aistudio6.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio6.md))
- [ ] **Stage 13**: Syncing AVL Compliance filters with the SVG chart & normalizing CSV headers ([prd-aistudio7.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio7.md))
- [ ] **Stage 14**: Pre-populating Admin dashboard with dummy orders & upgrading regex rules ([prd-aistudio7.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio7.md))
- [ ] **Stage 15**: Parametric 3D CAD model visualizer & STEP/SolidWorks exporter ([prd-aistudio8.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio8.md))
- [ ] **Stage 16**: Torque tightness calculator, clearance hole sizes & tap drill references ([prd-aistudio8.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio8.md))
- [ ] **Stage 17**: Mechanical material datasheets (tensile/yield strength metrics & PDF export) ([prd-aistudio8.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio8.md))
- [ ] **Stage 18**: Split-Vendor BOM Pricing Optimizer & shipment lead-time router ([prd-aistudio8.md](file:///C:/Users/jayar/Projects/partsource/research/archive/prd-aistudio8.md))

---

## 3. Pre-Export Verification Checklist
*Test these features directly in the AI Studio preview pane to ensure no logical bugs.*

- [ ] **Code Integrity**: Verify that no code blocks are truncated or contain comments like `// rest of the code goes here...`.
- [ ] **Specs & CAD Matching**: Change part sizes and verify the 3D model scales/stretches accordingly. Try downloading STEP files.
- [ ] **Engineering Calculator**: Verify torque values dynamically scale when switching between Alloy Steel and Stainless Steel 18-8, or dry and lubricated states.
- [ ] **BOM Optimizer Options**: Switch BOM routing between "Lowest Cost Split" and "Consolidated". Verify the shipping cost matches the invoice count ($9.99 flat shipping fee per distinct warehouse).
- [ ] **Compliance & SVG Sync**: Toggling compliance filters grays out non-compliant bars in the SVG chart and recalculates the "Best Value" supplier.
- [ ] **Currency Switches**: Currency conversion changes all numbers, chart tooltips, and checkout summaries.
- [ ] **Admin Sync**: Creating an order in user checkout updates the Admin Dashboard order list. Modifying status in Admin updates the customer's Order Tracking screen.

---

## 4. Local Export & Integration Steps (Post-AI Studio)
*Steps to migrate the project to local files and start building real tools.*

- [ ] **Extract Files**: Copy full file code from AI Studio and save to [web folder](file:///C:/Users/jayar/Projects/partsource/web/).
  - `app/layout.js`, `app/page.js`, `app/parts/[partNumber]/page.js`, `lib/decoder.js`, `styles/globals.css`, `app/sitemap.js`, `app/blog/[slug]/page.js`.
- [ ] **Local Build Verification**: Run `npm run build` or `next build` to verify there are no compilation or sitemap generation memory issues.
- [ ] **Replace Mock Data with Real Tools**:
  - Replace simulated pricing/stock with actual scraper scripts or distributor APIs (e.g. Zoro API).
  - [x] **Database & Auth**: ❌ Not plugged. Sourcing order data resides entirely in browser client-side `localStorage`.
  - Add active Slack/Discord webhooks to notify the sourcing broker of orders.
