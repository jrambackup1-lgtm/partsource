# PartSource — Web App

Industrial hardware research tool. Review standard-fastener specifications, build BOMs, export, and open supplier searches for independent verification.

## Prerequisites

- **Node.js** >= 18 (tested with 22.x)

## Quick Start

### One-time setup

```bash
# From the web/ directory
npm ci
```

This installs the frontend and test dependencies.

### Run locally

```bash
npm run dev
```

Starts the Vite app at http://localhost:3000.

## Supplier searches

Supplier links are search handoffs, not offers, listings, or confirmed matches. Verify identity, price, availability, and specifications on the supplier site. Catalog items enter the BOM with no selected supplier and no invented cost; imported costs are preserved.

## Project Structure

```
web/
├── src/
│   ├── components/    # UI components (Sidebar, Header, Footer, etc.)
│   ├── contexts/      # Currency context (USD/EUR/GBP/CAD switching)
│   ├── hooks/         # BOM state management, CSV import/export, PDF
│   ├── lib/           # Parts database, Fuse search, parser, suppliers
│   ├── pages/         # Route pages (Home, PartDetail, Admin, WidgetEmbed)
│   └── App.tsx        # Root app with routing
├── scripts/
│   ├── scraper_server.py   # Zoro live-pricing scraper (Python)
│   ├── run-scraper.mjs      # Node launcher for the scraper
│   ├── setup.sh / setup.ps1 # Environment bootstrap
│   └── generate-sitemap.ts # Sitemap generator
├── requirements.txt  # Python deps for the scraper
├── .env.example      # Config template
└── package.json
```

## Scripts

| Command              | Description                                    |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Frontend only                                  |
| `npm run build`      | Production build                               |
| `npm run lint`       | TypeScript type-check (`tsc --noEmit`)         |
| `npm test`           | Unit/integration and production-contract tests |
| `npm run test:browser` | Launch-critical Playwright flows             |
| `npm run sitemap`    | Generate sitemap XML for SEO                   |
| `npm run clean`      | Remove build artifacts                         |

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, Radix UI
- **Search**: Fuse.js (client-side fuzzy search)
- **BOM**: localStorage persistence, PapaParse CSV, jsPDF PDF export
