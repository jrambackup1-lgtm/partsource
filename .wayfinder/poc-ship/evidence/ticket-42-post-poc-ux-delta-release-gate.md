# Ticket 42 — post-POC UX-delta release gate

**Date:** 2026-08-14
**Ticket:** [42 — Run the post-POC UX-delta release gate](../tickets/42-run-post-poc-ux-delta-release-gate.md)
**Scope:** `PS-POC-SYNTHETIC-V1` local synthetic fixture only.
**Decision:** **PASS — final release audit clean.**

## Gate command

```text
cd C:\Users\jayar\Projects\partsource\web
npm run release:audit
```

Final result: **PASS**, exit code `0`.

## Audit coverage

The repeatable local audit now covers:

- TypeScript compile/lint gate.
- Bundle contract validation.
- Resolver contract validation.
- URL-state validation.
- Authority-document and Ticket 39 proxy-evidence attachment guard.
- Production build.
- Browser acceptance suite.
- Static boundary guard.

Final observed audit output:

- `npm run lint`: pass.
- `npm test`: pass.
  - `POC bundle contract passed.`
  - `POC resolver Ticket 40 contract passed.`
  - `POC URL-state contract passed.`
- `npm run test:documents`: pass.
  - Confirms current authority docs and Ticket 39 proxy-evidence attachment remain present.
- `npm run build`: pass.
- `npm run test:browser`: pass, **26 passed**.
- `npm run test:boundary`: pass.

## Acceptance evidence

- Exact-ID `unique`, `unknown`, and `non_unique` states pass resolver and browser coverage.
- Exact highlight remains distinct from explicit row selection.
- Recognized, unsupported, conflict, exact-state, stop-reason, and provenance traces are visible in browser coverage.
- Typed filter visibility, zero-result states, unit/datum truth, row/detail facts, and separated provenance pass browser coverage.
- Browser coverage confirms keyboard operation, desktop/narrow detail behavior, focus and scroll restoration, direct URL safety, selection invalidation, and 320 CSS-px row behavior without horizontal page scroll.
- Adversarial query checks now include bare unsupported numbers, unsupported imperial units, OR, and negation-like input at resolver and browser seams.
- URL adversarial checks cover malformed encoding, contradictory family URLs, invalid selected records, and direct selected URLs.
- Boundary checks fail on external catalog/supplier/API route activity, runtime AI/API references in POC source, prohibited claims/controls in POC source, isolated detail routes, and Product/Offer/supplier metadata.
- Browser boundary checks fail on console/page errors, external requests, prohibited visible copy, prohibited accessible control copy, prohibited metadata, and isolated detail routes.
- Ticket 39 proxy-evidence gate remains attached; passing automation does not claim qualified approval.

## Subagent review evidence

Subagent review after Ticket 41 found three Ticket 42 hardening gaps:

1. Ticket 39 proxy-evidence attachment was not checked by the repeatable audit.
2. OR/negation adversarial coverage was incomplete at browser/audit seam.
3. Prohibited-copy/control checks were too narrow for accessible controls and static POC source.

Fixes applied before final pass:

- Added Ticket 39 evidence assertions to `web/scripts/poc/test-documents.ts`.
- Added OR/negation/bare-number/unsupported-unit resolver checks in `web/scripts/poc/test-resolver.ts`.
- Added browser adversarial query checks in `web/tests/browser/poc-progressive-traceable-workspace.spec.ts`.
- Expanded browser visible/accessibility/metadata boundary checks in `web/tests/browser/poc-progressive-release.spec.ts`.
- Expanded static POC source boundary checks in `web/scripts/poc/test-boundary.ts`.
- Fixed resolver hyphen handling so `M4 screws - black oxide` fails closed instead of becoming a supported finish filter.

## Boundary

This is a local deterministic synthetic POC release gate only. It is not deployment approval, publication approval, qualified mechanical approval, standards conformance, real source ingestion, supplier/BOM/commercial approval, or runtime AI authorization.
