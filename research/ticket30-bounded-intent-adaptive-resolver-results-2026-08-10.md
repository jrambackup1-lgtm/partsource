# Ticket 30 — bounded intent-adaptive resolver result

> **HISTORICAL PROTOTYPE RESULT.** Preserve test and review evidence. The resolver model and its special workflows are superseded by progressive catalog navigation.

**Date:** 2026-08-10  
**Ticket:** `.wayfinder/poc-ship/tickets/30-prototype-bounded-intent-adaptive-resolver.md`  
**Result:** **PASS — behavioral-prototype scope only**  
**Direct-user validation:** 0  
**Qualified mechanical approval:** 0  
**`/to-spec`:** not started

## Progressive catalog correction

No AI or agents run at runtime.

Agents are development and orchestration tools only.

Keep Direction A and the Ticket 30 shell, dataset, responsive, selection, provenance, and fail-closed scope.

Runtime flow:

`query → catalog level → family → filters → result list`

Exact ID opens the same family result list and highlights the exact item. It does not open an isolated part page.

The old ambiguity, missing-fact, conflict, isolated-result, and agent workflows below are historical prototype evidence. They are not product architecture.

## Decision

Direction A is coherent enough as an interaction and truth-state model to reach the Ticket 30 acceptance gate.

This result does not show that an engineer understands it within 15 seconds. No practicing engineer used the artifact.

It also does not approve production implementation, product-contract changes, source publication, mechanical claims, deployment, outreach, or `/to-spec`.

## Artifact

- `sketches/008-bounded-intent-adaptive-resolver/index.html`
- `sketches/008-bounded-intent-adaptive-resolver/browser-test.cjs`
- `sketches/008-bounded-intent-adaptive-resolver/README.md`
- `sketches/008-bounded-intent-adaptive-resolver/critique.md`
- desktop and 320 CSS px screenshots under `sketches/008-bounded-intent-adaptive-resolver/screenshots/`

The artifact is one standalone resolver shell with:

- 24 clearly synthetic records;
- three illustrative fastener family profiles;
- strict exact-ID zero/one/many fixtures;
- deterministic parsing and routing;
- three simulated bounded agent roles;
- explicit truth origins;
- explicit candidate choice and discovery-snapshot creation;
- no production or external-service dependency.

## Specialist method

Three specialist lanes reviewed the interaction before implementation:

1. mechanical-engineering UX;
2. mechanical-data and authority safety;
3. skeptical acceptance testing.

The finished artifact then went through repeated independent specialist red-team review.

The reviewers returned FAIL three times before the final PASS.

### Failures found and fixed

1. Blank input inherited a fixture clue and false supplied provenance.
2. Two identifiers used the first mapping instead of conflicting.
3. Some states named multiple or unavailable next actions.
4. The required critique was absent.
5. Blank and generic clues received canned agent spans not present in the input.
6. Constrained intent named a reject action without a reject control.
7. Incompatible URL `case` and `q` values could manufacture an exact mapping or socket-family proposal.
8. The mobile fact ledger kept a desktop-width value column and wrapped identifiers badly.

Each failure became a behavior or regression check.

## Executed test result

Command:

```bash
NODE_PATH="$PWD/web/node_modules" node sketches/008-bounded-intent-adaptive-resolver/browser-test.cjs
```

Final result:

- 22 scenario groups;
- 138 assertions;
- 0 failures;
- 0 console errors;
- 0 uncaught page errors;
- 0 external requests.

A final independent specialist re-ran the official suite, exercised adversarial URL state and browser history, inspected the artifact, and returned **PASS** with no behavioral-prototype blocker.

## Required cases

| Case | Result | Key behavior |
|---|---|---|
| Broad intent | PASS | M4 remains supplied/parsed; three bounded family interpretations; no candidate auto-selection |
| Constrained intent | PASS | Socket-family proposal remains agent-owned and span-anchored; M4 carries into four synthetic records after user acceptance |
| Exact ID — one | PASS | One mapping is visible but unselected; snapshot needs two explicit user actions |
| Exact ID — zero | PASS | No nearby substitution; zero is scoped to the loaded fixture |
| Exact ID — many | PASS | Both mappings stay visible; selection is blocked; no first-row winner |
| Ambiguous input | PASS | Interpretation remains proposed; generic ambiguity creates no canned family or agent output |
| Missing data | PASS | Missing fields stay missing; blank input stays blank and produces no proposal |
| Conflict | PASS | Every thread, length, or identifier occurrence remains visible; no winner |
| Plausible but absent | PASS | Fixture zero does not become invalidity or availability claim |
| Unsupported scope | PASS | Clue remains unchanged; no nearby fastener reinterpretation |
| Model unavailable | PASS | Deterministic M4 remains; no fallback agent guess or stale candidate |
| Fixture unavailable | PASS | Identity is not evaluated; prior candidate, selection, and snapshot are cleared |

## Invariants verified

### Intent routing

- Rough text uses family/clarification hierarchy.
- Exact IDs use namespace-aware mapping hierarchy.
- Custom URL clues cannot be forced through an incompatible fixture case.
- Browser back/forward re-runs deterministic routing when `q` exists.

### Constraint carry-over

- Supplied M4 remains visible before and after family acceptance.
- Every resulting candidate retains M4.
- Family acceptance never selects a candidate.

### Truth states

The artifact keeps these states distinct:

- supplied;
- parsed;
- agent proposal;
- missing;
- conflicting;
- unsupported;
- fixture-scoped zero/one/many;
- model unavailable;
- fixture unavailable.

### Deterministic facts

- Thread, length, identifier occurrence, and namespace parsing use named deterministic rules.
- Duplicate/conflicting occurrences coexist.
- Blank text is missing, not supplied.
- Identifier mapping cannot be restored from an incompatible URL case.

### Fail-closed behavior

- Blank, conflict, unsupported, model-failure, fixture-failure, identifier collision, and incompatible URL states expose no unsafe candidate action.
- State changes clear stale candidate choice and snapshot.
- One mapping does not mean auto-selection.

### Agent authority

The three simulated roles can propose, challenge, and ask.

They cannot:

- create a supplied or deterministic fact;
- cite a span absent from the clue;
- resolve identity;
- change the zero/one/many gate;
- select a family or record;
- create a discovery snapshot;
- enable engineering or commercial actions.

### Modern minimal UX

- One resolver, no dashboard or chatbot.
- Calm hierarchy: state, original clue, bounded choices, fact ledger, agent work, one next action.
- No KPI cards, confidence badges, agent avatars, supplier/commerce surfaces, or fake geometry.
- Desktop and 320 CSS px pass without page overflow or wide-table shrinkage.
- Fact origins remain visible at narrow width.
- Keyboard focus is visible.

## Ticket 30 acceptance

| Gate | Result |
|---|---|
| One shell adapts to rough text and exact IDs | PASS |
| Supplied facts never become agent-owned | PASS |
| Conflicts and zero/one/many stay visible | PASS |
| Each state has one precise action or abstention | PASS |
| Candidate choice is explicit; no auto-selection | PASS |
| Output is discovery snapshot, not approval | PASS |
| Desktop and 320 CSS px work | PASS |
| Critique records proof, limits, and next test | PASS |
| Prototype-only hard stop maintained | PASS |

## What this proves

Only that a deterministic, bounded interaction can represent Direction A coherently and fail closed across the exercised fixture states.

## What this does not prove

- 15-second engineer comprehension;
- real user value, demand, repeat use, or willingness to pay;
- mechanical correctness or suitability;
- family-profile validity;
- source permission or catalog-release readiness;
- live-model quality, latency, injection resistance, or outage behavior;
- backend, persistence, concurrency, or production readiness;
- permission to begin `/to-spec`.

## Gate conclusion

**Ticket 30: PASS.**

Stop here.

There is no approved next execution ticket. Jay must decide whether to proceed, revise, or reject based on this artifact. That decision is separate from Ticket 30 and must not be converted automatically into `/to-spec` or a production backlog.
