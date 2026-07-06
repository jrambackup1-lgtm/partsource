# Google AI Studio Prompt: partsource.io MVP Mockup (Two Phased Approach)

To prevent code truncation or model confusion, the mockup generation is split into two phases. 

---

## Phase 1: Core Search, Decoder & Supplier Comparison Grid

Copy and paste the prompt below into Google AI Studio to generate the base single-file tool with the UI shell, search engine, spec decoder, and comparative supplier table.

```markdown
You are a senior front-end engineer and product designer. Build a high-fidelity, self-contained single-file prototype (`index.html`) implementing Phase 1 of the **partsource.io** mechanical hardware sourcing tool.

### Core Architecture & Dependencies
- Single file: HTML, CSS (in `<style>`), and JS (in `<script>`).
- Only external CDN dependency: Fuse.js (`https://cdnjs.cloudflare.com/ajax/libs/fuse.js/6.6.2/fuse.min.js`) for fuzzy searching.

### Visual Styling: "Quiet Technical Light"
- **Canvas**: Light-first page layout. Cool light-gray backgrounds (`#f4f5f7` or `#f8f9fa`) for body/panels, and pure white (`#ffffff`) for cards/tables.
- **Ink**: High-contrast, near-black ink (`#1a1d20` for primary text, `#495057` for secondary metadata).
- **Typography**: Clean sans-serif (e.g., Inter, system-ui) for headings/labels; monospace (`Consolas`, `Monaco`, `monospace`) for part numbers, specifications, dimensions, and data tables.
- **Borders & Dividers**: Thin, explicit boundaries (`1px solid #e2e8f0` or `#dee2e6`). Avoid heavy box-shadows.
- **Accents**: Restrained, industrial blue (`#0f4c81` or `#1d4ed8`) strictly for active links, buttons, and focus states.
- **Layout**: Compact, high-density spreadsheet layout mimicking McMaster-Carr and Octopart.
- **Footer**: Include `"Built by Jay"` linking to `https://jayar.co`.

### Features to Implement
1. **Search Bar**: Multi-match input utilizing Fuse.js.
2. **Static Fastener Database**: Embed this JSON array directly:
   ```json
   [
     {"partNumber": "91251A242", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M4", "pitch": "0.7 mm", "length": "12 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.28, "appNote": "High-tensile fastener for precision machinery and rigid structural clamping."},
     {"partNumber": "91251A244", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M4", "pitch": "0.7 mm", "length": "16 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.30, "appNote": "High-tensile fastener for precision machinery and rigid structural clamping."},
     {"partNumber": "91251A245", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M4", "pitch": "0.7 mm", "length": "20 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.32, "appNote": "High-tensile fastener for precision machinery and rigid structural clamping."},
     {"partNumber": "91251A342", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M5", "pitch": "0.8 mm", "length": "12 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.34, "appNote": "Common metric size for 3D printers, enclosures, and robotic joints."},
     {"partNumber": "91290A115", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M3", "pitch": "0.5 mm", "length": "10 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.22, "appNote": "Standard sub-miniature socket cap screw for electronics and sensors."},
     {"partNumber": "91251A192", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "#10-24", "pitch": "24 TPI", "length": "1/2\"", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "ASME B18.3", "mcmasterPrice": 0.25, "appNote": "Fractional structural bolt popular in US mechanical assemblies."},
     {"partNumber": "91247A142", "category": "Screws & Bolts", "type": "Hex Head Screw", "thread": "M4", "pitch": "0.7 mm", "length": "12 mm", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex Outer", "standard": "DIN 933 / ISO 4017", "mcmasterPrice": 0.40, "appNote": "Corrosion-resistant general-purpose hex cap bolt."},
     {"partNumber": "92210A110", "category": "Screws & Bolts", "type": "Flat Head Socket Cap Screw", "thread": "M3", "pitch": "0.5 mm", "length": "10 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 7991 / ISO 10642", "mcmasterPrice": 0.20, "appNote": "Countersunk screw designed to sit flush with mating surfaces."},
     {"partNumber": "90596A005", "category": "Nuts", "type": "Hex Nut", "thread": "M4", "pitch": "0.7 mm", "length": "N/A", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex Outer", "standard": "DIN 934 / ISO 4032", "mcmasterPrice": 0.10, "appNote": "Standard metric hex nut matching M4 thread sizes."},
     {"partNumber": "91166A005", "category": "Washers", "type": "Flat Washer", "thread": "M4", "pitch": "N/A", "length": "N/A", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "N/A", "standard": "DIN 125A / ISO 7089", "mcmasterPrice": 0.06, "appNote": "Spreads load and prevents wear on soft mating materials."}
   ]
   ```
3. **Fallback Regex Parser**: If a part number is not found in the static catalog, parse it with regex:
   - Identify thread sizes (like `M3x0.5`, `M4x0.7`, `10-24`).
   - Extract length numbers (e.g., `12mm`, `1/2"`).
   - Classify category/type based on McMaster prefixes (e.g., `91251` -> Socket Head Cap Screw).
4. **Decoded Spec Grid**: Show decoded properties (Thread, Pitch, Length, Material, Finish, Standard, Application Note).
5. **Supplier Comparison Grid**: Compare 5 suppliers:
   - Zoro (-15%, deep link: `https://www.zoro.com/search?q=[QUERY]`)
   - Bolt Depot (-30%, deep link: `https://www.boltdepot.com/Product-Search.aspx?txt=[QUERY]`)
   - MSC Industrial (-5%, deep link: `https://www.mscdirect.com/browse/tn?searchterm=[QUERY]`)
   - Fastenal (+0%, deep link: `https://www.fastenal.com/products/search?term=[QUERY]`)
   - Misumi (-10%, deep link: `https://us.misumi-ec.com/vona2/result/?Keyword=[QUERY]`)
   - Show simulated prices and stock quantities (use a simple string hash code helper so stock/price is randomized but stays consistent for the same part number).
```

---

## Phase 2: Add BOM Manager & CSV Integration

Once Phase 1 is generated and running, copy and paste the prompt below into Google AI Studio along with the Phase 1 code. This prompt instructs the AI to add the BOM manager, LocalStorage persistence, and CSV integration.

```markdown
Please modify and extend the working single-file `index.html` prototype generated in Phase 1 to add the BOM Manager and CSV integration features. Do not break any styling or decoder features.

### Requirements to Add

1. **Double-Tab Structure**:
   - Add a navigation tab bar at the top: **Part Finder** and **BOM Manager**.
   - Clicking tabs toggles the view visibility below them.
2. **Add to BOM Control**:
   - In the Part Finder results panel, add an "Add to BOM" control containing a quantity number input and an "Add" button.
   - Clicking "Add" inserts the decoded part specifications, quantity, and selected supplier pricing details into the BOM list.
3. **BOM Manager Tab View**:
   - A full-width table displaying all items in the BOM.
   - Table columns: `Part Number`, `Description (Thread, Length)`, `Material`, `Supplier Selected`, `Qty`, `Unit Cost ($)`, `Line Total ($)`, and an `Action` (Delete button) column.
   - Allow modifying the Quantity inline in the table; line totals and the overall BOM cost sum must recalculate instantly.
4. **BOM State Persistence**:
   - Automatically save the BOM array list to `localStorage` on additions, updates, or deletions.
   - Load the BOM list from `localStorage` on page startup to populate the table.
5. **CSV Integration using PapaParse CDN**:
   - CDN link: `https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js`.
   - **Export BOM**: Add a button in the BOM Manager to download the current table rows as a clean CSV file.
   - **Import McMaster List**: Add a file upload selector. Read the uploaded CSV/TXT file, parse it using PapaParse, search for part numbers, decode them, and bulk-load them into the active BOM (default quantity: 10 per part).

Make sure the styling remains compliant with the "Quiet Technical Light" theme, keeping layouts compact and spreadsheet-like. Output the complete, fully updated `index.html` file code.
```
