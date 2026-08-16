# Product recovery architecture red-team

**Date:** 2026-08-15  
**Decision:** **NO-GO for Phase 4 runtime implementation beyond bounded spikes; NO-GO for Phase 5 publication and Phase 6 deployment.**  
**Review posture:** adversarial review of current authorities, recovery plan, release-truth workflow/scripts, catalog contract/parser/synthetic package, nascent catalog engine, UX prototype decision/implementation, and preserved POC behavior. Synthetic and POC tests are treated as contract evidence, not mechanical or production truth.

## Executive result

The recovery direction has several good boundaries: one current product authority, deterministic/fail-closed resolution, namespace-aware identifiers, explicit synthetic labeling, a closed parser, selection distinct from exact highlighting, and BOM/supplier work deferred. Those boundaries are not yet end-to-end invariants.

The most dangerous seams are:

1. the release-truth gate is currently red and the workflow does not identify or verify the exact deployed bytes;
2. a structurally valid catalog can self-assert a fake final digest/public origin, while pending digests are intentionally mutation-blind;
3. identifier mappings are revision-bound, but the new index collapses them to configuration IDs whose displayed current revision may be different;
4. URL identity is tied to POC record IDs and no catalog release/digest, so a future catalog change can reinterpret a saved URL;
5. source permission, review authorization, correction, supersession, and withdrawal are not represented in the package contract;
6. package free text is a claims-injection seam and package size/text limits are absent;
7. the old POC still contains unsafe family aliases which must not be migrated, while the new engine is unexported and has no executable engine tests;
8. the UX prototype has exact-highlight/selection contradictions and mobile accessibility behavior that the decision record overstates.

## Executed evidence

Run from `web/` unless noted:

| Check | Result |
|---|---|
| `npm run lint` | **PASS** (`tsc --noEmit`) |
| `npm run test:catalog` | **PASS**: valid-package, adversarial-validation, and truth-state scripts |
| `npm run test:release` | **FAIL**: `test-release-truth.ts:149` expects a direct `npx tsx ...` workflow command, while `.github/workflows/deploy.yml:39-40` now uses `npm run test:release` |
| Mutate synthetic manifest notice, retain pending digest, parse | **ACCEPTED** as `sha256:pending:synthetic-screws-v1` |
| Convert synthetic package to `public_catalog`/`public_source`, use `sha256:` plus 64 zeroes, parse | **ACCEPTED** |
| Set `publishedAt` to `2026-02-31T00:00:00.000Z`, parse | **ACCEPTED** |
| Set a family label to `Verified equivalent — approved replacement`, parse | **ACCEPTED** |
| Add revision 2, leave exact mapping on revision 1, index and resolve | **ACCEPTED**; resolver returned mapping revision `synrec-v1-shcs-01:r1` while the list indexed current revision `synrev-v1-shcs-01-r2` |
| Fetch live `https://jrambackup1-lgtm.github.io/partsource/release.json` | **404** on 2026-08-15; expected before an authorized new deployment, but it proves there is no live release-truth endpoint yet |

The catalog script pass is real but only validates package/parser behavior. Search found no use of `createCatalogIndex`, `interpretCatalogQuery`, `resolveExactIdentifier`, `filterConfigurations`, or facet functions outside their own new engine files. The new engine is not exported by `web/src/catalog/index.ts:1-8` and is not exercised by `web/scripts/catalog/*`.

## Severity-ranked findings

### P0 — release truth is red and does not prove deployed-artifact identity

**Evidence**

- `.github/workflows/deploy.yml:38-40` invokes `npm run test:release`.
- `web/scripts/release/test-release-truth.ts:147-152` requires literal direct `npx tsx` commands, so the semantically equivalent package-script indirection fails today.
- `web/package.json:13-15` puts `test:release` inside `npm test`; `.github/workflows/deploy.yml:38-43` therefore attempts the same red test once directly and once via `release:audit`.
- `.github/workflows/deploy.yml:44-57` builds again after `release:audit`, then writes/verifies only `release.json` and uploads `dist`.
- `web/scripts/release/release-metadata.ts:6-9` contains only source `sha` and `builtAt`; there is no hash/manifest of uploaded application bytes.
- `.github/workflows/deploy.yml:4-5` permits manual dispatch, but there is no `github.ref == refs/heads/master` or approved-ref assertion before deployment.
- `.github/workflows/deploy.yml:59-67` has no post-deploy fetch/smoke, despite `research/release-truth.md:53` requiring one.
- `research/release-truth.md:20` says the uploader receives the “same tested” directory. Browser tests actually start their own build (`web/playwright.config.ts:16-19`), and the workflow performs another build afterward. Source SHA is useful provenance, but it is not a digest of the uploaded bytes.

**Impact**

Phase 6 could publish an arbitrary manually selected ref, rebuild bytes not exercised by browser tests, and report only a Git commit identity. Two rebuilds of one commit also share `sha` but have different `builtAt`; neither field proves byte identity. The current release gate cannot pass at all.

**Required correction**

Build once into a staged artifact, audit that exact directory, generate a closed file manifest/artifact digest without rebuilding, verify it, upload it, then fetch the deployed endpoint and critical assets. Enforce the approved branch/ref and deployment environment. Make the workflow test validate semantics/package-script resolution rather than one spelling, or use the exact command it asserts.

### P0 — revision-bound exact IDs can silently display a different current configuration revision

**Evidence**

- `web/src/catalog/contracts.ts:121-127` correctly maps an identifier to an immutable `configurationRevisionId`.
- `web/src/catalog/parse-catalog-package.ts:422-428` requires each configuration’s current pointer to the latest revision, but `:450-472` allows a mapping to any extant revision.
- `web/src/catalog/engine/exact-identifier.ts:4-6,18-27` converts mapping revision IDs to configuration IDs.
- `web/src/catalog/engine/catalog-index.ts:70-80` indexes list/detail records using the configuration’s current revision.
- `web/src/catalog/engine/filter-facets.ts:81-98` projects identifiers only when they target that current indexed revision.
- Executable probe: a mapping to revision 1 plus a new current revision 2 parsed successfully; exact resolution returned revision 1 while the catalog/list projection used revision 2.
- Current authority says exact identifier matching must not silently widen or reinterpret: `research/product-contract.md:156-182`, especially `:168-172` and `:178-182`.

**Impact**

A corrected configuration can cause an old exact identifier to highlight/show facts from the new revision even though the evidence mapping is tied to the old revision. This is precisely the mapping/configuration collapse the authority is designed to prevent.

**Required correction**

Choose and encode one policy before runtime: (a) exact resolution projects the mapped immutable revision; (b) a reviewed supersession record explicitly carries the mapping forward; or (c) stale/historical mappings return an explicit non-selecting state. Never derive display truth by replacing the mapped revision with `configuration.currentRevisionId` implicitly.

### P1 — catalog digest/publication authority is self-asserted, not verified

**Evidence**

- `web/src/catalog/contracts.ts:35-43` models `digest`, `allowedUse`, `dataOrigin`, and notice as ordinary manifest fields.
- `web/src/catalog/parse-catalog-package.ts:126-145` validates digest shape and allowed-use/origin pairing only.
- `web/src/catalog/parse-catalog-package.ts:529-547` calls itself the “sole public trust seam” but never recomputes a canonical digest or verifies a release signature/approved manifest.
- `web/src/catalog/synthetic-package.ts:115-124` intentionally uses a pending digest.
- `web/scripts/catalog/test-valid-package.ts:9-17` explicitly accepts that pending digest.
- Executable probes accepted arbitrary mutation under the same pending digest and accepted a fake all-zero final digest after self-asserting `public_catalog/public_source`.

**Impact**

The parser establishes structural self-consistency, not release identity, review authorization, or immutability. Calling it the sole trust seam invites synthetic-to-public promotion and mutable release content.

**Required correction**

Separate `parseStructure` from `verifyAuthorizedRelease`. Canonicalize and recompute the full package digest (excluding only the digest/signature envelope by a documented algorithm), bind it to an immutable review packet and approved release ID, reject pending digests outside explicit synthetic-dev entry points, and ensure the UI receives only verified packages.

### P1 — source rights, field-level publication authority, and lifecycle are absent

**Evidence**

- `research/data-source-register.md:12-16` distinguishes approved private data, blocked McMaster API data, discovery-only BOMs, and conditional standards facts.
- `research/product-contract.md:101-116` requires durable source identity and explicit review/claim boundaries.
- `web/src/catalog/contracts.ts:25-33` provenance contains only source kind, source ID, evidence ref, claim type, and synthetic flag.
- `web/src/catalog/contracts.ts:35-43` has only `synthetic` versus `public_source`; there is no approved-private source type, permission/grant ID, confidentiality/publication class, field-level allowlist, reviewer approval, effective interval, correction, supersession, or withdrawal.
- `web/src/catalog/contracts.ts:98-127` revisions and mappings have no lifecycle status or reason.
- `research/empirical-domain-family-release-review-2026-08-09.md:501-528` explicitly identifies correction/withdrawal and BOM-selection requirements as unresolved.

**Impact**

The only currently approved source cannot be represented truthfully without calling it public or leaking private lineage. A deleted/corrected mapping remains indistinguishable from an active one. Phase 5 cannot truthfully publish provenance or corrections with this schema.

**Required correction**

Add a separately governed source/review manifest that encodes source-register entry, permission basis, public/private projection rule, approved fields/claims, reviewer and digest, effective dates, correction/supersession/withdrawal, and public-safe evidence locators. Keep private lineage out of the client DTO.

### P1 — free text and package size are unbounded claims/availability seams

**Evidence**

- `web/src/catalog/parse-catalog-package.ts:33-55` requires non-empty strings/arrays but has no maximum lengths or cardinalities and no bidi/control-character policy.
- Labels, notice, source IDs, evidence refs, and fact-state reasons flow through the package (`web/src/catalog/contracts.ts:10-43,45-93`).
- `web/scripts/catalog/test-valid-package.ts:22-39` checks prohibited **field names**, not prohibited words or claims inside allowed free-text values.
- An executable probe parsed family label `Verified equivalent — approved replacement`.
- `web/src/catalog/parse-catalog-package.ts:510-521` recursively clones and freezes the entire caller-supplied object before any package byte/count budget is enforced.
- The date guard at `web/src/catalog/parse-catalog-package.ts:133-136` checks regex plus `Date.parse`, which accepted the impossible date `2026-02-31...` by rollover.

**Impact**

A structurally valid package can inject prohibited product claims into UI-visible strings, create log/screen-reader spoofing with controls/bidi text, or exhaust a browser with oversized arrays/strings. Invalid calendar dates can become release evidence.

**Required correction**

Define package byte, row, depth, and string limits before parsing; reject forbidden controls/bidi overrides; use strict calendar round-trip validation; and project public copy from typed, reviewed enums/templates rather than arbitrary source text. Run prohibited-claims checks over every public string and rendered accessibility/metadata surface.

### P1 — saved URL state has no catalog identity and is coupled to POC record IDs

**Evidence**

- `web/src/poc/url-state.ts:4-13` defines `v=1`, query/family/filters/selected but no catalog release ID or digest.
- `web/src/poc/url-state.ts:56-63` hard-codes `synrec-v1-(shcs|bhss|css)-NN` selected IDs.
- `web/src/poc/url-state.ts:92-100` re-resolves the current bundle and then validates selection against that result.
- The new contracts distinguish stable configuration IDs and immutable revision IDs (`web/src/catalog/contracts.ts:98-111`), but no new URL contract exists.
- The recovery plan requires mismatch handling at `.wayfinder/product-recovery/partsource-product-recovery-plan.md:583-591,858-865`.

**Impact**

A bookmarked query can silently produce different records after catalog replacement, and selected URLs will reject new production IDs or accidentally target a changed current revision. Browser-history acceptance from the POC is not enough because it only exercises one synthetic bundle.

**Required correction**

Version the production URL schema, carry catalog release/digest (and immutable selected revision when detail truth requires it), define mismatch/withdrawn states, migrate old POC URLs explicitly, reject duplicates/unknowns, and test Back/Forward/refresh across release changes.

### P1 — old POC family inference remains unsafe and must not be migrated

**Evidence**

- Current authority requires family boundaries that do not infer an internal-hex drive from head shape alone: `research/product-contract.md:73-78` and `research/prd.md:112-116`.
- The old POC maps `button head screws` and `countersunk screws` directly to socket-drive families in `web/src/poc/resolver.ts:21-25`.
- Old acceptance still treats `countersunk screws` as the countersunk socket family in `web/tests/browser/poc-progressive-benchmarks.spec.ts:5-8`.
- The recovery plan itself notes this correction at `.wayfinder/product-recovery/partsource-product-recovery-plan.md:141-146`.
- The new synthetic lexicon is safer and uses only `socket head cap screw`, `button head socket screw`, and `countersunk socket screw` (`web/src/catalog/synthetic-package.ts:192-199`).

**Impact**

“Preserve POC semantics” cannot be applied mechanically. Migrating this alias behavior would violate the new sole authority and silently narrow a query into the wrong drive-qualified family.

**Required correction**

Mark unsafe POC cases as explicit negative migration tests. Keep family terms release-owned and family-schema-reviewed; ambiguous head-only terms must stop at a safe hierarchy level or return unsupported, never socket-family results.

### P1 — the new catalog engine has no executable contract gate

**Evidence**

- Engine files exist at `web/src/catalog/engine/{catalog-index,exact-identifier,query-interpreter,filter-facets,types}.ts`.
- `web/src/catalog/index.ts:1-8` does not export them.
- No catalog script imports the engine functions; `web/package.json:13` calls only the three parser/package scripts.
- Engine exact state is based on mapping cardinality (`web/src/catalog/engine/exact-identifier.ts:18-27,41-50`), while record projection follows current revisions, causing the P0 mismatch above.
- `web/src/catalog/engine/query-interpreter.ts:49-155` and `filter-facets.ts:21-147` have no benchmark, property, or adversarial coverage.

**Impact**

Parser tests can all pass while exact IDs, query consumption, ordering, facets, provenance projection, and historical revisions are wrong. The current `lint` pass proves types only.

**Required correction**

Do not export/integrate the engine until it has deterministic corpus tests for zero/one/many exact mappings, normalized collisions, stale revisions, hierarchy conflicts, overlapping lexicon terms, unsupported syntax, duplicate filters, unknown/conflicting facts, stable sorting, self-excluding facet counts, and public projection.

### P2 — UX prototype contradicts exact-selection truth and clears valid selection too aggressively

**Evidence**

- The decision requires exact highlight distinct from selection and all six flows (`.wayfinder/product-recovery/evidence/ux-prototype-decision.md:31-57`).
- Prototype exact status always says “highlighted, not selected” (`.wayfinder/product-recovery/prototype/app.js:259-270`).
- A selected exact row’s accessible state contains both “highlighted, not selected” and “Explicitly selected” (`.wayfinder/product-recovery/prototype/app.js:337-342`).
- Every facet change clears selection unconditionally (`.wayfinder/product-recovery/prototype/app.js:447-454`), even when the selected row still matches. The old POC preserves selection when it remains in results (`web/src/poc/PocApp.tsx:33-38`).
- Prototype smoke checks the exact-not-selected state before selecting, but never asserts coherent wording after selection (`.wayfinder/product-recovery/prototype/smoke-test.mjs:45-53`).

**Impact**

Copying the composition can reintroduce the exact-highlight/selection confusion the recovery is meant to remove and can erase user state on harmless refinements.

**Required correction**

Model `exactMatchRevisionId`, `highlightedRecordId`, and `selectedRecordId` independently. Once the exact row is explicitly selected, every visible and accessible status must say both exact-highlighted and selected without “not selected.” Clear detail/selection only if the selected immutable record leaves the valid result set or becomes invalid/withdrawn.

### P2 — prototype mobile/accessibility evidence is not an implementation acceptance gate

**Evidence**

- The prototype decision calls the composition implementation-ready but still acknowledges specialist accessibility review remains (`.wayfinder/product-recovery/evidence/ux-prototype-decision.md:100-120`).
- Mobile detail is rendered as a plain `aside`; it has no dialog role/`aria-modal` (`.wayfinder/product-recovery/prototype/app.js:354-390`).
- Prototype result interaction is attached to focusable table rows (`.wayfinder/product-recovery/prototype/app.js:322-349`) rather than an explicit native control.
- Mobile filter sheet has no dialog semantics, inert background, focus trap, or explicit Escape contract (`.wayfinder/product-recovery/prototype/app.js:307-318`).
- Smoke uses 375 px (`.wayfinder/product-recovery/prototype/smoke-test.mjs:28-29`), not the 320 CSS-px authority gate; forced-colors is checked only by searching CSS text (`:82-84`).
- Current Playwright configuration is Chromium-only (`web/playwright.config.ts:15`) and repository browser tests have no axe/accessibility-tree, 200% zoom, forced-colors, or screen-reader checks.

**Impact**

The visual decision is useful, but it does not establish accessible semantics, focus containment, reflow at the required minimum width, high-contrast operation, or assistive-technology comprehension.

**Required correction**

Treat the prototype as a composition input only. Production tests must include native controls/row semantics, named landmarks, modal focus/inert/return behavior, 320 CSS-px and 200% zoom reflow, keyboard-only filters/results/detail, automated axe checks, forced-colors screenshots/assertions, and a manual screen-reader pass.

### P2 — synthetic truth can inflate confidence unless promotion is impossible

**Evidence**

- The package visibly labels itself synthetic (`web/src/catalog/synthetic-package.ts:4,117-124`) and generates 30 patterned records by copying ten tuples across three families (`:13-25,62-89`). This is appropriate fixture behavior, not engineering evidence.
- The source register has no approved public catalog (`research/data-source-register.md:12-16`).
- The recovery plan correctly says synthetic data cannot satisfy pilot/publication gates (`.wayfinder/product-recovery/partsource-product-recovery-plan.md:721-732`), but the parser can accept the same shape after manifest/provenance relabeling, as the executable probe showed.

**Impact**

Counts, facets, exact success, screenshots, and browser passes can be mistaken for catalog breadth or mechanical validation.

**Required correction**

Use a compile-time/runtime synthetic entry point that cannot be selected by production configuration, preserve a persistent non-dismissible notice, prohibit synthetic digests/provenance in publication CI, and report synthetic test counts separately from reviewed-source coverage.

### P3 — generic schema and future BOM planning risk premature abstraction/scope creep

**Evidence**

- The package builds a generic fact/schema/facet/lexicon/revision framework before one lawful reviewed public family exists (`web/src/catalog/contracts.ts:45-154`). It currently supports only numeric and string-enum primitives (`:4-5,46-56`), which is both broad infrastructure and insufficient for tolerances, rational imperial dimensions, standards editions, conditional applicability, and source notation.
- Current authority excludes BOM/workspace/supplier/commerce (`research/product-contract.md:192-213`).
- The plan defers local workspace until after product value evidence (`.wayfinder/product-recovery/partsource-product-recovery-plan.md:1040-1064`), which is the correct boundary, but extensive workspace architecture appears earlier at `:490-515`.

**Impact**

The team can spend effort on a universal EAV-like substrate or local BOM before exact recovery/discovery proves value, while still needing breaking schema changes for real mechanical truth.

**Required correction**

Keep Phase 4–6 family-bounded. Add only semantics demanded by a reviewed screw-family packet. No BOM routes, types, storage, import/export, supplier URLs, or workspace controls may enter runtime bundles before the separately authorized later-phase gate.

## Concrete phase gates

### Phase 4 — deterministic search/runtime gate

**Current verdict: FAIL / blocked.** Phase 4 may continue only as non-public, bounded test work.

All must pass:

1. **Authority corpus:** every family phrase has a positive/negative authority case; `button head screws` and `countersunk screws` must not resolve to socket-drive families. Zero unsafe family narrowing.
2. **Engine contract:** engine is exported only after unit/property/adversarial tests cover hierarchy, query consumption, AND filters, duplicate/unknown filters, exact zero/one/many, same-ID cross-namespace behavior, collisions, stale revisions, deterministic sort, facets, unknown/conflicting values, and provenance projection.
3. **Exact invariant:** an exact mapping’s immutable revision is the displayed revision, or an explicit reviewed supersession/withdrawal state blocks highlight. Zero implicit current-revision substitution.
4. **Package trust:** runtime accepts only a deeply frozen, size-bounded package from the parser; public mode additionally requires a recomputed approved digest. Pending/synthetic packages can run only in explicit demo mode with persistent notice.
5. **URL v2:** release ID/digest and immutable selection semantics are serialized. Duplicate, malformed, stale-release, withdrawn, and unknown states fail closed. Back/Forward/refresh tests cover list, exact highlight, selected detail, filters, and mismatch.
6. **Selection:** exact highlight never opens detail; user selection survives valid filtering and clears only on true invalidation. Visible and accessible state never says both “not selected” and selected.
7. **Accessibility:** keyboard-only, 320 CSS-px, 200% zoom, modal focus/inert/return, no horizontal page scroll, forced-colors, axe, and a manual screen-reader script pass.
8. **No scope leak:** production bundle/source/static/dynamic checks contain no BOM/workspace storage, supplier/offer, equivalence/replacement, AI/API, commerce, or isolated part-page behavior.

### Phase 5 — detail/provenance/reviewed-data gate

**Current verdict: FAIL / blocked.** Synthetic truth cannot pass this phase.

All must pass:

1. **Authorized source packet:** each public fact and mapping resolves to a source-register entry, explicit permission basis, field-level publication allowance, public-safe evidence locator, reviewer, review timestamp, and exact package digest. Private lineage never reaches the public DTO.
2. **Lifecycle:** revisions/mappings support active, corrected, superseded, and withdrawn states with reason/effective time/replacement. Historical exact IDs never silently show changed facts.
3. **Mechanical review:** a named qualified reviewer approves the bounded family profile, normalization rules, answer key, and immutable release digest. Test self-consistency is not approval.
4. **Truth-state UI:** known/not supplied/unknown/not applicable/conflicting are visibly distinct; no generic verified badge, equivalence, suitability, approval, standards-conformance, offer, price, stock, or availability claim.
5. **Claims projection:** all public free text is allowlisted/templated, size/control sanitized, and checked in visible copy, accessible names/descriptions, metadata, exports, and error states.
6. **Digest/replay:** final digest recomputes exactly; pending/fake digests fail; correction and withdrawal fixtures replay deterministically against old URLs and snapshots.
7. **No BOM approval:** detail cannot be treated as BOM selection, approved alternate, supplier listing, or procurement evidence.

### Phase 6 — hardening/release/deployment gate

**Current verdict: FAIL / blocked.** No deployment is authorized by this review.

All must pass:

1. `npm run test:release` and the complete release audit pass from a clean checkout; tests do not depend on one equivalent spelling of a command.
2. Workflow rejects any unapproved ref; only the protected canonical branch/environment can deploy.
3. Build exactly once. Tests and static boundary checks run against the exact staged `dist`; a deterministic file manifest/artifact SHA-256 is generated and verified before that same directory is uploaded.
4. `/partsource/release.json` carries/links code source SHA, artifact digest, and build time under a versioned closed schema. The app also exposes the verified catalog release ID/digest and blocks code/catalog mismatch.
5. Post-deploy checks fetch the canonical HTTPS URL, require endpoint `200`, exact expected SHA/artifact/catalog identities, valid content type/schema, load critical hashed assets, run the browser smoke, and fail the deployment job on mismatch.
6. Rollback redeploys a retained previously verified artifact/catalog pair; it does not rebuild an old commit and call that the same artifact.
7. Production monitoring distinguishes unavailable, corrupt, code/catalog mismatch, and withdrawn release states without falling back to synthetic or stale data.
8. Full browser/accessibility/claims/external-request gates pass against the deployed URL, not only local preview.
9. Live `release.json` is no longer 404 and its identity matches the approved deployment evidence packet.

## Positive seams to preserve

- Sole current product authority and explicit historical labeling: `AGENTS.md:19-29`.
- Exact highlight versus explicit detail selection: `research/product-contract.md:161-180`.
- Synthetic visible notice and non-production allowed use: `web/src/catalog/synthetic-package.ts:4,117-124`.
- Closed-object/reference/truth-state parser checks: `web/src/catalog/parse-catalog-package.ts:33-55,360-430,529-547`.
- New safe drive-qualified lexicon terms: `web/src/catalog/synthetic-package.ts:192-199`.
- BOM/supplier deferral in the current contract and phase plan: `research/product-contract.md:192-213`; `.wayfinder/product-recovery/partsource-product-recovery-plan.md:1040-1064`.

These are necessary but not sufficient. The Phase 4 runtime should not begin integration until the P0 revision/exact seam and the Phase 4 gates are made executable.