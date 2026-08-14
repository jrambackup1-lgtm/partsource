# 008 — bounded intent-adaptive resolver

> **HISTORICAL THROWAWAY PROTOTYPE.** Do not use its resolver, ambiguity, missing-data, conflict, isolated-result, or agent states as current product behavior. See `../../research/product-contract.md`.

Throwaway behavioral prototype for Wayfinder Ticket 30. It is not production UI, a reviewed catalog, or mechanical validation.

## Question

Can one resolver help an engineer understand the current discovery state, unknowns, and next safe action within the first 15 seconds?

## Open

Start a local server from the repository root:

```bash
python -m http.server 8765 --bind 127.0.0.1 --directory sketches/008-bounded-intent-adaptive-resolver
```

Open:

```text
http://127.0.0.1:8765/index.html?case=broad
```

The test harness at the bottom exposes stable URL states for:

- broad intent;
- constrained intent;
- exact ID zero, one, and many;
- ambiguous input;
- missing data;
- conflicting facts;
- plausible but absent record;
- unsupported scope;
- model unavailable;
- fixture unavailable.

## Model

One shell adapts its hierarchy by intent:

- broad/constrained text → preserved constraints, agent proposals, family interpretation, bounded candidates;
- exact identifier → namespace-aware zero/one/many mapping first;
- conflict/unsupported/failure → no candidates and one fail-closed next action.

Three simulated bounded agent roles exist:

1. terminology interpreter;
2. interpretation critic;
3. question writer.

Their outputs are deterministic interaction fixtures tied to input spans. They cannot create facts, resolve identity, change gates, select a candidate, or enable downstream actions.

The fixture bundle contains 24 clearly synthetic records across three illustrative fastener family profiles. It is not a catalog release.

## Browser acceptance test

With dependencies already installed under `web/node_modules`:

```bash
NODE_PATH="$PWD/web/node_modules" node sketches/008-bounded-intent-adaptive-resolver/browser-test.cjs
```

The test runs Chromium against the local URL and checks routing, constraint carry-over, truth ownership, zero/one/many identity, conflicts, blank input, multi-ID conflict, fail-closed state changes, no auto-selection, user-created snapshot, URL history, hostile text, 320 px composition, keyboard focus, console errors, and external requests.

Screenshots are written to `screenshots/`.

## Boundaries

- No production app or backend integration.
- No live model or live catalog.
- No mechanical correctness, suitability, equivalence, approval, stock, or availability claim.
- No BOM, supplier, export, account, deployment, or public-release action.
- No persistence beyond in-memory prototype state and URL fixture state.
- No `/to-spec`.

See `critique.md` for what the artifact proves and does not prove.
