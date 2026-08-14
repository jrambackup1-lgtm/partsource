# AGENTS.md — PartSource

## Repo type

Research vault and development project for PartSource, a deterministic mechanical-component catalog navigator.

## Current authority

1. `research/product-contract.md` — sole current product contract.
2. `research/prd.md` — current product requirements.
3. `SPEC_CONFIRMATION.md` — concise current product specification.
4. `CONTEXT.md` — current domain language.
5. `research/data-source-register.md` — source permission and ingestion gate.
6. `.wayfinder/poc-ship/poc-ship-map.md` — decision history and current planning frontier.

The current product flow is:

`query → catalog level → family → filters → result list`

Exact ID keeps family and result-list context and highlights the matching item. Non-exact search never auto-selects.

## Historical material

All other research plans, checklists, prototypes, dated reports, and archived files are evidence or history unless a current authority file links them for a specific fact.

Historical material does not change product behavior, scope, claims, implementation priority, or completion state.

Do not treat old resolver, runtime-agent, ambiguity, missing-fact, conflict, BOM, equivalence, supplier-handoff, pSEO, or isolated-part-page directions as current.

## Runtime boundary

No AI or agents run in PartSource. Agents are development and orchestration tools only.

Do not start `/to-spec` without Jay's explicit confirmation.
