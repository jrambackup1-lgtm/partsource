# Resolution comment - Define the catalog publication contract

## Decision

The production catalog is a versioned, immutable build artifact containing only current `verified-equivalent` cross-references that have passed source clearance, validation, conflict checks, and independent review. It is a deliberately small public projection, never an ingest store or a mixed test-data bundle. Until a source is `approved` in the source register, this cross-reference artifact remains empty.

## Required records

- `SourceRecord`: `id`, `status`, permission-evidence reference, permitted fields, acquisition method, required attribution, refresh/expiry, takedown procedure, and last compliance review. A record may use a source only while this status is `approved`; `blocked`, `discovery`, expired, or missing permission evidence fails closed.
- `CanonicalConfiguration`: `id`, supported family, and normalized values plus provenance for thread system, diameter, pitch, length, head, drive, material, grade/strength, finish, applicable standard, and required certifications. Dimensions carry explicit units; no value is inferred across systems or standards.
- `EvidenceRecord`: `id`, assertion type, source record, permitted URL/reference, captured date, applicable record revision, field/assertion supported, and immutable snapshot fingerprint. Evidence stores factual assertions and links, not copied descriptions, images, or standards text.
- `CrossReferenceRecord`: `id`, exact McMaster identifier, alternative manufacturer part and/or supplier identifier with its supported identity, canonical-configuration reference, relationship `verified-equivalent`, source/evidence references, lifecycle state, record revision, and review reference. All required equivalence fields must match; absent or conflicting evidence makes it non-publishable.
- `IndependentReview`: `id`, cross-reference id and revision, reviewer identity distinct from the preparer, review date, compared-field checklist, evidence references, decision, and reason. Approval applies only to the reviewed revision.
- `PublishedCatalog`: `schemaVersion`, immutable `catalogVersion`, generation time, record count, input source/review revisions, artifact fingerprint, and the public projection of each included cross-reference (`recordId`, `recordRevision`, identifiers, normalized facts, evidence/review revision, and any required attribution).

## Lifecycle and publish gate

Cross-reference lifecycle is `ingested` -> `normalized` -> `pending-review` -> `approved` -> `published`; terminal or blocking states are `invalid`, `conflicted`, `rejected`, `stale`, and `withdrawn`.

- Only a schema-valid, conflict-free `approved` record with an `approved` source, complete current evidence, and an approving independent review may enter a build.
- The build marks selected records `published`; every other state is excluded. A record becomes `stale` at evidence/source expiry and cannot remain in a new catalog version.
- Any factual, evidence, identifier, configuration, source-permission, or lifecycle change increments the record revision and returns it to `pending-review`. It cannot silently retain prior approval.
- A correction produces a new revision and catalog version. Withdrawal immediately excludes the record from the next build; an emergency withdrawal releases a replacement catalog without it. Historical artifacts remain audit evidence but never support a current equivalent claim.

## Synthetic-fixture boundary

Synthetic fixtures are test-only data with an explicit `synthetic-test` origin. They live in test-only modules/directories, may exercise normalization and lookup behavior, and are excluded from production generation by an allow-list that accepts only reviewed production records. The production build fails if a fixture origin, fixture path, unapproved source, non-published lifecycle state, or missing manifest/review/evidence field is selected. A build test asserts that fixture sentinel identifiers are absent from the generated catalog.

## Version and runtime rules

`schemaVersion` changes for every catalog-schema change and states its compatibility or migration rule; `catalogVersion` changes for every membership, public-field, evidence, review-revision, correction, or withdrawal change. Catalog artifacts are never edited in place and must retain their manifest fingerprint and release identity.

Runtime lookup reads only the current `PublishedCatalog`. It may show the included evidence and review revision, but it does not read raw snapshots, review queues, candidates, invalid records, or prior catalog versions. A missing, stale, withdrawn, or unpublished mapping returns `No verified equivalent yet`; it is never replaced with a candidate or a synthetic result.

## Build boundaries and proof

Keep raw snapshots, normalized working records, review/audit records, synthetic fixtures, and the published artifact in separate locations/modules. Production bundling imports only the generated `PublishedCatalog`; test bundles may import fixtures explicitly. R2 completion requires schema/lifecycle tests, a fixture-containment test, a negative publish-gate matrix for every blocked state, and an independently reviewed 25-record manifest with zero ambiguous mappings.
