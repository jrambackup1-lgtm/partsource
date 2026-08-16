# Wayfinder Ticket 25 result — 2026-08-10

**Status:** FAIL
**Decision:** **C — rethink**
**Evidence class:** proxy/synthetic only
**Direct participants:** 0
**Qualified mechanical reviewers:** 0
**`/to-spec`:** not started

## Scope exercised

The implementation stayed inside one local research instrument:

- one non-authoritative metric coarse, standard-profile, internal-hex socket-head-cap-screw candidate profile;
- neighboring forms as negative controls;
- blocked state or synthetic candidate-review packet only;
- no production route, public deployment, catalog mutation, supplier handoff, BOM, copy, export, price, stock, availability, equivalence, or engineering-selection action.

Artifact directory:

- `research/proxy-poc/ticket25/`

## Test chronology

| Test | Result | Meaning |
|---|---:|---|
| Node syntax checks for all `.mjs` files | PASS | Files parse. |
| Initial deterministic compiler matrix | 19/19 PASS | The intended fixtures block or return an actionless synthetic packet. |
| Real-browser matrix | PASS | 16 blocked fixtures, 2 candidate fixtures, 2 stale transitions, 320 px viewport, zero console errors, zero external requests, zero unsafe controls, zero observed private sentinel leaks. |
| Independent adversarial review | FAIL | Found untested trust-boundary and state-model defects. |
| Durable adversarial regression suite | **0/11 PASS; 11/11 FAIL** | Main-session reproduction confirmed every listed blocker. |

Commands:

```text
node --test research/proxy-poc/ticket25/test-kill-matrix.mjs
node research/proxy-poc/ticket25/test-browser.mjs
node --test research/proxy-poc/ticket25/test-adversarial-regressions.mjs
```

The first two commands passing does not override the third command failing.

## Failures reproduced

1. **Manifest digest is self-asserted, not content-bound.**
   - Configuration content can change while the same manifest digest remains accepted.
   - The mutable catalog supplies both `digest` and `expectedDigest`.
2. **Compound clue conflicts resolve last-wins.**
   - Repeated `thread`, `length`, and `drive_size` claims can overwrite earlier conflicting claims and still produce a candidate packet.
3. **Duplicate manifest identity selects the first row.**
   - A second manifest with the active ID does not force abstention.
4. **Duplicate configuration identity selects the first row.**
   - Exact-identifier resolution can survive duplicate `id + revision` records.
5. **The strict schema boundary misses non-enumerable unknown fields.**
   - A non-enumerable private field is accepted because key checking uses enumerable keys.
6. **Hostile accessors can escape the compiler.**
   - A throwing `rawInput` getter is dereferenced again on the error path and throws instead of returning a typed block.
7. **Unknown lifecycle values are checked only on selected records.**
   - An unrelated record with an unknown lifecycle remains in an accepted catalog.
8. **Whitespace-only identifiers can normalize to an exact empty identity.**
9. **Blocked next actions are generic.**
   - A missing `material` clue does not name `material` in the proposed next review action.
10. **Correction fixtures mutate state in place.**
    - They do not prove append-only revisions, immutable prior records, or a real rollback pointer.
11. **The ledger is not the required shared fact-state ledger.**
    - It does not carry supplied, parsed, catalog, missing, conflicting, defaulted, and unsupported claims in one structure.

## Fixes completed before the final challenge

- Added one isolated research compiler and browser instrument.
- Added explicit profile fields and neighboring-form exclusions.
- Added basic zero/one/many identifier fixtures.
- Added basic lifecycle, stale-state, mobile, privacy, and no-action checks.
- Fixed an imprecise missing-namespace result so it returns `namespace_required`.
- Corrected one adversarial test enum before recording the final 0/11 result.

These fixes are useful forensic work. They are not enough to pass Ticket 25.

## Remaining blockers

A new design must prove, before another implementation attempt:

1. a trusted digest root outside the mutable catalog;
2. canonical content hashing over the complete immutable manifest payload;
3. one conflict-aware claim accumulator for simple and compound clues;
4. globally unique manifest, configuration-revision, and mapping identities;
5. exact descriptor-safe schemas and exception-safe rejection paths;
6. a closed lifecycle enum checked over the complete input;
7. append-only correction, supersession, withdrawal, activation, and rollback events;
8. one shared ledger with supplied/parsed/catalog/conflict/missing/defaulted/unsupported states;
9. field-specific block details and next review actions;
10. adversarial tests written before the replacement implementation.

## Boundary

The failed POC must not be integrated into `web/`, deployed, published, or described as validated. Its passing happy-path tests are retained only to show what the narrower matrix covered. The adversarial suite is controlling.

Tickets 15 and 24 remain open. No human-validation, qualified-review, standards-certification, release-approval, family-approval, or production-readiness claim was created.

## Final decision

**FAIL — C — rethink**
