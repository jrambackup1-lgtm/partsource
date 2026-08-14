# Critique — 008 bounded intent-adaptive resolver

> **HISTORICAL PROTOTYPE CRITIQUE.** Preserve failures, fixes, and test evidence. It validates no current product workflow.

**Date:** 2026-08-10
**Scope:** Wayfinder Ticket 30 behavioral prototype only

## Verdict at artifact level

The interaction and fail-closed state model are coherent enough to reach the Ticket 30 acceptance gate.

Automated browser result after red-team fixes:

- 22 scenario groups;
- 138 assertions;
- 0 failures;
- desktop and 320 CSS px exercised;
- 0 console errors;
- 0 uncaught page errors;
- 0 external requests.

Independent reviewers returned FAIL in three rounds before acceptance. They found these real blockers:

1. blank input was replaced with a fixture clue;
2. two identifiers silently used the first mapping;
3. two states named multiple or unavailable next actions;
4. this critique was missing;
5. blank and generic clues received canned agent spans absent from the clue;
6. constrained intent named a reject action without a reject control;
7. incompatible URL `case` and `q` values could manufacture mappings and unanchored proposals.

The artifact and test suite were corrected after each review. Blank input remains blank and is labeled missing. Multiple identifiers conflict and block mapping. Every state names one available action or abstains. Agent outputs exist only when every cited span occurs in the preserved clue. When a URL supplies `q`, deterministic routing now owns the case; incompatible fixture names cannot force a mapping. The critique now records those failures and limits.

## What works

- Broad text and exact identifiers share one shell without sharing the wrong ceremony.
- The original clue remains visible and immutable.
- Supplied, deterministic, proposed, conflicting, missing, unsupported, and unavailable states remain separate.
- Agent proposals quote input spans and cannot alter deterministic gates.
- Family choice carries supplied M4 into bounded candidate filtering.
- Exact identifiers expose zero/one/many. One never auto-selects; many blocks selection.
- Blank, conflict, unsupported, model-failure, and fixture-failure states abstain without stale candidates.
- A discovery snapshot requires explicit candidate choice plus an explicit create action.
- Mobile rows reflow; fact origins remain visible; identifiers do not truncate or collapse.
- The visual hierarchy is restrained: resolver, state, clue, candidates, ledger, interpretation work, one next action.

## What this proves

Only prototype behavior:

- the routing and truth-state vocabulary can be represented coherently;
- supplied constraints can survive family acceptance and candidate filtering;
- deterministic state can remain separate from simulated agent proposals;
- zero/one/many, conflict, unsupported, and unavailable states can fail closed;
- one user-controlled discovery-snapshot flow can avoid automatic selection;
- the composition can work at desktop and 320 CSS px without page overflow.

## What this does not prove

- mechanical correctness of any family, record, mapping, or candidate;
- permission clearance, source publication rights, or reviewed catalog status;
- live frontier-model quality, latency, consistency, injection resistance, or outage handling;
- real backend integrity, bundle signing, concurrency, race handling, or persistence;
- that an engineer understands the state within 15 seconds;
- usefulness, repeat use, demand, willingness to pay, or preference over existing tools;
- accessibility conformance beyond basic keyboard, labels, focus, reflow, and text-state checks;
- production readiness or permission to start `/to-spec`.

## Remaining weaknesses

- Synthetic data makes the resolver feel cleaner than real mechanical evidence will be.
- “Modern minimal” is supported by review and layout checks, not participant preference.
- The three agent roles are simulated outputs. Their authority contract is tested; real model behavior is not.
- Exact-many displays two records for inspection but deliberately blocks resolution. A later test must decide the safest collision-resolution interaction.
- The 24-record bundle tests state density, not useful coverage.

## Next highest-value test

Run a timed comprehension test with practicing engineers using redacted recent-work clues.

Ask, without coaching:

1. What did you submit?
2. Which facts came from you, deterministic parsing, and interpretation?
3. What is unknown or conflicting?
4. Did the system select anything?
5. What is the one safe next action?

Do not start `/to-spec` from this prototype result. Ticket 30 can pass as an interaction/state experiment while product value, mechanical truth, and live-model behavior remain unvalidated.
