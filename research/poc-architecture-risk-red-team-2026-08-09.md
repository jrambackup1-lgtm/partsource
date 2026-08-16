# POC architecture risk red-team

**Date:** 2026-08-09  
**Wayfinder:** Ticket 22  
**Scope:** Four-relation public bridge (`families`, `configurations`, `identifiers`, `releases`), private raw staging, GitHub Pages, and an anonymous Supabase Edge Function.

## Verdict

**Strong hypothesis:** The four public relations are enough for a bounded POC, but only if they are **release-versioned serving records**, not four mutable master tables. Private raw staging must also retain immutable source records, review decisions, and a durable link from every published field group to its evidence. “Raw files somewhere private” is not enough.

The minimum safe shape is:

- `catalog_families`: one release-stamped family version, with a versioned family schema and identity/facet rules;
- `catalog_configurations`: one append-only release version per public configuration key, with supplied display values, typed promoted quantities, complete family-specific attributes, review/missingness states, and a revision/digest;
- `catalog_identifiers`: namespace-specific, release-stamped mappings with `active`, `ambiguous`, `withdrawn`, and `blocked` states;
- `catalog_releases`: immutable manifest/digests and one atomically selected active release;
- private staging/review records: immutable raw payload/hash, permission record, normalization version, reviewer decision, and field-group evidence links.

With that contract, whole-release replacement can cover first corrections, withdrawals, and rollback without a full revision/evidence graph. Without append-only release versions and private review links, the bridge cannot support the stated trust contract.

The current implementation does not implement this bridge. It is a source-row-shaped mutable table behind an Edge Function.

## Classification summary

### Confirmed

- Current `catalog.catalog_configurations` combines source row, configuration, identifiers, search row, provenance, and public DTO. IDs hash import bucket plus source SKU, and import uses in-place upsert (`web/scripts/import-catalog-to-supabase.ts:39-56, 78-117, 160-169`).
- Current family values are constrained to ingestion buckets `socket`, `hex`, and `rounded`, not reviewed user-facing families (`supabase/migrations/20260809_configuration_catalog_contract.sql:26-31`; taxonomy audit).
- Reviewed identity cannot be derived from the current flat projection. The narrower import signature has 1,591 repeated groups / 3,502 rows; 1,311 groups contain differences in supplied fields omitted by that projection. A common projection can create false duplicate candidates (`research/mechanical-data-trust-opportunities-2026-08-09.md:111-135`).
- The importer drops selection-relevant supplied fields. Its narrower imported signature has 1,591 repeated groups / 3,502 rows; in 1,311 groups the omitted source fields differ (`research/mechanical-data-trust-opportunities-2026-08-09.md:111-135`).
- Dimensions are text. There is no numeric quantity, unit dimension, parse status, tolerance, or conversion precision. Imperial TPI is already present in source thread fields, yet the importer reads only metric-style `thread_pitch` and the client renders missing pitch as `N/A` (`mechanical-data-trust-opportunities...:161-194`; `catalogApi.ts:115-141`).
- Current search has leading-wildcard `ILIKE`, no stable `ORDER BY`, facets, counts, cursor, total, release ID, query explanation, or statement timeout; it returns an arbitrary maximum of 25 (`20260809_configuration_catalog_contract.sql:74-119`).
- Exact identifier branches use un-namespaced `reference_number`/`source_sku` and `LIMIT 1`; a future collision would be hidden rather than reported as ambiguous (same migration:98-108).
- There is no catalog release, immutable revision, correction decision, supersession, withdrawal, or catalog rollback. `release.json` identifies only the frontend SHA (`generate-release-metadata.ts:4-18`). BOM snapshots omit catalog release/configuration/mapping revision and mark indexed rows `verified` (`PartDetail.tsx:293-337`; `bomStorage.ts:6-30`).
- The Edge Function is actually public: a live request without Authorization returned HTTP 200 and one exact result on 2026-08-09. CORS rejected a bad browser origin, but requests with no `Origin` are allowed (`catalog-search/index.ts:24-32, 85-91`).
- The live exact request samples took 2.576 s without auth and 1.418 s with the configured public key. These are only three cold/unknown-condition probes, not a latency benchmark, but they do not prove the proposed p95 target.
- Dynamic responses had no `Cache-Control`, `ETag`, `Retry-After`, release ID, or request ID in the live probe. The function emits no such headers (`catalog-search/index.ts:35-39, 117-135`).
- Rate limiting stores an apparent raw IP indefinitely, trusts forwarded headers in application code, performs a database write/check before every search, has no cleanup/cap, and gives all unresolved clients the `unknown` bucket (`catalog-search/index.ts:42-45, 110-121`; `20260808_catalog_search_rate_limit.sql`).
- The Edge Function parses an unbounded request body before validating the 200-character query, has no explicit content-type check, no request/DB timeout, and forwards every RPC-returned field except `created_at` instead of constructing a DTO allowlist (`catalog-search/index.ts:93-134`).
- Observability is limited to two error logs. There are no structured request IDs, release IDs, durations, result counts, limiter outcomes, metrics, or Edge/API canaries. Existing scheduled monitoring checks static Pages routes and frontend release SHA, not the catalog service (`production-monitoring.yml`).
- The Pages deploy does not inject catalog URL/key and does not smoke frontend-to-Edge behavior (`deploy.yml:35-69, 79-96`). The public site still reports frontend SHA `dd0be4...`, built 2026-07-12, while the local `dist/release.json` reports `09e030...`, built 2026-08-09.
- GitHub Pages currently returns HTTP 200 for the root with `Cache-Control: max-age=600` and an ETag, but the proposed family deep link returns HTTP 404. Pages supplies static caching; it does not solve API caching or clean arbitrary SPA routes.

### Strong hypotheses

- Keep normalization at identity, publication, and security boundaries; keep the released search row deliberately denormalized.
- Use one reviewed JSON Schema/axis specification per family. Preserve the complete allowed family-specific attribute document; promote only fields used for routing, sorting, or facets.
- Field-group evidence (`identity/thread`, `dimensions`, `material/finish`, `strength`, `standards`) is enough for the first release. Per-field assertion tables are not.
- Whole-release correction is adequate while edits are rare: copy forward reviewed records, assign a new configuration revision/digest, publish atomically, and retain the prior release.
- Typed quantities are required now for any numeric filter/order. Keep the supplied notation beside normalized values. A failed parse is `not-yet-normalized`, never zero, `N/A`, or a guessed value.
- GitHub Pages plus Supabase is acceptable for a non-transactional research POC once the production artifact is wired and tested end to end.
- Anonymous no-JWT reads are acceptable only for a narrow, non-sensitive, budget-limited API designed as hostile-internet-facing. The public key, JWT, and CORS are not access control.

### Open questions

- Which fields define identity, validity, and selector order for each proposed family? Domain review is required before deduplication.
- Is the initial release metric-only, or must a family mix metric and imperial records? The answer determines how much cross-unit/thread-designation behavior is required now.
- How many rows can actually be reviewed for the first release: all 11,973 candidate rows or a smaller set?
- What is the correction/withdrawal response target, and how long must prior releases remain resolvable for local BOMs?
- Does Supabase supply a trusted, non-client-spoofable address in this deployment? Application trust in arbitrary `x-forwarded-for` must not be assumed.
- What real peak request rate and budget follow a public demo? No production traffic baseline exists.
- What private evidence retention, reviewer identity, and takedown audit period are legally/operationally required?

### Nice-to-have

- Per-field temporal assertions, a reviewer UI, anomaly detection, source-comparison views, read replicas, an external search service, and semantic/vector retrieval.
- CDN/server cache after immutable releases and measured repeat traffic. Until then, bounded uncached queries with `no-store` are safer than incorrect caching.
- Vercel previews, clean arbitrary-route HTTP 200 responses, SSR metadata, and runtime frontend middleware before they become acceptance criteria.

### Rejected

- Automatic merge/deduplication on the common flat technical projection.
- One universal configuration tuple or one mostly-null flat schema for future categories.
- A universal EAV/unit ontology, knowledge graph, or field-assertion graph before POC value is proven.
- External identifiers as canonical identity or URLs; `LIMIT 1` collision handling.
- In-place mutation of released truth, silent identifier remapping, or nearest-row fallback after withdrawal.
- Generic `verified`, `N/A` for missing, or inferred standards/finish/pitch.
- Treating CORS, a publishable key, or a JWT on an anonymous endpoint as abuse prevention.
- Exposing service-role credentials to the browser, forwarding a raw RPC row as a public DTO, or pre-generating tens of thousands of configuration HTML shells.

## POC requirements versus migration triggers

| Concern | Required before first public family release | Migrate when measured trigger fires |
|---|---|---|
| Reviewed identity | Stable opaque family/configuration keys; reviewed family inclusion/exclusion and identity fields; no automatic merge | Add dedicated identity/adjudication history when repeated splits/merges or manual edits make whole-release review opaque |
| Field evidence | Immutable private source record + permission + normalization/review manifest; public field-group summaries and explicit missingness | Add per-field assertions when conflicts affect >5% of staged configurations for two releases, or >3 independent sources feed one family |
| Corrections | New immutable release; configuration revision/digest; retained previous release; explicit compare/update for BOM | Add canonical revision relations before frequent partial correction or when old releases cannot economically remain whole |
| Releases/rollback | Release ID on every DTO and BOM snapshot; complete manifest/digests; atomic active pointer; rollback to previous release | Use intervals/partitioned deltas above 1M active / 10M retained rows, publish >5 min with <1% churn, or rollback storage >2x budget |
| Withdrawals | Tombstone state in release-versioned configuration/identifier; remove from browse; exact lookup returns bounded `withdrawn`; no handoff/remap | Add richer case/audit workflow when withdrawals require legal cases, appeals, or partial jurisdiction/source scope |
| Family schemas | Versioned JSON Schema/axis spec; complete allowed family attributes; schema validation in publish gate | Add typed family extension tables/governed definitions when >6 materially different families repeatedly diverge; revisit richer taxonomy above 25 families plus >40% family-specific attributes or >30 mostly-null promoted columns |
| Quantities/units | For every numeric facet/order: supplied display value, numeric normalized value, dimension/unit/system, parse status, exact/rounded flag; explicit metric pitch vs imperial TPI | Add ranges/tolerances/conditions before filtering O-rings, springs, bearings, fittings, or any tolerance/service claim; add governed unit definitions when one attribute has >=3 incompatible definitions |
| Facets | Server allowlist from family schema; equality/range over typed keys; conjunctive counts; distinguish unavailable, not applicable, and unknown | Self-excluding counts/precomputation only if user testing needs them or facet p95 misses target |
| Pagination | Stable keyset order ending in public configuration key; page size <=25; cursor binds release, family, normalized filters, and order version; invalid/stale cursor is 400/409 | Partition/cache/search service only after query/index correction fails at measured scale |
| Observability | Structured safe logs and metrics; no raw BOM/query/IP; request/release ID in response; API health and golden exact/family canaries | Dedicated telemetry pipeline when volume/retention or incident investigation exceeds provider logs |
| Rate/abuse | Body/content-type limits, trusted client key, hashed expiring buckets, per-client plus global budget/circuit breaker, cleanup, 429 + `Retry-After`, cost alert | Add WAF/challenge/authentication when distributed traffic defeats budget controls or intended use becomes private/account-based |
| Cache | Explicit `no-store` until release/withdrawal behavior is correct; static assets may keep content-hash caching | Add release-keyed API cache when sustained search exceeds 10 rps or DB work is materially reduced; purge/switch by release, never mutable row TTL alone |
| Hosting | Inject safe public endpoint config; no secrets in Vite; real post-deploy frontend-to-Edge smoke; family shells/query-parameter selection | Leave Pages before commercial SaaS/transactions, root/runtime middleware/auth/SSR, required 200 deep links/previews, or Pages limits |
| Search infrastructure | Exact identifier index; family ranking; hard-constraint filtering; Postgres indexes | Read replica/cache at sustained >20 rps or >100 concurrent with DB saturation; external search only after tuning and roughly >5M active rows or ranked p95 >250 ms |

## Measurable release gates

### Data and correctness

- **100%** of published configurations belong to a reviewed family boundary and pass that family schema.
- **100%** of selection-critical values carry an origin, review state, and explicit value/missingness state.
- **Zero** automatic merges based only on common/promoted fields; every collision is blocked or reviewed.
- **100%** of approved identifier corpus resolves to exactly one reviewed target or an explicit `ambiguous`/`withdrawn` state; no `LIMIT 1` behavior.
- At least **100 reviewed search queries**: 100% approved exact-identifier routing, >=90% correct family at rank 1, >=98% in top 3, and **zero** hard-constraint-violating auto-selections.
- Same release + request returns byte-equivalent ordering/cursor semantics. Facet counts reconcile with a full reference query.
- Every response and saved BOM line contains catalog release ID, stable public family/configuration key, configuration revision/digest, and applicable identifier mapping state.
- Public response/bundle snapshots contain **zero** raw payloads, filenames, private source keys, internal notes, permission records, service credentials, or unallowlisted fields.

### Performance and capacity

Test against 27,009-100,000 active configurations with production-like indexes and `EXPLAIN (ANALYZE, BUFFERS)`:

- exact identifier DB p95 <20 ms, p99 <50 ms, index scan and no full projection scan;
- family search DB p95 <50 ms for top 10;
- configuration + facet DB/RPC p95 <100 ms for <=25 rows;
- browser-to-Edge warm p95 <250 ms and p99 <750 ms in the target US region;
- compressed response <=100 KiB;
- 20 concurrent mixed searches for 5 minutes: <1% 5xx, no pool exhaustion, stable latency;
- database statement timeout <=500 ms for public search and Edge deadline <=2 s, returning bounded `search-unavailable` rather than hanging.

The live 1.4-2.6 s samples mean this gate is presently **unproven**, not necessarily failed; run a controlled warm/cold benchmark.

### Reliability and release

- Publish is all-or-nothing: no request can observe mixed release IDs.
- Golden search/facet/boundary tests pass before pointer flip; rollback restores the prior release in **<5 minutes** with no frontend rebuild.
- Withdrawal drill removes browse/selection, preserves exact withdrawn explanation, suppresses supplier handoff, and leaves old BOM snapshot unchanged.
- Synthetic canary runs at least every **5 minutes** for health, exact lookup, family search, and active release identity; alert after two consecutive failures.
- Alert when 5xx >1% over 5 minutes with >=100 requests, p95 >750 ms for 10 minutes, or rate-limit/global budget storage fails. Catalog and frontend release IDs must be visible together.

### Security and abuse

- Reject bodies >16 KiB before JSON parsing; require JSON; query <=200 characters; <=12 allowlisted filters; page size <=25; malformed cursor/filter is 400.
- Fuzz at least 10,000 malformed/oversized/wildcard/cursor inputs with **zero** secret/private-field disclosure and <0.1% unexpected 5xx.
- Anonymous/unauthenticated roles have zero direct private schema/table/RPC access. Service-role/secret values are absent from Git, Pages artifact, source maps, logs, and browser traffic.
- Edge constructs explicit versioned DTOs; runtime validation rejects any unexpected RPC field instead of forwarding it.
- Start with a measured guardrail such as 30 requests/minute/client with burst 10 plus a project-wide 20 requests/second sustained circuit breaker; tune from pilot telemetry. Hash client keys with a rotating secret, expire/delete buckets within two windows, and prove spoofed forwarded headers cannot create new buckets.
- Return 429 with `Retry-After`; rate-limit/storage failure follows an explicit fail-closed or circuit-breaker policy. Budget alerts must stop an anonymous distributed attack from becoming unbounded spend.
- Pin Edge dependencies to an exact reviewed version and test deployment-level `verify_jwt = false` explicitly. Disabling JWT is a deliberate public-API choice, not a missing-security fix.

## Honest platform assessment

### GitHub Pages

**Suitable for the POC, not deployment-complete.** It is a low-cost static shell, its project-path base matches Vite, and static caching works. It cannot provide clean arbitrary SPA deep-link 200s or frontend runtime controls. GitHub's documented Pages policy also makes commercial SaaS/transaction use a move trigger. Current family routes do not exist, the live site is stale, and deploy does not provide or test catalog configuration. Keep Pages only after adding static family shells, safe build-time endpoint values, and real production API smoke.

### Public no-JWT Edge Function

**Acceptable only as an explicitly open read API.** The live endpoint proves that Authorization is not required. That is honest for public non-sensitive catalog facts and avoids fake authentication. It also means anyone can call it outside the browser, enumerate allowed data, spoof load from many clients, and consume database/Edge budget. CORS changes none of that.

The current fixed RPC call and private-table grants reduce SQL injection and browser exposure, but the service-role credential has broad blast radius, the response is not a true allowlist, and rate/body/timeout/telemetry controls are inadequate. Do not launch the reviewed catalog until the security and abuse gates above pass. If the data cannot safely be bulk observed, or the cost cannot be bounded under anonymous distributed traffic, no-JWT public access is the wrong architecture.

## Bottom line

Keep the four-relation bridge, but define it as an append-only, release-stamped publication model backed by durable private evidence. Add typed promoted quantities and family schemas without flattening away the long tail. Do not build EAV or a marketplace graph. The immediate risks are not relation count; they are lossy identity, mutable truth, missing release/withdrawal semantics, raw-row DTO forwarding, unbounded anonymous cost, and a production pipeline that does not yet join frontend and catalog release truth.
