# PartSource UX + engineer user-research + innovation synthesis — 2026-08-12

Status: fresh research synthesis; no implementation authority by itself.
Phase: UX + engineer user-research + innovation.
Scope: mechanical-component catalog navigation only.

Current product boundary remains:

`query → catalog level → family → filters → result list`

Exact ID keeps family/result-list context and highlights the exact match. Non-exact search never auto-selects. Runtime has no AI/agents, no supplier/BOM/commercial workflow, no McMaster API, no scraping, no copied supplier data.

## Method

Parallel research lanes:

1. Engineer/community pain: Reddit, HN, forums, engineering communities.
2. Competitor/reference UX: McMaster, MISUMI, MSC, Mouser, Digi-Key, Octopart, TraceParts/3Dfindit.
3. Adversarial challenge: falsify weak ideas and reject scope traps.

Evidence quality caveat:

- Search snippets and official search-result metadata were used because the configured web extraction backend is search-only and could not fetch full pages.
- Treat direct community snippets as directional user evidence, not formal interviews.
- Treat official pages as evidence of competitor claims/features, not proof those features work well.
- No direct PartSource user sessions were run in this phase.

## Source index

Community/user evidence:

- Reddit, `r/MechanicalEngineering`, “McMaster Carr CAD download part names” — https://www.reddit.com/r/MechanicalEngineering/comments/zcv090/mcmaster_carr_cad_download_part_names/
- Reddit, `r/MechanicalEngineering`, “Grainger or McMaster-Carr” — https://www.reddit.com/r/MechanicalEngineering/comments/15nmft3/grainger_or_mcmastercarr/
- Reddit, `r/AskEngineers`, “How is McMaster so amazing?” — https://www.reddit.com/r/AskEngineers/comments/o5z6hh/how_is_mcmaster_so_amazing/
- Reddit, `r/AskEngineers`, “McMaster-Carr: is there a way to quickly select a range of component sizes?” — https://www.reddit.com/r/AskEngineers/comments/11mckvx/mcmastercarr_is_there_a_way_to_quickly_select_a/
- Reddit, `r/AskEngineers`, “Using the McMaster Carr catalogue in Europe” — https://www.reddit.com/r/AskEngineers/comments/149ztv3/using_the_mcmaster_carr_catalogue_in_europe/
- Reddit, `r/AskEngineers`, “Heresy: Has the McMaster website degraded...” — https://www.reddit.com/r/AskEngineers/comments/14b3xwm/heresy_has_the_mcmaster_website_degraded_over_the/
- Reddit, `r/engineering`, local McMaster copies / supplier lock concern — https://www.reddit.com/r/engineering/comments/xdisju/does_anyone_elses_company_create_a_local_copy_of/
- Practical Machinist, “McMaster-Carr” manufacturer vagueness — https://www.practicalmachinist.com/forum/threads/mcmaster-carr.137720/
- Practical Machinist, “Is there a good alternative to McMaster Carr?” — https://www.practicalmachinist.com/forum/threads/is-there-a-good-alternative-to-mcmaster-carr.420276/
- Hacker News, McMaster UX praise — https://news.ycombinator.com/item?id=32976978
- Hacker News, McMaster UX discussion — https://news.ycombinator.com/item?id=34000502
- Hacker News, McMaster fast/thoughtful discussion — https://news.ycombinator.com/item?id=34306793

Official/reference competitor evidence:

- McMaster-Carr homepage/catalog — https://www.mcmaster.com/
- McMaster-Carr CAD models — https://www.mcmaster.com/cad-models/
- McMaster-Carr SolidWorks add-in — https://www.mcmaster.com/solidworksaddin/
- McMaster-Carr mobile apps — https://www.mcmaster.com/mobile/
- MISUMI USA — https://us.misumi-ec.com/
- MISUMI spec search guide — https://us.misumi-ec.com/guide/category/ecatalog/spec.html
- MISUMI category search guide — https://us.misumi-ec.com/guide/category/ecatalog/category.html
- MISUMI CAD guide — https://us.misumi-ec.com/guide/category/ecatalog/use_cad.html
- MSC product categories — https://www.mscdirect.com/ProductsHomeView
- MSC guidebook PDF — https://www1.mscdirect.com/custsupp/guidebook_msc.pdf
- Mouser search tools / Smart Filtering — https://www.mouser.com/en/searchtools/
- Digi-Key product search — https://www.digikey.com/en/products
- Digi-Key “How to Use Digi-Key Part Search” — https://www.digikey.com/en/articles/how-to-use-digi-key-part-search
- Digi-Key parametric search tips — https://forum.digikey.com/t/tips-for-using-the-parametric-search/167
- Digi-Key product-index tips — https://forum.digikey.com/t/tips-for-searching-the-digikey-product-index/7343
- Digi-Key accessibility statement — https://www.digikey.com/en/help-support/fraud-and-security/accessibility-statement
- Octopart — https://octopart.com/
- Octopart redesigned search filters — https://octopart.com/pulse/p/introducing-redesigned-search-filters
- TraceParts — https://www.traceparts.com/en
- 3Dfindit/CADENAS eCatalog — https://partsolutions.com/ecatalogsolutions
- 3DContentCentral — https://www.3dcontentcentral.com/

## Classification key

- Fundamental: must shape product behavior or truth model.
- High-value: likely strong differentiator after core loop.
- Nice-to-have: useful polish, not core.
- Future: real opportunity, but later scope/evidence/data required.
- Reject: do not build now; violates boundary, weak evidence, or creates unsafe claims.

---

# Findings: evidence → pattern → inference → idea

## 1. Engineers praise catalogs when vague intent can safely become a useful family path

Classification: Fundamental.

Evidence:

- Reddit user says McMaster is great “if I don't know exactly what part I need, or if I need a CAD model.”
- Reddit user says McMaster can accept “a half-assed broken English word or two” and often suggest what they need, with CAD/specs/drawings praised.
- Digi-Key official guidance recommends starting broad, then using category/parametric filters; long complicated searches can return weak/zero results.
- McMaster/HN discussions praise fast, direct catalog UX.

Repeated pattern:

Engineers do not want one magic answer first. They want a fast route from uncertain terms to the right catalog level, then controlled narrowing.

Inference:

PartSource’s current progressive catalog model is directionally correct. The strongest UX lever is not prettier results; it is preserving the intermediate decision path.

Idea:

Make the transition visible:

- recognized query tokens;
- chosen catalog level;
- candidate family/families;
- active filters;
- unsupported/conflicting terms;
- reason the system stopped short of a result.

Do not collapse this into natural-language search or first-result selection.

## 2. Filters are where engineering catalogs win or die

Classification: Fundamental.

Evidence:

- Reddit asks if McMaster has a way to quickly select a range of component sizes.
- Mouser official Smart Filtering hides filters that are no longer selectable to avoid dead-end zero-result searches.
- Digi-Key forum evidence shows range/min/max semantics matter; users struggle when range values are represented poorly.
- MSC user reports complain about duplicate/inconsistent filter values.
- MISUMI official guide uses category → specifications/dimensions → part number confirmation.

Repeated pattern:

Users need engineering constraints, not shopping facets. Bad filters create false zero results, duplicated values, impossible combinations, and slow comparison.

Inference:

PartSource must treat filter schemas as family-specific typed mechanical contracts. Raw supplier strings must not become UI filters directly.

Idea:

Prioritize deterministic smart filtering:

- family-specific filter schemas;
- canonical typed units;
- result counts per option;
- disable/hide impossible values;
- exact/min/max/range/nominal relation semantics;
- required vs optional fields;
- explain which constraint produced zero results.

## 3. Exact identifiers are workflow-critical and must not become fuzzy search

Classification: Fundamental.

Evidence:

- Reddit user downloading McMaster CAD removes descriptive filename text so CAD/BOM files keep only the part number.
- MSC guidebook claims search by MSC part number, manufacturer part number, customer part number, NSN, competitor part number.
- Digi-Key official guidance says exact/partial part-number search exists, but one wrong/missing character can fail.
- TraceParts/3Dfindit and McMaster CAD flows heavily revolve around exact configured IDs.

Repeated pattern:

Part numbers travel into CAD assemblies, drawings, BOMs, procurement systems, and internal standards. Engineers treat them as brittle identifiers, not prose.

Inference:

PartSource’s exact-ID rule is correct. Exact ID should route and highlight; non-exact and ID-like inputs must not auto-select.

Idea:

Add an identity confidence ladder:

1. unique exact ID → highlight in context;
2. normalized exact ID → show normalization rule and highlight only if uniquely supported;
3. prefix/family-like ID → route to family/context, no highlight;
4. ambiguous/colliding ID → show mapping evidence, no list or highlight;
5. unknown ID → no inferred family.

## 4. CAD is expected, but not the innovation for the current product

Classification: Future; metadata is High-value if source data exists.

Evidence:

- Reddit users repeatedly mention McMaster CAD models as daily workflow aids.
- McMaster official pages advertise CAD models and a SolidWorks add-in.
- MISUMI official pages support 3D CAD downloads from product/configuration pages.
- TraceParts, 3Dfindit, and 3DContentCentral position CAD catalog/download coverage as core value.

Repeated pattern:

CAD availability reduces modeling effort and helps engineers move from catalog discovery into CAD assemblies.

Inference:

CAD is table stakes among mature competitors. Building CAD generation/downloads now is scope creep unless PartSource owns source-backed CAD assets.

Idea:

Current-safe version:

- show CAD/drawing availability metadata only when source-backed;
- show format and source/provenance;
- show whether the CAD corresponds to the exact configured item, a representative family model, or unknown;
- never generate approximate CAD or imply geometry truth.

## 5. Trust/provenance is a stronger wedge than generic confidence scores

Classification: Fundamental / High-value.

Evidence:

- McMaster claims CAD models are accurately built and maintained in-house.
- 3Dfindit/PartSolutions advertises manufacturer-certified catalogs.
- Digi-Key emphasizes authorized distribution/accessibility and rich official technical data.
- Community reports note McMaster can be disallowed for production/regulated assemblies because supplier identity is not locked.
- PartSource current authority already requires provenance and prohibits suitability/equivalence/supplier claims.

Repeated pattern:

Users trust catalogs when they know what kind of truth a fact represents: catalog fact, manufacturer fact, normalized field, CAD artifact, commercial offer, or unknown.

Inference:

PartSource should not hide trust behind “verified,” “confidence,” or “AI reviewed.” It should show source lineage and limitations plainly.

Idea:

Use field-level provenance:

- displayed normalized value;
- original source value when needed;
- source kind;
- import/release date;
- missing/conflicting flags;
- exact ID provenance separate from record-fact provenance.

Reject global confidence scores.

## 6. Users want technical detail in result lists, not only in detail pages

Classification: Fundamental.

Evidence:

- Users praise McMaster specs, drawings, and dimensions.
- McMaster/MISUMI/Digi-Key/Octopart all expose rich technical data and datasheets/CAD/details.
- MSC and Digi-Key support compare/side-by-side flows.

Repeated pattern:

Engineers narrow by comparing multiple candidates. A result list that hides key dimensions forces pogo-sticking into detail pages.

Inference:

The result list should carry enough family-specific technical fields to make first-pass comparison possible.

Idea:

For each family, define canonical comparison columns:

- screws: thread, pitch, length datum, length, head form, drive, material, finish;
- bearings: bore, OD, width, seal/shield, load rating;
- springs: OD, wire diameter, free length, rate;
- shafts: diameter, length, tolerance, material, hardness.

Show missing critical data explicitly.

## 7. Taxonomy is not navigation chrome; taxonomy is the product

Classification: Fundamental.

Evidence:

- McMaster’s catalog-like hierarchy is heavily praised.
- MISUMI’s official flow is category/specification/dimension/confirmation.
- Digi-Key guides users through category then filters.
- Octopart surfaces relevant filters after search and lets users add more.

Repeated pattern:

Best systems route users into a meaningful family before filters become useful. Bad systems flatten everything into a global results dump.

Inference:

PartSource must protect family identity and family schemas. A global mechanical search with generic filters will become noisy fast.

Idea:

Add family-boundary affordances:

- sibling family cards when query is broad/ambiguous;
- compact diagrams/examples for family distinctions;
- “why this family” rationale;
- “near families” for recovery without mixing result lists.

## 8. Mobile/accessibility is underserved but not yet proved as a primary workflow

Classification: Nice-to-have now; High-value after validation.

Evidence:

- McMaster has mobile apps.
- Digi-Key publishes an accessibility statement and AA-support language.
- Industrial catalogs emphasize CAD/filter breadth more than accessible dense-table workflows.

Repeated pattern:

Mobile exists, but dense technical filtering and comparison are still desktop-biased. Accessibility is rarely foregrounded in industrial catalog UX.

Inference:

PartSource can differentiate on keyboard and screen-reader-safe engineering navigation, but we do not yet know if mobile is a primary selection workflow.

Idea:

Build accessible dense UX as a quality bar:

- keyboard-operable filters/result rows/detail;
- visible focus;
- non-color-only highlight/conflict states;
- screen-reader summaries for result count and active filters;
- mobile inspection mode with stacked records and sticky active-filter summary.

Do not build a native mobile app now.

## 9. Sourcing/procurement pain is real and seductive, but mostly outside current scope

Classification: Reject for current scope; Future only after new authorization.

Evidence:

- Reddit users outside the US complain about McMaster shipping/availability and EU access.
- Community reports mention approved-vendor issues and supplier changes.
- Octopart/Digi-Key/Mouser are strong in supplier/pricing/availability/commercial data.

Repeated pattern:

Engineers often connect discovery to procurement, but the business system around supplier approval, price, lead time, stock, and substitutes is a separate job.

Inference:

This is a major product-adjacent opportunity but a dangerous boundary trap. It would turn PartSource into procurement/PLM/BOM infrastructure before the catalog-navigation wedge is proved.

Idea:

Do not add supplier/pricing/availability/BOM/quote/alternate flows now.

Safe current behavior:

- avoid implying supplier identity or availability;
- keep result rows as catalog records;
- record future opportunity separately.

## 10. Competitors still fail at explainable deterministic “similar” and “nearby” parts

Classification: High-value; Future if it implies substitution.

Evidence:

- MSC supports similar items and compare.
- Digi-Key cross-reference and “View Similar” exist; forum users ask for better min/max semantics.
- Octopart supports comparison across electronic parts.

Repeated pattern:

“Similar” often hides the basis of similarity or treats attributes too rigidly. In mechanical design, similar is not equivalent.

Inference:

PartSource can support deterministic adjacent exploration without claiming replacement or equivalence.

Idea:

Add bounded adjacent-result tools:

- same family, same thread, longer length;
- same bore, wider bearing;
- same material, different finish;
- same critical dimensions, missing secondary fields flagged.

Label as “adjacent candidates,” not equivalent/replacement.

---

# Decision register

## Fundamental

1. Preserve progressive catalog navigation as the core model.
   - Evidence: McMaster/Digi-Key/MISUMI all validate broad/category/family/filter navigation.
   - Decision impact: no change to core flow.

2. Keep exact-ID highlight separate from selection.
   - Evidence: identifiers propagate into CAD/BOM/workflow; exact/partial ID fragility is high.
   - Decision impact: current exact-ID contract becomes even stronger.

3. Use family-specific typed filters, not raw supplier facets.
   - Evidence: filter/range/min-max complaints; MSC duplicate-value complaint; Mouser smart filtering.
   - Decision impact: future spec should require typed filter schemas, canonical values, and zero-result recovery.

4. Treat units/terminology as first-class product truth.
   - Evidence: mechanical terms are ambiguous; range/min/max/nominal semantics matter.
   - Decision impact: add explicit unit relation semantics before broadening families.

5. Show provenance and missing/conflicting data explicitly.
   - Evidence: trust concerns, source ambiguity, competitor CAD/certified-source claims.
   - Decision impact: strengthen provenance UI, reject global confidence badges.

6. Keep result-list context rich enough for first-pass engineering comparison.
   - Evidence: engineers use catalogs as technical references, not only stores.
   - Decision impact: result rows need family-specific comparison fields.

## High-value

1. Deterministic smart filtering with counts and disabled impossible values.
2. Query-token and family-match rationale trail.
3. Search within current family.
4. Comparison mode for narrowed same-family candidates.
5. CAD/drawing availability metadata only when source-backed.
6. Identity confidence ladder for exact, normalized, prefix-like, ambiguous, unknown IDs.
7. Adjacent candidates with deterministic reason and no equivalence claim.

## Nice-to-have

1. Mobile inspection mode.
2. Keyboard shortcuts/expert mode.
3. Pinned filters/columns.
4. Export/copy comparison values.
5. Collapsible educational diagrams/definitions.

## Future

1. CAD downloads/integration/add-ins.
2. CAD-based matching.
3. Manufacturer/supplier identity overlays.
4. Regional sourcing/availability/approved-vendor layers.
5. BOM/procurement/account workflows.
6. Deterministic cross-reference/substitution after legal/source/domain gates.

## Reject

1. Runtime AI/agentic part selection.
2. Auto-selecting non-exact results.
3. Fuzzy/semantic part-number selection.
4. Raw supplier attribute dumps as UI filters.
5. Commerce-first pages, price/stock/availability/quote/checkout.
6. Supplier/BOM/procurement scope in current product.
7. Generated/approximate CAD as product truth.
8. Global confidence score, “verified,” “approved,” “equivalent,” or “replacement” without authority.
9. Infinite-scroll global result lists that break comparison and state restoration.
10. Silent unit conversion or silent nominal/actual merging.

---

# Strongest evidence

1. Community praise for McMaster centers on discovery from rough intent, CAD/spec access, speed, and catalog organization.
2. Official competitor UX patterns converge on category/family then structured filters: MISUMI specs/dimensions, Digi-Key category + parametric filters, Mouser smart filtering, Octopart relevant filters.
3. Direct user pain appears around range selection, CAD naming/ID workflow, registration/sales friction, supplier/manufacturer ambiguity, and degraded/annoying search.
4. Competitors heavily support CAD and commerce, proving expectation but also showing these are not novel enough to be PartSource’s immediate wedge.

# Biggest engineer pain points

1. “I do not know the exact name/family.”
2. “I need to narrow by real dimensions, not shopping labels.”
3. “Part numbers and CAD filenames must stay clean and stable.”
4. “I need specs/drawings/CAD fast, without sales friction.”
5. “I cannot trust hidden supplier/manufacturer substitutions for production.”
6. “Filters are inconsistent, duplicated, or do not support ranges/min/max.”
7. “Dense parametric search is powerful but daunting.”
8. “Mobile/accessibility for dense engineering tables is weak.”

# Best product opportunities

1. Explainable deterministic catalog routing.
2. Family-specific typed filter schemas with unit relation semantics.
3. Smart filtering that prevents impossible combinations and explains zero states.
4. Field-level provenance and original-value preservation.
5. Same-family comparison with family-specific canonical columns.
6. Identity confidence ladder for ID-like queries.
7. CAD-readiness metadata without CAD scope creep.
8. Accessible dense table/filter UX.

# Surprising ideas

1. “Why this matched” is probably more valuable than AI search.
2. Field-level provenance can be a stronger differentiator than CAD downloads.
3. Adjacent candidates are safer and more useful than “equivalents.”
4. Exact-ID handling should have multiple deterministic confidence states, not a boolean found/not-found state.
5. Mobile should probably be inspection/recovery first, not full primary selection.
6. Login/friction metadata for external CAD/spec resources could be valuable later if PartSource links out.

# What should change

For future product decisions/spec work only, not code now:

1. Add a product decision for deterministic match rationale: query tokens → catalog level → family → filters.
2. Add typed unit/terminology requirements beyond the current synthetic POC: original value, normalized value, unit, relation type, datum.
3. Add smart-filter rules: counts, disabled impossible options, explicit conflict/zero explanations.
4. Add result-list comparison requirements by family.
5. Add provenance display requirements at field or field-group level.
6. Add identity confidence ladder to the exact-ID contract.
7. Add accessibility acceptance beyond the POC: dense comparison, keyboard path, non-color-only states, mobile stacked inspection.

# What should not change

1. Do not change the core flow: `query → catalog level → family → filters → result list`.
2. Do not auto-select non-exact results.
3. Do not add runtime AI/agents.
4. Do not add supplier/BOM/procurement/commercial flows now.
5. Do not claim equivalence, replacement, approval, suitability, price, stock, availability, or certification.
6. Do not build CAD generation/downloads without source-backed CAD and explicit scope approval.
7. Do not ingest/scrape/copy supplier data without data-source approval.
8. Do not create implementation tickets from this research without Jay’s explicit approval.

# Wayfinder/spec/ticket impact

Wayfinder impact:

- Add a new exploration frontier around UX/user validation and product opportunity classification.
- Current POC release stays complete; this research does not reopen implementation tickets 32–38.
- The next Wayfinder decision should not be implementation. It should be: which high-value UX truth to validate with users first.

Spec impact:

- No immediate spec change is authorized.
- Candidate spec changes after approval:
  - match rationale trail;
  - identity confidence ladder;
  - typed unit relation model;
  - smart filtering behavior;
  - family-specific comparison list fields;
  - field-level provenance model;
  - accessibility requirements for dense technical comparison.

Ticket impact:

- Do not create implementation tickets yet.
- Candidate decision/research tickets only:
  1. Validate deterministic match-rationale trail with engineer tasks.
  2. Define unit/terminology model for one next family beyond screws.
  3. Prototype smart-filter zero-state recovery without codebase integration.
  4. Define result-list comparison columns for 2–3 families.
  5. Test exact-ID confidence ladder with real ID-like user inputs.

# Bottom-line judgment

The correct move is not “make PartSource an AI part finder” or “clone McMaster with CAD.”

The useful wedge is narrower and stronger:

A deterministic engineering catalog navigator that makes each narrowing step explainable, unit-aware, provenance-aware, and comparison-ready.

That fits the current POC. It also creates real differentiation without jumping into supplier/BOM/CAD/procurement swamp.
