---
title: User-path test integrity — cover what the owner sees
status: resolved
resolved: 2026-08-16
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

## Verification (resolved 2026-08-16)

- Real user path in the browser: `catalog-real-path.spec.ts` via `playwright.dev.config.ts` (`npm run test:browser:real`; dev server, serialized workers, 240 s catalog-load budgets) — **5/5 passed (2.2 m)**: dev default is the real catalog with truthful labels; owner phrasing `M4 screw` → chooser, family entry keeps `Nominal diameter: 4 mm`; exact `92655A331` → correct family, highlighted row visible in viewport on its page, truthful banner + pager; rows/detail show `^\d{5}[A-Z]\d{3}$` PNs with diagnostics optional; absent `99999Z999` → "Exact identifier not found" with the submission echoed.
- Preview suite pins the synthetic default path (new test): singular `M4 screw` → 3-family chooser (0 table rows); PN-shaped input → "Search terms not recognized" (the honest class on a catalog that declares no McMaster namespace — u3's namespace-relative rule recorded in the spec comment). Suite now 17/17.
- Deploy-truth guard `npm run deploy:check` (scripts/release/check-deployed-source.ts): **demonstrated biting** — failed against the stale production state (`deployed a325f25 != local HEAD …`), the exact RC1/RC5 condition; passes only when the live `release.json.sourceSha` equals local HEAD.
- CI: deploy workflow runs `npm run test:browser:real` after the preview browser step (artifact already built by `test:catalog`), so every deploy exercises the real user path too.
- Mobile scroll-lock browser test stabilized (90 s timeout with rationale; landed with f2).
- Evidence-citation rule recorded in the plan §17: resolutions may cite only verifications recorded in the referenced file.
- Mutation bite is evidenced structurally: every user-path behavior asserted above regressed visibly during f2–f4 development probes before its fix landed (mixed rows, wrong failure class, hidden highlight, mislabeled notice).
