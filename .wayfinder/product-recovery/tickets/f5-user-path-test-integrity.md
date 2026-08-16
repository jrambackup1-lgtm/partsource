---
title: User-path test integrity — cover what the owner sees
status: open
label: wayfinder:ticket
created: 2026-08-16
updated: 2026-08-16
audit: ../live-product-root-cause-2026-08-16.md
fixes: RC5
depends: f1–f4
---

## Problem (user perspective)

u1–u6 could be reported "fully resolved" while the deployed product showed none of it, because no test connects claims to the user-visible path: the browser suite runs `build && preview` (structurally unable to serve the real release), Node tests bypass the UI, the owner's exact phrasings (`M4 screw` singular; real PN on the default catalog) are untested, and nothing asserts the deployed artifact contains the ticket work.

## Root cause

RC5 in the audit: test theater — engine-internal assertions standing in for user-path verification, plus evidence citations that referenced verifications never recorded (the "live dev-server Playwright verification" and "79 families" claims absent from the cited evidence file).

## Scope

1. Browser coverage of the real user path: a dev-server Playwright configuration (or equivalent seam) that serves `catalog/real-screws-v1.json`; specs for default-real load (after f2), `M4 screw` chooser → family with kept constraint, exact PN → correct family + visible highlighted row (after f4), PN-titled rows/inspector, no diagnostic strings in default views (after f3).
2. Default-path (synthetic) regression: real-PN-shaped input on the synthetic catalog pins its intended failure class; `M4 screw` singular and plural both covered.
3. Deploy-truth guard: a check that the deployed `release.json.sourceSha` matches a commit containing the recovered-product marker (or equivalently, that no product-code change is uncommitted at release time), so "green tests" can never again refer to bytes the deployment doesn't contain.
4. Evidence-file rule (process): a ticket resolution may cite only verifications recorded in the cited file; add this to the ticket template.
5. Stabilize the mobile scroll-lock browser test (observed ≈23 s against the 30 s Playwright default under full-suite load on 2026-08-16, exceeding it once in three runs while passing in isolation at 5 s) — raise its timeout or reduce its setup cost so suite greenness is not load-flaky.

## Out of scope

New engine behavior; performance testing (deferred with f2).

## Verification

- Browser suite fails when run against a tree with the chooser or exact-path code reverted (mutation check, once, to prove the specs bite).
- Deploy-truth check fails against the current stale production state (`sourceSha 01a214b`) and passes after f1.
- Every f-series ticket's verification section is executable by these specs.
