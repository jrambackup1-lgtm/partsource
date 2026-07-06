# Google AI Studio Prompt: Sourcing Widget Embed & SEO Rich Schema (Phase 6)

This document contains prompts to extend your Next.js application with an embeddable widget generator and structured JSON-LD product data for search engines.

---

## Stage 11: Sourcing Widget Embed Generator & Copy Snippet Panel

Copy and paste this prompt into Google AI Studio to implement the widget embed code generator.

```markdown
Please build a mock Sourcing Widget Embed Generator for **PartSource.io**.

### Features to Implement

1. **Widget Customization Control Panel**:
   - Create a settings card or tab: **Embeddable Sourcing Widget**.
   - Include the following customization controls:
     - **Default Part Number Input**: Input box to specify a McMaster part number to pre-load.
     - **Theme Style Selector**: Dropdown to select theme style (Light, Dark, High-Contrast Slate).
     - **Accent Color Picker**: Text field/color picker input for custom interactive element colors.
     - **Supplier Grid Toggle**: Checkbox to toggle whether to show the full distributor pricing matrix or just the decoded specifications grid in the embedded view.
     
2. **Dynamic Live Preview & Copyable Code Snippet**:
   - Render a mock live preview container showing how the widget looks embedded with the selected theme, accent colors, and configuration.
   - Display a text block containing the generated HTML embed code (e.g. `<iframe src="https://partsource.io/embed/[partNumber]?theme=[theme]&accent=[accent]"></iframe>`).
   - Add a "Copy Code" button with a brief "Copied!" checkmark micro-interaction to copy the code block.
```

---

## Stage 12: Structured JSON-LD Product Schema & Crawl Optimization

Copy and paste this prompt into Google AI Studio to integrate rich product schema tags for pSEO search indexing.

```markdown
Please implement dynamic JSON-LD Structured Data for product pages on **PartSource.io** to optimize Google rich search results.

### Features to Implement

1. **Structured Data Injection**:
   - In `/app/parts/[partNumber]/page.js`, construct and inject a script block of type `application/ld+json` inside the metadata header:
     - `@context`: "https://schema.org"
     - `@type`: "Product"
     - `name`: "[Part Number] Equivalent Sourcing & Specifications"
     - `description`: A dynamic text string outlining the part category, material, thread, length, and standards (e.g., "Compare prices and sourcing options for M4 Socket Cap Screw, 12mm length, Alloy Steel...").
     - `brand`: "PartSource"
     - `additionalProperty`: List of decoded specifications (Thread, Pitch, Length, Material, Finish, Standard) formatted for Google's rich product properties.
     - `offers`: An `AggregateOffer` summing up the pricing matrix:
       - `priceCurrency`: Selected currency (USD, EUR, GBP, CAD).
       - `lowPrice`: Lowest alternative supplier price in active currency.
       - `highPrice`: McMaster-Carr base price in active currency.
       - `offerCount`: Count of available alternative suppliers (e.g. 5).
       
2. **Local Schema Validation Helper**:
   - Include a hidden debug console tool or status indicator that runs a check on the generated JSON schema structure to verify that it does not contain empty values or invalid formats.
```
