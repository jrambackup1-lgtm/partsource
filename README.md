# PartSource.io

Industrial hardware research tool. Review standard-fastener specifications, build Bills of Materials, export, and hand off searches to supplier sites for independent verification.

## Quick Start

```bash
cd web
npm ci                       # one-time bootstrap
npm run dev                  # start frontend
```

Open [http://localhost:3000](http://localhost:3000).

See [`web/README.md`](web/README.md) for full documentation.

## Deployment

The canonical production target is GitHub Pages:
https://jrambackup1-lgtm.github.io/partsource/

`partsource.io` is a future custom domain, not the current production host. Keep
the `/partsource/` Vite base path and GitHub Pages URLs until the domain is
purchased and configured.

## Repo Layout

```
partsource/
├── web/              # React app + Python scraper
├── research/         # Product research, PRD, market analysis
├── AGENTS.md         # Agent workspace reference
├── DESIGN.md         # Design system tokens
└── PRODUCT.md        # Product context
```
