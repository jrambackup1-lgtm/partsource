# PartSource progressive catalog POC

PartSource is a local deterministic mechanical-component catalog POC.

`query → catalog level → family → filters → result list`

Exact ID keeps visible family/result-list context and highlights one supported exact record. The user explicitly selects a row before detail opens. Non-exact search never auto-selects.

The POC uses a validated local synthetic bundle. It makes no external request and contains no runtime AI/agent, supplier, catalog API, BOM, procurement, ordering, or commercial workflow.

## Run locally

```bash
npm ci
npm run dev
```

## Release audit

```bash
npm run release:audit
```

Current authority is `../research/product-contract.md`. The full POC technical contract is `../docs/specs/partsource-progressive-catalog-poc.md`.
