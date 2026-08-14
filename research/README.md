# Research and Planning Index

## Current authority

1. `product-contract.md` — sole current product contract.
2. `prd.md` — current product requirements.
3. `../SPEC_CONFIRMATION.md` — concise current product specification.
4. `../CONTEXT.md` — current domain language.
5. `data-source-register.md` — source permission and ingestion gate.
6. `../.wayfinder/poc-ship/poc-ship-map.md` — decision history and current planning frontier.

Current product flow:

`query → catalog level → family → filters → result list`

Exact ID keeps family and result-list context and highlights the matching item. Non-exact search never auto-selects.

## Historical research

Every other file in `research/` is supporting evidence, dated research, a superseded plan, or development history unless a current authority file links it for one specific fact.

Historical research does not define current product behavior, claims, scope, implementation order, or completion state.

Preserve historical files. Mark old product directions as historical. Do not execute them.

Archived snapshots live under `research/archive/`.

## Implementation evidence

The shipped runtime and tests show what is implemented. They do not change the current product contract.

A runtime mismatch is a remaining implementation contradiction, not a product decision.
