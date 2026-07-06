# Google AI Studio Prompt: CAD Visualizers, Technical Calculators & Sourcing Optimizers (Phase 8)

This document contains prompts to extend your Next.js application with interactive 3D CAD visualization, mechanical calculations, material datasheets, and split-vendor BOM cost optimization.

---

## Stage 15: Dynamic 3D CAD Model Visualizer & CAD Download Panel

Copy and paste this prompt into Google AI Studio to implement the interactive 3D fastener visualizer and CAD formats exporter.

```markdown
Please build an interactive, parametric 3D CAD fastener visualizer and export panel for the parts detail page on **PartSource.io**.

### Features to Implement

1. **3D Visualizer Canvas (WebGL/Three.js Mock)**:
   - In `/app/parts/[partNumber]/page.js`, add a visual canvas card: **3D Model Preview**.
   - Render a simplified, interactive 3D rendering (using Three.js CDN or a CSS/SVG-based dynamic isometric mockup) of the selected fastener (e.g., a socket cap screw, hex bolt, washer, or nut).
   - The 3D model's geometry must dynamically scale in real-time based on the decoded part specs (e.g., longer length stretch, larger thread diameter, head style changes from Socket to Hex or Flat).
   - Include mouse orbital rotation controls (pan, zoom, rotate) to inspect the 3D part.

2. **CAD Formats Download Panel**:
   - Add a download card listing standard industrial CAD formats:
     - **STEP (.step / .stp)** (Universal CAD standard)
     - **IGES (.igs / .iges)**
     - **SolidWorks (.sldprt)**
     - **Fusion 360 (.f3d)**
     - **STL (.stl)** (For quick 3D printing slicing)
   - Clicking a format triggers a simulated file download with correct nomenclature (e.g. `partsource_91251A242.step`) and displays a success toast.
```

---

## Stage 16: Thread Pitch, Tightening Torque & Drill Size Calculator

Copy and paste this prompt into Google AI Studio to implement standard mechanical calculations for the selected fastener.

```markdown
Please implement a high-precision tightening torque, tap drill size, and clearance hole calculator for the parts detail page on **PartSource.io**.

### Features to Implement

1. **Torque & Clamping Force Calculator**:
   - Input fields: **Lubrication State** (Dry, Lubricated, Anti-seize) and **Thread Fit Class**.
   - Read the decoded fastener thread size (e.g., M4, 10-24) and material grade (e.g., Alloy Steel Class 12.9, Stainless Steel 18-8).
   - Calculate and display:
     - **Recommended Tightening Torque** in Newton-meters (N·m) and Inch-pounds (in-lbs) using standard torque formulas ($T = K \cdot D \cdot F$).
     - **Clamping Preload Force** (in kN or lbs) at 75% yield strength.
     
2. **Standard Tap Drill & Clearance Hole Reference**:
   - Display a monospace technical table with:
     - **Recommended Tap Drill Size** (e.g., M4 x 0.7 pitch needs a 3.3mm drill).
     - **Close Fit Clearance Hole** (e.g., 4.2mm drill for M4 close fit).
     - **Free Fit Clearance Hole** (e.g., 4.5mm drill for M4 free fit).
   - This data must update dynamically as parts are searched or loaded.
```

---

## Stage 17: Material Performance Sheets & Technical Datasheets

Copy and paste this prompt into Google AI Studio to implement materials properties and performance graphs.

```markdown
Please build material performance cards and downloadable specifications sheets on **PartSource.io** to satisfy high-intent engineering searches.

### Features to Implement

1. **Mechanical Material Comparison Card**:
   - Dynamically load material properties based on the decoded fastener material (Alloy Steel, 18-8 Stainless, 316 Stainless, Brass, Titanium):
     - **Tensile Strength (Ultimate)** (e.g., 170,000 PSI for Alloy Steel vs 70,000 PSI for Stainless).
     - **Yield Strength** (e.g., 140,000 PSI vs 30,000 PSI).
     - **Hardness rating** (Rockwell C/B scale).
     - **Corrosion Resistance Rating** (Excellent, Moderate, Poor).
     
2. **Downloadable Spec Sheet (PDF Mock)**:
   - Provide a prominent button: `Download Technical Specification Sheet (PDF) ⬇`.
   - Simulates a print-friendly stylesheet download of the current part detail layout, complete with decoded specifications, torque calculations, and standards reference (DIN/ISO).
```

---

## Stage 18: Split-Vendor BOM Pricing Optimizer & Lead Time Router

Copy and paste this prompt into Google AI Studio to implement advanced procurement algorithms in the BOM Manager.

```markdown
Please build a Split-Vendor BOM Sourcing Optimizer in the BOM Manager tab of **PartSource.io** to allow users to compare split-shipments against consolidated orders.

### Features to Implement

1. **Optimization Mode Selector**:
   - In the BOM Manager tab, add a toggle for **Sourcing Strategy**:
     - **Strategy A: Lowest Cost Split**: Splitting items among the cheapest individual suppliers (e.g., Screws from Bolt Depot, Washers from Zoro, Nuts from Misumi).
     - **Strategy B: Single-Source (Consolidated)**: Sourcing all items from the single supplier with the lowest combined total, minimizing invoices and shipping packages.
     - **Strategy C: PartSource Brokerage**: Consolidated shipping flat rate with auditing and traceability tags.
     
2. **Comparison Summary Card**:
   - Render a table comparing:
     - **Subtotal Cost**
     - **Estimated Shipping Fees** (calculates $9.99 flat shipping fee *per shipment location* in Split mode vs single location in Consolidated mode).
     - **Lead Time Range** (Split mode displays widest range; Consolidated mode displays single maximum lead time).
     - **Invoice Count** (Split mode shows number of different supplier orders needed).
   - Automatically render a recommendation card: "Sourcing Advice: By consolidating with [Supplier], you save $XX in shipping fees and reduce lead times by Y days, despite a slightly higher hardware cost."
```
