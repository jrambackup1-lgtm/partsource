# Google AI Studio Prompt: partsource.io Premium Visual Overhaul (Phase 3)

This prompt integrates premium UI design principles from the design-references guide, utilizing a bento-grid layout, high-precision typography, micro-interactions, and explicit visual guardrails to produce a world-class mechanical engineering tool mockup.

---

## Stage 6: UI Overhaul & Premium Industrial Aesthetics

Copy and paste this prompt into Google AI Studio alongside your current code to redesign the mockup layout and styling.

```markdown
Please perform a complete visual overhaul of the single-file `index.html` prototype. We want to transform the basic layout into a professional, premium, high-density industrial dashboard (inspired by modern developer platforms like Vercel, Linear, and premium hardware sites like Teenage Engineering).

Implement the following design specifications across the HTML, CSS, and JS:

### 1. Style & Aesthetic: Bento Grid & Linear-Style Technical Light
- **Grid Layout**: Structure the Part Finder tab as a modern Bento Grid using CSS Grid (`gap: 16px` to `24px` range). Card dimensions should vary organically based on their contents:
  - Card 1: Search panel (full width or dominant top container).
  - Card 2: Decoded Spec Grid (left column).
  - Card 3: Supplier Comparison Matrix (right column, taking larger screen share).
- **Surfaces & Elevation**:
  - Page Background: `#f8fafc` (slate-50) light-first default.
  - Active Cards & Tables: `#ffffff` (white) with a clean 1px border.
  - Borders: Strict micro-borders: `1px solid #cbd5e1` (slate-300) or `#e2e8f0` (slate-200). Avoid fuzzy box-shadows. Use a subtle, crisp shadow on card hover (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)`).
- **Ink & Contrast**:
  - Primary Text: `#0f172a` (slate-900) for headers and table cells.
  - Secondary/Metadata Text: `#475569` (slate-600).
  - High WCAG AA compliance (4.5:1 ratio minimum). Avoid low-contrast gray text on white.

### 2. Strategic Typography & Pairings
- **Global Typography**: Import and use Google Font "Inter" (or system-ui sans-serif) for all headings, tabs, buttons, and UI labels.
- **Monospace Scent**: Use `Consolas, Courier New, monospace` for the following specific data-rich elements to preserve technical authenticity:
  - Part numbers (e.g., `91251A242`)
  - Thread sizes and pitches (e.g., `M4 x 0.7`)
  - Length and dimension numbers (e.g., `12 mm`)
  - Standard numbers (e.g., `DIN 912 / ISO 4762`)
  - Table pricing columns and savings values.

### 3. Micro-Interactions & Animation Soul
- **Button Hover States**:
  - Active primary buttons should slightly lift and scale on hover: `transform: translateY(-2px) scale(1.02); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);`.
  - Add a soft glow border or outline ring on focus: `outline: 2px solid #0284c7; outline-offset: 1px`.
- **Card Hover Effects**:
  - When the user hovers over a table row or a bento card, apply a subtle background color transition (`background-color: #f8fafc` or `#f1f5f9`).
- **Tab Transitions**:
  - Smoothly slide or cross-fade when toggling between "Part Finder" and "BOM Manager" tabs (opacity shift over 200ms).
- **Accessibility (Reduced Motion)**:
  - Respect system settings by including a `@media (prefers-reduced-motion: reduce)` block to instantly disable all animations and transitions if the user prefers reduced motion.

### 4. Interactive Layout Rythm & Component Details
- **Empty State "Quick-Start" Panel**:
  - If no part number has been entered, display a clean, empty state block.
  - Include a bento card: "Common McMaster Hardware". Inside, render 6 clickable badges for common parts (`91251A242`, `91290A115`, `91247A142`, `92210A110`, `90596A005`, `91166A005`). Clicking one must auto-fill the search input, trigger the search/decoding, and update the UI.
- **Supplier Matrix Enhancements**:
  - Color-code Simulated Stock levels:
    - Muted green text/dot indicator for "In stock" (e.g., `#166534`).
    - Muted amber text/dot indicator for "2-3 days" (e.g., `#92400e`).
  - Add a dynamic green discount pill badge next to the prices (e.g., `-15%`, `-30%`) using standard tags.
  - Wrap the outbound deep-link redirect as a polished button with an external-link icon: `Search [Supplier] ↗` rather than raw link text.
- **BOM Manager Upgrades**:
  - Render 4 clean summary cards at the top of the BOM tab:
    1. **BOM Total Items** (Muted gray background tag)
    2. **Total Qty** (Muted gray tag)
    3. **Estimated Savings** (Green badge showing total difference between McMaster reference price vs chosen supplier price)
    4. **BOM Estimated Total** (Bold, prominent slate-950 total)
  - Style the inline Quantity editor cell with interactive plus (`+`) and minus (`-`) buttons on each side of the number input for precise control.
  - Modernize the Sourcing Lead Form CTA as a premium dark-slate panel (`#1e293b`) with white text and an outline button, matching high-end enterprise B2B apps.

### 5. Explicit Anti-Patterns to AVOID
- No raw, pure black `#000` text on pure white backgrounds (use `#0f172a`).
- No low-contrast text (never use light gray like `#ccc` for readable copy).
- No hamburger menus or hidden navigations; keep tabs visible and responsive.
- No floating animations or transitions longer than 300ms.
```
