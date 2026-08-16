# Validation: deterministic architecture and safe automation boundary

**Date:** 2026-08-09  
**Phase:** Validation + Targeted Ideation Gate  
**Status:** Repository architecture audit after a specialist delegation was blocked by the active Codex plan limit. No production implementation was changed.

## Verdict

**Strong hypothesis:** Keep React/Vite on static hosting, a server-side Supabase Edge boundary, and deterministic PostgreSQL search for the bounded POC. The scale is not the problem. The current truth model, query contract, release identity, public DTO boundary, and hostile-internet controls are the problems.

**Fundamental requirement:** The browser must never read private catalog or evidence relations directly and must never receive a service-role credential. All public data leaves through one versioned, allowlisted API DTO tied to one immutable catalog release.

**Opportunity / gold idea:** Use the same deterministic constraint ledger as the product state, search request, regression corpus, and supplier-handoff compiler. One inspectable state can replace separate fuzzy search, opaque ranking, and duplicated UI logic.

**Rejected:** Browser-to-Supabase table/RPC access, vector or LLM retrieval for technical truth, an external search cluster for POC scale, automatic deduplication, hard-constraint relaxation, and generated mechanical facts.

## Evidence from the current implementation

### Evidence

- `catalog.catalog_configurations` is one mutable source-row-shaped table. It mixes family, configuration, identifiers, public DTO, provenance labels, search text, and ingestion state.
- The public search RPC is `SECURITY DEFINER`, callable only by `service_role`; `anon` and `authenticated` are revoked. This is the correct direction for blocking direct browser database access.
- The Edge Function holds `SUPABASE_SERVICE_ROLE_KEY`, calls the private rate-limit and search RPCs, then forwards every returned field except `created_at`. It does not construct or runtime-validate a strict DTO allowlist.
- The browser sends the public Supabase key to the Edge Function. The live function was previously observed to answer without authorization, so the endpoint is operationally public. CORS and a publishable key are not access control.
- `supabase/config.toml` does not declare the deployed function JWT setting. The repository therefore cannot prove that deployment configuration matches local intent.
- Current exact search uses un-namespaced `reference_number` and `source_sku` with `LIMIT 1`. A collision would become a false unique match.
- Broad and filtered search use leading-wildcard `ILIKE` over text fields. There is no stable order, total, cursor, release ID, query explanation, statement timeout, typed quantity filter, or ambiguity result.
- Current Edge input has a 200-character query limit and filter allowlist, but reads/parses an unbounded request body first. It has no explicit content-type requirement, request deadline, database statement deadline, DTO schema version, request ID, or release ID.
- Rate limiting writes to PostgreSQL for every search, accepts a forwarded IP value in application code, retains buckets without demonstrated cleanup, and places unresolved clients in one `unknown` bucket.
- `web/src/lib/catalogApi.ts` has an AbortSignal path and rejects commercial-field names, but it accepts a broad structural result, translates unknown fields into a common `Part`, and maps missing pitch/length to `N/A`.
- `.github/workflows/deploy.yml` builds and tests the static app but does not inject catalog endpoint configuration or perform an end-to-end frontend-to-Edge catalog smoke. Existing monitoring verifies static release identity and routes, not the catalog release.
- The current public site and local build were previously observed at different frontend revisions. Proposed family deep links returned 404 on GitHub Pages.
- Existing source profiling found identity collisions and mechanically significant omitted fields. Search architecture cannot repair a lossy publication model.

## Target POC topology

### Fundamental requirement

Use this request path:

`browser → versioned public Edge API → deterministic private RPC → immutable active catalog release`

Private publication path:

`permitted raw source → normalization candidates → family-schema validation → conflict/identity review → immutable release build → atomic active-release switch`

### Fundamental requirement

Public serving objects remain bounded:

1. `catalog_releases` — immutable manifest, schema/parser versions, digests, lifecycle, active pointer;
2. `catalog_families` — release-stamped family profile and public labels;
3. `catalog_configurations` — release-stamped reviewed configuration revision with typed promoted facts and complete family attributes;
4. `catalog_identifiers` — namespace-aware release-stamped mapping with unique, ambiguous, blocked, withdrawn, and unknown states.

Private raw records, permissions, review decisions, evidence links, source keys, filenames, and internal notes do not enter public DTOs.

### Strong hypothesis

The four public relations are enough for the fastener POC when they are immutable release projections. They are not enough as mutable master tables.

### Fundamental requirement

Every public response and frozen BOM line carries:

- API schema version;
- catalog release ID;
- family and configuration public key;
- configuration revision/digest;
- identifier namespace/value and mapping revision/state when applicable;
- parser/constraint-ledger version;
- explicit missingness/conflict/applicability states.

## Deterministic search contract

### Fundamental requirement

Keep deterministic:

- identifier normalization and namespace routing;
- exact identifier collision detection;
- supported grammar parsing;
- unit dimension checks and exact conversions;
- family routing rules;
- hard-constraint application;
- missing, not-applicable, unknown, conflict, outside-release, withdrawn, invalid, and unavailable states;
- selection and handoff gates;
- stable ordering and pagination;
- release publication and rollback;
- public DTO construction;
- supplier query compilation.

### Strong hypothesis

PostgreSQL remains sufficient through at least the present 27,009-row source and a substantially larger reviewed release if the schema and indexes match the request shapes:

- B-tree exact indexes on normalized `(namespace, identifier)` and public keys;
- B-tree/equality indexes on family and promoted enums;
- numeric indexes on typed normalized quantities used in range filters;
- PostgreSQL full-text search for reviewed vocabulary and descriptions;
- narrowly scoped trigram suggestions for aliases or ordinary words only;
- keyset pagination ending in a stable public configuration key.

### Fundamental requirement

Hard dimensions, units, thread forms, pitch/TPI, standards, materials, finishes, and strength attributes filter or cause abstention. They never act as relevance boosts.

### Risk

Trigram similarity on identifiers, dimensions, thread designations, or standards can produce mechanically nearby but wrong results. Keep exact technical tokens outside fuzzy promotion.

### Nice-to-have

Self-excluding facet counts, precomputed counts, read replicas, release-keyed API caching, and external search infrastructure only after measured need.

### Rejected

- nearest-row fallback;
- `LIMIT 1` collision handling;
- query relaxation after zero results;
- vector similarity for technical identity;
- universal EAV search;
- external search service before indexed PostgreSQL is measured and tuned.

## Safe automation boundary

### Opportunity / gold idea

Automation may assist offline review by proposing:

- parser test cases;
- alias candidates;
- duplicate/collision groups;
- unusual unit or designation forms;
- family-classification candidates;
- field-difference summaries;
- source-permission checklist gaps;
- regression corpus expansion;
- supplier-query templates for review.

### Fundamental requirement

Every automated proposal remains non-public until deterministic validation and explicit review. The original source notation and machine transform version remain available to reviewers.

### Rejected

Automation must not:

- infer missing pitch, TPI, dimensions, standard, material, finish, strength, tolerance, or suitability;
- merge configurations;
- resolve identifier collisions;
- claim equivalence, replacement, listing, offer, stock, approval, or application suitability;
- override a hard constraint;
- publish a release;
- silently rewrite a saved BOM snapshot;
- generate user-visible confidence scores.

### Strong hypothesis

An LLM can help write aliases, explain a deterministic state in plain language, or cluster review work. It cannot own the state. Generated explanations must be derived from and checked against a structured public DTO; templates are safer for the POC.

## Public Edge requirements

### Fundamental requirement

Before public release:

- reject non-JSON and oversized bodies before parsing;
- bound query, filter count, value length, page size, and cursor;
- use a database statement timeout and Edge deadline;
- return a versioned allowlisted DTO validated at runtime;
- include request and catalog release IDs;
- emit safe structured duration, outcome, count, release, and limiter telemetry;
- never log raw BOMs, raw source text, full IPs, credentials, or private evidence;
- return `Retry-After` on 429;
- add an explicit project-wide cost/circuit breaker, not only per-client buckets;
- test deployment-level JWT/public access behavior;
- prove `anon` has no direct table/RPC access;
- pin Edge dependencies;
- test private-field and secret containment in source, bundle, logs, and responses.

### Risk

A service-role secret inside the Edge Function has broad blast radius. For the POC, keep it server-only and restrict all code paths to reviewed RPCs. Move to a dedicated least-privilege server role when Supabase deployment supports it cleanly or before the API surface grows.

### Strong hypothesis

A no-JWT endpoint is acceptable only as an explicitly open, non-sensitive, budget-bounded read API. JWT validation would not make anonymous public data private; it would mainly change caller handling. The security boundary is the DTO, database grants, validation, budgets, and observability.

## Release, caching, and deployment

### Fundamental requirement

The active catalog release changes atomically. Requests never mix release IDs. Corrections and withdrawals create a new release; old BOM snapshots remain unchanged and resolvable to their release state.

### Strong hypothesis

Start catalog API responses with explicit `no-store` until correction and withdrawal behavior is verified. Add immutable release-keyed caching only after it cannot serve withdrawn or mixed-release data.

### Fundamental requirement

Deployment must inject only the public Edge URL/key, build the exact tested artifact, and run a post-deploy browser-to-Edge smoke covering:

- active release identity;
- one exact mapping;
- one family search;
- one explicit unavailable/invalid state;
- zero private DTO fields;
- frontend SHA and catalog release shown together.

### Strong hypothesis

GitHub Pages is acceptable for a controlled static POC if routes are query-based or generated as static shells and catalog configuration is tested. It is not a good long-term host for runtime middleware, clean arbitrary deep links, accounts, transactions, or commercial SaaS controls.

## Measured gates

### Fundamental requirement

Use a reviewed 100–150-case truth corpus and production-like indexes. Required correctness:

- 100% approved exact identifiers return one reviewed target or explicit ambiguous/blocked/withdrawn/unknown;
- zero hard-constraint-violating unique selections;
- 100% seeded conflicts and collisions abstain;
- stable byte-equivalent ordering for the same release and request;
- zero unallowlisted/private fields in public DTO snapshots.

### Strong hypothesis

Practical POC targets:

- exact identifier DB p95 under 20 ms;
- family search DB p95 under 50 ms;
- configuration/facet RPC p95 under 100 ms;
- warm browser-to-Edge p95 under 250 ms and p99 under 750 ms;
- public statement timeout at or below 500 ms;
- Edge deadline at or below 2 seconds;
- compressed response at or below 100 KiB;
- 20 concurrent mixed searches for five minutes with under 1% 5xx.

These are release gates to measure, not current claims.

## Migration triggers

### Nice-to-have

Add caching or read replicas after sustained load shows benefit. Reconsider an external search engine only after PostgreSQL query/index correction fails at measured scale—roughly millions of active reviewed configurations, ranked p95 above target, or database saturation under real load.

### Rejected

Do not build for hypothetical universal mechanical data. Bearings already falsify the assumption that all categories share the fastener configuration center. New categories need new identity objects and category rules before they enter a serving release.

## Classified decision register

- **Evidence:** Current API uses a service-role Edge boundary and private RPC, but forwards a broad row, lacks release identity, and uses unsafe flat text search.
- **Fundamental requirement:** Immutable release projections, explicit public DTOs, deterministic truth/selection gates, private lineage, bounded public execution.
- **Strong hypothesis:** PostgreSQL + Edge + static React is sufficient for the bounded POC and materially more data.
- **Opportunity / gold idea:** One deterministic constraint ledger powers search, UI, tests, BOM snapshots, and handoff.
- **Nice-to-have:** Release-keyed caching, replicas, advanced facet counts, external search after measured triggers.
- **Open question:** Initial reviewed release size, approved family profiles, real latency under controlled warm/cold load, and Supabase trusted-client/rate-limit primitives.
- **Risk:** Service-role blast radius, anonymous cost, mutable/lossy data, stale deployment, and automation laundering guesses into truth.
- **Rejected:** Direct browser data access, fuzzy technical identity, automatic publication/deduplication, vector truth search, premature platform infrastructure.
