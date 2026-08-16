# Proxy architecture and security review — 2026-08-10

**Status:** Bounded proxy/synthetic review; not production readiness, external security certification, qualified approval, release approval, or human validation.

**Scope:** Local repository evidence, deterministic tests/static probes, and official public platform/security documentation. No deployment or remote-state change was made. `/to-spec` was not started.
**Evidence tiers:** Public primary authority; repository observation; proxy/synthetic specialist analysis. The last tier can find contradictions and define conservative rules, but cannot approve a release.

## Strong hypothesis

**Decisive proxy verdict:** **The bounded target is technically coherent; the current runtime is not a fail-closed implementation of it and must not be handed off as release-safe.** A static React client calling one intentionally public Supabase Edge endpoint, which calls a deterministic private PostgreSQL projection pinned to one immutable reviewed release, is a coherent POC topology. PostgreSQL scale is not the blocker.

The current runtime receives a mutable source-row projection, has no catalog release object or lifecycle state, spreads database rows into the response, accepts unknown response fields, uses broad service-role authority, and cannot recognize withdrawal. A deterministic browser probe injected `release_state: "withdrawn"`; the client displayed **five supplier-handoff links** and no withdrawal state. This fails the required unsafe-release handoff gate.

The architecture lane therefore supports only **A — proceed to human validation** from the proxy-gate choices, while catalog implementation/specification and public handoff remain blocked. It does not force **C — rethink** because the failures appear repairable by a release-bound projection and strict API contract rather than inherent to the bounded product direction. It does not support **B — bounded POC despite missing human validation** on the current runtime.

## Evidence

**Actual caller and privilege path — repository observation.**

1. `Home.tsx:120-176,395-425` calls `useCatalogSearch` on text changes and navigates from the hook's mapped `Part` result.
2. `useCatalogSearch.ts:23-73` debounces for 250 ms, aborts an older fetch when a new search starts, and calls `searchCatalog`.
3. `catalogApi.ts:46-112` derives the Edge URL, sends a browser-visible publishable key as a bearer token, parses JSON, rejects a small denylist of commercial field names, and otherwise accepts the result.
4. `supabase/functions/catalog-search/index.ts:85-134` is the internet-facing HTTP boundary. It permits three browser origins, also permits requests with no `Origin`, creates a Supabase client with `SUPABASE_SERVICE_ROLE_KEY`, calls `take_catalog_search_rate_limit`, then `search_catalog_configurations`.
5. `20260809_configuration_catalog_contract.sql:42-123` defines the final current RPC as `SECURITY DEFINER`, revokes it from `public`, `anon`, and `authenticated`, and grants execution to `service_role`. `20260805_catalog.sql:1-24` likewise revokes schema/table access and enables RLS. This is a useful private-table direction.
6. CORS only determines which browser origins may read a response; originless scripts and non-browser clients can call the endpoint. The endpoint must be threat-modeled as public. The browser key is not an authorization boundary for public data.

**The public/private boundary is directionally right but the DTO boundary is not.**

- The service-role secret is read only inside the Edge Function (`index.ts:93-110`). `test-catalog-api.ts:35-41` verified that the browser request contains the test publishable key and not a service-role value. `test-catalog-boundary.ts:99-115` also contains a bundle secret-containment check, although it depends on a built bundle.
- The Edge response is not an allowlist: `index.ts:134` removes only `created_at` and spreads every other RPC field. Adding a private/internal RPC column would publish it without an Edge code change.
- The client is also not a schema validator. `CatalogSearchResult` permits arbitrary strings for family, provenance, and verification (`catalogApi.ts:3-25`), while `assertConfigurationBoundary` rejects only names in `commercialFields` and recursively accepts all other unknown fields (`catalogApi.ts:30-35,66-75`). It does not validate required keys, primitive types, nullability, lifecycle, API version, release identity, or result count before mapping.
- `catalogResultToPart` turns missing pitch/length into `N/A` and other missing facts into `Unknown` (`catalogApi.ts:115-149`). That collapses explicit missing/conflict/not-applicable states and loses the information needed for a deterministic handoff gate.
- Public `provenance_note` is a database/importer-shaped string, while raw source keys, filenames, permissions, evidence URLs, reviewer notes, and review identities need to remain private. A safe public evidence summary must be separately authored and allowlisted.

**Privileged access is broad.**

- Every request uses the project service-role credential (`index.ts:93-127`), so an Edge code-path defect has authority beyond catalog search. The RPC grants are narrow, but the credential itself is not.
- PostgreSQL warns that `SECURITY DEFINER` executes with the owner's privileges and that its `search_path` should exclude schemas writable by untrusted users. The current functions set `search_path = catalog, public`; table references are schema-qualified, but retaining `public` is unnecessary exposure and ownership/default privileges were not proved locally.
- Supabase documents that service/security-definer contexts can bypass RLS. RLS is therefore defense for direct roles, not containment for this Edge credential.

**No catalog release identity or lifecycle exists in the serving path.**

- A search across all Supabase SQL found no `catalog_releases`, `release_id`, active-release pointer, configuration revision, supersession, withdrawal, or immutable-row trigger. The only matching `rollback` was the test transaction in `supabase/tests/catalog_foundation.sql`.
- The current table is mutable. `import-catalog-to-supabase.ts:160-195` performs `INSERT ... ON CONFLICT DO UPDATE` in independent 500-row batches when invoked with `--live`. There is no whole-release transaction, manifest digest, review signature/state, compare step, atomic activation, rollback pointer, or prevention of partial publication.
- Exact lookup uses un-namespaced `reference_number` and `source_sku`, each with `LIMIT 1` and no stable order (`20260809_configuration_catalog_contract.sql:98-108`). A future collision becomes a false unique identity rather than `ambiguous` or `blocked`.
- Search has no stable `ORDER BY`, release predicate, total, cursor, interpretation, or match explanation and uses leading-wildcard `ILIKE` on display strings (`20260809_configuration_catalog_contract.sql:74-119`). The existing lowercase B-tree indexes do not make those leading-wildcard predicates bounded.
- Frontend release truth is separate and sound only for the Pages artifact: `release.json` binds Git SHA and build time (`research/release-truth.md`). Neither `.github/workflows/deploy.yml` nor production monitoring injects/probes catalog endpoint configuration or correlates frontend SHA to a catalog release.

**Correction, supersession, withdrawal, and rollback are absent rather than merely undisplayed.**

- There is no state for a corrected or withdrawn mapping/configuration and no serving rule that can abstain on those states.
- There is no immutable prior release to reactivate. Current “rollback” documentation and smoke concern the static Pages artifact, not catalog data.
- `PartDetail.tsx:310-337` marks every indexed item `origin: "verified"` and `verificationStatus: "verified"`, but writes `verificationRevision: null` and no release ID/configuration digest. It therefore assigns trust without a resolvable revision.
- BOM snapshots preserve visible facts and handoff URLs, but `BomSelectionSnapshot` has no API schema version, catalog release ID, family/configuration key, configuration digest, mapping namespace/state/revision, parser version, or lifecycle status (`bomStorage.ts:9-21`). Existing snapshots cannot be checked against a later correction/withdrawal.
- CSV import is conservative in the actual UI: `useBOM.ts:302-308` calls `validateBomCsvRows(rows)` without current reviewed records, so imported rows do not regain `verified`. The reusable domain function can restore that label only on an exact five-field/current-revision match (`bom.ts:111-187`).

**Failure, cache, timeout, retry, and stale-state behavior.**

- On a completed empty/error response, `useCatalogSearch` sets `results` to `[]` (`useCatalogSearch.ts:52-71`). It does **not** clear old results when entering `loading` (`:36-39`), and `Home.tsx:398-415` renders old results before the loading/error branch.
- A headless deterministic browser probe first returned `VISIBLE-STALE-001`, then delayed a 503 for a replacement query. Output was `staleVisibleDuringReplacementRequest: true` and `staleVisibleAfterFailure: false`. Thus completed failures clear the dropdown, but stale candidates remain selectable while the replacement request is pending.
- Independently, `Home.tsx:446-455` always renders the first 24 bundled rows below the search panel. They remain present after a remote search failure and are not labelled as pre-search examples, reproducing the misleading stale/default-result concern in the structural audit.
- The API emits no `Cache-Control`; the browser does not set `cache: "no-store"`; and no cache key contains catalog release identity. RFC 9111 defines `no-store` as prohibiting storage by private and shared caches. Conservative initial serving should use it until withdrawal behavior is proved.
- The browser accepts an optional `AbortSignal`, but has no elapsed-time deadline. The Edge Function has no body-read deadline, RPC deadline, or database `statement_timeout`. Supabase's official hosted Edge limits list a 150-second request idle timeout; a platform ceiling is not an appropriate POC search deadline. PostgreSQL documents `statement_timeout` as aborting statements exceeding the configured duration.
- There are no search retries, which is safer than hidden retry multiplication for this read path. Static production monitoring uses `curl --retry 2`, but that does not protect or characterize the catalog caller. If retries are later added, only idempotent transient failures should retry, with a tiny budget, jitter, and one end-to-end deadline.

**Rate, cost, request identity, and logging.**

- Edge limits query/filter string length and output count, but calls `request.json()` before checking media type or byte size (`index.ts:97-104`). Filter count is not bounded separately. Chunked oversized bodies are not stopped by a `Content-Length` check because none exists and a streaming cap is absent.
- The limiter allows 60 requests/minute per value read from application-visible `x-forwarded-for` before `cf-connecting-ip`, falling back to one `unknown` bucket (`index.ts:42-45,111-121`). Trust provenance for those headers is not proved. A forged value can evade a limiter; a shared `unknown` value can deny unrelated callers.
- Every keystroke search writes one PostgreSQL limiter row. Expired rows are reset when reused but never deleted (`20260808_catalog_search_rate_limit.sql`). There is no project-wide request/concurrency/spend budget, response-byte ceiling, or circuit breaker. OWASP API4:2023 identifies missing execution, payload, request-rate, and third-party spending limits as unrestricted resource-consumption risk.
- A 429 response has no `Retry-After`, although RFC 9110 defines that field for telling a client how long to wait. A 503 also has no bounded retry guidance.
- There is no server-generated request/interaction ID in request headers, response headers/body, RPC parameters, or logs. Browser-generated IDs alone would be spoofable; a server ID may safely correlate Edge duration/outcome with database telemetry.
- Edge logs currently record database error code/message, not raw query or full IP (`index.ts:117-131`), which is relatively restrained. However, there is no explicit redaction policy or structured success/latency/release telemetry. OWASP's Logging Cheat Sheet recommends recording an interaction identifier and excluding access tokens and other secrets; it also treats IP addresses as data that may require masking or de-identification.
- `PartDetail.tsx:190-209` writes generated product JSON-LD to the browser console. This is public client data, not a credential leak, but it is noisy and establishes a pattern of dumping record-shaped objects. Raw BOMs, raw query text, source filenames/keys, evidence links, full IPs, authorization headers, and service errors must never enter production telemetry.

**Deployment/auth configuration is not reproducible from the repository.**

- `supabase/config.toml` has no function block declaring `verify_jwt`. Ticket 17 resolves the endpoint as intentionally public with JWT verification disabled, but checked-in deployment configuration does not prove that state.
- Supabase's official API-key documentation says Edge JWT verification supports the legacy JWT-based `anon`/`service_role` keys and that publishable/secret keys require the no-verify-JWT deployment path; the platform does not validate an `apikey` header in that mode. Therefore “a publishable key is present” must not be confused with caller authentication.
- `npm:@supabase/supabase-js@2` is a floating major reference (`index.ts:1`), and `deno.json` has no import lock/pin. A release build is not dependency-reproducible at the Edge boundary.

**Automation authority is currently too direct.**

- The importer deterministically hashes family plus source SKU, but maps lossy source fields, labels all records synthetic/demo, and can mutate the serving table merely through the `--live` flag and a database URL (`import-catalog-to-supabase.ts`). No second-person/explicit release approval, candidate digest, policy check, or active-release switch separates transformation from publication.
- Deterministic generation, duplicate/collision grouping, test-case generation, and release-candidate assembly are appropriate automation. Selecting facts, resolving collisions/conflicts, marking review complete, activating a release, withdrawing truth, rolling back, or revalidating BOM lines are authority-bearing actions and are not safe automation defaults.

**Executed deterministic checks — repository/synthetic evidence.**

| Check | Actual result | Meaning |
|---|---|---|
| `npm run test:catalog-api` | Passed | Browser key/service-key separation, current denylist, result cap, API errors, and supplier-label boundaries passed their existing fixtures. It does not prove a strict DTO or lifecycle gate. |
| `test-bom-storage.ts` and `test-bom-domain.ts` | Passed | Current local store validation, frozen-copy behavior, backup rejection, and stale CSV revision downgrade passed. Snapshots still lack release identity. |
| `test-release-truth.ts` and `test-production-monitoring.ts` | Passed | Static frontend artifact identity/monitoring contracts passed; catalog release identity remains untested. |
| `npm run lint` | Passed | TypeScript check passed. Types do not substitute for runtime validation of hostile JSON. |
| Delayed-503 browser probe | Old result visible while next request loaded; absent after 503 | The final failure state clears dropdown results, but replacement-query loading is not fail-closed. |
| Withdrawn-release browser probe | `supplierHandoffLinks: 5`, `explicitWithdrawalStateCount: 0`, verdict `FAIL` | Unknown lifecycle fields pass through client parsing and do not block handoff. |
| Targeted checked-in Playwright run | 6/6 failed against `Not Found` because Playwright reused an already-running dev server whose base was `/`, while tests requested `/partsource/` | This run is not evidence that the six product assertions fail. It is evidence that the local test harness's `reuseExistingServer` can accept the wrong runtime/base and should verify readiness identity, not only port availability. |

**Official primary references consulted.**

- Supabase Edge Functions auth and API keys: <https://supabase.com/docs/guides/functions/auth> and <https://supabase.com/docs/guides/getting-started/api-keys>
- Supabase Edge limits and RLS: <https://supabase.com/docs/guides/functions/limits> and <https://supabase.com/docs/guides/database/postgres/row-level-security>
- Supabase browser CORS and rate-limit example: <https://supabase.com/docs/guides/functions/cors> and <https://supabase.com/docs/guides/functions/examples/rate-limiting>
- PostgreSQL `CREATE FUNCTION` security and timeouts: <https://www.postgresql.org/docs/current/sql-createfunction.html> and <https://www.postgresql.org/docs/current/runtime-config-client.html>
- OWASP API4:2023 and Logging Cheat Sheet: <https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/> and <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>
- HTTP caching and semantics: RFC 9111 <https://www.rfc-editor.org/rfc/rfc9111.html> and RFC 9110 <https://www.rfc-editor.org/rfc/rfc9110.html>

## Fundamental requirement

**Release model.**

- Build append-only release projections: `catalog_releases`, release-stamped `catalog_families`, `catalog_configurations`, and namespace-aware `catalog_identifiers`. Mutable raw/import/review records remain private and are never queried by the public API.
- A release manifest contains immutable release ID, content digest, family-schema version, parser/constraint-ledger version, source-permission snapshot digest, candidate build identity, review decision, timestamps, and lifecycle state. Published rows cannot update/delete in place.
- Activation is one database transaction that validates a fully reviewed manifest and atomically changes one active pointer. A request reads one active release and cannot mix IDs.
- Correction creates a new configuration revision and new release. Supersession links old to new without rewriting old rows. Withdrawal creates a new active release excluding/blocking the affected configuration or mapping; a known withdrawn identifier returns an explicit withdrawn outcome and no candidates/handoff.
- Rollback means atomically activating a previously reviewed immutable manifest only after checking it against the current withdrawal deny state. Record a new activation event; do not erase history or pretend the old release was never superseded.
- No active/reviewed release, digest mismatch, mixed release, unknown lifecycle value, or failed deny check returns **503/unavailable with zero results and zero supplier handoff**.

**Strict public API.**

Use one versioned endpoint such as `POST /catalog-search/v1`. Reject unknown request keys and non-JSON/oversized bodies before full parsing. Bound query bytes/code points, token count, filter count, filter value length, page size, cursor length, output rows, output bytes, and total deadline.

The response must be constructed field-by-field and runtime-validated. A minimum allowlist is:

- envelope: `api_schema_version`, server `request_id`, `outcome`, `catalog_release_id`, `catalog_release_digest`, `parser_version`, `results`, `next_cursor`;
- interpretation: supplied query plus deterministic recognized family/constraints, unresolved terms, conflicts, and unsupported terms—never an inferred engineering requirement;
- result identity: public `family_key`, `configuration_key`, `configuration_revision`, `configuration_digest`;
- exact lookup: `identifier_namespace`, normalized/public identifier value, `mapping_revision`, and `mapping_state` (`unique`, `ambiguous`, `blocked`, `withdrawn`, `unknown`);
- facts: only reviewed public family fields with typed normalized value/unit and supplied display notation, plus explicit `known`, `missing`, `not_applicable`, `conflict`, or `outside_release` state;
- trust/gates: bounded public evidence summary, `selection_state`, `handoff_state`, and machine-readable reasons;
- supplier destinations: generated only when `handoff_state = allowed`; never a listing, offer, equivalence, stock, price, or availability claim.

Private source URLs where publication is not permitted, source keys/SKUs not approved as public, filenames, raw rows, permissions analysis, reviewer identity/notes, conflict discussion, internal confidence, ingestion state, and database timestamps are excluded by construction. Snapshot-test exact response keys and fail on both missing and additional keys.

**Fail-closed handoff rules.**

- Permit handoff only for one active reviewed release, one reviewed configuration revision, no identifier ambiguity/block/withdrawal, no critical missing/conflicting fact, and no unsupported family/application claim.
- `ambiguous`, `blocked`, `withdrawn`, `conflict`, `outside_release`, `unreviewed`, `invalid`, and `unavailable` are terminal abstention states. They return no supplier URL and cannot be transformed into a fallback `Part` that later acquires one.
- Superseded or corrected BOM snapshots remain unchanged and readable, but new handoff is blocked until the user reviews the current revision/delta. Withdrawn snapshots show the withdrawal and remain frozen; they cannot hand off.
- Clear displayed candidates synchronously when query identity changes, show loading separately, and key all state by `(request identity, release ID)`. Never retain earlier-query results under a new query label. Label any permanent bundled examples as examples, not current results.

**Least privilege and hostile-internet controls.**

- Make public/no-JWT behavior explicit in checked-in Supabase function configuration and exercise it after deployment with and without authorization. Do not describe CORS or a publishable key as authentication.
- Replace project-wide service-role use with a dedicated least-privilege database role when feasible. Until then, expose only reviewed RPCs from the Edge code path, schema-qualify every object, remove untrusted schemas from `SECURITY DEFINER search_path`, pin function owner/default privileges, and regression-test `anon`/`authenticated` denial.
- Stream/read the request with a hard byte cap, enforce JSON media type, set a database `statement_timeout` at or below the measured query budget, and enforce a shorter Edge/client end-to-end deadline than platform maxima. Abort downstream work when the caller disconnects where supported.
- Use trusted platform connection metadata for abuse keys; do not trust arbitrary forwarded headers. Combine short per-client limits with global concurrency/request/response-byte/database-cost budgets and a circuit breaker. Expire limiter records. Return `Retry-After` on 429 and planned/transient 503.
- Generate a server request ID; accept a caller correlation ID only as untrusted metadata. Return the server ID and log duration, outcome, row count, release ID, limiter decision, and coarse error class. Redact/hash network identity under a documented retention policy. Never log raw query/BOM/source text, full IP, credentials, authorization headers, private evidence, or database error detail.
- Pin the exact Edge dependency/lock and deploy the exact tested function artifact/configuration. Correlate frontend Git SHA and catalog release ID in UI, smoke, monitoring, and incident records.

**Automation authority.**

Automation may normalize under versioned deterministic rules, compute digests, propose aliases/collisions, build a candidate, and run regression suites. It may not approve evidence, infer missing mechanical facts, resolve collisions, mark review complete, activate/withdraw/rollback a public release, restore `verified` to imported BOM data, or generate a handoff after a failed gate. Authority-changing operations require explicit named human action and append-only audit evidence; this proxy review is not that approval.

**Release tests required before any public catalog handoff.**

- collision fixtures return `ambiguous`/`blocked`, never `LIMIT 1`;
- unknown/extra DTO fields and wrong primitive/nullability fail closed at Edge and client;
- every response row and cursor has exactly one active release ID/digest;
- mixed, draft, failed, superseded-without-review, withdrawn, and no-active-release fixtures return no handoff;
- correction creates a new revision/release and preserves the old snapshot byte-for-byte;
- rollback cannot revive an emergency-withdrawn mapping;
- query change clears old candidates before loading; timeout, abort, invalid JSON, 429, and 503 leave zero candidate/handoff state;
- direct `anon`/`authenticated` table/RPC access fails; service secret/private fields are absent from response, bundle, and sanitized logs;
- deployment smoke shows frontend SHA plus catalog release, validates public auth mode, exact lookup, ambiguity/withdrawal/unavailable, and zero private fields.

## Opportunity / gold idea

Use one deterministic **constraint-and-release ledger** to drive parsing, search filters, result explanation, handoff eligibility, regression fixtures, and BOM snapshot status. If the browser does not independently reconstruct trust from a broad `Part`, the same machine-readable reasons can prove why a result was selected or blocked, and correction/withdrawal behavior becomes testable rather than copy-dependent.

A small release manifest plus configuration digest also creates a useful support primitive: a user can report `frontend SHA + catalog release + request ID + configuration digest` without sending their raw BOM or query. That improves reproducibility and privacy simultaneously.

## Nice-to-have

- Immutable release-keyed GET/detail caching with purge/deny strategy after `no-store` correction and withdrawal tests pass.
- Self-excluding facet counts, materialized counts, read replicas, or an external search service only after measured PostgreSQL/index limits.
- Privacy-preserving aggregate abuse metrics, sampled traces, and synthetic canaries after the minimum safe telemetry exists.
- Signed release manifests or transparency-log export if multiple publishers or external auditors later require stronger provenance. This is not needed to prove the bounded POC topology.

## Open question

- Which exact family schemas and critical handoff fields receive qualified review? Architecture can enforce a gate but cannot decide mechanical completeness.
- What source fields and evidence summaries are legally permitted in the public DTO? The source register, not the API code, must answer this.
- Which Supabase connection metadata is guaranteed trusted in the deployed Edge environment, and what least-privilege role pattern is supportable there?
- What controlled warm/cold latency, concurrency, and spend bounds hold for the reviewed release? Current tests provide no production-like load evidence.
- Should supersession alone block handoff, or only correction/withdrawal/material delta? The conservative proxy rule blocks until reviewed, but qualified product/mechanical governance must decide.
- What named role may approve, withdraw, and reactivate a release, and what independent review is required? No current repository authority model answers this.
- The local targeted Playwright run reused a wrong-base server. The harness needs a readiness identity check; the six affected assertions should then be rerun in a clean controlled server context.

## Risk

- Service-role compromise or an unreviewed Edge code path can reach broadly privileged project operations.
- Mutable batch upserts can expose partial or mixed catalog state and destroy reproducible correction history.
- A denylist masquerading as a DTO allowlist permits future private fields and unknown lifecycle values to pass silently.
- Current `verified` labels launder “indexed” into trust while revision is null; a saved BOM can freeze this overclaim indefinitely.
- Exact `LIMIT 1` and un-namespaced identifiers can convert future collisions into false unique identity.
- Unbounded body parsing, leading-wildcard queries, per-keystroke database writes, spoofable/shared limiter keys, and no global budget allow denial-of-wallet and denial-of-service.
- Missing deadlines can leave users in loading state far beyond a safe interactive budget; stale prior results remain visible during replacement requests.
- Missing request/release identity makes incidents, correction notices, and user reports difficult to reproduce without collecting overly broad logs.
- Static frontend rollback can falsely look complete while catalog state remains incompatible or withdrawn.
- A permissive importer `--live` flag allows transformation automation to become publication authority without an immutable review boundary.

## Rejected

- Treating the current runtime, passing unit tests, or proxy agreement as production readiness, security certification, qualified approval, release approval, or human validation.
- Direct browser table/RPC access or any service-role credential in the browser.
- CORS, a publishable key, or presence of an `Authorization` header as the security boundary for intentionally public data.
- Row-spread DTOs, unknown-field tolerance, commercial-field denylists as publication controls, and public exposure of private lineage.
- Mutable in-place publication, partial batch upsert as a release, silent correction, deletion as withdrawal, or frontend-only rollback.
- `LIMIT 1` collision resolution, fuzzy technical identifiers/dimensions/standards, hard-constraint relaxation, stale-result fallback, and generated missing facts.
- Automatic release approval, collision resolution, equivalence, verification restoration, withdrawal reversal, or supplier handoff by an LLM/importer/CI job.
- Caching before release-keying and emergency withdrawal semantics are deterministic and tested.
- `/to-spec` or production edits from this proxy lane. The next evidence step remains human validation plus qualified review of the bounded release corpus and gates.
