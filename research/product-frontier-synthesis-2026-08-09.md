# PartSource product-frontier synthesis

**Date:** 2026-08-09  
**Status:** Wayfinder exploration. Not a product spec, release scope, or implementation backlog.

## Corrected destination

PartSource is exploring an Octopart-like discovery system for mechanical components, with a McMaster-like family and variant experience.

The POC must prove two connected entry paths:

1. Imperfect description → likely product family → structured requirement → one published configuration.
2. Known identifier → reviewed configuration mapping → canonical family with that configuration selected.

Supplier discovery and BOM follow configuration selection. They do not replace the family/configuration model.

## Main synthesis

The family-first direction is strategically stronger than the previous `configuration → supplier handoff → local BOM` framing.

It is not validated yet.

Current evidence proves that mechanical sourcing is fragmented and that people use McMaster as a discovery/reference layer, then move to approved, local, or bulk suppliers. It does not yet prove that a family-first interface is the best solution or that the current POC saves enough time to matter.

The next product risk is not code. It is whether PartSource can reduce configuration-recovery effort without becoming a thin query generator.

## What the evidence supports

### Strong

- Supplier catalogs use inconsistent taxonomy and terminology.
- Known catalog numbers are frequently carried into drawings, BOMs, and sourcing work.
- McMaster is often a reference/discovery tool even when purchasing happens elsewhere.
- Buyers move from prototype quantities to approved, local, or bulk purchasing contexts.
- Configuration recovery and supplier selection are separate tasks.
- The current dataset gives PartSource unusually strong known-identifier coverage.

### Weak or unproven

- No direct study yet shows how much time the exact current workflow wastes.
- No baseline comparison exists against Google, McMaster, distributor search, or engineer-to-procurement handoff.
- No real-user test proves that family-first navigation beats the current list/detail flow.
- No evidence yet proves that generic supplier search links are valuable after configuration recovery.
- Octopart is a useful interaction reference, not proof that its electronics model transfers unchanged to fasteners.

## Competitor/reference conclusion

No single reference should be copied.

- Octopart contributes search intent, taxonomy, dense comparison, and supplier separation.
- McMaster contributes family-first organization and compact variant browsing.
- MISUMI contributes progressive configuration and disabled-invalid choices.
- TraceParts and 3Dfindit contribute taxonomy and geometry-oriented discovery, but have weaker procurement handoff.
- Grainger, Zoro, Fastenal, and similar suppliers are potential destinations. Without reviewed listing evidence, PartSource may say `Search at supplier`, not `Available from supplier`.

## Leading interaction model

The leading hypothesis is a dual-intent family workspace.

### Broad query

`M4 screw`

- Preserve `M4` as a parsed constraint.
- Show multiple family candidates.
- Do not guess one family.

### Family-specific query

`M4 socket head screw`

- Open `Socket Head Cap Screws`.
- Apply the reviewed M4 constraint.
- Keep other required attributes unresolved.
- Show configuration records only as filters narrow them.

### Exact known identifier

`91290A115`

- Resolve the identifier before generic text search.
- Open the canonical family.
- Show one selected configuration immediately.
- Keep family controls collapsed until the user chooses to compare.
- Display identifier-mapping evidence separately from configuration provenance.
- Never describe the mapping as equivalence or replacement.

### Selection truth

- Filter state is a requirement, not a BOM-ready part.
- One unique published configuration enables Add to BOM and supplier search.
- The UI must distinguish: invalid by supported rule, potentially valid but not indexed, unknown, and published configuration.

## Prototype conclusion

The first two static sketches proved only layout alternatives and were superseded after cross-review exposed contradictory state and weak mobile/exact behavior.

`sketches/002-behavioral-family-workspace/` now exercises:

- broad family chooser;
- family-specific query;
- exact identifier inspector-first path;
- active facet filtering;
- unique-row selection;
- disabled pre-selection actions;
- truth-state language;
- separate evidence layers;
- URL/back state;
- explicit phone composition.

It renders and runs without browser console errors in the exercised paths.

This prototype is still not validation. The family taxonomy, attribute order, supplier action, and task performance remain user-test questions.

## Data audit conclusion

The current 27,009-row input is useful but not ready to become a public family catalog without classification.

- Known identifier coverage: 99.8%.
- Thread, length, material, strength evidence, and head dimensions: 100% populated.
- Drive: 99.8%.
- Pitch: 32.3%.
- Dedicated raw finish field: 25.0%. Some combined material values encode finish and require reviewed normalization.
- Normalized standard (`specifications_met`, excluding `-`): 83.9%.

The three import files are not three safe families.

In particular, `Rounded Head Screws` mixes at least seven head styles and fourteen drive styles. `Socket Head Cap Screws` also contains low, ultra-low, pilot-recess, Torx Plus, and square-drive records that change family semantics.

Leading POC coverage hypothesis:

1. Socket Head Cap Screws — conventional cylindrical/standard profile + internal hex.
2. Hexagon Socket Button Head Screws — button + internal hex, excluding flange/collar forms.
3. Pan Head Machine Screws — Phillips and slotted as drive facets, excluding washer assemblies.

These three candidate boundaries select 11,973 rows, or 44.3% of the input, and give every selected row a known identifier. `91290A115` falls inside the proposed Socket Head Cap Screws boundary.

Hold back the external-hex bucket. It contains at least 1,076 flange, 587 heavy-hex, and 278 structural title-marked rows. `External Hex` alone is not enough to define one safe family.

This three-family set is not approved. It is the smallest current hypothesis that demonstrates cross-family discovery and different drive semantics. The POC may publish a smaller reviewed subset instead of all 11,973 candidate rows.

Standard filtering is supported by the supplied `specifications_met` field. Do not infer standards from dimensions or identifiers when that field is absent.

## Architecture disagreement

### Maximal model proposed by the architecture audit

A full product-family, alias, attribute-definition, configuration, revision, identifier, release, supplier-target, and source-lineage model.

Strength:

- clean long-term domain boundaries;
- reproducible releases;
- explicit provenance and publication control.

Weakness:

- too much POC machinery before family taxonomy, facet order, and user value are validated.

### Minimalist challenge

Use a four-relation bridge:

1. `catalog_families`
2. `catalog_configurations`
3. `catalog_identifiers`
4. `catalog_releases`

Keep variable attributes in reviewed JSONB for the POC. Keep family aliases and supplier search templates in versioned code/config. Keep raw source lineage outside public tables. Add a public release identifier to every DTO.

### Main decision

Use the four-relation bridge as the POC architecture direction.

Do not build the full revision/attribute-definition/supplier-target graph yet.

Migration triggers are explicit:

- persistent per-field provenance requirement;
- repeated manual-edit history;
- heterogeneous new component families needing governed attributes;
- verified supplier listings;
- rollback or audit requirements beyond whole-release replacement.

## Search direction

Use deterministic search before semantic or AI retrieval.

Priority:

1. Normalize and exact-match a known identifier.
2. Match reviewed family aliases and terminology.
3. Extract supported constraints such as thread, length, material, drive, head style, and standard.
4. Rank family candidates.
5. Query configurations only inside the chosen family.
6. Explain parsed constraints and unresolved terms.

Minimum PostgreSQL support:

- normalized unique identifier index;
- family slug/alias lookup;
- typed/generated indexes for the dominant fastener facets;
- JSONB for secondary family-specific fields;
- server-side filtering and pagination;
- stable tie-break order;
- query and release identifiers in responses.

Defer embeddings, vector search, learning-to-rank, and LLM parsing until a measured query set exposes a real need.

## Supabase/public boundary

- Browser calls only an allowlisted Edge Function/API surface.
- Browser never receives raw-table access or private lineage.
- Public DTOs contain only reviewed technical fields, explicit nulls, family/configuration/identifier provenance state, and release identity.
- Service-role credentials remain server-side only.
- The catalog Edge Function is intentionally public and read-only with JWT verification disabled. The browser needs only the function URL; a publishable key is not an access-control boundary.
- CORS is restricted to approved production and local-development origins, but it is browser policy, not authentication.
- Search guardrails include length limits, result caps, timeouts, and rate controls.

## Hosting decision

GitHub Pages is technically suitable for a static Vite/React POC with Supabase as the data/search backend.

It supports custom domains, static assets, environment-injected build values, and SPA fallback generation.

It is not the long-term commercial SaaS hosting choice. GitHub's documented Pages limits say Pages is not intended for running an online business, e-commerce site, or commercial SaaS.

Decision:

- GitHub Pages may host a non-transactional public POC/demo.
- Move to Vercel or equivalent before commercial operation, or earlier if preview environments, server rendering, runtime middleware, or stricter deployment controls become necessary.

## BOM and supplier actions

### BOM

Keep:

- local-first BOM;
- named BOMs;
- frozen configuration snapshots;
- quantity editing;
- CSV/JSON/PDF portability.

Do not let a BOM line silently change when the catalog release changes.

### Supplier discovery

Current safe POC claim:

- `Search at Zoro`
- `Search at Grainger`
- `Search at Fastenal`
- similar neutral destinations

Unsafe without reviewed listing evidence:

- `Available from Zoro`
- `In stock`
- `Equivalent at Grainger`
- `Best supplier`

Whether neutral supplier handoff is useful enough remains an open product question.

## Rejected or deferred

Rejected now:

- configuration-only sourcing-handoff framing;
- standalone detail pages disconnected from families;
- three import files treated as three families;
- one generic `verified` badge;
- automatic standards inference;
- supplier `available from` claims based only on search links;
- full long-term catalog graph before POC validation;
- blind full UI redesign.

Deferred:

- equivalence/replacement engine;
- pricing, stock, RFQ, checkout, accounts, ERP, and cloud BOM sync;
- verified distributor-offer ingestion;
- semantic/vector search;
- broad component-category expansion;
- commercial hosting architecture.

## What still blocks `/to-spec`

1. **User-value proof** — no measured task comparison with target users.
2. **Persona/wedge** — engineer configuration recovery is the leading wedge, but engineer/procurement ownership and handoff need validation.
3. **Family taxonomy** — proposed three-family boundary needs domain review and task testing.
4. **Facet order** — required versus secondary attributes need real task testing.
5. **Supplier utility** — neutral search destinations may be too weak to carry the sourcing promise.
6. **Scope threshold** — no approved answer yet for how many families and query cases make the POC convincing.

## Next exploration loop

1. Validate the three proposed family boundaries against Jay's mechanical-domain judgment and benchmark participants.
2. Build a 12–20 task query set covering broad, family-specific, exact, ambiguous, invalid, not-indexed, and unknown cases.
3. Compare the current UI and behavioral prototype on time, wrong turns, configuration confidence, and supplier-action clarity.
4. Test whether neutral supplier handoff is useful; if not, narrow the POC promise instead of inventing availability data.
5. Revisit the Wayfinder gate only after those results.

We have not reached `/to-spec`.
