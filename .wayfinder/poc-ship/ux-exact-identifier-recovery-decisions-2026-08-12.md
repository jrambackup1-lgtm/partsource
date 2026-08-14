# Wayfinder decision record — exact identifier recovery UX — 2026-08-12

Status: Jay-approved product-direction decisions for the next UX focus.

This is a Wayfinder decision record.
It is not an implementation ticket.
It does not authorize code changes.
It does not reopen the completed POC release.

## Runtime rule

Preserve:

`query → catalog level → family → filters → result list`

No runtime AI or agents.
No fuzzy selection.
No supplier, BOM, procurement, price, stock, availability, quote, checkout, equivalence, replacement, or approved alternate scope.

## Decisions

### First engineer job

Decision: exact identifier recovery and confirmation.

Meaning:

An engineer can enter an exact identifier as the query.
PartSource must show the correct catalog level, family, filters/result list context, and identifier state.
The user must be able to confirm what the identifier maps to without losing catalog context.

### Next UX focus

Decision: interpretation trace is the next UX focus.

Use a deterministic interpretation trace.
Do not use AI explanation language.
Do not use confidence scores.
Do not say “best match” or “recommended.”

The trace can show:

- original query;
- recognized identifier or terms;
- catalog level;
- family;
- active typed filters;
- unsupported terms;
- conflicts;
- exact identifier state;
- stop reason.

### Unit and terminology depth

Decision: define the unit and terminology model fully for the selected POC families before adding more families.

For selected POC families, define:

- original value;
- normalized value;
- unit;
- relation type;
- datum;
- family applicability.

Do not silently merge different meanings.
Examples:

- under-head length is not overall length;
- nominal value is not necessarily actual measured value;
- unsupported units or terms stay unsupported until explicitly modeled.

### Smart filters

Decision: deterministic smart filters only.

Allowed:

- show valid filter values;
- remove or disable impossible filter values;
- explain zero-result states from current typed constraints.

Not allowed:

- hiding active constraints silently;
- auto-dropping constraints;
- auto-broadening the query;
- inferring missing values;
- ranking values by guessed intent;
- AI or agentic filtering.

### Comparison

Decision: keep comparison-ready result rows for now.

No separate compare mode yet.

Meaning:

Result rows should carry enough family-specific typed fields for first-pass inspection.
Do not add shortlist, favorite, cart, BOM, export, or comparison workspace scope now.

### Provenance

Decision: show source/origin per catalog record and per relevant fact or identifier mapping.

No generic verified badge.
No global confidence score.
No approval/suitability/equivalence implication.

Provenance must stay attached to the fact or mapping it supports.

### Exact identifier states

Decision:

- unique exact identifier match → highlight the mapped row in context;
- unknown identifier → no highlight;
- non-unique identifier → no highlight and clear non-unique state;
- never fuzzy-select.

Highlight is not selection.
User selection remains explicit.

### Validation gate

Decision: before implementation changes, pass:

- deterministic benchmark;
- browser tests;
- adversarial cases;
- domain review.

This gate is required before any implementation changes based on these UX decisions.

## Impact on current POC

No code change now.
No implementation ticket now.
Do not reopen completed POC tickets 32–38.

The current POC remains release evidence for the existing deterministic catalog navigator.

These decisions define the next product/UX decision frontier.

## Next Wayfinder frontier

If Jay authorizes the next Wayfinder map/frontier, it should answer:

How should exact identifier recovery and confirmation work in the deterministic catalog navigator, with interpretation trace, fully defined unit/terminology for selected POC families, deterministic smart filters, comparison-ready rows, source/fact/mapping provenance, and strict exact identifier states?

The output should be product/spec decisions first, not implementation tickets.
