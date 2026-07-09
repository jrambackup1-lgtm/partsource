# PartSource — Web App

Industrial hardware sourcing tool. Search standard fasteners, compare vendor pricing, build BOMs, and consolidate orders across distributors.

## Prerequisites

- **Node.js** >= 18 (tested with 22.x)
- **Python** >= 3.10 with `venv` support (only needed for the optional live-pricing scraper)

## Quick Start

### One-time setup

```bash
# From the web/ directory
bash scripts/setup.sh        # Git Bash / WSL
powershell scripts/setup.ps1 # PowerShell
```

This installs Node dependencies, creates a Python venv, and installs the scraper's Python packages.

### Run everything

```bash
npm run dev:all
```

Starts both the Vite dev server (http://localhost:3000) and the optional Zoro pricing scraper (http://localhost:3001) together.

### Run individually

```bash
npm run dev       # Frontend only (port 3000)
npm run scraper   # Scraper only (port 3001)
```

## How Pricing Works

The app is **fully functional without the scraper**. Prices are computed client-side from a seeded parts database and heuristic estimation. The scraper is an enhancement: when it's running and Zoro responds, the part detail page shows a "Live Zoro Pricing" badge with real-time prices. When the scraper is off or blocked, the app silently uses computed fallback prices.

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
| `npm run dev:all`    | Start frontend + scraper together               |
| `npm run dev`        | Frontend only                                  |
| `npm run scraper`    | Scraper only                                   |
| `npm run build`      | Production build                               |
| `npm run lint`       | TypeScript type-check (`tsc --noEmit`)         |
| `npm run sitemap`    | Generate sitemap XML for SEO                   |
| `npm run clean`      | Remove build artifacts                         |

## Environment Variables

| Variable            | Default                      | Description                         |
| ------------------- | ---------------------------- | ----------------------------------- |
| `VITE_SCRAPER_URL`  | `http://localhost:3001`       | Scraper API base URL                |
| `SCRAPER_PORT`      | `3001`                       | Port the scraper listens on         |

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, Radix UI
- **Search**: Fuse.js (client-side fuzzy search)
- **BOM**: localStorage persistence, PapaParse CSV, jsPDF PDF export
- **Scraper** (optional): Python, Scrapling for Zoro live pricing
