# POC family, search, public-boundary, and hosting architecture

**Date:** 2026-08-09  
**Wayfinder question:** Resolve the POC data, search, public-boundary, and hosting shape.  
**Status:** Research recommendation; not an implementation spec. Its maximal relation model was challenged. `research/product-frontier-synthesis-2026-08-09.md` records the main decision to use a four-relation POC bridge instead.  
**Scope:** Family-first mechanical-component discovery. No equivalence, price, stock, purchase, account, ERP, supplier scraping, or bulk SEO.

## Executive decision

Use a **hybrid relational canonical core with a deliberately denormalized, release-stamped public search projection**.

Keep these concepts separate now:

1. product family;
2. canonical configuration and its revision;
3. external identifier and its reviewed resolution;
4. private source/import record and public-safe provenance summary;
5. atomic publication release and withdrawal state.

Keep attributes hybrid:

- real typed columns for the small set used in routing, ordering, and facets;
- family-scoped `jsonb` only for the long tail;
- no universal entity-attribute-value system in the POC.

Keep supplier discovery destinations as **versioned search templates**, not supplier listings. Generate a destination from a published configuration; do not persist a fake offer or listing.

For search:

- resolve a known identifier through a separate, indexed exact-lookup path;
- rank generic intent to a **family**, not an arbitrary row;
- fetch configurations and facet availability only after a family is selected;
- use Postgres B-tree, weighted full-text search/GIN, and narrowly applied trigram indexes before considering an external search service.

For the public boundary:

- raw and canonical data remain in non-exposed schemas;
- the browser calls the existing Supabase Edge Function;
- the Edge Function owns HTTP validation, quotas, CORS, response shape, and observability;
- narrowly granted RPCs own set-based database search and return explicit public DTO columns;
- neither the browser nor an anonymous Data API role receives table access.

For hosting:

- retain **GitHub Pages + Supabase** for the POC;
- stop generating one static HTML shell per configuration as the Supabase catalog grows;
- pre-generate only the root, reference pages, and a small number of family routes, with the selected configuration in a query parameter;
- move to Vercel only when clean 200-status arbitrary deep links, per-branch preview deployments, root-domain routing, runtime frontend logic, or GitHub Pages' usage policy becomes an acceptance requirement.

This is enough to make 27,009 source rows credible without pretending to have built a marketplace-scale catalog platform.

---

## 1. Authority and non-negotiable product semantics

The authoritative contract defines PartSource as standards-first discovery and sourcing assistance. A configuration is a standards-defined combination, not proof of manufacture or stock. A supplier destination is a search handoff, not a listing or offer. McMaster identifiers are clues only.[R1]

The Wayfinder direction adds one important interaction rule:

- generic intent such as `M4 socket head screw` goes to a family;
- a known identifier goes to that family with one exact configuration highlighted.[R2]

The source gate permits the cofounder-provided technical configuration fields for storage, normalization, search, and public display, but prohibits publication of the confidential origin or a raw dataset download. Other named mapping/supplier sources remain blocked or conditional.[R3]

Therefore the architecture must not let any of these pairs collapse:

| Keep separate | Why |
|---|---|
| family vs configuration | Generic intent and family browsing are different from selecting one dimensional/material variant. |
| configuration vs manufactured part | The POC has standards/configuration facts, not proof that a product exists. |
| external identifier vs canonical identity | An identifier is evidence-backed routing metadata, not the canonical record itself. |
| source record vs canonical fact | Imports can duplicate, conflict, disappear, or contain private fields. |
| public provenance summary vs private source provenance | Users need trust state, but the confidential origin, raw payload, filenames, and internal notes must not leak. |
| supplier destination vs listing/offer | A generated search URL establishes no listing identity, equivalence, price, or availability. |
| published revision vs mutable working record | Corrections and withdrawals must not silently rewrite what a prior BOM snapshot meant. |

---

## 2. Repository audit: what exists and where it breaks

### 2.1 Current data and model

The local CSV packet contains 27,009 rows:

- socket head cap screws: 7,864;
- hex head screws: 8,850;
- rounded head screws: 10,295.

All source SKUs were unique in a local structural count. The populated external-reference values were also unique in this packet. Those observations are useful for a POC but do **not** establish a durable domain uniqueness rule across sources.

The importer deterministically hashes `family + source SKU` into the canonical row ID and writes the source row directly into `catalog.catalog_configurations`. The same row carries `reference_number`, `source_sku`, normalized descriptive fields, provenance flags, and verification state.[R4] This is a source-row-shaped catalog, not a canonical family/variant model.

The first migration creates one private table with text fields and ordinary indexes.[R5] The later migration adds type/head/strength and provenance/demo flags, but still keeps all meanings on the same row.[R6]

### 2.2 Current search

The RPC currently:

- performs `lower(reference_number) = normalized_query` and `lower(source_sku) = normalized_query` exact checks;
- concatenates a wide lowercased text haystack;
- removes a small hard-coded set of words;
- requires every remaining token to occur somewhere;
- applies `%value%` `ILIKE` filters;
- returns at most 25 rows without a deterministic relevance order.[R6]

Problems:

1. The plain indexes on `reference_number` and `source_sku` do not match the `lower(column)` predicates. Expression indexes are needed for those exact queries.
2. `%...%` filters do not use the existing B-tree/lower indexes and confuse equality, containment, and typed dimensional matching.
3. A query made entirely of removed words, such as `screws`, can admit the entire filtered set and return an arbitrary first 25.
4. A generic query ranks rows, not families.
5. There is no stable `ORDER BY`, cursor, total, interpretation, release ID, or facet availability contract.
6. The current search does not distinguish a hard requirement (`M4`) from a relevance hint (`socket`).

The previous completion audit observed this in practice: exact lookup and `screws` returned results, while `M4 screws` and `M5 socket head cap screw` returned zero against the development API.[R7]

### 2.3 Current public boundary

The private schema and table are revoked from browser roles. The public RPC is executable only by `service_role`, and the Edge Function keeps that credential server-side.[R5][R8] This is directionally correct.

However, the current response allowlist is too close to the raw row. It exposes `source_sku` and a free-text `provenance_note`; the importer puts the packet filename into that note.[R4][R8] The client then drops the provenance/demo/verification fields when converting the response to its `Part` model.[R9] The detail page constructs new source notes from the reduced object and marks every indexed BOM snapshot as `verified`, conflating a reviewed configuration with verified equivalence.[R10]

Other boundary issues:

- raw CSV files are tracked/staged in this working tree;
- the build script regenerates TypeScript catalogs from those raw files before tests and builds;[R11]
- `data/README.md` still describes scraped SKDIN lineage, contrary to the active source register;[R12]
- the rate-limit table stores the key supplied by the Edge Function indefinitely, while the function currently supplies a raw apparent client IP and has no cleanup path;[R8]
- CORS restricts browser origins but is not an authorization boundary; non-browser callers can invoke a public endpoint;
- deployment-level JWT verification is not explicitly represented in `supabase/config.toml`; it should be made an explicit deployment decision rather than assumed.[R13]

### 2.4 Current frontend and hosting

The React app uses `BrowserRouter` with the Vite base `/partsource/`.[R14][R15] The build creates static HTML shells for each bundled part and embed route, plus a `404.html` SPA fallback.[R16]

Measured locally, the current `dist` has 1,208 files, 1,193 HTML files, and is about 2.57 MiB. That is fine for the bundled 589-record catalog. It is the wrong publication method for 27,009 configurations because it turns a database/search release into tens of thousands of duplicate route shells and ties catalog publication to a frontend rebuild.

The GitHub Actions Pages workflow tests, builds, stamps a commit-tied release, and deploys one artifact. It does **not** pass the Vite catalog URL or publishable key into the build.[R17] Vite statically replaces `import.meta.env` at build time; any `VITE_*` value is client-visible and therefore must never be a secret.[E3]

GitHub Pages is genuinely static hosting, and a project site naturally lives under `/<repository>/`.[E1] It supports a custom `404.html`, but not an arbitrary SPA rewrite rule.[E2] The current fallback can boot React for an unknown deep URL, but the HTTP response remains a 404. That is tolerable for a POC fallback, not a clean long-term route contract.

---

## 3. Competing minimum architectures

### Option A — Hybrid canonical core + release-stamped projection (**recommended**)

Private canonical tables are relational where identity and integrity matter. Family-specific attributes remain a typed-column/`jsonb` hybrid. Publication creates a denormalized read projection for one release.

Minimum logical model:

```text
ingest.source
  -> ingest.import_batch
    -> ingest.source_record (private raw/normalized payload + content hash)

catalog.family
catalog.configuration -> catalog.configuration_revision
catalog.external_identifier -> configuration_revision
catalog.configuration_evidence -> source_record
catalog.supplier_destination_template
catalog.release -> catalog.release_configuration
catalog.withdrawal

serve.family_search_projection
serve.configuration_search_projection
serve.identifier_resolution_projection
serve.current_release
```

This is the best balance because it separates the meanings that already conflict, while avoiding a generic graph, marketplace offer model, or fully normalized attribute system.

**Benefits**

- exact identifier resolution is indexed and reviewable;
- one family can own many configurations;
- source replacement does not silently redefine canonical identity;
- corrections can create immutable revisions;
- one pointer flip publishes or rolls back a complete release;
- public queries hit narrow, denormalized rows;
- the long tail of attributes does not require a schema migration for every family.

**Costs**

- approximately ten logical relations rather than one table;
- requires an explicit curation/publish step;
- projection duplication uses more storage.

At 27,009 rows, those costs are small and the integrity gain is material.

### Option B — Versioned family/configuration documents + identifier side table

Store each canonical family and configuration revision as a validated `jsonb` document. Keep only external identifiers, source records, and releases relational. Copy published documents into a public projection.

```text
ingest.source_record
catalog.document(id, kind, family_id, schema_version, revision, body jsonb)
catalog.external_identifier(document_id, namespace, normalized_value, state)
catalog.release_document(release_id, document_id, revision)
serve.published_document(release_id, public_key, body jsonb, search_vector)
```

Promote a few generated columns (`family_id`, `thread_key`, `length_mm`, `material_key`, `standard_key`) on the public projection for indexes and facets.

**Benefits**

- lowest migration friction while taxonomy is still changing;
- immutable publication snapshots are straightforward;
- family-specific data is natural;
- a public DTO is visibly separate from private source payloads.

**Costs**

- database constraints and joins cannot protect all document fields;
- JSON validation must be rigorous and schema-versioned;
- facets become awkward unless every high-use field is promoted;
- ad hoc JSON paths can become a second, undocumented schema;
- field-level provenance is harder.

Choose this only if the next POC iteration is expected to change configuration shapes weekly and the team will enforce JSON schemas in import and publication tests.

### Option C — Flat configuration row + four side tables (short-lived bridge)

Keep the current configuration table, add `family`, `external_identifier`, `source_record/link`, and `publication` tables, then construct a public projection.

**Benefits**

- least data migration;
- fastest route from the current implementation;
- enough to stop external identifiers and provenance from living on the canonical row.

**Costs**

- the row remains a compromise between source, canonical, public, and search shapes;
- revisions/corrections tend to mutate in place;
- heterogeneous family attributes either create many nullable columns or force an unplanned JSON escape hatch;
- deduplication rules remain implicit.

This can support one demo, but it should carry an expiry criterion: migrate to Option A before a second independent source, before more than six materially different families, or before field-level conflicts must be shown.

### Rejected for the POC — fully normalized taxonomy/EAV

Do not create `attribute_definition`, `attribute_value`, `configuration_attribute`, unit ontology, taxonomy DAG, synonym graph, and field-evidence tables for every fact now.

That model appears pure but creates:

- many joins for one family grid;
- hard-to-read ranking and facet SQL;
- weak database typing when every number/string lives in generic value columns;
- curation UI and governance requirements the POC does not have;
- premature accommodation of every future mechanical category.

Use it later only if the heterogeneity signals in section 10 are reached.

---

## 4. Recommended minimum domain contract

### 4.1 Product family

A family is the generic object a user can browse and configure.

Minimum fields:

```text
family_id uuid                 -- private stable identity
public_family_key text unique  -- opaque/stable URL key or reviewed slug
slug text unique
label text
category_key text
summary text
alias_terms text[]
configuration_axis_spec jsonb  -- ordered selectors and display rules
status draft|published|withdrawn
```

Examples are “socket head cap screws,” “hex head screws,” and “rounded/button head screws.” `socket`, `hex`, and `rounded` are current ingestion buckets, not sufficient long-term family identities.

### 4.2 Canonical configuration and revision

A configuration is a normalized combination inside one family. It is still not a manufactured part.

Keep a stable configuration identity and immutable revisions:

```text
configuration(configuration_id, public_configuration_key, family_id)
configuration_revision(
  configuration_id, revision,
  measurement_system,
  thread_key, nominal_diameter_mm,
  pitch_mm, length_mm,
  material_key, finish_key, head_key, drive_key, strength_key,
  standard_key, standard_edition,
  display_values jsonb,
  extra_attributes jsonb,
  review_state,
  canonical_key,
  created_at
)
```

Rules:

- typed SI numeric values support comparison and ordering;
- `display_values` preserves user-facing notation such as `M4`, `0.7 mm`, or a fraction;
- `canonical_key` is an internal deduplication key derived from the reviewed identity fields and a versioned normalization algorithm;
- URLs use the opaque public key, not the canonical hash or an external identifier;
- a correction that preserves identity creates a new revision;
- a changed identity creates or splits a configuration rather than overwriting history.

### 4.3 External identifiers

```text
external_identifier(
  identifier_id,
  namespace,                 -- e.g. mcmaster-clue, source-sku, standard-designation
  raw_value_private,
  normalized_value,
  configuration_id,
  configuration_revision,
  source_record_id,
  review_state,
  routing_state,             -- active|ambiguous|withdrawn|blocked
  valid_from_release,
  valid_to_release
)
```

Normalization must be **namespace-specific and conservative**:

- Unicode normalization, trim, and case normalization where the namespace is case-insensitive;
- collapse cosmetic whitespace only where allowed;
- do not globally strip hyphens, slashes, decimal points, or unit punctuation;
- represent accepted alternate spellings as explicit alias rows;
- never resolve a collision by `LIMIT 1`.

A unique partial index may enforce one active reviewed target per globally unique namespace/value. Where a namespace is source-scoped, include `source_id` in uniqueness. A collision returns `ambiguous`, not an arbitrary configuration.

### 4.4 Taxonomy and attributes

Use three tiers:

1. **Family/category columns:** category, family, measurement system.
2. **Promoted facet columns:** thread/diameter, pitch, length, material, finish, head, drive, strength, standard.
3. **Long-tail `extra_attributes jsonb`:** only reviewed, family-scoped facts not yet used as common facets.

Each family owns an `axis_spec` that says:

- which attributes are required;
- selector order;
- data type and unit;
- allowed values or formatting rule;
- whether a value is a facet, a detail-only fact, or identity-defining.

Do not use free-text `ILIKE` for a facet. Normalize equality keys and numeric values at ingestion. Add a promoted column when an attribute is used in routing/faceting for two families or appears in more than 20% of configuration queries.

### 4.5 Source and provenance records

Keep private:

```text
source(source_id, owner, permission_status, permission_evidence_uri,
       allowed_fields, attribution_rule, refresh_rule, takedown_rule)
import_batch(batch_id, source_id, received_at, content_hash, status)
source_record(source_record_id, batch_id, source_row_key, raw_payload,
              normalized_payload, content_hash, supersedes_id)
configuration_evidence(configuration_revision, source_record_id,
                       supported_fields text[], review_state, reviewed_at)
```

The public response receives only:

```text
provenance_summary: "Reviewed PartSource configuration record"
review_state: "reviewed-configuration" | "unreviewed" | "demo-only"
reviewed_at (optional, coarse date)
limitations: [...]
```

Do not publish source owner, confidential origin, raw payload, packet filename, local path, permission document, source row key/SKU, internal reviewer notes, conflict notes, or raw content hash. A permitted external identifier may be displayed only through its identifier model, not because it happened to be a source key.

### 4.6 Supplier discovery destinations

This is a small configuration table, not a supplier catalog:

```text
supplier_destination_template(
  destination_key,
  display_name,
  allowed_host,
  url_template,
  query_recipe_version,
  enabled,
  terms_reviewed_at
)
```

At response or client time, combine a published configuration with the recipe to produce:

```json
{
  "state": "supplier-search-destination",
  "name": "…",
  "label": "Search this configuration on …",
  "url": "https://allowed-host/…",
  "query": "M4 socket head cap screw 20 mm …",
  "templateRevision": 3,
  "requiresVerification": true
}
```

Validate the final scheme/host against the allowlist. Snapshot the generated destination and recipe revision into the browser-local BOM. Do not store a supplier SKU, match state, price, stock, or listing URL in this POC.

### 4.7 Publication, version, and withdrawal

A release is immutable after publication:

```text
release(release_id, sequence, state, published_at, dataset_version,
        normalization_version, search_version)
release_configuration(release_id, configuration_id, configuration_revision)
current_release(singleton_id, release_id)
withdrawal(configuration_id or identifier_id, reason_code,
           public_message, effective_release, internal_note)
```

Publication flow:

1. import into private staging;
2. validate permissions, schema, canonical-key collisions, identifiers, provenance, and public allowlist;
3. construct all `serve.*_projection` rows under a new `release_id`;
4. run golden search/facet/boundary tests against that release;
5. atomically update `current_release`;
6. retain the prior release for rollback.

Withdrawal is a new release that removes the configuration from browse/search and marks its known identifiers `withdrawn`. Exact lookup should return a bounded withdrawn state and family context, not silently reroute the identifier to a different configuration. Existing local BOM snapshots remain frozen and should retain their old configuration key, revision, and release ID.

---

## 5. Public projection and Supabase boundary

### 5.1 Public response allowlist

The browser may receive only what the UI needs.

**Family projection**

- public family key, slug, label, category, summary;
- supported selector/facet definitions;
- configuration count for the current release;
- family-level public provenance/trust summary.

**Configuration projection**

- public configuration key and revision;
- public family key;
- reviewed display values and promoted facet keys/numbers;
- explicitly allowed extra attributes;
- review state, public provenance summary, limitations;
- release ID.

**Identifier resolution projection**

- matched namespace and the submitted/matched identifier if display is permitted;
- target family/configuration public keys;
- routing state (`exact`, `ambiguous`, `withdrawn`, `not-found`);
- release ID.

Do not return all identifiers for every search result. That makes bulk enumeration easy and is unnecessary. Return a permitted identifier on exact resolution/detail only.

### 5.2 Two safe Supabase shapes

#### Shape 1 — Edge-only public API (**recommended now**)

- `ingest`, `catalog`, and `serve` are not exposed through the Data API.
- browser roles have no schema/table/RPC grants.
- the browser sends only the publishable key to the Edge Function.
- the Edge Function uses a server-side key to execute only narrow RPCs.
- RPCs are `security definer`, have a fixed/empty `search_path`, fully qualify relations, return named columns, and have execution revoked from `public`, `anon`, and `authenticated`.

Supabase explicitly warns that service-role/secret keys bypass RLS and must never reach the browser.[E6][E8] Database functions default to broad execute access unless revoked, and Supabase recommends setting `search_path` for `security definer` functions.[E7]

The current `search_path = catalog, public` is better than an unset path, but an empty path with fully qualified objects is safer and easier to audit.

#### Shape 2 — Dedicated read-only Data API schema

Expose only an `api` schema containing current-release views/RPCs. Grant `anon` narrowly and protect every exposed relation with grants plus RLS. Supabase recommends dedicated API schemas because they make the exposed surface explicit and auditable.[E5]

This removes one network hop and the service-role dependency, but anonymous clients can call the Data API directly. Input limits, rate limiting, consistent errors, and anti-enumeration become harder. It is acceptable for low-risk family browse metadata, but not the preferred POC search boundary.

### 5.3 Edge Function vs RPC responsibilities

**Edge Function owns**

- POST/OPTIONS and content-type handling;
- body byte limit and JSON parsing;
- query length, filter-key allowlist, page-size/cursor bounds;
- origin-specific CORS response;
- API/JWT policy explicitly configured and tested;
- rate limit and abuse response;
- request ID, structured non-sensitive logs, timing, and error mapping;
- cache headers/ETag keyed by release + normalized request;
- final DTO schema validation.

**RPC owns**

- current-release predicate;
- identifier normalization lookup;
- family relevance and hard-constraint matching;
- configuration ordering, pagination, and facet counts;
- stable tie-breakers;
- explicit column allowlist;
- statement timeout and bounded work.

CORS is browser hygiene, not authentication. The public POC can remain anonymous, but its endpoint must be designed as publicly callable.

Improve the current limiter before a broader pilot:

- hash the client key with a rotating server secret rather than storing raw IP;
- distinguish `unknown` callers so they do not all share one global bucket;
- delete expired buckets;
- cap table growth;
- define behavior when rate-limit storage fails;
- add a release-independent health check that does not expose catalog rows.

---

## 6. Exact identifier routing

### 6.1 Route contract

Use stable canonical routes:

```text
/partsource/families/:familySlug?configuration=:publicConfigurationKey
```

An identifier itself is not the canonical URL. Use one of these entry forms:

```text
/partsource/?identifier=91290A115
/partsource/identify?q=91290A115       -- only if a static shell exists
```

Resolution then navigates client-side to the family route with the exact configuration selected. This keeps URLs stable if an identifier is corrected or withdrawn and avoids pre-generating one HTML file per identifier/configuration.

### 6.2 Exact query and indexes

Illustrative projection/indexes:

```sql
create unique index identifier_active_exact_idx
on serve.identifier_resolution_projection
  (release_id, namespace, normalized_value)
where routing_state = 'active';

create index identifier_value_probe_idx
on serve.identifier_resolution_projection
  (release_id, normalized_value);
```

Illustrative lookup:

```sql
select routing_state, namespace, public_family_key,
       public_configuration_key, configuration_revision, release_id
from serve.identifier_resolution_projection
where release_id = catalog.current_release_id()
  and normalized_value = catalog.normalize_identifier(p_namespace, p_query)
order by namespace_priority, public_configuration_key
limit 3;
```

Endpoint behavior:

| Result | Behavior |
|---|---|
| one active reviewed match | Return `exact`; route to family and highlight exact configuration. |
| multiple matches | Return `ambiguous` with bounded namespace/family choices; never choose first. |
| withdrawn match | Return `withdrawn`, reason/public note, and family context; no supplier destinations. |
| no identifier match | Pass the original query to intent-to-family search. |
| malformed identifier-like input | Return `invalid-input`; do not generate a configuration. |
| search service unavailable | Return `search-unavailable`; do not use a decoder to claim an exact match. |

Track `exact_resolution_rate`, `ambiguous_rate`, `withdrawn_lookup_rate`, and top not-found identifier namespaces. Never log raw user query strings if they could contain sensitive BOM text; use bounded classification/hashed corpus keys for analytics.

---

## 7. Intent-to-family search and relevance

### 7.1 Two-stage search

**Stage 1: interpret**

Produce a structured interpretation:

```json
{
  "normalizedQuery": "m4 socket head screw",
  "familyTerms": ["socket head screw"],
  "hardConstraints": {"threadKey": "m4"},
  "softConstraints": {},
  "unparsedTokens": [],
  "parserVersion": 1
}
```

Use reviewed aliases (`SHCS`, `socket cap screw`), unit parsing, and conservative patterns for `M4`, `M4 x 12`, standards, material, finish, and drive. A recognized dimension is a hard compatibility constraint, not merely a ranking boost.

**Stage 2: rank families**

Create one row per published family:

```text
release_id, public_family_key, label, aliases,
search_text, search_vector, active_configuration_count,
available_thread_keys, available_standard_keys
```

Use the Postgres `simple` text-search configuration for technical identifiers/terms so stemming does not distort `M4`, `DIN`, or abbreviations. Add reviewed singular/plural and synonym forms explicitly.

Illustrative index:

```sql
create index family_search_fts_idx
on serve.family_search_projection using gin (search_vector);

create index family_search_alias_trgm_idx
on serve.family_search_projection using gin
  (normalized_alias_text gin_trgm_ops);
```

PostgreSQL provides `websearch_to_tsquery` for forgiving raw text and weighted `tsvector`/ranking functions; GIN is the preferred full-text index type.[E9][E10] `pg_trgm` supports indexed similarity and `LIKE`/`ILIKE`, but should be a typo fallback, not the primary relevance model.[E11]

Illustrative ranking, with a stable tie-breaker:

```sql
score =
    100 * exact_reviewed_alias
  +  40 * all_family_terms_match
  +  20 * hard_constraints_available
  +  10 * ts_rank_cd(search_vector, query)
  +   3 * prefix_alias_match
  +   1 * log(1 + active_configuration_count)
```

The actual SQL should use explicit `CASE` expressions, not a floating black box. Return the score components and interpretation in non-production debug tests so relevance failures are explainable.

### 7.2 Result policy

- If exact identifier resolution succeeds, bypass family ranking.
- If one family clearly wins and satisfies all hard constraints, open that family.
- If several families are close, show a short family result list with interpreted constraints.
- If a family matches but no configuration satisfies hard constraints, show the family with `no configuration in this release`, not the nearest row.
- If only typo similarity matches, label it as a suggestion.
- If no family matches, return `unsupported-input`.

POC relevance corpus must include at least:

- singular/plural generic terms;
- abbreviation and full family name;
- thread-only plus family (`M4 screws`);
- thread + family + length;
- standard designation;
- material/finish terms;
- exact known identifiers;
- ambiguous and malformed identifiers;
- unsupported pins/imperial cases;
- adjective collisions such as `hex` as a head versus a drive.

A convincing gate is at least 100 reviewed queries, with 100% exact-identifier routing for the approved corpus, at least 90% correct family in rank 1, at least 98% correct family in top 3, and zero hard-constraint-violating auto-selections.

---

## 8. Configuration availability and facets

### 8.1 Public projection

One denormalized row per published configuration revision:

```text
release_id, public_family_key, public_configuration_key, revision,
thread_key, nominal_diameter_mm, pitch_mm, length_mm,
material_key, finish_key, head_key, drive_key, strength_key, standard_key,
display_values, extra_public_attributes, review_state, provenance_summary
```

Core indexes for the three current families:

```sql
create unique index configuration_release_key_idx
on serve.configuration_search_projection
  (release_id, public_configuration_key);

create index configuration_family_thread_length_idx
on serve.configuration_search_projection
  (release_id, public_family_key, thread_key, length_mm,
   public_configuration_key);

create index configuration_family_material_idx
on serve.configuration_search_projection
  (release_id, public_family_key, material_key, finish_key);

create index configuration_family_standard_idx
on serve.configuration_search_projection
  (release_id, public_family_key, standard_key);

create index configuration_extra_attrs_idx
on serve.configuration_search_projection using gin
  (extra_public_attributes jsonb_path_ops);
```

Do not create one partial index per family. PostgreSQL warns that many non-overlapping partial indexes are usually worse than one appropriate multicolumn index and are not a substitute for partitioning.[E12]

### 8.2 Availability query

Configuration list queries use equality and numeric ranges, not `%...%`:

```sql
select public_configuration_key, revision, display_values,
       review_state, provenance_summary
from serve.configuration_search_projection
where release_id = :release
  and public_family_key = :family
  and (:thread is null or thread_key = :thread)
  and (:min_length is null or length_mm >= :min_length)
  and (:max_length is null or length_mm <= :max_length)
  and (:material is null or material_key = :material)
  and (:finish is null or finish_key = :finish)
order by nominal_diameter_mm nulls last,
         pitch_mm nulls last,
         length_mm nulls last,
         material_key,
         finish_key,
         public_configuration_key
limit :page_size_plus_one;
```

Use keyset pagination from the same ordered tuple. Do not use deep `OFFSET` pagination.

### 8.3 Facet counts

For a POC, return counts for the currently constrained candidate set:

```sql
select 'material' as facet, material_key as value, count(*) as n
from candidates group by material_key
union all
select 'finish', finish_key, count(*) from candidates group by finish_key
union all
select 'thread', thread_key, count(*) from candidates group by thread_key;
```

Two valid UX contracts exist:

1. **Conjunctive counts:** every facet count reflects all current filters. Cheapest and clear if disabled values disappear.
2. **Disjunctive/self-excluding counts:** material counts ignore the selected material but honor every other filter. Better exploration, but requires one candidate CTE/aggregate per facet or precomputed bitmaps.

Use conjunctive counts in the POC unless interaction research explicitly requires self-excluding counts. Cap the response to the family's declared facet set and top values; do not allow arbitrary client-selected group-by fields.

For each selector, distinguish:

- `available`: at least one configuration remains;
- `selected`;
- `unavailable-under-current-filters`;
- `not-applicable-to-family`;
- `unknown/unreviewed`.

Never call a configuration “available” without clarifying that this means **present in the PartSource configuration dataset**, not supplier stock or availability.

---

## 9. Query performance and POC acceptance gates

Before publication, run `EXPLAIN (ANALYZE, BUFFERS)` on a production-sized staging release.

POC targets at 27,009–100,000 active configurations:

| Measure | Gate |
|---|---|
| exact identifier DB query | p95 < 20 ms warm, p99 < 50 ms; index scan; no full projection scan |
| family search DB query | p95 < 50 ms warm for top 10 |
| configuration + facet RPC | p95 < 100 ms warm for one family and <= 25 results |
| browser-to-Edge response | p95 < 250 ms in target US region, excluding first cold sample; p99 < 750 ms |
| response size | <= 100 KiB compressed for search/facets; <= 25 configurations |
| concurrency smoke | 20 concurrent searches for 5 minutes with < 1% 5xx and no pool exhaustion |
| deterministic behavior | same release/request returns same ordering and cursor |
| boundary | zero unallowlisted fields in golden response snapshots |

Treat these as POC engineering thresholds, not externally guaranteed SLAs.

Use short cache lifetimes keyed by `release_id + normalized request`. Exact identifier, family metadata, and common family facets are safe to cache because a release is immutable. A current-release metadata request supplies the invalidation key.

---

## 10. Growth strategy and explicit architecture-forcing signals

Postgres remains the default until evidence says otherwise.

### 10.1 Add richer relational taxonomy/provenance when

Any one signal persists for two releases:

- more than 25 published families and more than 40% of attributes are family-specific;
- more than 30 promoted facet columns would otherwise be mostly null;
- the same semantic attribute has three or more incompatible unit/type definitions;
- more than 5% of staged configurations have source conflicts requiring field-level adjudication;
- more than three independent sources contribute to the same family;
- standards edition/effective-date relationships must be queried rather than merely displayed.

Then introduce reviewed attribute definitions/unit dimensions and field-level evidence. Do not jump directly to generic EAV; consider family-specific typed extension tables first.

### 10.2 Change release storage when

- active configurations exceed 1 million and retained full release copies exceed 10 million projection rows;
- a normal release changes less than 1% of rows but full projection copy/publish takes more than 5 minutes;
- rollback storage exceeds 2x the active database size budget.

Then use valid-from/valid-to revision intervals, partition release data, or retain only the last two full projections plus immutable canonical history.

### 10.3 Partition or add read replicas/cache when

- one configuration projection/index exceeds available memory and p95 stays above target after query/index correction;
- sustained public search exceeds 20 requests/second or 100 concurrent requests;
- Edge-to-database connection or CPU saturation, not SQL design, is the measured bottleneck;
- ingest/publication causes user-visible latency or lock contention.

Partition by release first only if release pruning is reliable; partition by family/category only when family sizes and access patterns justify it. Do not partition 27,009 rows.

### 10.4 Introduce an external search engine when

After Postgres tuning, a representative corpus still shows one or more:

- more than 5 million active configurations and ranked query p95 > 250 ms at target load;
- typo/synonym relevance requires analyzers that cannot be maintained credibly in Postgres;
- faceting p95 > 300 ms on families with more than 50,000 active configurations;
- relevance needs click-learning, merchandising/rules, multilingual analyzers, or cross-index federation;
- search load independently needs horizontal scaling and database read replicas/caching do not meet cost/latency targets.

Even then, Postgres remains the source of truth. Publish a release-stamped search index and keep exact identifier resolution in the canonical database unless measurement proves otherwise. Vector/semantic search is not justified for exact technical identifiers and constrained fastener families.

### 10.5 Split ingestion into separate infrastructure when

- source refreshes are more frequent than daily;
- a batch exceeds 250,000 records or takes more than 15 minutes;
- more than one adapter runs concurrently;
- retry, quarantine, human review, or source-specific secrets become operational requirements.

Until then, a deterministic offline import/publish job is simpler and safer than a queue/worker platform.

---

## 11. GitHub Pages versus Vercel

### 11.1 GitHub Pages shape

GitHub describes Pages as static hosting for HTML/CSS/JavaScript and supports project sites at `/<repository>/` plus custom domains.[E1] Vite's official deployment guide says a project Pages deployment should set `base` to `/<REPO>/`, matching the current config.[E4]

Use this POC route set:

```text
/partsource/                                      static shell
/partsource/reference/…                          pre-generated static shells
/partsource/families/socket-head-cap-screws/     one shell per family
/partsource/?identifier=…                        exact lookup entry
/partsource/families/…?configuration=…           selected configuration
```

Advantages:

- preserves the authoritative host and commit-tied release workflow;
- no host migration;
- current app is entirely static except Supabase search;
- family routes are few and can receive correct metadata;
- configuration publication no longer requires tens of thousands of HTML files.

Required release contract:

- provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as build environment values;
- never put service-role/secret keys in a `VITE_*` variable; Vite bundles those client-side.[E3]
- add frontend build SHA and catalog release ID to release metadata;
- smoke the real frontend-to-Edge query after deploy;
- keep a bounded `404.html`, but do not rely on it as the canonical route for arbitrary configurations.

GitHub Pages' documented limits include a 1 GB published-site limit, a 10-minute deployment timeout, and a soft 100 GB/month bandwidth limit.[E13] More importantly, GitHub says Pages is not intended or allowed as free hosting for an online business, commercial transaction site, or commercial SaaS.[E13] The non-transactional research POC can remain there, but a commercial SaaS/product launch is an explicit move signal regardless of technical capacity.

### 11.2 Vercel shape

Vercel detects Vite projects and creates preview deployments from non-production branches.[E4] For a Vite SPA, Vercel documents that deep linking does not work by default but can be enabled with a catch-all rewrite to `/index.html`.[E14]

Advantages:

- clean 200-status arbitrary client routes via rewrite;
- preview deployments and environment-scoped frontend configuration;
- simpler root-domain/custom-domain path (`/` instead of `/partsource/`);
- optional future server/edge functions without another host.

Costs/risks:

- changes canonical host, `base`, hard-coded canonical URLs, CORS allowlist, release-truth checks, and production monitoring;
- adds another vendor while the backend remains Supabase;
- a catch-all SPA rewrite still does not provide per-route server-rendered metadata;
- Vercel Functions would duplicate the existing Supabase Edge boundary unless deliberately replacing it.

### 11.3 Decision

**Stay on GitHub Pages for the POC.** Use static family shells and query-parameter configuration selection.

Move to Vercel when any one becomes a required acceptance criterion:

1. every arbitrary family/configuration deep link must return HTTP 200 without pre-generation;
2. stakeholder review requires isolated per-PR preview deployments with separate Supabase environments;
3. `partsource.io` root routing must remove `/partsource/` and migration work is approved;
4. the frontend needs request-time redirects, headers, geolocation, authentication, or SSR;
5. Pages build/artifact/bandwidth thresholds are approached;
6. the site becomes commercial SaaS or transaction-directed, which conflicts with GitHub's stated Pages usage limits.[E13]

Do not move merely to fix search. Search remains a Supabase/Postgres concern in both hosting choices.

---

## 12. Recommended POC build boundary (for a later spec)

Build only:

1. family, configuration/revision, external identifier, source record/evidence, release/withdrawal, and supplier-template concepts;
2. a release-stamped denormalized public projection;
3. exact identifier RPC;
4. intent-to-family RPC;
5. family configuration/facet RPC;
6. Edge validation/rate/DTO boundary;
7. static root/reference/family routes on Pages;
8. a production-size publish and golden search corpus.

Defer:

- general taxonomy DAG or EAV;
- manufacturer part, supplier listing, offer, price, inventory, equivalence, replacement, or approved alternate models;
- live supplier ingestion;
- external search engine/vector search;
- accounts and server BOMs;
- pSEO/configuration-page generation;
- Vercel/SSR migration until a route/hosting signal is reached.

### Decision-complete acceptance checklist

- [ ] `M4 socket head screw` resolves to the correct family and shows only configurations satisfying the interpreted hard constraints.
- [ ] Every approved exact identifier routes to its family with exactly one configuration highlighted.
- [ ] Ambiguous, withdrawn, malformed, unsupported, and unavailable states are explicit and fail closed.
- [ ] Family facets use typed normalized equality/range semantics and report dataset presence, never supplier availability.
- [ ] Search responses carry release/configuration revisions and preserve review/provenance state through detail and BOM snapshot.
- [ ] Raw source records, confidential origin, filenames, internal notes, and unapproved source SKUs cannot appear in public response snapshots or bundles.
- [ ] Browser roles cannot select private tables or execute private RPCs.
- [ ] Service-role/secret credentials are absent from repository, Pages artifact, and browser network payloads.
- [ ] Search/index plans and latency meet section 9 on the full 27,009-row packet.
- [ ] Publication pointer flip and rollback are atomic; withdrawal does not remap an identifier.
- [ ] Pages production artifact is supplied safe build-time public configuration and passes a real frontend-to-Edge smoke.

---

## 13. Final challenge to both extremes

### Why the current flat row is not “simple” anymore

It hides complexity rather than removing it. The row ID is derived from a source SKU, the row simultaneously acts as source record/canonical variant/search document/public DTO, identifiers live beside facts, provenance is free text, and corrections mutate the same identity. That shape makes the first import easy and every second source, correction, collision, and withdrawal unsafe.

### Why a fully normalized catalog is not automatically “correct”

The POC has three families, a bounded attribute set, no supplier listings/offers, and no curation organization. A universal attribute ontology and field-level temporal graph would consume the product-learning budget before family UX and relevance are proven. Normalization is valuable at boundaries of identity, evidence, and publication; denormalization is valuable at the public search boundary.

The recommended architecture deliberately uses both:

> **Normalize truth and lifecycle. Denormalize serving. Promote only the attributes the POC actually facets.**

That is the minimum credible architecture for the stated POC.

---

## References

### Repository evidence

- **[R1]** `research/product-contract.md`, especially lines 26–45, 61–120, and 136–150.
- **[R2]** `.wayfinder/poc-ship/poc-ship-map.md`, lines 31–50.
- **[R3]** `research/data-source-register.md`, lines 3–16 and 35–46.
- **[R4]** `web/scripts/import-catalog-to-supabase.ts`, lines 39–43, 50–57, 78–117, and 136–169.
- **[R5]** `supabase/migrations/20260805_catalog.sql`, lines 1–37; `supabase/migrations/20260807_catalog_search_rpc.sql`, lines 1–55.
- **[R6]** `supabase/migrations/20260809_configuration_catalog_contract.sql`, lines 1–38 and 42–123.
- **[R7]** `research/poc-completion-discovery-2026-08-09.md`, lines 63–98 and 114–156.
- **[R8]** `supabase/functions/catalog-search/index.ts`, lines 3–13, 24–32, 42–82, and 85–135; `web/scripts/test-catalog-boundary.ts`, lines 10–38 and 55–96.
- **[R9]** `web/src/lib/catalogApi.ts`, lines 3–27, 66–75, and 128–149.
- **[R10]** `web/src/pages/PartDetail.tsx`, lines 214–243, 293–339, and 458–473.
- **[R11]** `web/package.json`, lines 6–21.
- **[R12]** `data/README.md`, lines 1–41.
- **[R13]** `supabase/config.toml`, lines 1–14.
- **[R14]** `web/src/App.tsx`, lines 18–51 and 95–118.
- **[R15]** `web/vite.config.ts`, lines 6–12.
- **[R16]** `web/scripts/generate-static-part-pages.ts`, lines 56–114.
- **[R17]** `.github/workflows/deploy.yml`, lines 17–69 and 79–96.

Local structural counts and `dist` measurements in this report were calculated on 2026-08-09 without printing row contents or credentials.

### Official external documentation

All external sources retrieved 2026-08-09.

- **[E1]** GitHub Docs, “What is GitHub Pages?” — static hosting, project paths, custom domains, and visitor IP logging. https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- **[E2]** GitHub Docs, “Creating a custom 404 page for your GitHub Pages site.” https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site
- **[E3]** Vite Docs, “Env Variables and Modes” — `import.meta.env` replacement and public `VITE_*` values. https://vite.dev/guide/env-and-mode
- **[E4]** Vite Docs, “Deploying a Static Site” — `dist`, GitHub Pages base path, GitHub Actions, Vercel detection, and preview deployments. https://vite.dev/guide/static-deploy.html
- **[E5]** Supabase Docs, “Securing your API” — grants, RLS, dedicated schemas, default privileges, and pre-request checks. https://supabase.com/docs/guides/api/securing-your-api
- **[E6]** Supabase Docs, “Securing your data” — Data API vs Edge Functions, publishable keys, and secret/service-role key boundary. https://supabase.com/docs/guides/database/secure-data
- **[E7]** Supabase Docs, “Database Functions” — RPC, function-vs-Edge guidance, `security definer`, `search_path`, and execute grants. https://supabase.com/docs/guides/database/functions
- **[E8]** Supabase Docs, “Environment Variables” — Edge default secrets and warning that service-role/secret keys bypass RLS and must not be used in a browser. https://supabase.com/docs/guides/functions/secrets
- **[E9]** Supabase Docs, “Full Text Search” — `tsvector`, `tsquery`, `websearch_to_tsquery`, ranking, and indexes. https://supabase.com/docs/guides/database/full-text-search
- **[E10]** PostgreSQL Docs, “Controlling Text Search” and “Preferred Index Types for Text Search” — weighted vectors, forgiving web search parsing, ranking, and preferred GIN indexes. https://www.postgresql.org/docs/current/textsearch-controls.html and https://www.postgresql.org/docs/current/textsearch-indexes.html
- **[E11]** PostgreSQL Docs, `pg_trgm` — indexed similarity and trigram support for `LIKE`/`ILIKE`. https://www.postgresql.org/docs/current/pgtrgm.html
- **[E12]** PostgreSQL Docs, “Partial Indexes” — predicates and warning against using many partial indexes as partitioning. https://www.postgresql.org/docs/current/indexes-partial.html
- **[E13]** GitHub Docs, “GitHub Pages limits” — usage restrictions, site/deployment/bandwidth limits, and commercial SaaS/transaction limitation. https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- **[E14]** Vercel Docs, “Vite on Vercel” — SPA deep-link rewrite, environment variables, and Vercel Functions. https://vercel.com/docs/frameworks/frontend/vite
