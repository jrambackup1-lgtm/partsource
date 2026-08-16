# Proxy UX / trust review — 2026-08-10

## Decisive proxy verdict

**Risk:** **FAIL / HOLD.** The current runtime is not fail-closed. Under synthetic broad, partial, explicit-conflict, unsupported-family, withdrawn-record, and in-flight route-transition states, it leaves BOM-save and supplier-search actions enabled. It can also replace a user-supplied conflicting pitch with a decoded default without presenting the two claims as a conflict. This is a release-blocking trust-gate failure, not a copy-polish issue.

**Evidence:** The research instruments contain useful interaction primitives but do not constitute a validated safe handoff. Sketch 006 blocks most negative states clearly, yet its fully specified fixture emits destination searches and a copy packet while explicitly saying the fixture is “not released.” Sketch 007’s decision queue is the clearest synthetic next-decision treatment and mechanically disables “Add frozen configuration,” but it never exercises a released positive handoff and other directions show state-incompatible fixture content. The combined proxy evidence therefore does not support approval of the safe-handoff interaction.

**Fundamental requirement:** Do not enable BOM freeze or alternate-supplier handoff unless required facts, conflict resolution, reviewed mapping, immutable release identity, lifecycle state, and provenance boundary all pass mechanically. Warning copy such as “verify before ordering” is not a substitute for that gate.

## Scope, method, and non-claims

**Evidence:** This is a proxy/synthetic review only. It is not user evidence, comprehension testing, preference evidence, qualified mechanical approval, catalog approval, public-release approval, or permission to start `/to-spec`. No production code, public surface, or product data was edited for this review.

**Evidence:** The review used the gate contract, product contract, repository context, prior UX/trust and empirical handoff studies, two deterministic HTML sketches, and the current local React runtime as instruments. Browser requests to the current runtime were intercepted only to inject synthetic exact, delayed, failed, withdrawn, and corrected catalog responses. No claim below infers what a user understands, notices, prefers, or would do.

**Open question:** The current contracts require active reviewed mapping and release for handoff, but the runtime response type has no release identifier, release timestamp, correction event, supersession relation, or enforceable lifecycle field. The owner of the release contract and the exact browser-safe release packet remain unresolved.

## Instruments and execution record

**Evidence:** Reviewed source and contract material:

- `research/proxy-validation-gate-contract-2026-08-10.md`
- `research/product-contract.md`
- `CONTEXT.md`
- `research/validation-ux-reimagination-2026-08-09.md`
- `research/validation-trust-provenance-2026-08-09.md`
- `research/empirical-supplier-query-translation-2026-08-09.md`
- `research/empirical-a-vs-b-bom-preflight-duel-2026-08-09.md`
- `sketches/006-supplier-handoff-lab/index.html`
- `sketches/007-engineering-workspace-directions/index.html`
- relevant current `web/src` search, detail, decoder, catalog, and BOM code

**Evidence:** Exercised locally in Chromium:

- Sketch 006 at `http://127.0.0.1:8765/sketches/006-supplier-handoff-lab/`: exact ID, fully specified, partial, conflict, unsupported, unavailable, confidential-boundary, all three output formats, keyboard order, and 320 × 720 narrow states.
- Sketch 007 at `http://127.0.0.1:8765/sketches/007-engineering-workspace-directions/`: Queue, Identity, Refine, and Diff directions against ambiguity, exact identity, conflict, failure, and mobile-stress fixtures; keyboard order; retry; and 320 × 720 narrow Queue/Identity/Diff states.
- Current runtime at `http://127.0.0.1:3010/`: exact, broad, partial, conflict, unsupported, exact service failure, non-identifier service failure, synthetic withdrawn record, corrected record with a pre-correction frozen BOM snapshot, delayed route transition, keyboard order, and a 320 × 720 partial state.
- Harness output was recorded outside the repository at `C:\Users\jayar\AppData\Local\Temp\partsource-proxy-ux-harness-output-2.json`. Its execution timestamp is `2026-08-09T19:28:30.879Z` UTC, corresponding to this 2026-08-10 review session.

**Evidence:** Browser consoles for sketches 006 and 007 were clean. The runtime console contained only the deliberately injected 503 resource errors for service-failure fixtures; no unrelated page exception was observed.

## Synthetic state matrix

| Synthetic state | Sketch 006 | Sketch 007 | Current runtime | Proxy disposition |
|---|---|---|---|---|
| Exact | Preserves `91290A115`; only source-direct McMaster opening; alternate handoff blocked | Mapping and supplied facts are visible; release/material gaps remain; BOM action disabled | Preserves input and displays facts, but exposes five supplier links and enabled BOM save with no release/revision; source SKU crosses into UI | Runtime fails closed-gate requirement |
| Broad | Not a named fixture | Ambiguity queue preserves only `M4`; no defaults; next gate is family | `M4 screws` becomes `Custom Fastener`, defaults pitch `0.7 mm`, and enables save plus five supplier links | Fail |
| Partial | Preserves `M4 socket head cap screw`; no destination emitted | Queue preserves supplied family/thread/material/finish and labels unresolved dimensions; BOM disabled | Preserves raw input but defaults pitch, drive, and standard while length/material/finish remain unknown; save and supplier links enabled | Fail |
| Conflict | Shows both pitch claims in raw text; handoff blocked | Queue/Identity show both claims, “no winner,” correction requirement, and disabled BOM action | Shows raw conflict string but renders pitch `0.7 mm` and length `12 mm`; does not identify the conflict; save and supplier links enabled | Fail |
| Unsupported | Preserves bearing clue and blocks handoff | Not exercised as a dedicated fixture | Bearing clue becomes `Custom Fastener · Unknown x Unknown`; emits generic `custom fastener` searches and enabled BOM save | Fail |
| Unavailable / service failure | Preserves input and removes destination; says retry is permitted but provides no retry control | Removes selection/handoff controls; only `Retry fixture` remains | Exact identifier failure removes supplier/save actions and says no handoff; raw input is not shown in failure card. Non-identifier failure falls back to unsafe `Custom Fastener` actions | Mixed; exact branch blocks, recovery/raw continuity incomplete |
| Withdrawn | Not exercised | Not exercised | Synthetic `verification: withdrawn` / `lifecycle: withdrawn` record renders as “Indexed Catalog”; supplier links and BOM save remain active | Fail |
| Corrected | Not exercised | Not exercised | Current facts change from pitch/length `0.5 mm`/`10 mm` to `0.6 mm`/`11 mm`; old frozen line remains `0.5 mm`/`10 mm`, but there is no correction/revision explanation and saved `verificationRevision` is `null` | Snapshot immutability works; trust explanation fails |
| Narrow screen | No horizontal page overflow at 320 px; blocked copy and raw input remain present | No horizontal page overflow at 320 px in exercised states; disabled action remains detectable | No horizontal page overflow in exercised partial state, but the unsafe save action remains enabled and the page is long | Layout containment does not cure gate failures |

## Cross-state interaction checks

### Raw input and supplied-versus-normalized facts

**Evidence:** Sketch 006 consistently labels `Preserved input:` in every exercised state. Sketch 007 keeps the editable query above the result and its ledger labels origins such as `supplied text`, `Not supplied`, `three boundaries remain`, and `no winner`. In the conflict fixture it keeps the identifier-derived `M3 × 0.5 × 10 mm` and description-derived `M4 × 0.7 × 12 mm` as separate claims.

**Evidence:** The current runtime displays `Input:` on successful and fallback detail pages and frozen BOM snapshots retain `selectionSnapshot.inputText`. It does not, however, distinguish supplied facts from normalized, decoded, catalog-derived, or defaulted facts in the specification table. For `M4 socket head cap screw`, pitch `0.7 mm`, drive `Hex`, and standard `DIN 912 / ISO 4762` appear alongside supplied `M4` and family text with no field-level origin labels. For the explicit pitch-conflict string, the table presents `0.7 mm` as one authoritative value.

**Fundamental requirement:** Every selection-critical field needs value, origin, confidence/review state, and conflict state. Raw-input preservation is necessary but insufficient when a normalized table silently outranks it.

### Blocking facts and fail-closed actions

**Evidence:** Sketch 007’s Queue direction exposes the blocking ledger before the disabled BOM action. Its ambiguity fixture states `Pitch — Not supplied — do not default`; exact states that material/finish and public release are absent; conflict says `Action — Blocked — human correction required`. Disabled controls are native `disabled` buttons and were skipped by keyboard traversal.

**Evidence:** Sketch 006 removes alternate-supplier links in partial, conflict, unsupported, unavailable, and confidential-boundary states. Its exact-ID state permits only opening the supplied identifier at its supplied source and explicitly disclaims alternate identity.

**Risk:** Sketch 006’s fully specified state says `Compiler fixture — not released` while destination-specific supplier searches and copy actions are available. This violates the gate’s stated release prerequisite even though the packet copy is cautious.

**Risk:** The current runtime enables the same BOM and supplier actions for complete exact records, partial records, broad custom records, conflict inputs, unsupported families, and withdrawn records. `PartDetail.tsx` renders the save button without a disabled gate and always maps `supplierDestinations` to active anchors once it reaches the ordinary detail branch.

### Keyboard, focus, and narrow-screen behavior

**Evidence:** Sketch 006’s initial keyboard sequence follows fixture tabs, output-format tabs, then the active packet action. Sketch 007’s sequence reaches query, top-level Resolve, fixture selector, in-stage Resolve, and direction controls in DOM order. Current exact-detail traversal reaches global navigation, search, currency, Back to Search, the reference link, BOM form fields, save, supplier links, and related configurations in a coherent DOM sequence.

**Risk:** Sketch 007 exposes two controls named only `Resolve` in the keyboard sequence: the top query action and the first decision-gate action. The duplicate accessible name does not identify which object will be resolved. This is a proxy legibility defect; no user comprehension claim is made.

**Evidence:** At 320 × 720, no exercised instrument produced document-level horizontal overflow. Raw conflict text, blocked state, and action state remained in the DOM. Sketch 007’s narrow Diff table was contained rather than forcing page-level horizontal scroll. This establishes containment only, not readability or touch usability.

**Risk:** In Sketch 007’s mobile Queue fixture, the heading says `2 gates` while the visible numbered list includes `1 Choose pitch and length`, `2 Confirm fit and thread extent`, and `3 Review material and finish`. The internal count contradicts the visible decision list.

### Stale-state clearing and service failure

**Evidence:** During client-side navigation from exact `91290A115` to delayed `91290A117`, the URL changed immediately, but the old `Input: 91290A115`, all five old supplier links, and an enabled old BOM-save button remained rendered during the delay. The test observed the stale actions 120 ms into a deliberately delayed response. `PartDetail.tsx` cancels late updates on cleanup but does not clear `item` and `resolution` when `partNumber` changes.

**Fundamental requirement:** On any query, route, filter, release, or retry transition, immediately clear or inert all prior candidate, packet, BOM, and supplier actions before starting asynchronous work. A new URL paired with old enabled handoff actions is a wrong-object action hazard.

**Evidence:** For an exact McMaster-shaped identifier under injected 503, the runtime shows `No supported configuration yet` and `Configuration search temporarily unavailable. No supplier search handoff shown.` Supplier and BOM controls are absent. That branch is mechanically fail-closed.

**Risk:** The exact-failure card does not visibly repeat the submitted identifier and offers Back to Search rather than an in-context retry. Sketch 006 says retry is permitted but has no retry button. Sketch 007 provides `Retry fixture`, but deterministic retry returned the same fixture state, so the instrument confirms control presence, not successful recovery.

### Release, revision, correction, and withdrawal

**Evidence:** The runtime’s `CatalogSearchResult` contract contains provenance and a `verification` string but no immutable release identifier or correction/supersession model. `catalogResultToPart` retains title and source SKU but drops provenance, verification, synthetic status, and any injected revision/correction/lifecycle fields. The ordinary detail UI consequently cannot enforce or explain these states.

**Risk:** A synthetic withdrawn record was rendered as `Indexed Catalog`, with an enabled BOM-save action and all supplier searches. Withdrawal metadata was ignored.

**Evidence:** A frozen BOM line created before a synthetic catalog correction remained at the old pitch and length after refresh. This is the desired immutable-snapshot behavior. The refreshed detail changed to the new facts, but there was no visible old-versus-new diff, correction event, current revision, superseded release, review effect, or revalidation instruction. The frozen line’s `verificationRevision` was `null`.

**Risk:** The runtime displayed `Source SKU: PRIVATE-…` in source notes and copied it into the frozen BOM snapshot. The research prototypes explicitly model private source identity as out of bounds. Whether every source SKU is confidential is policy-dependent, but the current unqualified pass-through is not a defensible provenance boundary.

### Safe packet and synthetic next action

**Evidence:** Sketch 006’s copy packet is the clearest handoff artifact: family, thread, length, material, finish, drive, referenced standard, release status, and excluded claims are visible together under `SUPPLIER SEARCH HANDOFF — VERIFY INDEPENDENTLY`. Its destination-specific view exposes the exact editable query for each destination and says syntax differences do not imply better results.

**Risk:** That packet is not actually safe under the gate contract because its release status is `Compiler fixture — not released`. The adjacent action therefore communicates a clear next step but authorizes it before a required trust fact exists.

**Evidence:** Sketch 007 Queue provides a clear synthetic next decision for ambiguity (`Choose the family boundary`), conflict (`Resolve explicit conflict`), and exact mapping (`Material and finish`, then release). Failure provides Retry. It does not contain a released, action-enabled packet, so positive-path handoff legibility is untested.

**Risk:** Sketch 007 Refine renders the literal broken text `family '+(active?'candidate':'unresolved')+'`. Its exact and conflict fixtures also show the same M4 family-choice content used for ambiguity, while Diff shows state-independent comparison fixtures even when the stage says PartSource chose neither conflicting claim. Save remains disabled, but the next interactive refinement is not state-valid.

**Risk:** The current runtime’s apparent next actions—save or supplier search—are legible as controls but are not safe actions because blocking facts, release identity, lifecycle, and provenance status are not enforced.

## Classified findings

### Evidence

- Raw input is preserved well in both sketches and ordinary runtime detail/BOM snapshots.
- Sketch 007 Queue is the strongest proxy model for supplied-versus-unresolved facts and next-decision sequencing.
- Sketch 006 negative states remove alternate-destination links and its packet makes excluded commercial/equivalence claims explicit.
- Current exact service failure removes handoff actions.
- Current frozen snapshots resist silent catalog overwrite.
- Exercised narrow states remain contained at 320 px and both sketches had clean consoles.

### Fundamental requirement

- Centralize one mechanically enforced handoff predicate used by rendering, keyboard activation, BOM serialization, copy/export, and supplier-link generation.
- Require complete family-specific facts, zero unresolved conflicts, reviewed provenance, immutable release/revision identity, active lifecycle, and allowed boundary fields before actions can exist or become enabled.
- Clear prior state and actions synchronously on every transition.
- Preserve raw input and expose field-level supplied/normalized/catalog/defaulted origins.
- Treat correction, supersession, and withdrawal as first-class states with visible consequences for current and previously frozen packets.

### Strong hypothesis

- A decision-queue composition—preserved input, blocking ledger, one named next decision, then inert handoff—will be more legible under ambiguity than the current specification-first page. This remains a design hypothesis until tested with representative engineers.
- A reviewable packet that shows exact destination query, release identity, provenance-safe facts, excluded claims, and a final independent-verification instruction will reduce hidden translation risk. The current instruments support feasibility, not user comprehension.

### Opportunity / gold idea

- Build a single “handoff compiler” that accepts only a released configuration revision and returns either a typed block reason or an immutable, browser-safe packet. Drive the UI, BOM snapshot, copied packet, and supplier links from that one output. The blocked form should return the ordered decision queue; the released form should show a human-readable diff from raw input and an explicit `What leaves PartSource` preview before activation. This joins the strongest parts of sketches 007 and 006 while eliminating duplicate client-side safety logic.

### Nice-to-have

- Give top-level and in-stage Resolve controls object-specific names, such as `Resolve submitted requirement` and `Choose family boundary`.
- Keep the narrow-screen ledger header or current block reason visually persistent while long content scrolls.
- Add a copyable recovery reference for service failures after raw-input continuity and retry are mechanically correct.

### Open question

- Which fields and identifiers are approved to cross the browser/BOM/supplier boundary, specifically `source_sku`, internal record IDs, provenance notes, and correction-event IDs?
- What entity owns release, who can withdraw it, and what immutable identifier is saved in a BOM line?
- Does a source-direct opening of a user-supplied identifier require a release gate, or is it a separately governed navigation that must never be represented as configuration handoff?
- Which family-specific facts are mandatory for each supported family, and can any normalization default be selection-authoritative without explicit confirmation?
- What should happen to a frozen line after its release is corrected or withdrawn: retain with warning, block export, require revalidation, or create a linked superseding line?

### Risk

- Highest: current runtime authorizes wrong-object or under-specified handoff in broad, partial, conflict, unsupported, withdrawn, and stale-transition states.
- High: exact mapping is treated as readiness without release/revision evidence, while private-looking source identity is exposed and frozen.
- High: correction and withdrawal cannot be explained or enforced because the client contract discards those fields.
- Medium: prototype state-independent content and contradictory gate count reduce synthetic legibility even while final save remains disabled.
- Medium: failure recovery does not consistently preserve raw input and provide a working in-context retry.

### Rejected

- Warning copy as a replacement for disabled or absent unsafe actions.
- “Exact match,” “Indexed Catalog,” or complete-looking specifications as implicit release approval.
- Emitting broad `custom fastener` supplier searches for unsupported or mostly unknown inputs.
- Silently choosing one side of an explicit conflict and asking the operator to verify later.
- Allowing old enabled actions to remain during a new query or route transition.
- Treating frozen immutability alone as sufficient correction handling.
- Treating these proxy observations as user validation, preference, mechanical approval, or permission to publish.

## Proxy gate disposition

**Risk:** **Gate closed.** The decisive proxy verdict is that the safe-handoff interaction is not presently legible-and-fail-closed as a complete system. Sketch 007 Queue and Sketch 006’s negative-state/packet treatments are promising implementation inputs, but neither instrument supplies qualified evidence and both have material gaps. The current runtime has multiple mechanically reproducible unsafe-action paths and must not be approved on this proxy review.

**Fundamental requirement:** Re-run this same synthetic matrix only after the runtime has one release-aware gate, state clearing, field-origin/conflict display, lifecycle/correction handling, a provenance-safe packet, and tests proving unsafe actions are absent—not merely accompanied by cautions—in every blocked state.
