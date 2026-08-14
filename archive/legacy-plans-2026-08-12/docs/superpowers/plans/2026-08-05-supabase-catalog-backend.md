# Supabase Catalog Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` task-by-task.

**Goal:** Keep the complete hardware catalog in Supabase Postgres and return only bounded search results to the React app.

**Architecture:** The Vite client calls one Supabase Edge Function, `catalog-search`. The function queries private Postgres tables with a server-only key and returns a maximum of 25 configuration records. The client no longer imports generated CSV artifacts.

**Tech Stack:** Vite/React/TypeScript, Supabase Postgres, Supabase Edge Functions, Supabase CLI, SQL migrations.

## Global Constraints

- Do not delete source CSV files or prototype artifacts.
- Never put a Supabase service-role key in browser code, Git, or `.env.example`.
- Initial public API returns configurations only: no price, inventory, supplier listing, offer, equivalent, or approved-alternate fields.
- Return at most 25 rows per request; reject empty queries; rate-limit the endpoint.
- All new secrets are supplied interactively by Jay; do not create/deploy a Supabase project without approval.

---

### Phase 1: Backend foundation

**Files:** create `supabase/config.toml`, `supabase/migrations/20260805_catalog.sql`, `web/.env.example`.

1. Create the Supabase project manually in Jay's account; save URL and anon key only in local `web/.env.local`.
2. Add a migration with `catalog_configurations` fields: `id uuid`, `family text`, `reference_number text`, `source_sku text`, `title text`, `thread text`, `pitch text`, `length text`, `material text`, `finish text`, `drive text`, `standard text`, `prototype boolean`, `created_at timestamptz`.
3. Put the table in a private schema; revoke browser-table access. Add indexes on `reference_number`, `source_sku`, `family`, and lower-cased title/thread/material.
4. Verify with SQL: anonymous role cannot `select`; service role can insert/query.

### Phase 2: Deterministic import

**Files:** create `web/scripts/import-catalog-to-supabase.ts`, `web/scripts/test-catalog-import.ts`.

1. Write a failing test asserting 27,009 parsed source rows produce unique IDs and no commercial fields.
2. Implement a dry-run importer that reads the three CSV files, normalizes empty and `-` values to null, assigns family, and upserts only the listed configuration fields.
3. Run dry-run test; then run an explicitly confirmed import against the development Supabase project.
4. Verify table counts: socket 7,864; hex 8,850; rounded 10,295; total 27,009.

### Phase 3: Search API

**Files:** create `supabase/functions/catalog-search/index.ts`, `supabase/functions/catalog-search/deno.json`, `web/scripts/test-catalog-search.ts`.

1. Write failing integration tests: blank query returns 400; exact reference returns one row; text search returns no more than 25 configuration rows; response contains no commercial fields.
2. Implement `POST /functions/v1/catalog-search` accepting `{ query, family?, filters? }`.
3. Query only the private table with parameterized SQL/RPC; exact `reference_number`/`source_sku` wins, otherwise bounded text/filter search.
4. Add per-IP rate limiting and CORS restricted to local development plus the production domain.
5. Verify tests against local Supabase, then deployed development function.

### Phase 4: React migration

**Files:** modify `web/src/lib/decoder.ts`, `web/src/pages/Home.tsx`, `web/src/pages/PartDetail.tsx`; create `web/src/lib/catalogApi.ts`, `web/scripts/test-catalog-api.ts`.

1. Write a failing API-client test asserting debounce, max 25 results, and network-error state.
2. Implement `searchCatalog(query, filters)` calling the Edge Function.
3. Replace prototype CSV imports/Fuse use with API results; retain existing standards-only local decoder as offline fallback.
4. Render API results as `Configuration — verify before sourcing`; direct unknown routes remain unindexed.
5. Verify browser search, keyboard selection, empty/error states, and no prototype catalog literal in built assets.

### Phase 5: Security and release audit

**Files:** create `web/scripts/test-catalog-boundary.ts`; modify release docs only after evidence exists.

1. Test anonymous database reads are denied; service key is absent from built assets; API rejects blank/oversized input and enforces 25-row limit.
2. Test rate limiting and allowed-origin CORS.
3. Run `npm run lint`, `npm test`, `npm run build`, browser suite, and a bundle scan for `PROTO-`/catalog row literals.
4. Record actual Supabase project, migration, function deployment, and verification evidence in the production-readiness packet before any public launch claim.

## Phased decision points

- After Phase 1: Jay confirms the development project and secrets are configured.
- After Phase 2: Jay confirms imported counts and sample records.
- After Phase 3: Jay confirms anonymous search access/rate limits are acceptable.
- After Phase 5: independent review before production release.
