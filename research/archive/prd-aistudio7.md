# Google AI Studio Prompt: Sourcing Engine Refinements, Compliance Sync & Multi-User Simulation (Phase 7)

This document contains prompts to resolve architectural inconsistencies, synchronize compliance states with analytics, and implement mock multi-user data for administrative dashboard testing.

---

## Stage 13: Compliance-Integrated Sourcing Charts & CSV Header Normalization

Copy and paste this prompt into Google AI Studio to synchronize compliance filters with cost savings charts and improve CSV import robustness.

```markdown
You are a senior frontend engineer. Before writing any code, analyze the codebase and answer the following logic-check questions to identify potential errors:

### Logic Check Questions (Respond to these first)
1. **Compliance vs Analytics Hook**: Does the current SVG savings chart recommend the cheapest supplier (e.g., Zoro or Bolt Depot) even if they are marked as non-compliant or locked by DFARS/ISO/Origin settings? Explain how you will rewrite the "Best Value" identification logic to filter out non-compliant suppliers first.
2. **CSV Header Rigidity**: Does the CSV importer crash or skip rows if the user uploads a McMaster BOM export where column headers are shifted or named slightly differently (e.g., "Part #" instead of "Part Number")? How will you normalize the parsed PapaParse keys dynamically?
3. **Attribution Drift**: Are the global branding links in the footer, sourcing form, and redirects pointing to different domains (e.g., `jayar.co` vs `afterconcept.com`)? How will you consolidate them using a single configuration constant?

---

### Features to Implement

1. **Compliance-Linked SVG Savings Chart**:
   - Update the "Cost Savings Analysis" SVG bar chart:
     - If a supplier is filtered out or locked due to compliance selections (e.g., DFARS, ISO, Made in USA), their corresponding bar in the SVG chart must be visually grayed out (e.g., low opacity with a diagonal pattern fill) and marked with a lock/warning symbol.
     - Ensure the "Best Value" savings badge automatically recalculates to highlight the lowest-cost *compliant* supplier, rather than choosing a cheaper non-compliant supplier.

2. **PapaParse CSV Header Normalization**:
   - Update the McMaster CSV import logic to support varied export formats.
   - Do not rely on hardcoded column indexes. Instead, normalize column keys to find the correct data:
     - Map **Part Number** columns: `Part Number`, `Part #`, `Item #`, `Number`, `PartNumber`.
     - Map **Quantity** columns: `Qty`, `Quantity`, `Count`, `Quantity Ordered`.
   - If headers cannot be automatically identified, fall back to parsing the first column as Part Number and second as Quantity, displaying a toast notification listing successfully imported lines.

3. **Global Branding Alignment Configuration**:
   - Define a single global branding constant `NEXT_PUBLIC_BRAND_URL` (defaulting to `https://afterconcept.com`) and `NEXT_PUBLIC_BRAND_NAME` ("Afterconcept Engineering").
   - Update all footer attribution links, sourcing lead form API submissions (`/api/sourcing-lead`), and redirect success dialogs to use these unified variables.
```

---

## Stage 14: Mock Multi-User Order Simulation & Robust Regex Lookup Expansion

Copy and paste this prompt into Google AI Studio to pre-populate the admin dashboard with test orders and expand the regex decoding rules.

```markdown
You are a senior React and SEO architect. Before writing any code, analyze the codebase and answer the following logic-check questions to identify potential errors:

### Logic Check Questions (Respond to these first)
1. **Mock Admin Sync Engine**: Since the app is client-side only (using LocalStorage), does an update made in the Admin Dashboard toggle reflect on the customer's "Track Sourcing Orders" view? How will you structure the LocalStorage schema to sync both views in the same browser session?
2. **Regex Parsing Fallbacks**: When regex fails or decodes "unknown" specs, does it trigger a `<meta name="robots" content="noindex">`? How will you enhance regex matches so standard nuts, washers, and imperial screws are accurately identified, preventing unnecessary index exclusions?
3. **Static Build Sitemap Memory Limits**: Will generating dynamic paths for all McMaster parts run out of memory during a static static site build (`output: 'export'`)? How will you implement sitemap batch limits and check for backlinks before generating index tags?

---

### Features to Implement

1. **Mock Multi-User Data Engine**:
   - Since the application runs entirely client-side, the Sourcing Admin Dashboard is empty until the user submits an order.
   - To make the dashboard functional for testing immediately, pre-populate `localStorage` on first load with 3-4 realistic mock orders from different "companies" (e.g., SpaceX, Tesla, Boston Dynamics) containing different BOM items, quantities, and submission times.
   - Ensure the Sourcing Admin Dashboard displays these simulated customer orders alongside any new user-submitted orders.
   - Saving changes to any order (status changes, price overrides) in the admin panel must persist locally and correctly update the tracking views.

2. **Upgraded Fallback Regex Engine**:
   - Expand the regex lookup logic in `lib/decoder.js` to intelligently decode standard patterns:
     - **Imperial Threads**: Support sizes like `1/4-20`, `10-24`, `8-32` including length matches in fractional inches (e.g., `1/2"`, `1-1/4"`).
     - **Nuts**: Detect part numbers beginning with `90596` or containing "Nut" to return category "Nuts", setting thread size and mapping standard "DIN 934".
     - **Washers**: Detect part numbers beginning with `91166` or containing "Washer" to return category "Washers", setting inner diameter, outer diameter, and mapping standard "DIN 125A".
   - If a part number is undecodable, write an intelligent guess rather than showing "unknown" for all fields, ensuring the index gate does not restrict too many search landing pages.

3. **Controlled Sitemap Rollout Gate**:
   - Add a configuration variable `DOMAIN_BACKLINK_COUNT` (default: 0).
   - In the sitemap generator (`app/sitemap.js`), restrict sitemap exports to a maximum of 5,000 pages during the initial rollout phase to avoid exceeding Next.js build-time static export limits.
   - If `DOMAIN_BACKLINK_COUNT` is less than 20, add the `noindex` tag automatically to all programmatic pages as a safeguard.
```
