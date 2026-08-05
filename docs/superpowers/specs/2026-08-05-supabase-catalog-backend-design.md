# Supabase Catalog Backend - Phase 1 Design

## Scope

Create only the backend foundation for the private configuration catalog. Do
not deploy, import source data, add an Edge Function, or change the React app.

## Architecture

The future React client will call a Supabase Edge Function. The function will
be the only public path to catalog search. Configuration data will live in a
new non-public `catalog` schema, outside the Data API's default `public`
schema exposure.

The initial table, `catalog.catalog_configurations`, contains configuration
fields only: identifier, family, reference number, source SKU, descriptive
attributes, prototype flag, and creation timestamp. It contains no supplier,
offer, price, inventory, availability, or equivalence fields.

## Access boundary

The migration will revoke schema and table privileges from `anon`,
`authenticated`, and `public`. No browser-access policy will be created. A
future Edge Function will use server-only Supabase credentials supplied by the
platform; neither a secret key nor database password is placed in browser code
or committed files.

`web/.env.local` will hold the development project URL and publishable key only
and remains untracked. `web/.env.example` documents variable names without
values or secrets.

## Database design

`catalog.catalog_configurations` has a UUID primary key, nullable text
configuration attributes, a non-null family, a non-null prototype flag, and a
creation timestamp. Indexes support future exact lookup by reference number or
source SKU and case-insensitive search by title, thread, material, and family.

## Verification

Phase 1 verification runs the migration against the approved development
project and proves anonymous database reads are denied while a server-side
database session can insert and query a temporary configuration. The temporary
verification row is removed afterwards. No source catalog data is imported in
this phase.

## Success criteria

- The migration creates the private schema, table, indexes, and explicit
  browser-role denials.
- No committed file contains a secret key, database password, or project key.
- Local configuration contains only the development URL and publishable key.
- Database checks prove anonymous reads fail and server-side operations work.
