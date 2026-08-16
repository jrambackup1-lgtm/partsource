# Empirical Supplier-Query Translation Validation — 2026-08-09

## Executive result

**Measured outcome: FAIL for release-aware supplier handoff.** URL construction and the lab's explicit blocked-state compositions behaved correctly, but the current runtime did not preserve or gate enough truth to support supplier-query translation safely:

- the current generic query preserved **5/8** declared configuration facts and omitted pitch, drive, and standard;
- reserved-character and ordinary-query URL round trips passed **10/10** checks across five configured destinations;
- prototype 006 passed **6/6** explicitly designated no-alternate-translation states (exact-ID translation, partial, conflict, unsupported, unavailable, and confidential-lineage), while keeping the exact-ID source-direct action separate;
- the current browser runtime passed only **1/4** exercised block decisions: the unmapped exact identifier was blocked, but partial, conflict, and unsupported-bearing inputs each exposed five alternate-supplier links;
- the current runtime silently filled or collapsed facts in **3/3** unsafe non-exact route fixtures: missing pitch became `0.7 mm`, conflicting pitches collapsed to displayed `0.7 mm`, and bearing input became `Fasteners / Custom Fastener`;
- five official alternate destinations were opened. Zoro rendered the query; Bolt Depot presented security verification; MSC returned an access-denial incident page; Fastenal and MISUMI returned access denied. These blocks are automation limitations, not evidence about any item;
- on the one observable result surface, Zoro retained the query exactly. The first ten result-heading strings all remained in the socket-head-cap-screw family, so **0/10 observed family-category drift** was recorded there, but only **1/10** echoed every explicit generic-query constraint. This is result broadening/constraint drift, not an identity, listing, equivalence, compatibility, suitability, stock, price, offer, or availability finding.

The transparent packet remains the only tested representation with **8/8 public configuration facts**. The result does not justify supplier handoff as a core completion event or destination-specific syntax as a dependable improvement.

## Status, scope, and non-claims

- **Phase:** Empirical/domain validation only.
- **Artifact created first:** this report skeleton was created before repository inspection or destination execution, then completed with measured evidence.
- **Production edits:** none.
- **Routes/features:** no `/to-spec` work or use.
- **External actions:** official destination pages were opened by GET navigation only. No forms, carts, accounts, messages, contacts, purchases, requests, uploads, or external submissions were made.
- **Source boundary:** no prohibited supplier scraping, bulk collection, login bypass, or confidential raw lineage was used.
- **Claim boundary:** a configuration, query, URL, destination page, or result heading is not treated here as a supplier listing, offer, equivalent, approved alternate, replacement, compatible item, suitable item, price, stock state, or availability state.
- **Human participants:** **none**. This was an internal fixture and browser-behavior validation. It makes no claim about human comprehension, preference, usefulness, saved time, adoption, or value.

## Required eight-label taxonomy

All classified findings use the repository's required labels:

1. **Evidence**
2. **Fundamental requirement**
3. **Strong hypothesis**
4. **Opportunity / gold idea**
5. **Nice-to-have**
6. **Open question**
7. **Risk**
8. **Rejected**

## Repository basis and frozen evidence

The following authoritative or requested artifacts were read before evaluation:

- `research/validation-targeted-ideation-synthesis-2026-08-09.md`
- `research/validation-supplier-handoff-2026-08-09.md`
- `research/product-contract.md`
- `research/data-source-register.md`
- `research/empirical-a-vs-b-bom-preflight-duel-2026-08-09.md`
- `sketches/006-supplier-handoff-lab/README.md` and `index.html`
- `sketches/007-engineering-workspace-directions/README.md` and `index.html`
- `web/src/lib/decoder.ts`
- `web/src/lib/catalogApi.ts`
- `web/src/pages/PartDetail.tsx`

Frozen SHA-256 values at execution:

| Artifact | SHA-256 |
|---|---|
| `research/validation-supplier-handoff-2026-08-09.md` | `ddfb0682c7d5878c28d8e7767be078e22a2cc80d02f4603a80497b69bb7753a7` |
| `research/product-contract.md` | `aa073aeb09f3636b6f625ef6efb19c8c9e5da74b4b15a55b269238db883e4ac1` |
| `research/data-source-register.md` | `e902eacfb2b5c1f6eaee382e6e0f5c1e1c9df8769fbb089da73b5c47f92d77bf` |
| `research/validation-targeted-ideation-synthesis-2026-08-09.md` | `a5df8ce6b45e715cfeb0ec0f9a98f1af870eedb93ee82ce3a23d13c8d6278de4` |
| `research/empirical-a-vs-b-bom-preflight-duel-2026-08-09.md` | `ce8e15da835b6ee4655a7d858ce5a406e0c9f7fb584413be687047b1ac4f135d` |
| `sketches/006-supplier-handoff-lab/index.html` | `4613a799629194482a6e135bb9dd58df1b4737eae6b77f77384bb57add5cb211` |
| `sketches/007-engineering-workspace-directions/index.html` | `a5ee9873090e680de69d34cef136c32f998599135fbb4900043155ae92ad4859` |
| `web/src/lib/decoder.ts` | `2e8d4213941facef27e612a3d962c2863d7c99b7a14b07a1a31e37bd0fd424f3` |
| `web/src/lib/catalogApi.ts` | `ed4d7d426a4916e8ac0d85e0d558524a35724c71b45cb458c8ef6897e3292902` |
| `web/src/pages/PartDetail.tsx` | `b4f961a489cd7a6fac5ad268633dc2faf461c47a89cb0e83cc56314ab82cb373` |

The working tree was already substantially dirty. This validation did not modify or clean unrelated files.

## Fixtures and expected dispositions

Only repository-safe wording and configuration facts were used. No confidential origin, private row ID, private source SKU, or lineage value was copied into this report.

| Fixture | Preserved input/facts | Expected handoff disposition |
|---|---|---|
| Exact ID | `91290A115` | Source-direct URL only; preserve the identifier exactly; block alternate-supplier translation. |
| Selected configuration | `DIN912-M3X10`: socket head cap screw; M3; 0.5 mm pitch; 10 mm; alloy steel; black oxide; hex; DIN 912 / ISO 4762 | Evaluate transparent packet and alternate-search query as fixtures only; do not infer any destination relationship. |
| Partial | `M4 socket head cap screw` | Block; do not fill pitch, length, material, finish, drive, or standard for handoff. |
| Conflict | `M4 × 1.5 × 12 mm; selected record says M4 × 0.7 × 12 mm` | Block; preserve both pitch claims; choose neither. |
| Unsupported | `BRG-608ZZ deep groove bearing` | Block; retain bearing category; do not emit `custom fastener`. |
| Unavailable | `91290A115` with configuration-service failure | Block; retain input; no stale configuration or alternate query. |
| Confidential lineage | Reviewed public facts plus private origin/IDs/SKU/lineage notes, with no private value reproduced | Block until a strict public projection excludes every private field. |
| URL-encoding control | Repository test fixture `#10-24 ... 1/2" ...` | Reserved characters must survive encode/decode round trip. This fixture is an encoding control, not a destination-result claim. |

### Eight fact-preservation fields

The denominator was frozen as: **family, thread diameter/designation, pitch, length, material, finish, drive, standard**. A field counted as exact when its supplied value survived in the outgoing text, allowing only formatting changes such as spaces/hyphens or `10` versus `10.00`. A partial field retained only part of a compound supplied value. Omitted fields were not silently credited from category conventions.

## Method

1. Read the authoritative synthesis, handoff validation, product contract, source register, prototypes 006/007, current supplier URL/compiler code, and the empirical A-vs-B report.
2. Executed `buildSupplierQuery` and `getSupplierSearchUrl` against the current `DIN912-M3X10` configuration facts.
3. Executed a second URL round-trip control containing `#`, `/`, and `"` across all five configured destinations.
4. Served prototype 006 locally and programmatically exercised all seven tabs, all three handoff formats, emitted link counts, text, and hrefs.
5. Served the current Vite runtime locally and browser-exercised exact, indexed configuration, partial, conflict, and unsupported-bearing routes.
6. Opened official destination URLs in a browser. No destination result was promoted to a PartSource relationship or commercial claim.
7. Ran the existing catalog API and decoder checks.

## Separation of handoff types

### A. Source-direct exact-ID opening

Prototype 006 emitted exactly one source-direct URL:

```text
https://www.mcmaster.com/91290A115
```

Measured properties:

- identifier text in source path: **1/1 exact**;
- alternate-supplier query links in the exact fixture: **0**;
- translation of the identifier: **0**;
- official landing URL retained `/91290A115`: **pass**;
- the official page presented a login gate in this browser, so no item-detail inference was possible or made.

The current production runtime behaved differently: `/parts/91290A115` showed `No supported configuration yet` and no supplier-search links. That correctly blocked alternate translation but did not expose the separate source-direct action represented by prototype 006.

### B. Alternate-supplier specification translation

The indexed configuration route emitted a specification-derived generic query to five alternate destinations. It did not include `91290A115`. The path is therefore mechanically separate from the exact-ID source-direct path, but its fact completeness and gating failed the release-aware standard below.

## Current generated query and URLs

Current query from `buildSupplierQuery(DIN912-M3X10)`:

```text
M3 socket head cap screw 10mm black-oxide alloy steel
```

| Destination | Current generated URL | Query parameter |
|---|---|---|
| Zoro | `https://www.zoro.com/search?q=M3%20socket%20head%20cap%20screw%2010mm%20black-oxide%20alloy%20steel` | `q` |
| Bolt Depot | `https://www.boltdepot.com/Product-Search.aspx?txt=M3%20socket%20head%20cap%20screw%2010mm%20black-oxide%20alloy%20steel` | `txt` |
| MSC Industrial | `https://www.mscdirect.com/browse/tn?searchterm=M3%20socket%20head%20cap%20screw%2010mm%20black-oxide%20alloy%20steel` | `searchterm` |
| Fastenal | `https://www.fastenal.com/products/search?term=M3%20socket%20head%20cap%20screw%2010mm%20black-oxide%20alloy%20steel` | `term` |
| MISUMI | `https://us.misumi-ec.com/vona2/result/?Keyword=M3%20socket%20head%20cap%20screw%2010mm%20black-oxide%20alloy%20steel` | `Keyword` |

All five decoded query parameters equaled the source query byte-for-byte after normal URL parsing: **5/5 pass**.

### Query fact preservation

| Representation | Family | Thread | Pitch | Length | Material | Finish | Drive | Standard | Score |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Current generic query used by all five destinations | exact | exact | omitted | exact | exact | exact | omitted | omitted | **5 exact / 8** |
| Prototype 006 Zoro syntax | exact | exact | omitted | exact | exact | exact | omitted | omitted | **5 exact / 8** |
| Prototype 006 MSC syntax: `M3x0.5 10.00 mm hex socket cap screw alloy steel black oxide` | partial family wording | exact | exact | exact | exact | exact | exact | omitted | **6 exact + 1 partial / 8** |
| Prototype 006 Fastenal syntax: `M3-0.5 x 10mm socket head cap screw ISO 4762 black oxide alloy steel` | exact | exact | exact | exact | exact | exact | omitted | partial (`ISO 4762` retained; `DIN 912` omitted) | **6 exact + 1 partial / 8** |
| Prototype 006 transparent packet | exact | exact | exact | exact | exact | exact | exact | exact | **8 exact / 8** |

No destination-specific query reached 8/8. The MSC and Fastenal variants transformed notation but did not silently replace an explicit numeric, material, or finish value in the emitted query. Their omissions remain material: MSC omitted the standard; Fastenal omitted the explicit drive and half of the compound standard reference.

### Reserved-character encoding control

Current query:

```text
#10-24 socket head cap screw 1/2" black-oxide alloy steel
```

For each of the five templates:

- `#` encoded as `%23` rather than becoming a fragment;
- `/` encoded as `%2F`;
- `"` encoded as `%22`;
- spaces encoded as `%20`;
- parsed query value exactly equaled the source query.

Result: **5/5 pass**. Combined with the ordinary M3 query, URL encode/decode round trips passed **10/10**.

## Official destination landing behavior

Observed behavior is recorded as destination behavior only. A blocked or broad page does not establish item absence, presence, or any relationship.

| Official destination | URL-level query retained? | Rendered query observable? | Landing behavior | Query loss / drift finding |
|---|---:|---:|---|---|
| Zoro | yes | yes | Search surface rendered. Search input and title retained the exact generic query. | **0 query loss** on the rendered input. Broad result ordering observed. |
| Bolt Depot | yes | no | Cloudflare `Performing security verification`. | URL retained; destination interpretation **not evaluable**. |
| MSC Industrial | yes | no | Access-denial incident page for both generic and prototype-specific syntax. | URL retained; destination interpretation **not evaluable**. |
| Fastenal | yes | no | `Access Denied` for both generic and prototype-specific syntax. | URL retained; destination interpretation **not evaluable**. |
| MISUMI | yes | no | `Access Denied`. | URL retained; destination interpretation **not evaluable**. |

Summary:

- destination URLs retaining their generated query parameter: **5/5**;
- destination applications visibly rendering the query: **1/5**;
- visible rendered-query preservation where observable: **1/1**;
- destination applications blocked before interpretation: **4/5**;
- cross-destination result relevance or category behavior proven: **no**.

### Zoro result-heading drift sample

The first ten visible result-heading strings were recorded without opening any result:

- family category remained socket head cap screw: **10/10**;
- heading strings that echoed every explicit generic-query constraint (`M3`, `10 mm`, black oxide, alloy steel, socket head cap screw): **1/10**;
- heading strings with an explicit different thread/measurement system, length, material/finish wording, or a missing required query constraint: **9/10**;
- observed family-category drift: **0/10**;
- observed constraint/specification drift: **9/10**.

This only measures displayed search-heading text. It does not establish identity, equivalence, compatibility, suitability, or any commercial state.

## Blocked-state correctness and silent substitutions

### Prototype 006 state matrix

| State | Alternate links | Source-direct links | Expected | Outcome |
|---|---:|---:|---|---|
| Exact ID | 0 | 1 | Preserve exact ID; block alternate translation | **PASS** |
| Partial | 0 | 0 | Block | **PASS** |
| Conflict | 0 | 0 | Block and preserve both pitch claims | **PASS** |
| Unsupported bearing | 0 | 0 | Block; preserve bearing wording | **PASS** |
| Service unavailable | 0 | 0 | Block; retain input; no stale output | **PASS** |
| Confidential lineage | 0 | 0 | Block until private lineage is removed | **PASS** |

Prototype explicit blocked-state result: **6/6 pass**.

A separate release-boundary defect remains: prototype 006 labels the fully specified compiler fixture `Compiler fixture — not released` while exposing its three experimental alternate links. That is acceptable only as a clearly bounded empirical lab affordance; it would **fail** the stated active/reviewed/release-aware production handoff gate.

### Current browser runtime

| Exercised input | Runtime state/display | Alternate links | Silent substitution or loss | Expected | Outcome |
|---|---|---:|---|---|---|
| `91290A115` | `No supported configuration yet` | 0 | No alternate translation | Block alternate translation | **PASS** |
| `M4 socket head cap screw` | `configuration-search`; displayed pitch `0.7 mm`, drive `Hex`, standard `DIN 912 / ISO 4762`, length/material/finish unknown | 5 | Missing pitch was filled in the displayed state; query dropped the filled pitch and all unresolved facts | Block partial | **FAIL** |
| conflicting M4 pitches | `configuration-search`; displayed `Custom Fastener`, pitch `0.7 mm`; query `M4 custom fastener 12mm` | 5 | Two explicit pitch claims collapsed to one displayed pitch; outgoing query dropped both pitch claims and conflict state | Block conflict | **FAIL** |
| `BRG-608ZZ deep groove bearing` | `invalid-input`; displayed `Fasteners / Custom Fastener`; query `custom fastener` | 5 | Bearing category and identifier were lost; category recast to fastener | Block unsupported | **FAIL** |

Current browser-exercised block result: **1/4 pass**.

Additional boundaries:

- `search-unavailable` has an early-return composition stating that no supplier handoff is shown, but an injected current-runtime service failure was not independently exercised in this pass; prototype 006 supplied the empirical unavailable-state check.
- the current supplier URL helper receives only a `Part` and has no partial/conflict/confidential/release-state parameter. It therefore cannot enforce those gates itself.
- `PartDetail` includes `Source SKU` in source notes when present and freezes source notes with supplier destinations in the BOM snapshot. This code-path observation does not reproduce confidential data, but it confirms that confidentiality must be enforced by a strict public projection before handoff/snapshot construction rather than by query formatting.

## Silent-substitution measurement

Definitions:

- **silent substitution:** an absent or conflicting selection-critical fact becomes one displayed value without an explicit blocking decision;
- **query omission:** a known explicit configuration fact is absent from the outgoing query;
- **category recast:** input category wording is replaced by a different category in the handoff state;
- **destination drift:** the destination renders broader/different result-heading constraints after receiving the query.

Measured counts:

| Measure | Result |
|---|---:|
| Explicit full-configuration values changed by current generic query | **0** |
| Full-configuration facts omitted by current generic query | **3/8** |
| Unsafe current runtime fixtures with a silent fill/collapse/category recast | **3/3** |
| Prototype explicit blocked fixtures with any emitted alternate query | **0/6** |
| Zoro visible heading sample with constraint drift | **9/10** |
| Zoro visible heading sample with family-category drift | **0/10** |

The absence of an explicit changed value in the full query does not make it complete; pitch, drive, and standard disappear. Conversely, the unsafe routes mutate state before query generation and then often omit the mutated field, making the loss less visible rather than safer.

## Existing automated checks

Executed without modification:

```text
npm run test:catalog-api
./node_modules/.bin/tsx scripts/test-decoder.ts
```

Results:

- catalog API client checks: **passed**;
- decoder checks: **28 passed, 0 failed**.

These tests verify URL shape, encoding, labels, absence of prohibited commercial fields, and decoder behavior. They do not prove release-aware handoff gating: the browser run showed links on partial, conflict, and unsupported-bearing routes despite the green checks.

## Human-comprehension boundary and exact combined-study prompts

No participants were recruited, observed, or represented by an agent. Therefore, this report makes **no human-comprehension claim**.

For the combined A/B study defined in the synthesis, use the following prompts verbatim after showing the same fixture/state in A and B. Do not supply the answer inside the prompt, and record the participant's exact response before clarification.

1. **Object claim:** “In your own words, what is PartSource saying this object is?”
2. **Not established:** “What, if anything, does this screen establish about a supplier having an item corresponding to these facts?”
3. **Relationship boundary:** “What, if anything, does this screen establish about equivalence, compatibility, or suitability for your application?”
4. **Commercial boundary:** “What, if anything, can you conclude here about price, stock, availability, or an offer?”
5. **Path distinction:** “What is the difference between ‘Open user-supplied ID at McMaster’ and ‘Search this configuration on [supplier]’?”
6. **Outgoing-fact audit:** “Before opening anything, read the outgoing query or packet and tell me which supplied facts are present, which are missing, which changed, and which remain unresolved.”
7. **Partial state:** “For this partial input, why is supplier handoff blocked, and what information would you seek next?”
8. **Conflict state:** “The input contains two pitch claims. What did the system choose, if anything, and what would you do next?”
9. **Unsupported state:** “How should the bearing line be handled by this fastener workflow?”
10. **Unavailable state:** “The destination or configuration service did not complete. What can you conclude from that failure, and what can you not conclude?”
11. **Confidential-lineage state:** “Which information is allowed to leave PartSource in this handoff, and which information must remain private?”
12. **Destination interpretation:** “After viewing the destination page, what carried over from the query, what was broadened or dropped, and what still requires independent verification?”
13. **Result status:** “Without opening a result, what does a result heading allow you to conclude about identity, equivalence, compatibility, or suitability?”
14. **A/B teach-back:** “Explain the state and next safe action first from A, then from B. Did either presentation change your conclusion?”
15. **Confidence check without a score:** “What evidence or missing fact would change your next action?”

Predeclare comprehension scoring before the study. A response passes only if it independently distinguishes configuration facts from destination behavior, source-direct ID opening from alternate-specification search, and search output from identity/equivalence/compatibility/suitability/commercial claims. Any accepted silent substitution or inference of item absence from an access block is a critical failure.

## Findings classified with all eight required labels

- **Evidence:** The current generic compiler generated the same five-destination query, preserved 5/8 declared facts, and omitted pitch, drive, and standard.
- **Evidence:** Ordinary and reserved-character URL round trips passed 10/10 across the configured templates; no fake supplier SKU or exact source identifier was inserted into alternate queries.
- **Evidence:** Prototype 006 passed 6/6 explicit no-alternate-translation states, and the source-direct exact-ID URL retained `91290A115` with zero translation.
- **Evidence:** The current runtime passed 1/4 exercised block decisions; partial, conflict, and unsupported-bearing inputs each exposed five destination links.
- **Evidence:** Five official destinations were opened. One rendered the exact query; four denied or challenged automated access. On the one observable result surface, 1/10 heading strings echoed all generic-query constraints, while 10/10 remained in the queried family category.
- **Fundamental requirement:** Supplier handoff must be constructed from a unique, reviewed, active/release-aware public configuration projection, not from any `Part` object or parser fallback.
- **Fundamental requirement:** The gate must run before query, URL, BOM snapshot, or source-note construction and block partial, conflict, unsupported, unavailable, confidential-lineage, withdrawn, unreviewed, and malformed states.
- **Fundamental requirement:** Preserve all eight public facts in the transparent packet, expose any query omissions, and keep source-direct exact-ID navigation separate from alternate-supplier specification translation.
- **Strong hypothesis:** A visible 8/8 public-specification packet plus manual destination search will preserve truth better than destination-specific query syntax, but participant usefulness and destination success remain unmeasured.
- **Opportunity / gold idea:** Make the frozen public packet the completion artifact; derive any editable destination query from that packet only after a single fail-closed gate, with an automatic field-loss diff shown before navigation.
- **Nice-to-have:** Record a client-local, non-commercial trace of outgoing field names, encoded URL, landing outcome class (`rendered`, `security-verification`, `access-denied`), and user-confirmed omissions for later permitted study analysis.
- **Open question:** Whether practicing engineers understand, trust, or reuse the packet; whether any destination syntax improves their task; and whether blocked destinations make the handoff too unreliable remain unanswered because no participants were run.
- **Risk:** Green URL/unit tests can mask unsafe handoff behavior. This run had 28/28 decoder checks pass while three unsafe runtime routes still emitted links.
- **Risk:** Broad destination result ordering can look authoritative even when most visible headings weaken or contradict query constraints.
- **Risk:** Source notes and source SKU fields can cross into a frozen snapshot unless the public projection excludes confidential lineage before handoff construction.
- **Rejected:** Automatic supplier links from partial, conflicting, unsupported, unavailable, confidential, unreviewed, malformed, parser-fallback, or non-released states.
- **Rejected:** Translating `91290A115` into an alternate-supplier identity, treating an access denial as evidence of absence, treating destination headings as verified relationships, or making claims about listings, offers, equivalence, price, stock, availability, compatibility, or suitability.
- **Rejected:** Production edits, `/to-spec`, messages, contacts, purchases, quote requests, form submissions, or external data collection as part of this validation.

## Decision

**Do not advance the current supplier-query handoff as release-aware behavior.** Retain the two-path concept and the transparent 8/8 packet as research artifacts. Before any implementation approval, require one public-projection gate shared by configuration display, BOM snapshot, and supplier handoff; then rerun the same state matrix and the combined participant prompts. Destination-specific syntax has not demonstrated a dependable advantage, and official destination access was observable at only one of five alternate sites in this execution.

## Reproducibility notes

- Local prototype: `http://127.0.0.1:8765/sketches/006-supplier-handoff-lab/`
- Local current runtime: Vite dev server on `http://127.0.0.1:3010/`
- External destinations: official hosts only.
- Temporary local servers were used for read-only browser exercise; they created no production artifact.
- No temporary harness was added to the repository.
