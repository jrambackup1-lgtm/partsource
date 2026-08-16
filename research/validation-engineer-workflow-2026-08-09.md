# Real-engineer workflow validation

Date: 2026-08-09

## Verdict

The proposed workflow is directionally sound, but the current application and prototypes are not ready for direct validation. They can create false confidence by silently correcting, inventing, carrying over, or omitting engineering facts. The minimum defensible product outcome is a configuration research packet that preserves the input and separates interpreted facts, unresolved items and conflicts; identifies family and configuration; records source status and release identity; and supports a safe BOM/supplier handoff.

## Validation method/limits

This is a review of observed application and prototype behavior against the information and trust needs of an engineering configuration workflow. It classifies what the artifacts demonstrate and turns the gaps into a direct-user test plan. It does not establish task frequency, pain severity, time savings, adoption, or commercial value. No direct interviews or user tests were conducted, and prototype logic that is fixed or hard-coded must not be treated as evidence of resolver performance.

## Evidence

- The live application silently mapped an explicit **M4×1.5** input to **M4×0.7**.
- Unsupported text was assigned the label **Custom Fastener**, and an unknown identifier shape was used to infer a family.
- Alloy steel, brass, and left-hand-thread facts were dropped.
- Supplier actions remained enabled for nonsensical input; an arbitrary query was called a part number.
- The application showed a generic **SCALE 1:1** schematic and unsupported currency.
- Prototype 002 repeated the pitch conflict and leaked stale state: absent part `91290A999` inherited **12 mm** and unrelated M4 rows.
- Prototype 003 presented a broader, more honest resolver, but its behavior was fixed/hard-coded.
- Prototype counts represented source rows, not a reviewed release.
- The exact passport was the strongest trust-oriented composition reviewed.

## Fundamental requirement

A valid workflow must never silently replace an explicit engineering fact. It must preserve original input, distinguish extracted or interpreted facts from assumptions, expose conflicts and unknowns, maintain family/configuration identity, show source and review status, identify the released configuration, prevent stale-state leakage, and block BOM selection or supplier handoff while material unknowns remain.

## Strong hypothesis

Engineers will prefer a traceable configuration research packet over a superficially complete answer when the packet makes evidence, uncertainty, conflicts, and release status inspectable. The exact-passport composition is the strongest current basis for testing that hypothesis.

## Opportunity / gold idea

Make the durable output—not an instant match—the product: an exact configuration passport that joins preserved input, normalized facts, source citations and status, explicit conflicts, unresolved questions, family/configuration identity, release identity, and a gated BOM/supplier handoff. A differences-only comparison can accelerate review, provided it cannot hide unknowns or permit selection before they are resolved.

## Nice-to-have

Geometry can support recognition and comparison as an experimental aid. It should remain clearly labeled, non-authoritative, and secondary to sourced configuration facts until independently validated.

## Open question

- How often do engineers perform this task, and which cases consume the most time?
- Which errors or omissions create meaningful rework, delay, quality, or procurement cost?
- Does the packet reduce time-to-reviewed-configuration without reducing accuracy?
- Which unknowns must block selection, release, BOM export, or supplier contact?
- What evidence and review state are required before users trust family and configuration identity?
- Will teams adopt and pay for this workflow, and who owns the budget?

## Risk

The principal risk is false authority: polished labels, diagrams, counts, prices, supplier controls, or part-number language can make unsupported output look released. Silent normalization, dropped constraints, stale-state inheritance, and hard-coded prototype behavior could produce wrong procurement or design decisions while overstating validation progress.

## Rejected

- Treating the current live application as validation-ready.
- Treating silent pitch substitution as acceptable normalization.
- Inferring family or part identity from arbitrary text or identifier shape without evidence.
- Enabling supplier or BOM actions for nonsense, conflicts, or unresolved material facts.
- Presenting generic geometry, scale, currency, row counts, or hard-coded resolver output as verified engineering truth.
- Calling source-row counts a reviewed release.
- Using prototype behavior as proof of user demand or business value.

## Direct-user test plan

1. Recruit practicing engineers and adjacent BOM/procurement reviewers who perform configuration research; record role and recent task context without claiming representativeness.
2. Give each participant realistic cases that include a valid known part, an unknown identifier, explicit **M4×1.5**, left-hand thread, alloy steel/brass constraints, conflicting sources, absent `91290A999`, and nonsensical input.
3. Establish a reviewed answer key and critical-fact checklist before testing.
4. Compare the participant's current workflow with an exact-passport prototype. Measure completion time, critical-fact accuracy, conflict/unknown detection, inappropriate selection or handoff attempts, confidence calibration, and review effort.
5. Require participants to explain what they believe is sourced, inferred, unresolved, selected, and released. Test whether differences-only views hide unknowns.
6. Test persistence by switching cases, clearing inputs, reopening records, and confirming that no dimensions, M4 rows, sources, or release state leak between configurations.
7. Interview only after task completion about frequency, consequences of failure, current workaround, willingness to change, ownership, and value; report these as user evidence, not artifact evidence.
8. Advance only if participants can produce a correct, traceable packet with no critical silent substitutions or stale-state contamination, and if measured task gain and pain justify continued investment.

## Recommended prototype corrections

1. Preserve and display verbatim input beside normalized interpretation; never overwrite explicit facts.
2. Represent every field with value, provenance, confidence/status, and conflict state. Retain alloy steel, brass, handedness, pitch, and other constraints.
3. Remove unsupported fallback labels and identifier-shape family inference; use **unknown** until sourced.
4. Reset all case-specific state on input change and add regression tests for `91290A999`, inherited **12 mm**, and unrelated M4 rows.
5. Block configuration selection, BOM export, supplier contact, and release while critical conflicts or unknowns remain.
6. Separate source rows from reviewed candidates and released configurations; show an explicit release identity and reviewer state.
7. Remove or clearly label unsupported scale, generic schematics, currency, prices, part-number claims, and supplier actions.
8. Rebuild prototype 003 with real data and resolver behavior before testing it; disclose any remaining fixtures.
9. Use the exact passport as the primary test surface. Keep geometry experimental and allow differences-only views only when unresolved facts remain visible and gating still applies.
10. Instrument direct-user tests for accuracy, time, review effort, confidence calibration, and blocked unsafe actions before making product or business claims.
