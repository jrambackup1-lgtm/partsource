# Release Truth

Canonical repository: `jrambackup1-lgtm/partsource`

Canonical branch: `master`

Canonical site: `https://jrambackup1-lgtm.github.io/partsource/`

## Release Identity

Every Pages deployment contains `/partsource/release.json`:

```json
{
  "sha": "full 40-character deployment commit SHA",
  "builtAt": "ISO 8601 UTC build timestamp"
}
```

The deploy workflow passes the immutable triggering `${{ github.sha }}` to the generator. It never infers a release from current branch state. The uploaded artifact name also contains that SHA.

## Truth Boundary

- **Candidate:** committed `master` revision selected by a deploy run.
- **Release:** the exact candidate artifact successfully deployed by GitHub Pages.
- **Production-verified:** production `release.json.sha` equals the deploy-trigger SHA and the production smoke passes.
- Uncommitted local files are excluded from candidate, artifact, release, and production state, even if local tests include them.

## Verification

Local generator/schema contract, with no network dependency:

```powershell
cd web
npx tsx scripts/test-release-truth.ts
```

After deployment, fetch `https://jrambackup1-lgtm.github.io/partsource/release.json`. Post-deploy smoke requires its full SHA to equal `${{ github.sha }}`. Scheduled/manual monitoring validates the same two-field schema and timestamp without assuming an expected SHA.

Retain: commit SHA, `builtAt`, Actions run URL, artifact name/ID, deployment URL, smoke result, and verification UTC time. A local build or passing candidate test is not production evidence.
