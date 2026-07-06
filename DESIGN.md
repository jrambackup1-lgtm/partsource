---
name: PartsSource Design System
description: Modern SaaS Design System for Mechanical Sourcing Platform
colors:
  primary: "#0f172a"
  bg-page: "#f8fafc"
  bg-surface: "#ffffff"
  bg-subtle: "#f1f5f9"
  text-primary: "#0f172a"
  text-secondary: "#475569"
  border: "#e2e8f0"
  accent: "#0284c7"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.25
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Consolas, Monaco, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.bg-surface}"
    rounded: "{rounded.lg}"
---

# Design System: PartsSource

## 1. Overview

**Creative North Star: "The Mechanical Blueprint Vault"**

PartsSource uses a clean, high-density, precise visual layout. The visual architecture is inspired by premium modern engineering software: clean lines, generous data densities, clear hierarchies, and subtle micro-motions. It rejects the stereotypical dark-hacker glowing grid tropes in favor of professional web standards tailored for engineers and procurement panels.

**Key Characteristics:**
* Clean slate-50 and white page backgrounds to establish clarity.
* Standard typography weights (using Inter display/sans scales) instead of default monospace.
* Subtly rounded borders (10px and 12px radii) to frame stats and tables.
* Tactical micro-animations (`active:scale-[0.98] transition-all`) to signal interface reactivity.

## 2. Colors

The color palette uses clean slate neutrals combined with high-contrast text and a selective blue accent color.

### Primary
* **Slate Navy** (#0f172a): Main typography ink, active headers, and solid button fills.

### Neutral
* **Pure White** (#ffffff): Card surfaces and active data rows.
* **Slate Page** (#f8fafc): Background canvas of all dashboard views.
* **Slate Subtle** (#f1f5f9): Inactive panels, tab containers, and header panels.
* **Slate Border** (#e2e8f0): Thin boundary dividers and card outline limits.

### Named Rules
**The Rarity of Accent Rule.** The primary accent blue (#0284c7) is reserved solely for focus borders, matching badge details, and visual selection markers. It must never cover more than 10% of any layout surface.

## 3. Typography

**Display Font:** Inter (with system-ui fallback)
**Body Font:** Inter (with system-ui fallback)
**Label/Mono Font:** Consolas (with Monaco fallback)

**Character:** Highly legible, clean grotesque sans-serif for reading bulk specs, with monospace elements reserved purely for technical identifiers (part numbers, dimensions, and prices).

### Hierarchy
* **Display** (700, 30px, 1.25): App headers, panel titles.
* **Headline** (600, 20px, 1.3): Section headers, modal drawer titles.
* **Body** (400, 14px, 1.5): Spec descriptions, tabular items, helper text.
* **Label** (500, 12px, 0.05em tracking): Monospace part numbers, unit prices, date markers.

## 4. Elevation

The visual layout is flat and structured, using background color tints and thin borders to separate zones instead of heavy box shadows.

### Shadow Vocabulary
* **Ambient Low** (`box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)`): Subtle layout cards hover response.

### Named Rules
**The Elevation Response Rule.** Surfaces are flat by default. Subtle shadows appear only as a hover response on interactive cards.

## 5. Components

### Buttons
* **Shape:** Curved edges (6px radius).
* **Primary:** Slate-900 solid background with white text and 8px 16px padding.
* **Hover / Focus:** Scale press transitions (`active:scale-[0.98] transition-all`).

### Cards / Containers
* **Corner Style:** Curved edges (12px radius).
* **Background:** Pure White (#ffffff).
* **Border:** Slate Border (#e2e8f0) outline.
* **Internal Padding:** Spacing Medium (16px) or Large (24px).

### Inputs / Fields
* **Style:** Curved edges (8px radius), Slate Page background, Slate Border outline.
* **Focus:** Sky Blue border outline with inset focus glow.

## 6. Do's and Don'ts

### Do
* **Do** use uppercase monospace text purely for part numbers, cost fields, and registry IDs.
* **Do** use distinct background tints to highlight table sections.
* **Do** apply `active:scale-[0.98]` transitions on buttons to provide tactile feedback.

### Don't
* **Don't** use neon-cyan linear gradients or wireframe grid patterns behind dashboards.
* **Don't** add arbitrary absolute crosshair `+` signs to container corners.
* **Don't** place mock system tags like `[SYS-01]` or `[notice]` in text headers.
* **Don't** combine a solid card border with heavy, wide box-shadows.
