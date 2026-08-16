# Direct-engineer validation proxy

**Date:** 2026-08-15
**Decision:** **PROXY-CLOSED; EXTERNAL-HUMAN GATE OPEN**
**Authority:** Automated evidence only. This report does not represent an interview, observation, endorsement, mechanical review, or usability result from a practicing engineer.

## Bounded purpose

The Phase 6 (user Phase 7) proxy asks whether the deterministic release candidate can execute the scenarios intended for later engineer sessions without unsafe selection or scope expansion. It is the strongest repeatable substitute currently available; it cannot answer whether engineers understand, prefer, trust, or repeatedly value the workflow.

## Scenario results

| Intended engineer scenario | Automated proxy and observed result | Proxy status | Human evidence still required |
|---|---|---|---|
| Broad discovery | `screws` preserves broad context, exposes three families, and selects nothing | PASS | Can an engineer identify the useful family without coaching? |
| Family discovery | Drive-qualified family queries enter the correct family table; broad head-only aliases fail closed | PASS | Are labels and boundaries mechanically natural? |
| Dimensional narrowing | Typed diameter/pitch/length/material constraints apply deterministic AND filtering and facet counts | PASS | Is this faster/clearer than the participant's normal method? |
| Exact-ID confirmation | Unique `PSYN-SCR-0006` opens family context and highlights one row without selection/detail | PASS | Can participants quickly explain highlight versus selection? |
| Explicit selection | Click/Enter selects and opens detail while retaining list context | PASS | Does detail support a real decision without false confidence? |
| Near-variant comparison | Aligned family table and deterministic ordering expose adjacent synthetic variants | PASS as interaction proxy | Which columns matter in real work, and is explicit compare needed? |
| Unknown/collision/conflict | Unknown and non-unique IDs, conflicting facts, unsupported terms, and empty filters produce no highlight/selection/fallback | PASS | Do users understand the state and safe next action? |
| Provenance and release identity | Synthetic source state plus catalog `releaseId`/SHA-256 digest are visible; claim-level evidence is available | PASS as discoverability proxy | Can users find and correctly interpret evidence limits? |
| Keyboard/mobile continuity | Playwright covers keyboard activation and narrow-screen flows; runtime boundary stays closed | PASS as automation proxy | Manual screen-reader, forced-color, zoom/reflow, and assistive-technology review remain open |

Evidence commands: `npm run test:catalog`, `npm run test:browser`, and `npm run test:boundary`, all included by `npm run release:audit`. The browser suite contains eight tests. The data is synthetic and patterned; scenario success is not mechanical correctness.

## Gate disposition

Automated gates establish deterministic behavior, fail-closed safety, and a testable participant surface. They do **not** establish the Phase 6 human outcomes: majority unfacilitated completion, repeated-use value, parity with normal workflow, correct participant explanation, zero confident false human selections, or a reusable next artifact.

**OPEN external-human gate:** recruit 6–8 practicing mechanical engineers using recent participant-owned, safely redacted tasks; record facilitation, task completion, timing versus normal workflow, highlight/selection and known/unknown comprehension, false selections, repeated-use case, and next artifact. Until that evidence exists, direct-engineer validation is not passed and expansion must not be justified from this proxy.
