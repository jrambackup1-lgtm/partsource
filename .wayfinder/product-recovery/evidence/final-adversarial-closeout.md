# Final adversarial recovery closeout

**Date:** 2026-08-16 (updated from 2026-08-15)
**Verdict:** **GO for a clearly labelled synthetic release candidate; NO-GO for real-family publication, external validation claims, Workspace/BOM, or a production-deployed claim without deployment evidence.**
**Baseline:** Reassessment of `architecture-red-team.md`; that file remains the dated original finding record.

## Finding disposition

| Original finding | Current disposition | Evidence / residual risk |
|---|---|---|
| P0 release truth red; deployed bytes unidentified | **FIXED + TESTED locally** | Closed `/release.json`, exact artifact manifest/digest, staged-byte workflow and deployed-byte verifier are covered by release tests. No actual production deployment or live verification is claimed |
| P0 exact mapping could display another current revision | **FIXED + TESTED** | Exact-resolution engine retains immutable revision semantics and adversarial engine coverage |
| P1 digest/publication authority self-asserted | **FIXED for package trust seam; EXTERNAL-BLOCKED for publication** | Canonical finalized SHA-256 and trusted approval boundary are tested; no real candidate digest has permission/mechanical approval |
| P1 source rights, review, and lifecycle absent | **SCHEMA/BOUNDARY FIXED; EXTERNAL-BLOCKED** | Permission/trusted-review/lifecycle boundaries and pilot refusals are represented; no real family completed required review |
| P1 free text, dates, and package size unbounded | **FIXED + TESTED** | Closed parser/adversarial suite enforces bounds, claims/control checks, and strict dates |
| P1 URL lacked catalog identity | **FIXED + TESTED** | URL v2 serializes release/digest and immutable selection semantics; stale/malformed/history cases execute in catalog tests |
| P1 unsafe broad aliases | **FIXED + TESTED** | `stainless`, generic button-head, and generic countersunk fail closed; `A2 stainless` exact phrase remains supported by the synthetic package. Family routing aliases (`socket head screw(s)` → shcs) are spec-published (POC spec B02, line 395) and distinct from fact inference — they route context without adding typed facts |
| P1 engine had no executable gate | **FIXED + TESTED** | Engine is integrated and exercised for query/exact/filter/facet/revision/order/projection plus URL/history |
| P2 exact-highlight/selection contradiction | **FIXED + TESTED in product shell** | Exact search highlights without selecting/opening; click/Enter explicitly selects; browser tests cover state transition |
| P2 mobile/accessibility evidence overstated | **PARTLY FIXED; EXTERNAL-HUMAN GATE OPEN** | Keyboard/mobile automated scenarios pass; manual screen-reader, assistive-technology, and participant comprehension evidence is absent |
| P2 synthetic truth could be promoted accidentally | **FIXED as technical boundary; publication remains blocked** | Persistent synthetic labeling, finalized synthetic identity, trusted approval seam, pilot attestation, and boundary tests. Synthetic success still cannot imply mechanical truth |
| P3 premature generic/BOM scope | **FIXED by decision boundary** | Workspace/BOM is DEFER with no implementation; family scope remains synthetic and bounded |

## Adversarial claims check

Allowed current claim: the repository has a modern deterministic Home/Catalog synthetic release candidate whose local `release:audit` passes and whose app/catalog identities are separate.

Disallowed claims remain: real engineer validation; qualified mechanical approval; a lawfully completed real family; permission to publish a candidate real digest; production deployment/live endpoint verification; suitability, equivalence, approval, supplier/offer truth; or Workspace/BOM completion.

## Final residual gates

1. Complete a private field map and qualified mechanical review for one eligible candidate family; bind source/publication approval to its exact digest. The 2026-08-16 real-data aggregate audit (27,009 records, 3 families) identified one structural blocker (112 blank identifiers in socket-head-cap-screws) and mixed `in`/`mm` unit fields requiring normalization adjudication — these must be resolved before any real-family candidate can proceed.
2. Run the 6–8 practicing-engineer study in `engineer-validation-proxy.md`; do not convert automation into participant evidence.
3. Perform dedicated assistive-technology review.
4. ~~Replace the currently observed public POC deployment only after explicit publication approval.~~ **RESOLVED 2026-08-16:** the recovered candidate was deployed under owner authorization in the recovery session (workflow run 31926209080, source `01a214b`, artifact digest `016698c7…bb9a`). Post-deploy exact-byte verification succeeded in-workflow and independently (11/11 files). `/partsource/release.json` now returns the closed release schema pinned to the deployment commit. The catalog remains synthetic; this deployment claim covers application identity only.
5. Keep Workspace/BOM deferred unless the evidence triggers and explicit contract-change gate pass.

## 2026-08-16 adversarial re-verification

First-hand adversarial checks completed:
- **Forbidden vocabulary:** zero hits for supplier/price/stock/lead-time/verified/approved/equivalent/replacement/suitability in UI strings, engine logic, or synthetic package data.
- **Conflict handling:** verified `query_conflict` fail-closed path (resolver.ts:115-120); conflicting fact values demote to common ancestor, never silently resolved.
- **URL safety:** strict allowlist, duplicate-param rejection, release/digest pin check, malformed-encoding rejection, invalid_selection/invalid_url_state discriminated unions.
- **Digest canonicality:** sorted-key canonical JSON, SHA-256, omit-only-digest-field — cannot be spoofed by key reordering.
- **CI/local boundary:** CI requires `PARTSOURCE_RELEASE_SHA`; local emits `LOCAL/NON-PRODUCTION` and cannot be confused with production evidence.
- **SelectedRecordId:** only set by explicit `selectCatalogRecord` or `activateCatalogRecord`; non-exact search never sets it.
- **Facet self-exclusion:** verified in filter-facets.ts:158 — counts exclude the active facet value per the exclusion parameter.

These are external/operational gates, not reasons to mislabel the synthetic candidate as unfinished or real.
