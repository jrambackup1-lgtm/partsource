# Google AI Studio Prompt: PartSource.io Admin Sourcing Panel & Localization (Phase 5)

This document contains prompts to extend your Next.js application with a mock Administrator dashboard for order brokerage management and localization support.

---

## Stage 9: Sourcing Broker Admin Dashboard & Vendor Matching Portal

Copy and paste this prompt into Google AI Studio to implement the administrative backend interface.

```markdown
Please build a mock Administrative Sourcing Dashboard for **PartSource.io** to manage bulk order requests.

### Features to Implement

1. **Admin Orders Overview Portal**:
   - Create a hidden route or toggle view: **Admin Sourcing Dashboard** (accessible via a gear icon or admin link).
   - Display a list of all submitted BOM orders (loaded from `localStorage`).
   - For each order, show:
     - Date & Time submitted
     - Customer details (Name, Work Email, Company)
     - Total items and total estimated cost.
     - Current Sourcing Status (`Pending Quote`, `Consolidating`, `Shipped`, `Delivered`).

2. **Custom Quote & Vendor Override Panel**:
   - Clicking an order opens an admin detail editor where the admin can:
     - Edit the unit price and select/change the chosen distributor for each line item.
     - Mark individual lines as "Custom Sourced" and manually enter a custom factory unit cost.
     - Add a custom consolidated markup fee (e.g., 10% or custom dollar value).
     - Update the Sourcing Status with a dropdown menu and input a mock tracking carrier/number.
     - Save updates back to state, which dynamically updates the customer's "Track Sourcing Orders" view.
```

---

## Stage 10: Multi-Currency Localization & International Shipping Estimator

Copy and paste this prompt into Google AI Studio to implement internationalization and shipping tariff calculators.

```markdown
Please implement multi-currency support and localized shipping cost estimators in the **PartSource.io** mockup.

### Features to Implement

1. **Currency Converter Controls**:
   - Add a currency selector dropdown in the global header: **USD ($)**, **EUR (€)**, **GBP (£)**, **CAD (C$)**.
   - Bind this converter to all pricing displays (Supplier Grid, BOM Manager Table, KPI Summary cards, Admin dashboard).
   - Use dynamic mock conversion rates (e.g., USD to EUR: 0.92, USD to GBP: 0.78, USD to CAD: 1.36) and properly format the symbol prefixes/suffixes in monospace cells.

2. **International Shipping & Tariff Estimator**:
   - In the checkout/routing modal, add shipping destination selection: **United States**, **Canada**, **European Union**, **United Kingdom**.
   - Dynamically calculate and append taxes, duties, and customs clearance estimates:
     - For non-US shipments, add a "Duties & Tariffs (Estimated)" line item (e.g., 12% of hardware subtotal).
     - Scale shipping lead times and base shipping fees dynamically (e.g., shipping to EU adds $45.00 freight flat fee and +5 business days to lead times).
```
