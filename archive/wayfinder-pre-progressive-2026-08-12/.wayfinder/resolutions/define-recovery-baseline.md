# Resolution comment — Define the recoverable repository baseline

## Decision

R0 starts from the committed `master` revision `d13df1cba77e68121e2c18190eb52145995c4bac`, not from an edited copy of the current checkout. The existing dirty checkout remains intact until all recovery evidence has been made and independently checked. A new `production-ready-v1` worktree is the only place where reconciliation happens.

## Required recovery artifacts

Before creating or retiring a worktree, create and push these durable recovery points:

- annotated archive refs for `master`, `phase1-exit-gate`, `phase2-domain-foundation`, `phase3-ui-foundation`, and `phase4-search-catalog-discovery`, named `archive/r0/<branch>-<short-sha>`;
- an annotated `archive/r0/phase4-snapshot-23bb136` ref;
- `research/evidence/r0-recovery-manifest.md`, recording the full SHA for every ref, all worktree paths and heads, `git status --short`, the tracked-change inventory, the untracked-file inventory, and SHA-256 digests of the preservation files;
- `research/evidence/r0-dirty-tree.patch`, made with `git diff --binary` from the original checkout; and
- `research/evidence/r0-untracked.zip`, containing every untracked file from that checkout, with its manifest entry.

Verify every archive ref with `git show`, verify the patch with `git apply --check` in a disposable copy, and verify the ZIP contents and digests before any retirement. The original checkout, old worktrees, refs, and archived research are never reset, deleted, or rewritten as part of R0.

## Reconciliation rule

Create `production-ready-v1` at the recorded `master` SHA only after the artifacts verify. Reconcile one file or cohesive change at a time, recording its source path, destination, contract rationale, and verification in the R0 manifest. A change enters the new worktree only when it is both reviewable and compatible with `research/product-contract.md`; history and evidence remain recoverable even when their code does not enter the baseline.

Retain the static Vite/React application, GitHub Pages deployment contract, standards/configuration research, correctly labelled supplier-search handoffs, browser-local BOM behavior, user-entered/imported USD costs, and client-side CSV/PDF exports as inputs to the later stage contracts.

Do not carry forward as baseline behavior: supplier offers or prices, price estimates, affiliate links, inventory/availability claims, quote/lead-capture flow, inferred or weakly evidenced McMaster cross-references, or any data claimed to be a published equivalent. Keep any needed code or fixtures only in the recovery archive; future R2-R3 test fixtures must be unmistakably synthetic and must not enter a production catalog. Existing single-BOM storage may be retained solely as a migration source for R4.

## R0 proof of completion

The R0 evidence must show:

- archive-ref, patch, and untracked-archive recovery checks passed;
- the new worktree is clean before reconciliation and each admitted change is traceable in the manifest;
- `npm run lint`, `npm test`, `npm run build`, `npm run test:browser`, product-truth/governance checks, and `git diff --check` pass in the reconciled worktree; and
- an independent reviewer confirms the manifest, contract classification, clean-tree state, and that no prohibited runtime claim survives.

Historical browser results do not satisfy this gate: the recorded 7/9 browser baseline must be rerun and pass after reconciliation.
