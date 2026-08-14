---
title: Prototype the bounded intent-adaptive resolver
status: closed
outcome: PASS-behavioral-prototype-only
label: wayfinder:prototype
created: 2026-08-10
updated: 2026-08-10
---

> **HISTORICAL — CLOSED BEHAVIORAL EXPERIMENT.** Preserve the ticket and evidence. Its resolver, ambiguity, missing-fact, conflict, isolated-result, agent, and completion workflows do not define the current product.

## Resolution

**Progressive catalog correction — 2026-08-10:** No AI or agents run in PartSource. AI and agents are development tools only. Keep Direction A and the Ticket 30 shell, dataset, responsive, selection, provenance, and fail-closed scope. Runtime flow is `query → catalog level → family → filters → result list`. Exact ID opens the same family result list and highlights the exact item. It does not open an isolated part page. The old ambiguity, missing-fact, conflict, isolated-result, and agent workflows below are historical test evidence, not product architecture.

Ticket 30 passed its behavioral-prototype acceptance gate on 2026-08-10.

Final execution:

- 22 browser scenario groups;
- 138 assertions;
- 0 failures;
- desktop and 320 CSS px exercised;
- 0 console errors, uncaught page errors, or external requests;
- final independent specialist review: **PASS**.

The artifact is coherent as an interaction and truth-state experiment only.

It does not prove 15-second engineer comprehension, user value, mechanical truth, source permission, backend behavior, or production readiness.

No next execution ticket is approved. `/to-spec` remains blocked.

## Question

Can Direction A make an engineer understand the current discovery state, its unknowns, and the next safe action within the first 15 seconds?

## Approved product direction

Direction A — bounded intent-adaptive resolver.

The approved product promise is:

> Turn an imperfect mechanical-component clue into inspectable candidate families or records, show what is known and unknown, and help you decide what to verify next.

## Prototype scope

Create one behavioral prototype of the resolver workspace.

Test two entry paths in the same shell:

1. rough or partial mechanical text;
2. a known identifier with namespace-aware zero/one/many state.

The prototype must show:

- original clue;
- supplied facts;
- deterministic parsed facts;
- agent proposals tied to input spans;
- critic findings;
- conflicts, missing facts, and unsupported scope;
- family candidates or identifier state;
- compact candidate rows;
- differences and evidence scope;
- one reversible next action;
- user-selected discovery snapshot or useful abstention.

## Agent roles

Represent only three bounded roles:

1. terminology interpreter;
2. interpretation critic;
3. question writer.

Agents may propose, explain, challenge, and ask.

Agents may not create technical facts, default missing values, merge identity, resolve collisions, select the final candidate, or enable downstream actions.

The prototype may use deterministic agent-output fixtures to test interaction. It does not need live model orchestration yet.

## Required truth states

Exercise at least:

1. broad ambiguous text;
2. family-specific partial text;
3. exact identifier with one candidate;
4. identifier with zero candidates;
5. identifier with multiple candidates;
6. supplied-fact conflict;
7. plausible but not in the fixture bundle;
8. unsupported scope;
9. model unavailable with deterministic fallback;
10. catalog/fixture unavailable.

Do not use a known identifier fixture until its repository mapping is internally consistent and its publication boundary is explicit.

## Data boundary

Use only:

- two or three neighboring POC fastener family profiles;
- 24–40 deliberately selected permission-cleared or clearly synthetic candidate records;
- a versioned fixture bundle;
- deterministic truth-state cases.

Do not import or publish all 27,009 rows.

Do not treat ingestion buckets as families.

Do not call the fixture bundle a reviewed catalog release.

## UX requirements

- one intent-adaptive resolver, not a dashboard or chatbot;
- no KPI cards or random default configurations;
- technically calm visual language;
- compact aligned technical rows;
- explicit differences between supplied, parsed, proposed, unknown, conflicting, and unsupported;
- no agent avatars, token streams, consensus badges, or confidence percentages;
- no generic or falsely scaled geometry;
- no supplier logos or commerce surfaces;
- desktop and 320 CSS px mobile composition;
- keyboard-visible controls and non-color status meaning.

## Prohibited claims and actions

The prototype must not claim:

- correct selection or suitability;
- equivalent, alternate, replacement, or interchangeability;
- approval, certification, or qualified review;
- listing, price, stock, availability, or best supplier;
- BOM or procurement readiness;
- broad category coverage;
- agent confidence as truth.

Do not include:

- Add to BOM;
- supplier search;
- CSV/PDF batch flow;
- live unrestricted browsing;
- accounts or cloud workflow;
- production release authority.

## Acceptance

1. The same shell handles rough text and exact identifiers without forcing one through the other's ceremony.
2. Supplied facts never become agent-owned facts.
3. Conflicts and zero/one/many identity states remain visible.
4. Every state has one precise next action or an honest abstention.
5. The user explicitly chooses a candidate; the system never auto-selects.
6. The output is a discovery snapshot, not PartSource approval.
7. The prototype works at desktop and 320 CSS px without shrinking a wide table.
8. A short critique records what the prototype proves, does not prove, and which interaction should be tested next.
9. No production code, backend, public source publication, deployment, outreach, or `/to-spec` work occurs.

## Completion event

A reviewable behavioral artifact plus critique exists and Jay can decide whether the interaction is coherent enough to proceed, revise, or reject.

## Evidence

- `research/ticket30-bounded-intent-adaptive-resolver-results-2026-08-10.md`
- `sketches/008-bounded-intent-adaptive-resolver/index.html`
- `sketches/008-bounded-intent-adaptive-resolver/browser-test.cjs`
- `sketches/008-bounded-intent-adaptive-resolver/critique.md`
- `research/partsource-product-directions-reconciliation-2026-08-10.md`
- `.wayfinder/poc-ship/tickets/29-choose-partsource-product-direction.md`
- `research/modern-engineering-ux-opportunities-2026-08-09.md`
- `research/validation-ux-reimagination-2026-08-09.md`
- `research/proxy-poc-ticket25-results-2026-08-10.md`
- `research/product-contract.md`
- `CONTEXT.md`

## Acceptance result

1. Same shell adapts to rough text and exact identifiers — **PASS**.
2. Supplied facts never become agent-owned — **PASS**.
3. Conflicts and zero/one/many identity remain visible — **PASS**.
4. Every state has one precise action or abstention — **PASS**.
5. Candidate choice is explicit; no automatic selection — **PASS**.
6. Output is a discovery snapshot, not approval — **PASS**.
7. Desktop and 320 CSS px work without wide-table shrinkage — **PASS**.
8. Critique records proof, limits, and next test — **PASS**.
9. Prototype-only hard stop remained intact — **PASS**.

## Hard stop

- Do not start `/to-spec`.
- Do not create a production implementation backlog.
- Do not change production code or backend data.
- Do not revise the product contract inside this prototype ticket.
- Do not publish, deploy, or contact anyone.
