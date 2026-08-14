# PartSource.io

PartSource is a deterministic mechanical-component catalog navigator.

`query → catalog level → family → filters → result list`

Exact ID keeps catalog context, opens the relevant result list, and highlights the matching item. The user selects what to open. Non-exact search never auto-selects.

## Current product documents

- `research/product-contract.md` — product authority.
- `research/prd.md` — current product requirements.
- `SPEC_CONFIRMATION.md` — concise current product specification.
- `CONTEXT.md` — current domain language.
- `research/data-source-register.md` — source permission gate.
- `.wayfinder/poc-ship/poc-ship-map.md` — decision history and current planning frontier.

Old plans, prototypes, and dated research are historical evidence. They do not define current product behavior.

## Quick start

```bash
cd web
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The progressive synthetic POC is locally verified only. It is not authorized for deployment, publication, or external access.

## Repo layout

```text
partsource/
├── web/              # Local progressive catalog POC
├── archive/          # Superseded runtime and planning evidence
├── research/         # Current authority plus preserved historical evidence
├── AGENTS.md         # Workspace authority index
├── DESIGN.md         # Design system
└── PRODUCT.md        # Current product context
```
