# Validation: UX reimagination

**Date:** 2026-08-09  
**Phase:** Validation + Targeted Ideation Gate  
**Status:** Specialist-led desk exploration and prototype. Not user validation, a design specification, or approval to edit production.

## Verdict

**Opportunity / gold idea:** Replace the current result-list funnel with a persistent **engineering decision queue**. Each input becomes an inspectable state with one next safe action: identify the clue, resolve the family, complete a required fact, review a conflict, freeze a configuration packet, or stop.

**Strong hypothesis:** The modern interaction is not fewer technical facts. It is less repeated truth, clear fact states, progressive access to evidence, and a stable connection from raw input to frozen handoff.

**Risk:** A calmer interface can create false confidence if it hides unknowns, applicability, source limits, or the distinction between a candidate row and a selected released configuration.

**Rejected:** A cosmetic dashboard redesign, generic AI chat, badge-based confidence, a universal result card, or a dramatic geometry canvas before domain profiles and real-task evidence exist.

Prototype: `sketches/007-engineering-workspace-directions/index.html`

## What was investigated

### Evidence

- Current PartSource spreads one engineering line across search suggestions, generic cards, a part page, local BOM controls, and supplier buttons. The user must reconstruct what the system understood and what remains unresolved.
- The current app maps missing pitch and length to `N/A`, converts source rows to a common `Part` shape, and routes broad input toward a part detail page. This compresses distinct truth states.
- Existing 003 and 004 prototypes proved that broad, family, exact-ID, and comparison intents need different compositions.
- The workflow, search, trust, and competitor validations converge on the same durable primitives: raw clue, constraint ledger, unresolved facts, conflict states, release identity, abstention, and a frozen packet.
- Dense mechanical interfaces are not automatically bad. Density is rational when experts must scan many comparable variants. PartSource must remove repeated or irrelevant information, not engineering information.
- No direct engineer has tested the 007 prototype. Visual and interaction inspection is desk evidence only.

## Fundamental interaction model

### Fundamental requirement

Every work item must preserve:

1. the verbatim input;
2. the interpreted identifier, family, and facts;
3. unresolved and conflicting facts;
4. the active release and mapping/configuration state;
5. the next action that can safely change the state;
6. the frozen output, if selection becomes valid.

### Fundamental requirement

Selection, BOM freeze, and alternate-supplier handoff stay blocked while a family-required fact is unresolved, conflicting, unreviewed, withdrawn, or outside the active release.

### Fundamental requirement

The interface must distinguish at least:

- supplied;
- deterministically parsed;
- user chosen;
- supported by released evidence;
- unknown;
- not applicable;
- conflicting;
- outside release;
- withdrawn;
- service unavailable.

### Fundamental requirement

The UI must expose technical notation exactly as supplied beside any normalized value. Unit conversion, parser output, and evidence must never silently replace the source notation.

## Four prototype directions

The prototype supports `?v=queue`, `?v=identity`, `?v=refine`, and `?v=diff`, with test cases such as `ambiguity`, `conflict`, and `exact`.

### Direction 1 — Decision queue

**Strong hypothesis:** Best shell for repeat work and the BOM-readiness challenger.

- The left rail groups unresolved lines by next safe action rather than supplier or category.
- The center owns the current decision.
- The right side keeps the original clue and current interpretation visible.
- Completion is a state transition, not a green badge.

**Risk:** The queue implies multi-line recurring work. It may overbuild the first POC if direct-user testing shows isolated exact-ID recovery is the dominant job.

### Direction 2 — Exact identity

**Opportunity / gold idea:** Keep the submitted identifier, mapping state, and released configuration as separate objects.

- The submitted clue stays verbatim.
- Exact mapping never becomes the configuration by implication.
- Mapping limits, release state, and configuration gaps remain visible.
- Exact-ID work stays compact when the released mapping is unique and complete.

**Strong hypothesis:** Separating identifier mapping from configuration truth prevents the current product from turning source identifiers into fake universal part numbers.

**Risk:** Mapping detail can feel bureaucratic for a clean exact identifier. It needs a compact default with evidence and parser detail on demand.

### Direction 3 — Family refinement

**Strong hypothesis:** Best for broad family input when one next question has high information gain.

- Ask one family-approved question at a time.
- Explain why the answer matters.
- Preserve already supplied facts and never ask again.
- Show which paths are excluded by the answer.

**Risk:** Wizard flow becomes slow if it asks questions in a fixed sequence, lacks a compact expert mode, or pretends the question order is mechanically approved before domain review.

### Direction 4 — Differences-only comparison

**Strong hypothesis:** When two or more coherent candidates remain, showing only differing and unknown facts reduces scanning without concealing selection-critical truth.

**Risk:** Differences-only must never hide a common unknown or imply equivalence. The full fact set must remain inspectable.

## Recommended composition

### Opportunity / gold idea

Use a hybrid:

- **Queue** as the multi-line or repeated-work shell;
- **Constraint ledger** as the shared truth model inside each composition;
- **Family refinement** only when one missing fact controls the next branch;
- **Exact-ID compact path** when mapping is unique and released;
- **Differences-only comparison** when two or more coherent candidates remain.

This is one state model with several compositions, not separate products.

### Strong hypothesis

The default screen should answer four questions in under five seconds:

1. What did I enter?
2. What did PartSource understand?
3. What still prevents a safe configuration?
4. What is the next safe action?

## Technical-information hierarchy

### Fundamental requirement

Display priority:

1. blocking conflict or unresolved required fact;
2. exact identifier and family state;
3. selection-critical dimensions and attributes;
4. source/release limits;
5. comparable candidate differences;
6. non-critical technical detail;
7. detailed evidence on demand.

### Opportunity / gold idea

Use **evidence-on-demand without evidence theatre**:

- concise fact-state sentence by default;
- expand to field-group origin and review scope;
- private raw lineage never appears in the browser;
- no evidence counts, confidence percentages, generic shields, or `verified` badges.

### Strong hypothesis

Technical tables remain useful after family routing. The improvement is to make rows comparable, pin differences, preserve units, and remove duplicated prose—not to replace tables with cards.

## Visual direction

### Strong hypothesis

A credible PartSource UI should feel like a modern engineering instrument:

- neutral light surface with restrained ink and one decision accent;
- compact typography with clear numeric alignment;
- monospaced identifiers and supplied notation;
- semantic color used only for blocked, unresolved, conflict, and released states;
- no decorative KPI cards, gradients, mascot copy, or fake activity;
- responsive reflow that preserves the clue, blocker, and next action before secondary evidence.

### Risk

Green currently reads as approval. Use it only for a completed released state with defined scope. A single matching candidate is not green merely because the list has one row.

## Prototype critique

### Evidence

The 007 queue composition makes the blocker and next action clear. The right rail preserves the clue and state. Density is substantially lower than the current production dashboard without discarding the core technical facts.

### Risk

- The floating variant selector overlays decision content at shorter desktop heights.
- The prototype is illustrative and does not prove keyboard order, 320 px reflow, screen-reader labels, long-token wrapping, or all state transitions.
- Example release and mapping labels are fixture copy, not current catalog claims.
- The queue count can become a vanity metric unless it maps to real unresolved work.

### Nice-to-have

- keyboard-first queue navigation;
- copyable issue packet;
- differences-only toggle;
- print-safe configuration packet;
- compact expert mode;
- accurate geometry only after measured comprehension benefit.

## Direct-engineer tests

### Open question

Does the queue reduce wrong turns and review effort compared with the current page funnel?

### Open question

Do engineers understand the difference between supplied, parsed, reviewed, and released facts without training?

### Open question

Does the compact exact-ID path feel faster than opening the original supplier page?

### Open question

Is one unresolved-question-at-a-time useful, or does it feel like slow form filling?

### Fundamental requirement

Test with recent redacted cases. Measure:

- time to a correct stopping point;
- wrong-family turns;
- silent substitutions accepted;
- unresolved facts noticed;
- confidence calibration;
- review effort;
- whether the final packet is reused in a BOM or handoff.

## Classified decision register

- **Evidence:** Existing app and prototype audits show discontinuity between clue, interpretation, result, BOM, and handoff.
- **Fundamental requirement:** Preserve the decision state and block unsafe completion.
- **Strong hypothesis:** Queue + shared constraint ledger + contextual family refinement is the best interaction system.
- **Opportunity / gold idea:** Make abstention and the next safe engineering decision useful output.
- **Nice-to-have:** Geometry, keyboard expert mode, print view, richer correction compare.
- **Open question:** Whether multi-line queue work or isolated exact lookup dominates real usage.
- **Risk:** Calm visual design can hide uncertainty and manufacture confidence.
- **Rejected:** Cosmetic SaaS dashboard, AI chat, universal result card, badge theatre, and requirement-hiding minimalism.
