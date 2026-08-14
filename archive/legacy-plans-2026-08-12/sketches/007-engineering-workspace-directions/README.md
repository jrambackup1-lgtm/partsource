# 007 — Engineering workspace directions

Decision artifact for the Validation + Targeted Ideation Gate. It is not production UI and contains illustrative states only.

Open:

- `index.html?v=queue&case=ambiguity`
- `index.html?v=identity&case=exact`
- `index.html?v=refine&case=ambiguity`
- `index.html?v=diff&case=conflict`

## Question

Can PartSource reduce mechanical decision effort without hiding technical truth?

## Directions

- `queue`: groups work by the next safe action. Tests the BOM-readiness shell.
- `identity`: keeps the submitted identifier separate from the released configuration.
- `refine`: asks only family-relevant next questions while preserving fixed facts.
- `diff`: compares remaining candidates by meaningful differences and unknowns.

## Decision

Use one shared decision-state model. Keep the queue as the multi-line shell, identity as a separate mapping view, refinement only where one missing fact controls the next branch, and differences-only comparison for coherent candidates. Keep exact-ID work compact.

## Boundaries

- Fixture copy is illustrative, not released catalog truth.
- A sole candidate is not automatically selection-ready.
- No equivalence, suitability, stock, price, availability, or approval claim.
- No production implementation before explicit direction approval and `/to-spec`.
