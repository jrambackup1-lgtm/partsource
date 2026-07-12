# PartSource Production Runbook

Canonical site: `https://jrambackup1-lgtm.github.io/partsource/`
Canonical deploy branch: `master`
Owner: repository owner/maintainer. The person initiating or approving a deploy owns its verification and evidence.

## Deploy

`.github/workflows/deploy.yml` runs for every push to `master` and every manual dispatch. Its `verify` job performs `npm ci`, typecheck, tests, workflow-contract assertions, a production build, and browser tests before it uploads `pages-<commit SHA>`. The deploy job consumes that exact commit-tied artifact; it does not check out or rebuild the source.

1. Review the commit and confirm CI is green before merging or manually dispatching.
2. Open **Actions → Deploy static content to Pages** and identify the run by commit SHA.
3. Confirm `verify`, `deploy`, and the reusable `smoke` job succeed in that order.
4. Evidence: retain the Actions run URL, commit SHA, artifact name/ID from the job summary, deployment URL, and smoke log. Link them from the release/incident record.

Repository branch protection and the `github-pages` environment policy are external GitHub settings. This repository does not prove they are configured; verify them in GitHub before relying on them as approval controls.

## Production Smoke and Monitoring

`.github/workflows/production-monitoring.yml` runs after a deploy, twice hourly, and manually. It asserts both HTTP status and body content for:

- canonical root: `200`, PartSource shell;
- representative direct part route: `200`, `DIN912-M3X10` metadata;
- BOM URL `?tab=bom`: `200`, PartSource shell;
- `/reference`: GitHub Pages transport `404`, PartSource SPA fallback shell (the client then renders the known route);
- `sitemap.xml`: `200`, sitemap content;
- `robots.txt`: `200`, crawler directives;
- deliberately unknown route: `404`, PartSource fallback shell (the client renders the explicit **Not Found** state).

For failures, record the workflow run URL, failed URL, expected/actual status, expected content marker, commit SHA, and UTC time. A transport `404` for `/reference` is the current GitHub Pages SPA behavior; changing that expectation requires generating a static entry for that route.

## Roll Back Production

1. Identify the first bad production commit and last known-good commit from Git history and deploy evidence.
2. Create a normal revert with `git revert <bad-commit>`. Never rewrite `master` history.
3. Run the local verification gate from `web/`: `npm ci`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:browser`.
4. Push the revert commit to `master`; the normal gated workflow builds a new artifact and deploys it.
5. Confirm deploy and production smoke pass. Capture the same evidence listed above plus the bad, known-good, and revert SHAs.

If GitHub Pages or Actions is experiencing an outage, record the incident and retry after recovery; do not change application code to mask it.

## Safe Rollback Rehearsal (No Deploy)

Use a revision previously proven good in production:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .github/scripts/rehearse-rollback.ps1 -Revision <known-good-sha>
```

The script exports the selected revision into an isolated temporary checkout, then runs deterministic install, typecheck, tests, production build, and browser tests. It does not switch branches, modify a worktree, rewrite history, push, or deploy. It removes the temporary checkout and writes timestamped evidence under `.superpowers/evidence/`.

Evidence: retain the generated log with the chosen known-good SHA and result. Do not claim a rollback rehearsal was performed unless that log exists and ends in `PASS`.
