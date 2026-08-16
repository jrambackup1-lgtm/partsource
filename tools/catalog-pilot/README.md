# Lawful catalog pilot metadata audit

This directory contains a deliberately local, non-publishing audit path for the approved cofounder-provided CSV package. It is an evidence-gathering boundary, not a catalog adapter and not an import or publication tool.

## Enforced boundary

- Real-data audits accept only source ID `confidential-cofounder-local-csv-v1`, and that ID is path-bound to the three registered CSV family files under `archive/legacy-runtime-2026-08-12/data`.
- Source ID `generated-boundary-test-fixture-v1` exists only for generated fixtures below the OS temporary directory; it cannot be used to label repository or real-source data.
- A narrowly scoped review attestation is validated **before any CSV is read**.
- The attestation must acknowledge that mechanical review is incomplete and publication approval has not been granted.
- `--publish`, `--publication`, `--import`, and `--export` are refused.
- Supplier/vendor/manufacturer, price/cost, stock/availability, offer/order, equivalence/replacement, approval/suitability, and confidential-origin/URL fields fail the audit.
- Reports can only be written under the operating-system temporary directory.
- Reports contain aggregate counts, safe family IDs/file basenames, ordinal column references, canonical unit categories, and pass/review/fail states. They contain no raw row values, raw headers, source paths, origin, transformed records, or publication payload.
- A structurally passing report still sets `promotionEligible` and `publicationAuthorized` to `false`.

## Attestation schema

The attestation is local review-control input. It is not mechanical approval or publication approval.

```json
{
  "schemaVersion": 1,
  "sourceId": "confidential-cofounder-local-csv-v1",
  "scope": "local-metadata-audit-only",
  "decision": "approved-for-local-audit-only",
  "reviewer": "reviewer identity",
  "reviewedAt": "YYYY-MM-DD",
  "acknowledgements": {
    "nonPublishing": true,
    "aggregateOutputOnly": true,
    "confidentialOriginMustNotBePublished": true,
    "mechanicalReviewNotCompleted": true,
    "publicationApprovalNotGranted": true
  }
}
```

Only the attestation's scope, decision, and SHA-256 digest appear in the aggregate report; reviewer identity and date are not copied into it.

## Dry-run invocation

Use one `--expect-family` and one `--family family-id=path.csv` per expected family. The output path must resolve below the host OS temporary directory.

```sh
node tools/catalog-pilot/audit.mjs \
  --source-id confidential-cofounder-local-csv-v1 \
  --review-attestation "$LOCAL_ATTESTATION" \
  --expect-family hex-head-screws \
  --expect-family rounded-head-screws \
  --expect-family socket-head-cap-screws \
  --family "hex-head-screws=archive/legacy-runtime-2026-08-12/data/hex-head-screws.csv" \
  --family "rounded-head-screws=archive/legacy-runtime-2026-08-12/data/rounded-head-screws.csv" \
  --family "socket-head-cap-screws=archive/legacy-runtime-2026-08-12/data/socket-head-cap-screws.csv" \
  --output "$LOCAL_TEMP/partsource-catalog-pilot-report.json"
```

Exit code `0` means the bounded structural checks passed. Exit code `2` means an aggregate report was safely emitted but one or more structural checks blocked the audit. Boundary/configuration refusals use a nonzero usage exit code and read no CSV when source approval or attestation is absent.

## What is measured

- CSV/header shape and normalized header collisions;
- file, row, and column counts;
- missingness by ordinal column reference;
- exact duplicate rows and identifier-candidate duplication/missingness;
- dimension-candidate coverage, observable canonical unit categories, and mixed-unit fields;
- prohibited dangerous/commercial fields;
- expected versus observed family coverage.

These automated checks cannot establish correctness of a technical value, family semantics, identifier authority, transformation correctness, dimensional datum, tolerance, standards scope, completeness, or suitability. Those remain human review gates.
