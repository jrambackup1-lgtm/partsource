create schema catalog;

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

create index catalog_configurations_reference_number_idx
  on catalog.catalog_configurations (reference_number);
create index catalog_configurations_source_sku_idx
  on catalog.catalog_configurations (source_sku);
create index catalog_configurations_family_idx
  on catalog.catalog_configurations (family);
create index catalog_configurations_title_lower_idx
  on catalog.catalog_configurations (lower(title));
create index catalog_configurations_thread_lower_idx
  on catalog.catalog_configurations (lower(thread));
create index catalog_configurations_material_lower_idx
  on catalog.catalog_configurations (lower(material));
