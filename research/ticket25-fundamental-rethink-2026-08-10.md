# Ticket 25 fundamental rethink

**Date:** 2026-08-10  
**State:** Historical Ticket 25 rethink; product recommendation superseded  
**Evidence:** repository, proxy, and synthetic evidence only  
**Direct users:** 0  
**Qualified mechanical approvals:** 0  
**`/to-spec`:** not started

> **Destination correction — 2026-08-10:** Jay restored the original PartSource mission: build and ship a credible mechanical-component discovery POC using frontier-model multi-agent orchestration. Keep this report's failure taxonomy and authority boundaries as evidence. Its recommendation to pivot PartSource into a paid manual BOM ambiguity audit or kill the product is superseded. The audit is only a separate business experiment. Current synthesis: `research/partsource-product-directions-reconciliation-2026-08-10.md`.

## Decision

Do not repair Ticket 25 under the same product claim.

The failed Ticket 25 automatic-authority direction is rejected:

> imperfect clue → PartSource-selected configuration → release-aware safe handoff → BOM or supplier action

This is not a small search product. It is an authoritative mechanical-data publication system. It needs named domain authority, reviewed family rules, complete source facts, scoped identity, immutable releases, correction history, and fail-closed serving.

We built that authority burden before proving a recurring paid job.

The surviving hypothesis is much smaller:

> A human-owned review artifact that preserves the original BOM lines, flags literal ambiguity and data-integrity problems, and asks precise questions without selecting a configuration.

That is technically viable. It is not yet a product.

Historical recommendation: run a paid manual BOM ambiguity audit before more software. This recommendation no longer controls the PartSource product route.

## What Ticket 25 proved

Ticket 25 proved that its own implementation is unsafe against its controlling contract:

- intended compiler matrix: 19/19 passed;
- intended browser matrix: passed;
- adversarial matrix: 0/11 passed; 11/11 failed.

It did not prove that every evidence packet is impossible.

It proved that the word `safe` becomes expensive when PartSource claims authority over selection, catalog truth, release state, and downstream actions.

## Failure taxonomy

A failure can have more than one cause.

| # | Failure | Architectural | Data model | POC implementation | Fundamental finding |
|---:|---|:---:|:---:|:---:|---|
| 1 | Manifest digest is self-asserted | Yes | Yes | Yes | A release claim needs a trust root and content binding outside mutable candidate data. |
| 2 | Compound claims resolve last-wins | If parsing selects | Yes | Yes | Contradictory facts must coexist and force abstention. |
| 3 | Duplicate manifest identity selects first | Yes | Yes | Yes | Release identity needs scoped uniqueness or explicit zero/one/many handling. |
| 4 | Duplicate configuration revision selects first | Yes | Yes | Yes | `LIMIT 1` or first-row behavior cannot establish identity. |
| 5 | Non-enumerable fields bypass the schema | Boundary mismatch | No | Yes | Accept canonical serialized data, not arbitrary live JavaScript objects. |
| 6 | Hostile accessors escape the error path | Boundary mismatch | No | Yes | Rejection paths must not dereference hostile input again. Canonical JSON removes this object-capability case. |
| 7 | Unknown lifecycle values survive in unselected rows | Yes | Yes | Yes | An atomic release must be valid as a whole, or bad rows must be quarantined outside it. |
| 8 | Whitespace identifiers become an empty exact identity | No | Yes | Yes | Normalize, then reject empty identities before matching. |
| 9 | Blocked next action is generic | No | Yes | Yes | A useful issue record must preserve the specific missing or conflicting fact. |
| 10 | Corrections mutate state in place | Yes | Yes | Yes | Released truth needs immutable replacement and activation history. Full event sourcing is not required. |
| 11 | No shared fact-state ledger | Yes for automatic selection | Yes | Yes | One state must explain supplied, parsed, catalog, missing, conflicting, defaulted, and unsupported facts if it authorizes actions. |

### Purely local bugs

These are repairable without a new company:

- last-wins compound parsing;
- weak key inspection;
- unsafe exception handling;
- empty normalized identifiers;
- generic next-action text.

Fixing them would not make the product safe.

### Architectural blockers

These exist because PartSource claimed an authoritative released result:

- trusted release authority;
- content-bound immutable artifact identity;
- scoped identity and cardinality rules;
- whole-release validation or quarantine;
- correction, supersession, withdrawal, activation, and rollback history;
- one fact state that controls UI and downstream actions.

These are buildable. They are not justified.

### Data and domain blockers

These remain even after perfect code:

- a source row is not a reviewed configuration;
- an ingestion bucket is not a family;
- required fields differ by operation and family;
- the current import projection drops supplied mechanical facts;
- identifier namespace and mapping authority are unresolved;
- configuration identity and duplicate semantics are unresolved;
- current sources do not establish listing, offer, equivalence, approval, or complete standards conformity;
- no qualified reviewer approved a family, mapping set, answer key, or release.

A better compiler cannot create missing authority.

## Root failure

The root failure is not JavaScript.

The root failure is an authority inversion:

1. PartSource has no validated buyer or recurring paid job.
2. It nevertheless claims a selected, released, safe artifact.
3. That claim forces catalog governance, mechanical review, identity, lifecycle, and security machinery.
4. The machinery grows faster than user value.
5. Passing internal fixtures then looks like product progress even when no user has accepted the outcome.

The packet became the product because it was testable. The buyer outcome stayed unproved because it was not.

## Safe-handoff viability

| Concept | Verdict | Why |
|---|---|---|
| Automatic PartSource-selected safe handoff | Reject | It requires authoritative release operations and approved mechanical truth. Current evidence has neither. |
| Reviewed configuration release | Kill for now | Zero approved families, no qualified reviewer, lossy source projection, unresolved identity, and no release lifecycle. |
| Catalog-assisted comparison with human selection | Defer | Safer than automatic selection, but still needs reviewed catalog facts and release authority. |
| Human-owned raw-preserving review packet | Viable hypothesis | It can preserve evidence, expose conflicts, and require human attestation without claiming configuration truth. |
| Safe handoff as the product wedge | Reject | Safety is product behavior. It is not proof of urgency, repeat use, buyer value, or payment. |

Stop calling the survivor `safe handoff`.

Use `raw-preserving issue list` or `BOM ambiguity audit` until a real recipient accepts the artifact and changes a useful next action.

## Product boundary change

### Remove from the active direction

- family-first discovery as the lead product;
- public configuration catalog as the wedge;
- automatic unique configuration selection;
- release-aware passport;
- supplier search as a completion event;
- Add to BOM from inferred or unreviewed records;
- broad mechanical-parts platform positioning;
- architecture repair before demand evidence.

### Keep only as safety rules or reusable research

- preserve original input;
- separate supplied and derived facts;
- keep conflicts and unknowns visible;
- no silent defaults;
- no equivalence, approval, price, stock, availability, or suitability claims;
- exact identifier namespace and cardinality discipline;
- immutable snapshots when a human chooses to export;
- deterministic rules before fuzzy or AI authority.

### New maximum product boundary before validation

A private manual service may:

- preserve every submitted line;
- flag literal contradictions, duplicate identifiers, parse failures, source sentinels, and projection loss;
- identify unclear wording;
- ask precise review questions;
- return a prioritized issue list.

It may not:

- select or correct a mechanical configuration automatically;
- claim a family, standard, pitch, material, strength, finish, or suitability without named qualified review;
- claim the line is BOM-ready, procurement-ready, verified, approved, or safe;
- produce alternates, equivalents, listings, price, stock, or availability;
- create supplier or BOM actions from inferred facts.

## Alternative wedges

| Rank | Direction | Role | Verdict |
|---:|---|---|---|
| 1 | Paid manual BOM ambiguity audit | Revenue and demand test | Recommended next test. No software. |
| 2 | Internal catalog data-quality anomaly report | Different B2B company | Backup only if a catalog owner provides sanctioned data and budget. |
| 3 | Kill standalone PartSource | Capital-allocation option | Default if the paid test fails. Reuse expertise in engineering services. |
| 4 | Exact-identifier explanation | Acquisition hook | Not a standalone business. Keep only if it feeds a paid service. |
| 5 | Paid one-line/BOM office hours | Consulting fallback | Use if buyers pay for live judgment but not a repeatable artifact. |
| 6 | Automated BOM lint/question generation | Later software | Do not build before repeated paid manual use. |
| 7 | Standards/reference content | Content support | Narrow acquisition content only. No broad library or pSEO revival. |
| 8 | Supplier-query generator | Disposable convenience | Reject as a wedge. Low differentiation and lost constraints. |
| 9 | Family-first public catalog | Existing direction | Reject. It is an interaction pattern without a proved job or buyer. |

## Recommendation

### Test one paid manual offer

Proposed offer hypothesis:

> Send a safely redacted 10–50-line fastener BOM excerpt. For a fixed fee, receive every original line preserved, literal contradictions and opaque identifiers flagged, unclear specification wording identified, and a prioritized list of questions for engineering or sourcing. No equivalent, alternate, application approval, supplier match, price, stock, or procurement-readiness claim.

Starting price hypothesis: **US$250**.

The price is not validated. It forces a buyer test instead of another free-interest test.

### Intended buyer

- head of engineering;
- hardware operations lead;
- prototype or product program owner;
- engineering consultancy owner;
- contract manufacturer that receives unclear customer BOMs.

A generic engineer may be the user. They are not automatically the buyer.

### Completion event

The service is complete only when the real owner or recipient does at least one of these without facilitator explanation:

- corrects a consequential line;
- answers a precise engineering question;
- marks a line unsupported or out of scope;
- accepts and forwards the issue list;
- identifies the next comparable event when they would buy again.

Generating a packet is not completion.

## Paid-test gate

This is a proposed gate for Jay to approve in the next session. No outreach has been sent.

### Pass

From 12 qualified offers in a fixed window:

1. at least 3 prospects provide a real safely redacted recent packet;
2. at least 2 pay or place a nontrivial deposit;
3. at least 2 confirm the job occurred more than once in the previous 90 days;
4. at least 2 delivered issue lists cause a concrete next action;
5. at least 1 buyer names a comparable future purchase event.

### Narrow

- Buyers pay only for live judgment: become a consulting offer, not software.
- Buyers value exact-ID explanation but not the batch artifact: use exact ID only as acquisition.
- Catalog owners show stronger pull than hardware teams: test catalog QA as a separate B2B direction.
- Prospects share packets but do not pay: pain or buyer selection is weak; do not build.

### Kill

Kill standalone PartSource if:

- 0 paid pilots result from 12 qualified offers;
- fewer than 3 prospects share a useful recent packet;
- the issue list changes no next action;
- normal supplier/manual work is equally clear and faster;
- buyers mainly want price, availability, equivalents, AVL, ERP/PLM, certification, or completed sourcing;
- truthful delivery requires unsupported mechanical decisions or a reviewer who is unavailable;
- customers pay only for broad engineering consulting, not this repeatable artifact.

## Product-contract impact

The negative safety rules in `research/product-contract.md` remain valid.

The following positive claims should be treated as suspended direction hypotheses during C, not as proof of a future product:

- standards-first discovery and sourcing-assistance positioning;
- approved configuration catalog language;
- known identifier → configuration-match behavior;
- guided configuration selection;
- supplier-search handoff as a capability;
- configuration-derived BOM readiness;
- production ownership for catalog/search/handoff stages.

Do not edit the authoritative contract automatically. Jay must first choose the new boundary. Then a reviewed contract revision can separate implemented historical surfaces from supported product claims.

## Next decision

Choose one in the next session:

- **A — recommended:** approve the no-build paid BOM ambiguity audit test and its safety boundary;
- **B:** test internal catalog QA with one sanctioned catalog owner;
- **C:** kill standalone PartSource now and preserve only reusable research/code;
- **D:** revise the offer, buyer, or gate before any external action.

No option authorizes outreach. Public contact still needs Jay's explicit real-time approval of the exact target and copy.

## Evidence

Controlling:

- `research/proxy-poc-ticket25-results-2026-08-10.md`
- `research/wayfinder-ticket-audit-2026-08-10.md`
- `research/empirical-domain-gate-synthesis-2026-08-09.md`
- `research/empirical-domain-family-release-review-2026-08-09.md`
- `research/empirical-benchmark-domain-adjudication-2026-08-09.md`
- `research/empirical-a-vs-b-bom-preflight-duel-2026-08-09.md`
- `research/full-problem-space-skeptical-review-2026-08-09.md`
- `research/current-system-structural-audit-2026-08-09.md`
- `research/validation-mechanical-data-model-2026-08-09.md`
- `research/mechanical-data-trust-opportunities-2026-08-09.md`
- `research/poc-architecture-risk-red-team-2026-08-09.md`
- `research/product-contract.md`

Ticket 25 implementation evidence:

- `research/proxy-poc/ticket25/proxy-poc.mjs`
- `research/proxy-poc/ticket25/test-kill-matrix.mjs`
- `research/proxy-poc/ticket25/test-adversarial-regressions.mjs`
- `research/proxy-poc/ticket25/test-browser.mjs`

## Hard stop

- No `/to-spec`.
- No implementation backlog.
- No production repair.
- No public deployment.
- No outreach sent.
- No automatic product-contract rewrite.

C starts by choosing a paid job or killing the standalone product—not by writing more architecture.
