# Lawful real-family pilot — bounded proxy and publication boundary

**Updated:** 2026-08-16
**Status:** **PROXY-CLOSED; REAL-FAMILY PROMOTION/PUBLICATION EXTERNAL-BLOCKED**
**Evidence class:** generated synthetic schema fixtures, permission-attestation, aggregate-only audit-boundary tests, AND a real bounded aggregate audit of the registered confidential cofactor CSV package (27,009 records, 3 families)
**Authority:** `research/data-source-register.md` controls eligibility. This report does not approve a source, family, fact, mapping, or release.

> Numbering note: this filename is retained for continuity. The recovery plan calls the lawful pilot Plan Phase 5 (user Phase 6).

## Decision

No source package is currently eligible for ingestion into a candidate public family under the complete gate: an approved register entry alone is not an executable publication grant. The confidential cofounder entry permits only separately reviewed future use and requires independent counts/samples, confidential-origin protection, field-level adjudication, mechanical review, and exact candidate-digest approval. No such candidate packet or approval was supplied to this phase.

Therefore no real source file was transformed, imported, sampled into repository evidence, or published. No real family is complete. PartSource remains a visibly synthetic catalog.

The strongest lawful substitute has two components:

1. **Boundary testing** (`tools/catalog-pilot/` + `test-pilot-boundary.ts`): exercises the ingestion boundary with generated synthetic schema fixtures and explicit attestations. Proves refusal and report-shape behavior, not source truth.

2. **Real-data bounded aggregate audit** (2026-08-16): ran `audit.mjs` against the three registered confidential CSV files under `archive/legacy-runtime-2026-08-12/data/` with a properly scoped attestation. Results:
   - **27,009 total records** across 3 families (hex-head-screws: 8,850; rounded-head-screws: 10,295; socket-head-cap-screws: 7,864).
   - **85 columns** across files; 34 dimension-candidate fields.
   - **Zero** duplicate rows, zero duplicate identifier values, zero dangerous fields.
   - All commercial/supplier/price/stock/equivalence field checks: **PASS**.
   - All structural checks: **PASS** except one **FAIL** — socket-head-cap-screws has 112 blank identifier cells (column-014, column-015, column-016 share 56 rows with missing identifiers across multiple fields, likely a distinct sub-family with different ID conventions).
   - 3 dimension-units checks flagged as **REVIEW** (mixed `in`/`mm` fields across all families — 4–5 mixed-unit fields per family, requiring unit normalization adjudication).
   - Aggregate report written to OS temp path only. Zero raw values, headers, paths, or origin leaked.
   - `promotionEligible: false`, `publicationAuthorized: false` — correctly refused.
   - Attestation digest: `sha256:3c1703799a905d587bcab2e73bb7e4ed6e1a0e106cd2b4948bf655ad3e8f4a85`.

## Proxy controls exercised

The pilot tooling and `web/scripts/catalog/test-pilot-boundary.ts` require or verify:

1. explicit source identity and permission attestation before any eligible audit path;
2. acknowledgement of non-publication, aggregate-only output, origin protection, incomplete mechanical review, and absent publication approval;
3. generated fixtures confined to operating-system temporary paths and never relabelled as real/confidential input;
4. refusal of unapproved source IDs, missing/weakened attestations, non-temporary output, and registered-path violations;
5. refusal of publish/import/export modes; the audit path emits no catalog records;
6. aggregate-only report shape, excluding raw paths, raw headers, cell values, source URLs, and confidential origin;
7. fail-closed detection for dangerous commercial/source header classes and malformed/duplicate structures;
8. a structurally passing audit still reports promotion and publication as unauthorized;
9. **real registered source files** can be audited through the same attestation-gated, temp-confined, aggregate-only path.

## What the proxy establishes

- The permission/attestation boundary is executable rather than a convention.
- Generated schema scenarios can test deterministic structural reconciliation and refusals without introducing external data.
- The pilot tool cannot turn its own output into a catalog package or publication decision.
- Synthetic fixture success stays visibly separate from a real-family claim.

## What remains open

A lawful real-family gate still requires all of the following outside this proxy:

- an exact eligible source packet and frozen private-input digest;
- confirmed permission scope for each proposed stored/transformed/public field and mapping;
- approved family inclusion/exclusion boundary and typed field map;
- required/optional/unknown/not-supplied/not-applicable adjudication;
- identifier namespaces, normalization, collisions, and zero critical false unique mappings;
- units, datums, tolerances, transformations, and preservation of raw supplied notation in a controlled private store;
- independent count reconciliation and stratified record sampling;
- permitted claim-level fact and mapping provenance with no confidential-origin leakage;
- correction, supersession, withdrawal, rollback, and old-release replay;
- qualified mechanical approval of the exact immutable candidate digest;
- explicit publication-boundary approval naming that digest.

None may be inferred from parser tests, synthetic fixtures, source-register status alone, or this proxy.

## Executable evidence

- `npx tsx scripts/catalog/test-pilot-boundary.ts`
- included in `npm run test:catalog`
- included in `npm run release:audit`

The current repository audit passes this proxy. That pass authorizes no ingestion or publication and supplies no external engineer/domain evidence.
