# Supabase Catalog Backend - Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a private Supabase Postgres foundation that holds configuration-only catalog records and denies browser database access.

**Architecture:** A new `catalog` schema holds one configuration table. Explicit privilege revocations and RLS prevent the anonymous browser role from reading it. A future Edge Function, outside this phase, is the only intended client-facing access path.

**Tech Stack:** Supabase SQL migrations, Supabase CLI, TypeScript, `tsx`, Node strict assertions.

## Global Constraints

- Do not deploy, import source rows, add an Edge Function, or change React code in Phase 1.
- Do not delete source CSVs or prototype artifacts.
- Do not commit a secret key, database password, project URL, or project key.
- `web/.env.local` may contain only local development URL and publishable-key values and must remain ignored.
- Table fields are configuration-only: no supplier, offer, price, inventory, availability, or equivalence fields.
- Browser roles `anon`, `authenticated`, and `public` receive no privileges on the catalog schema or table.

---

## File structure

- `supabase/config.toml` — Supabase project configuration without credentials.
- `supabase/migrations/20260805_catalog.sql` — private schema, configuration table, indexes, RLS, and explicit privilege denials.
- `web/.env.example` — environment variable names only.
- `web/scripts/test-supabase-catalog-foundation.ts` — static migration-boundary test, run locally without credentials.
- `web/package.json` — a focused script that runs the foundation test.

### Task 1: Add the private catalog migration

**Files:**

- Create: `supabase/config.toml`
- Create: `supabase/migrations/20260805_catalog.sql`
- Create: `web/scripts/test-supabase-catalog-foundation.ts`
- Modify: `web/package.json`

**Interfaces:**

- Produces: `catalog.catalog_configurations` with `id uuid`, `family text`, `reference_number text`, `source_sku text`, `title text`, `thread text`, `pitch text`, `length text`, `material text`, `finish text`, `drive text`, `standard text`, `prototype boolean`, and `created_at timestamptz`.
- Produces: `npm run test:supabase-catalog-foundation`, which exits non-zero if the migration loses its privacy or product-boundary clauses.

- [ ] **Step 1: Write the failing migration-boundary test**

Create `web/scripts/test-supabase-catalog-foundation.ts` with assertions for the required private schema, table, fields, RLS, privilege revocations, indexes, and forbidden commercial field names:

```ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migration = readFileSync('../supabase/migrations/20260805_catalog.sql', 'utf8');

assert.match(migration, /create schema if not exists catalog/i);
assert.match(migration, /create table catalog\.catalog_configurations/i);
assert.match(migration, /alter table catalog\.catalog_configurations enable row level security/i);
assert.match(migration, /revoke all on schema catalog from public, anon, authenticated/i);
assert.match(migration, /revoke all on table catalog\.catalog_configurations from public, anon, authenticated/i);
for (const field of ['id uuid', 'family text', 'reference_number text', 'source_sku text', 'title text', 'thread text', 'pitch text', 'length text', 'material text', 'finish text', 'drive text', 'standard text', 'prototype boolean', 'created_at timestamptz']) {
  assert.match(migration, new RegExp(`\\b${field}\\b`, 'i'));
}
for (const name of ['price', 'inventory', 'availability', 'supplier', 'offer', 'equivalent']) {
  assert.doesNotMatch(migration, new RegExp(`\\b${name}\\b`, 'i'));
}
```

Add this script to `web/package.json`:

```json
"test:supabase-catalog-foundation": "tsx scripts/test-supabase-catalog-foundation.ts"
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:supabase-catalog-foundation` from `web/`.

Expected: FAIL because the migration file does not yet exist.

- [ ] **Step 3: Write the minimal migration and project config**

Create `supabase/config.toml` using generated Supabase CLI defaults; do not add a project reference or credentials.

Create the migration with this SQL shape:

```sql
create schema if not exists catalog;
revoke all on schema catalog from public, anon, authenticated;

create table catalog.catalog_configurations (
  id uuid primary key default gen_random_uuid(),
  family text not null,
  reference_number text,
  source_sku text,
  title text,
  thread text,
  pitch text,
  length text,
  material text,
  finish text,
  drive text,
  standard text,
  prototype boolean not null default true,
  created_at timestamptz not null default now()
);

alter table catalog.catalog_configurations enable row level security;
revoke all on table catalog.catalog_configurations from public, anon, authenticated;
create index catalog_configurations_reference_number_idx on catalog.catalog_configurations (reference_number);
create index catalog_configurations_source_sku_idx on catalog.catalog_configurations (source_sku);
create index catalog_configurations_family_idx on catalog.catalog_configurations (family);
create index catalog_configurations_title_lower_idx on catalog.catalog_configurations (lower(title));
create index catalog_configurations_thread_lower_idx on catalog.catalog_configurations (lower(thread));
create index catalog_configurations_material_lower_idx on catalog.catalog_configurations (lower(material));
```

- [ ] **Step 4: Run the foundation test to verify it passes**

Run: `npm run test:supabase-catalog-foundation` from `web/`.

Expected: PASS with a confirmation message.

- [ ] **Step 5: Run static quality checks**

Run: `npm run lint` from `web/`, then `git diff --check` from the repository root.

Expected: both commands exit 0.

- [ ] **Step 6: Commit**

```bash
git add supabase/config.toml supabase/migrations/20260805_catalog.sql web/package.json web/scripts/test-supabase-catalog-foundation.ts
git commit -m "feat: add private catalog foundation"
```

### Task 2: Configure the development project locally and verify database permissions

**Files:**

- Create (untracked): `web/.env.local`
- Modify: `web/.env.example`
- Modify: `web/scripts/test-supabase-catalog-foundation.ts`

**Interfaces:**

- Consumes: Task 1 migration; the Supabase development project URL and publishable key supplied by Jay.
- Produces: a local development configuration and direct SQL evidence that browser roles cannot read catalog data while a privileged server-side session can write and read a temporary record.

- [ ] **Step 1: Write the failing environment-template assertion**

Extend `web/scripts/test-supabase-catalog-foundation.ts` to read `web/.env.example` and assert it contains exactly these blank declarations:

```ts
assert.match(example, /^VITE_SUPABASE_URL=$/m);
assert.match(example, /^VITE_SUPABASE_PUBLISHABLE_KEY=$/m);
assert.doesNotMatch(example, /service[_-]?role|secret[_-]?key|password/i);
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:supabase-catalog-foundation` from `web/`.

Expected: FAIL because `.env.example` is absent or lacks the two variables.

- [ ] **Step 3: Add safe local configuration**

Create `web/.env.example` with only:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Create ignored `web/.env.local` with the approved development project URL and publishable key. Verify it remains ignored with `git check-ignore web/.env.local`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:supabase-catalog-foundation` from `web/`.

Expected: PASS.

- [ ] **Step 5: Apply migration and perform direct permission checks**

Authenticate the Supabase CLI interactively; link only the approved development project; then push the migration. In Supabase SQL Editor, run:

```sql
select has_schema_privilege('anon', 'catalog', 'usage') as anon_schema_usage,
       has_table_privilege('anon', 'catalog.catalog_configurations', 'select') as anon_select,
       has_schema_privilege('authenticated', 'catalog', 'usage') as authenticated_schema_usage,
       has_table_privilege('authenticated', 'catalog.catalog_configurations', 'select') as authenticated_select;

insert into catalog.catalog_configurations (family, reference_number, title)
values ('verification', 'PHASE1-CHECK', 'Temporary verification configuration')
returning id;

select id, family, reference_number, title
from catalog.catalog_configurations
where reference_number = 'PHASE1-CHECK';

delete from catalog.catalog_configurations
where reference_number = 'PHASE1-CHECK';
```

Expected: all four privilege booleans are `false`; the privileged SQL Editor session can insert, read, and delete the temporary row.

- [ ] **Step 6: Run final static verification**

Run: `npm run test:supabase-catalog-foundation && npm run lint` from `web/`, then `git diff --check` from the root.

Expected: all commands exit 0; `git status --short` lists no `.env.local` file.

- [ ] **Step 7: Commit only safe files**

```bash
git add web/.env.example web/scripts/test-supabase-catalog-foundation.ts
git commit -m "chore: document catalog backend environment"
```

## Self-review

- Spec coverage: Task 1 creates the private schema, configuration-only table, indexes, RLS, and explicit denials. Task 2 supplies untracked local configuration and proves anonymous denial plus privileged access.
- Scope: no import, Edge Function, React migration, deployment, or commercial data is included.
- Security: no credential values occur in tracked files; the test rejects secret-like template variables.

