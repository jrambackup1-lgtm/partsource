# Proxy Validation Gate synthesis — 2026-08-10

**Status:** Completed proxy/synthetic gate  
**Direct participants:** 0  
**Qualified mechanical reviewers:** 0  
**Evidence claim:** Specialist-agent analysis plus public technical authority and deterministic repository tests. This is not human validation, qualified approval, standards certification, release approval, or production evidence.  
**Hard boundary:** `/to-spec` was not started.

## Controlling decision

**Direction gate: CONDITIONAL PASS.** PartSource remains active as one bounded internal POC hypothesis.

**Current-runtime gate: FAIL.** The current catalog, search, detail, BOM, and supplier-handoff path is not fail-closed and is not release-safe.

**Human/domain gate: OPEN / NO-GO.** Direct-user evidence remains absent. Candidate families, answer keys, normalized mechanical facts, and a catalog release remain unapproved.

These three statements are compatible. The product direction can remain alive while the current implementation and formal human/domain gate remain unapproved.

## Final choice

**B — bounded POC despite missing human validation**

This is explicit risk acceptance to continue a narrow, local, synthetic POC loop. It is not permission to publish, claim validation, claim equivalence, make a unique engineering selection, enable supplier handoff, close Tickets 15/24, or start `/to-spec`.

A is still a later required gate, but it is not the only work allowed now. C is not forced because the specialists found a coherent narrow direction and repairable architecture. If the bounded POC cannot satisfy the kill conditions below, the decision becomes C.

## Gate method

Six specialist proxy lanes ran independently:

1. mechanical engineering;
2. fastener domain;
3. manufacturing/sourcing;
4. UX/trust;
5. data quality; and
6. architecture/security.

Each lane used the hierarchy in `proxy-validation-gate-contract-2026-08-10.md`:

1. official public standards pages and manufacturer/platform technical sources;
2. repository observation and deterministic execution; and
3. clearly labeled proxy/synthetic interpretation.

Agent agreement is not a new evidence tier.

## Public technical authority used

Full source ledgers are in the six lane reports. Representative official sources included:

- ISO 4762, 4014, 4017, 7045, 1580, 261, 888, 965-1, 4042, 898-1, 3506-1, and 7380 public scope/lifecycle pages;
- ASME B1.1, B1.13M, B18.3, B18.6.3, and B18.12 public scope pages;
- Unbrako Engineering Guide;
- Bossard thread guidance and product-form catalogs;
- TR Fastenings technical standards and product-form pages;
- Fastenal engineering and catalog pages used only for form/thread distinctions;
- official Supabase, PostgreSQL, OWASP, and RFC documentation for the public API/security lane.

No protected standards table was copied. No blocked catalog/API data was ingested. Manufacturer catalogs were used to falsify unsafe collapsing of product forms, not to certify PartSource records.

A main-agent source check independently found the cited official ISO 4762, ASME B1.13M, Unbrako, Bossard, and OWASP pages at the stated official URLs. Web extraction was unavailable in this environment; the reports therefore restrict claims to public scope/metadata and cited bounded observations.

## Result by requested test

| Test | Proxy/synthetic result | Gate disposition |
|---|---|---|
| Family boundaries | The three CSV buckets are not coherent user-facing families. Narrow candidate profiles are possible: metric coarse standard-profile internal-hex socket-head cap screws; separate partial-thread hex bolts and full-thread hex screws; separate H/Z cross-recess and slotted pan-head machine screws. Neighboring forms stay excluded or unresolved. | **Conditional direction pass; current data fail.** Positive membership remains unapproved. |
| Identifiers | Packet-local references are distinct, but current exact lookup is un-namespaced, un-released, and uses `LIMIT 1`. Two injected exact rows still returned one. Removing all projected technical fields left 34/34 exact cases uniquely selected. | **Fail.** Namespace, mapping state, zero/one/many detection, release, revision, and lifecycle are mandatory. |
| Required fields | The source packet contains useful facts, but the projection drops geometry, drive size, direction, fit, extent, and other distinctions. It coalesces separate strength concepts. | **Fail.** Required fields must be family-profiled and preserve supplied, normalized, missing, conflict, and provenance states. |
| Units/thread semantics | All 16 metric benchmark cases duplicate `mm` in pitch value and unit. Changing every pitch unit to `in` still scored 120/120. Imperial TPI has no valid positive parse coverage in v1. | **Fail.** Use typed value/unit once, thread system/form, diameter, pitch or TPI, direction, fit/tolerance, extent, and round-trip tests. |
| Conflicts/missing data | The current runtime silently defaults or collapses broad, partial, and explicit-conflict inputs. Missing fields become `Unknown`/`N/A`, hiding why they are absent. | **Fail.** Preserve both claims, choose neither, show origin, and block every downstream action. |
| False matches | Frozen v1 reproduces 120/120 with 95 abstentions and zero false-unique matches, but it is semantically blind to wrong family, wrong units, and wrong release. The current-artifact emulation scores 8/120 with 58 false-unique cases. | **Fail for current runtime.** Frozen v1 remains forensic composition evidence only. |
| Release/revision | The serving table mutates in place. No immutable catalog release, configuration revision, correction, supersession, withdrawal, active pointer, or catalog rollback exists. | **Fail.** No release-aware behavior or handoff can be claimed. |
| Safe-handoff packet | A one-line manual packet preserved 27/27 declared synthetic facts, blocked alternate-supplier action in 10/10 synthetic lines, and produced a defensible next review action in 10/10. Current runtime and prototype 006 still expose unsafe actions in unreleased or blocked states. | **Strong hypothesis only.** Packet structure survives; current implementation fails. |
| Next-action usefulness | Synthetic packet A scored 10/10 defensible next actions versus 1/10 for the source-direct/original-clue baseline. Sketch 007 Queue best exposed the next unresolved decision. Queue wrapper B reduced starts but added no line truth. | **Proxy pass only.** Must not be called user usefulness or comprehension evidence. |

## Independently reproduced material facts

The main agent reran `research/validation-tools/audit_proxy_data_quality_20260810.py` and the frozen scorer.

- Rows: 27,009.
- Canonically populated material: 26,962.
- Dedicated finish: 6,753.
- Pitch: 8,734.
- Paired head dimensions: 26,535.
- Rows carrying more than one strength concept: 25,404.
- Material strings with a conservative finish-bearing lexical flag: 9,269.
- Typed low-profile socket rows admitted by the punctuation-sensitive predicate: 466 total; 265 metric; 255 DIN 7984.
- Duplicate 22-field socket technical signatures: 145 groups covering 311 rows.
- Frozen v1: 120/120, 95 abstentions, zero false unique; corpus SHA-256 `0b4acb8152288973a9fa6465d2c4f2d066a5e0566fb33503309e968e2e5c087b`.
- Current artifact: 8/120, 47 abstentions, 24 false-unique identities, 58 false-unique selections/cases.
- Frozen score remained 120/120 after wrong pitch units, wrong input families, wrong source families, and wrong releases.
- Fresh frozen-score output was byte-identical to the checked-in result and the temporary output was removed.

Therefore the benchmark is reproducible but not a mechanical truth gate.

## What the bounded POC is

The only allowed B path is a local/internal **blocked-first constraint-and-release ledger plus safe-packet compiler**.

Initial positive hypothesis:

- one candidate profile only: metric, coarse-thread, standard-profile, internal-hex socket-head cap screws;
- external-hex and pan-head profiles remain boundary/negative controls, not supported released families;
- supplied values remain visible and immutable;
- parsed/normalized values are separate claims with rule version and origin;
- every identifier is namespace-qualified and mapping state is explicit;
- every output is either a typed block reason or a synthetic candidate packet;
- no state is a unique engineering selection;
- no packet is released, verified, approved, equivalent, suitable, orderable, or BOM-ready;
- no alternate-supplier URL is emitted;
- source-direct navigation, if retained at all, stays explicitly separate from configuration handoff;
- frozen v1 stays unchanged and is used only as a regression/forensic control.

This bounded POC may repair and exercise research prototypes or local test harnesses. It may not mutate public serving data, deploy, send supplier requests, publish claims, or become an implementation backlog through `/to-spec`.

## Mandatory B controls

1. One central handoff predicate drives UI rendering, keyboard activation, BOM serialization, export/copy, and supplier-link generation.
2. Broad, partial, conflict, unsupported, unavailable, stale, corrected, superseded, withdrawn, and no-release states have zero handoff actions.
3. Query/route changes clear old candidates and actions synchronously before loading.
4. Field values carry supplied/parsed/catalog/defaulted origin; selection-critical defaults are prohibited.
5. The public shape, even in a local instrument, is a strict field allowlist and rejects unknown lifecycle values.
6. Candidate release data is append-only and digest-bound in the instrument. No mutable row is treated as released truth.
7. Collision tests evaluate zero/one/many before any limit.
8. Corrections create a new revision; old snapshots remain byte-stable and receive an explicit blocked/review-required state.
9. Private source keys, filenames, raw rows, reviewer notes, credentials, and unapproved provenance never cross the browser/packet boundary.
10. No LLM, importer, benchmark, or CI job may approve facts, resolve collisions, activate a release, reverse withdrawal, or enable handoff.

## B exit test

The bounded POC loop passes only when deterministic synthetic tests prove all of the following:

- zero false-unique identity or selection under collisions and critical-field deletion;
- critical mutations in family, unit, thread, release, lifecycle, and conflict state change the result or force abstention;
- zero BOM, copy, export, or supplier actions in every blocked state;
- zero stale prior actions during route/query transitions;
- exact DTO allowlist and zero private-field leakage;
- immutable revision/release behavior under correction, withdrawal, and rollback fixtures;
- one clear, state-specific next review action for every blocked fixture;
- a clean rerun of the browser matrix against a readiness-identified local server.

Passing this test keeps the POC alive. It still does not close human validation or qualified review.

## Kill conditions

Move to **C — rethink** if any of these remains inherent after the bounded repair loop:

- false unique output is required to make the POC look useful;
- a required mechanical fact cannot be represented without guessing or lossy collapse;
- safe packet usefulness depends on an unreleased supplier action;
- the interaction cannot remove stale or blocked actions mechanically;
- lawful source boundaries cannot support a reviewable candidate sample;
- the architecture requires mutable published truth or broad privileged exposure;
- the bounded artifact produces no better next review action than preserving the original clue.

## Human/domain gate remains open

This proxy gate does not alter the later evidence requirement:

- 6–8 qualifying recent-work sessions on participant-owned redacted packets;
- qualified review of family boundaries, required fields, normalization, answer keys, and a digest-bound release;
- a corrected separately versioned 150-case benchmark;
- direct evidence that the packet improves a real next action;
- zero critical false-unique or silent selection-critical mutation.

Tickets 15 and 24 remain open. `/to-spec` remains blocked.

## Specialist artifacts

- `research/proxy-mechanical-engineering-review-2026-08-10.md`
- `research/proxy-fastener-domain-review-2026-08-10.md`
- `research/proxy-manufacturing-sourcing-review-2026-08-10.md`
- `research/proxy-ux-trust-review-2026-08-10.md`
- `research/proxy-data-quality-review-2026-08-10.md`
- `research/proxy-architecture-security-review-2026-08-10.md`
- `research/validation-tools/audit_proxy_data_quality_20260810.py`

## Final decision

**B — bounded POC despite missing human validation**
