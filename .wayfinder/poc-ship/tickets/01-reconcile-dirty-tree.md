# 01 — Reconcile dirty tree into a POC candidate

**Blocked by:** None — can start immediately

**Status:** closed — out of scope after C rethink 2026-08-10

**C boundary:** Closed without completion. The current destination is a paid no-build direction decision, not a deployable POC candidate.

## What to build

Create a reviewable candidate state from the current mixed checkout without losing recovery/provenance. The end state is one coherent worktree/branch where required files are tracked, abandoned files are parked or archived, and local tests run against the same content that can be committed/deployed.

## Acceptance criteria

- [ ] Capture `git status --short`, staged diff, unstaged diff, and untracked inventory as recovery evidence.
- [ ] Classify every staged/modified/untracked item as POC-critical, archive/history, or exclude.
- [ ] Resolve `MM` files such as `web/package.json` so index and worktree do not disagree.
- [ ] No required script/data/import remains untracked.
- [ ] No deleted research history is lost without archive replacement being tracked or explicitly excluded.
- [ ] End with a candidate status report: clean or exact remaining dirty files with reasons.

## Historical resolution

Closed for the POC packet on 2026-08-08.

- Dirty tree was reviewed and turned into a POC candidate.
- Old evidence files were removed to keep this map simple.
- Current direction lives in `../poc-ship-map.md`.

## Reopened audit — 2026-08-10

The current workspace again has a large mixed staged/modified/untracked state, including `MM` paths and required untracked work. The old detailed inventory/classification evidence cited by the original close was removed. Ticket 01 is open again until the current tree has a durable inventory, classification, and exact candidate-state report.

Audit: `research/wayfinder-ticket-audit-2026-08-10.md`.
