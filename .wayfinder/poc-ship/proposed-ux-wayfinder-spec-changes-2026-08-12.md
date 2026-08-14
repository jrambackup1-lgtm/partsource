# Proposed Wayfinder/spec changes — UX decision phase — 2026-08-12

Status: proposal updated with Jay's decisions. Not implementation authority. No implementation tickets created.

Source decision synthesis:

- `research/ux-decision-challenge-synthesis-2026-08-12.md`
- `ux-exact-identifier-recovery-decisions-2026-08-12.md`

## Jay decisions recorded

- First engineer job: exact identifier recovery and confirmation.
- Next UX focus: deterministic interpretation trace.
- Unit/terminology depth: define fully for the selected POC families before adding more families.
- Smart filters: deterministic only; show valid values; remove or disable impossible values; never hide constraints silently.
- Comparison: keep comparison-ready result rows for now; no separate compare mode.
- Provenance: source/origin per record and relevant fact or identifier mapping; no generic verified badge.
- Exact identifier states: unique → highlight; unknown → no highlight; non-unique → no highlight + clear state; never fuzzy-select.
- Validation gate before implementation changes: deterministic benchmark + browser tests + adversarial cases + domain review.

## Proposed Wayfinder direction

Create a new post-POC UX validation frontier only if Jay explicitly authorizes it.

Do not reopen completed POC implementation tickets 32–38.

Destination candidate:

Define exact identifier recovery and confirmation for the deterministic catalog navigator without changing the runtime boundary.

Non-negotiable route:

`query → catalog level → family → filters → result list`

## Proposed decision tickets

These are decision tickets, not implementation tickets.

1. Define exact identifier recovery and confirmation

Question:

How should an engineer recover and confirm a catalog record from an exact identifier while preserving catalog level, family, filters, result list, provenance, and explicit user selection?

2. Define deterministic interpretation trace scope

Question:

Should PartSource add a structured resolver trace showing what was recognized, applied, rejected, and why it stopped?

Allowed content:

- original query;
- recognized tokens;
- catalog level/family;
- active typed filters;
- unsupported terms;
- conflicts;
- exact-ID cardinality;
- stop reason.

Banned content:

- AI explanation;
- confidence score;
- “best match”;
- recommendation;
- inferred suitability.

3. Define unit/terminology model depth for selected POC families

Question:

What unit/terminology fields must exist for the selected POC families before PartSource expands to more families?

Candidate fields:

- original value;
- normalized value;
- unit;
- relation type: exact/range/min/max/nominal;
- datum;
- family applicability.

4. Define deterministic smart-filter scope

Question:

Which deterministic smart-filter behavior is safe and useful without hidden inference?

Options:

- result counts only;
- disabled impossible values;
- range/min/max semantics;
- zero-state explanation.

Hard limits:

- no silent recovery;
- no auto-dropping constraints;
- no ranking;
- no inferred missing values.

5. Define comparison-ready result-row boundary

Question:

What typed fields must result rows show to support first-pass confirmation without adding a separate compare mode?

Hard limits:

- no cross-family equivalence;
- no replacement/substitute language;
- no shortlist/cart/BOM creep.

6. Define provenance depth for exact identifier recovery

Question:

What provenance is required per catalog record and per relevant fact or identifier mapping?

Candidate levels:

- bundle/source-level;
- field-level;
- original/normalized dual display;
- import/release timestamp;
- missing/conflict state;
- identifier mapping provenance separate from technical fact provenance.

7. Define exact identifier state vocabulary

Question:

What deterministic exact identifier states should PartSource expose?

Required states:

- unique exact;
- unknown;
- non-unique.

Hard limit:

Only unique supported mappings can highlight. Unknown and non-unique identifiers do not highlight. No state auto-selects. Never fuzzy-select.

8. Define validation gate before implementation changes

Question:

What validation is required before any UX decision becomes implementation work?

Required gate:

- deterministic benchmark;
- browser tests;
- adversarial cases;
- domain review.

## Proposed spec themes

Prepare later only after Wayfinder decisions close:

1. Deterministic interpretation trace.
2. Deterministic identity-state vocabulary.
3. Unit/terminology truth model.
4. Smart-filter constraints.
5. Same-family comparison boundary.
6. Provenance model for real source data.
7. Accessibility/dense-table acceptance rules.

## Rejected from proposed spec

Do not include:

- runtime AI/agents;
- non-exact auto-selection;
- fuzzy ID selection;
- supplier/pricing/availability/procurement/BOM;
- equivalence/replacement/substitute claims;
- generated CAD;
- confidence/verified/approved badges;
- raw supplier facets;
- global infinite results.

## Existing POC impact

No change.

The existing POC remains complete evidence for the current deterministic catalog navigator.
