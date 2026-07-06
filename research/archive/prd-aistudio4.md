# Google AI Studio Prompt: partsource.io Analytics, AVL Compliance & Brokerage (Phase 4)

This document contains prompts to extend your Next.js application with interactive cost visualization charts, Approved Vendor List (AVL) compliance gates, and the mock BOM order brokerage dashboard.

---

## Stage 7: Sourcing Analytics, SVG Savings Charts & AVL Compliance

Copy and paste this prompt into Google AI Studio to implement interactive cost-savings charts and enterprise supplier filters.

```markdown
Please extend the current Next.js application of **partsource.io** to add advanced interactive cost-sourcing charts and compliance controls.

### Features to Implement

1. **Interactive Cost Visualization (SVG Charts)**:
   - In the BOM Manager view, add a "Cost Savings Analysis" card.
   - Render a custom responsive SVG bar chart comparing the total cost of the BOM across:
     - McMaster-Carr (Reference Base)
     - Zoro
     - MSC Industrial
     - Bolt Depot
     - Misumi
   - Highlight the lowest cost supplier automatically with a green badge: "Best Value: [Supplier Name] (Save $XX.XX)".
   - Make the chart responsive and interactive: hovering over a bar shows a tooltip containing the unit cost sum and simulated shipping time.

2. **Enterprise AVL (Approved Vendor List) Compliance Gate**:
   - Add a sidebar settings panel: "Compliance & Auditing Filters".
   - Include checkboxes for:
     - **DFARS Compliant** (Defense Procurement)
     - **ISO 9001 / AS9100 Certified Supplier**
     - **Made in USA / Domestic Origin Only**
   - Bind these filters to the Supplier Comparison Grid:
     - If "DFARS Compliant" is checked, apply a warning badge or lock symbol to suppliers that do not satisfy the criteria (e.g. mock Bolt Depot as "Origin Audit Required", lock it from selection).
     - If "Made in USA" is checked, filter the options to highlight Zoro and Fastenal, showing origin tags next to part lines.
     - Display compliance warning notes in the spec grid based on these toggles.
```

---

## Stage 8: BOM Order Brokerage & Sourcing Tracking Dashboard

Copy and paste this prompt into Google AI Studio to create the mock order placement, payment approval flow, and sourcing status dashboard.

```markdown
Please build a mock BOM Order Brokerage dashboard for the Next.js version of **partsource.io**. This implements the transition from the free search tool (Phase 1/2) into the V2 Brokerage model.

### Features to Implement

1. **"Checkout / Route BOM" Sourcing Workflow**:
   - In the BOM Manager tab, add a primary CTA button: "Submit BOM for Brokerage Fulfillment".
   - Clicking this button launches a multi-step checkout wizard modal:
     - **Step 1: Parts Review**: Review all lines, quantities, and chosen supplier mappings.
     - **Step 2: Shipping & Compliance**: Input shipping address, billing info, and upload compliance certificates (PDF dummy selector).
     - **Step 3: Quote Generation**: Simulate a 3-second API call loading state ("Consolidating orders, checking distributor stock..."). Then display a consolidated quote showing:
       - Subtotal of hardware.
       - Consolidated Shipping Fee (instead of 5 separate shipping fees, show one flat brokerage shipping rate).
       - Brokerage Transaction Fee (15% take-rate).
       - Total Final Cost.
     - **Step 4: Place Order**: Click to submit. Save this order instance into local state.

2. **Active Orders Tracking Dashboard**:
   - Add a navigation option/view: **Track Sourcing Orders**.
   - Show a list of past submitted BOM orders with real-time status steps:
     - `Order Submitted` (Date, Time)
     - `Quoting & Consolidating` (Active progress bar)
     - `Shipped from Consolidated Warehouse` (Tracking number generated dynamically, e.g. mock USPS/FedEx link)
     - `Delivered`
   - Include details of the parts included in each order, allowing users to re-order the entire BOM with a single click.
```
