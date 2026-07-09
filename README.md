# PartSource.io

Industrial hardware sourcing tool. Search standard fasteners, compare vendor pricing across 5 distributors, build Bills of Materials, and consolidate orders.

## Quick Start

```bash
cd web
bash scripts/setup.sh        # one-time bootstrap (Git Bash)
npm run dev:all              # start frontend + scraper
```

Open [http://localhost:3000](http://localhost:3000).

See [`web/README.md`](web/README.md) for full documentation.

## Repo Layout

```
partsource/
├── web/              # React app + Python scraper
├── research/         # Product research, PRD, market analysis
├── AGENTS.md         # Agent workspace reference
├── DESIGN.md         # Design system tokens
└── PRODUCT.md        # Product context
```
