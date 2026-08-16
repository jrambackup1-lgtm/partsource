# Release Truth

Canonical repository: `jrambackup1-lgtm/partsource`

Canonical branch: `master`

Canonical site: `https://jrambackup1-lgtm.github.io/partsource/`

## Observed live state

At `2026-08-15T14:00:25Z`, the canonical site returned HTTP 200 with the old `PartSource Progressive Catalog POC` document, while `/partsource/release.json` returned HTTP 404. Therefore the public site is **not** the recovered catalog candidate and is **not production-verified**. The repository recovery fixes the build/deploy contract, but publishing it requires a reviewed commit and an explicitly approved public deployment.

## Versioned release identity

Every Pages artifact contains `/partsource/release.json`:

```json
{
  "schemaVersion": 1,
  "sourceSha": "full 40-character deployment commit SHA",
  "builtAt": "canonical ISO 8601 UTC build timestamp",
  "artifactManifest": "artifact-manifest.json"
}
```

The closed schema is versioned and links explicitly to the artifact identity document. `sourceSha` is exactly 40 lowercase hexadecimal characters. `builtAt` must round-trip through `Date.prototype.toISOString()`. The manifest link is a fixed, same-directory relative path; traversal and alternate identity documents are rejected.

`artifact-manifest.json` is deterministic and closed-schema. It records schema version 1, SHA-256, a sorted list of every regular file in the upload directory (including `release.json`, excluding only the manifest itself), each file's byte count and SHA-256, and an aggregate `artifactDigest`. The aggregate is SHA-256 of the canonical manifest body. Symlinks, non-regular files, non-canonical paths, duplicate/unsorted paths, missing files, unexpected files, changed bytes, and digest/schema changes fail verification.

The deploy workflow passes immutable `${{ github.sha }}` to generation and verification. Generation occurs after the final build and browser/boundary tests so Vite cannot erase identity metadata. Nothing rebuilds afterward. Verification recomputes the exact `web/dist` inventory, and `actions/upload-pages-artifact` uploads that same directory under `pages-${{ github.sha }}`. The digest is carried as a job output into deployment verification.

For local development only, when neither `PARTSOURCE_RELEASE_SHA` nor `GITHUB_SHA` is present, generation can use the repository's full Git HEAD and emits a `LOCAL/NON-PRODUCTION` warning. CI refuses that fallback. Local output is never production evidence.

## Truth boundary

- **Candidate:** committed `master` revision selected by a canonical manual deploy run.
- **Artifact:** the exact, manifest-verified `web/dist` directory generated from that candidate.
- **Release:** that named artifact successfully deployed by GitHub Pages.
- **Production-verified:** deployed `sourceSha`, aggregate digest, manifest inventory, and every fetched file byte match the expected deployment.
- Uncommitted local files are excluded from candidate, release, and production state even if local tests exercise them.

## Verification

Run the focused no-network contract directly:

```sh
cd web
npx tsx scripts/release/test-release-truth.ts
```

The contract uses a temporary artifact root and covers metadata/manifest schema, SHA and timestamp validation, deterministic ordering/digest, changed/missing/unexpected files, file hashes, expected digest mismatch, path traversal, symlink rejection where the host permits symlink creation, CI fallback refusal, package-script workflow indirection, exact upload path, final-build ordering, deployed byte verification, and propagation retry.

Generate and verify a local built artifact:

```sh
cd web
npm run build
npx tsx scripts/release/generate-release-metadata.ts
npx tsx scripts/release/verify-release-metadata.ts
```

Production supplies explicit identities:

```sh
PARTSOURCE_RELEASE_SHA=<full-sha> npx tsx scripts/release/generate-release-metadata.ts
PARTSOURCE_RELEASE_SHA=<same-sha> PARTSOURCE_ARTIFACT_DIGEST=<generator-digest> npx tsx scripts/release/verify-release-metadata.ts
```

After `actions/deploy-pages`, `verify-deployed-release.mjs` retries cache-busted production reads to allow Pages propagation. It validates both closed schemas and expected identities, then fetches every manifest entry and verifies exact size and SHA-256. A stale, partial, mixed, or modified deployment fails.

Retain source SHA, `builtAt`, aggregate artifact digest, Actions run URL, artifact name/ID, deployment URL, smoke result, and verification UTC time. A local build or passing candidate test is not production evidence.
