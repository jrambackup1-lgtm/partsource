alter table catalog.catalog_configurations
  add column if not exists type text,
  add column if not exists head text,
  add column if not exists strength text,
  add column if not exists demo boolean not null default true,
  add column if not exists synthetic boolean not null default true,
  add column if not exists provenance_kind text not null default 'internal-demo-seed',
  add column if not exists provenance_note text not null default 'Demo configuration facts imported from reviewed PartSource CSV packet. McMaster numbers are search clues only.',
  add column if not exists verification text not null default 'demo-only';

update catalog.catalog_configurations
set
  type = coalesce(type, case family
    when 'socket' then 'Socket Head Cap Screw'
    when 'hex' then 'Hex Head Screw'
    when 'rounded' then 'Rounded Head Screw'
    else 'Catalog Configuration'
  end),
  head = coalesce(head, case family
    when 'socket' then 'Socket'
    when 'hex' then 'Hex'
    when 'rounded' then 'Rounded'
    else null
  end);

alter table catalog.catalog_configurations
  alter column type set not null,
  add constraint catalog_configurations_family_check check (family in ('socket', 'hex', 'rounded')),
  add constraint catalog_configurations_provenance_kind_check check (provenance_kind in ('standards-derived', 'permitted-reference', 'internal-demo-seed', 'user-entered')),
  add constraint catalog_configurations_verification_check check (verification in ('unreviewed', 'reviewed-configuration', 'demo-only')),
  add constraint catalog_configurations_demo_provenance_check check (demo = false or provenance_kind = 'internal-demo-seed');

create index if not exists catalog_configurations_type_lower_idx
  on catalog.catalog_configurations (lower(type));
create index if not exists catalog_configurations_head_lower_idx
  on catalog.catalog_configurations (lower(head));
create index if not exists catalog_configurations_strength_lower_idx
  on catalog.catalog_configurations (lower(strength));

drop function if exists public.search_catalog_configurations(text, text, jsonb);

create or replace function public.search_catalog_configurations(
  p_query text,
  p_family text default null,
  p_filters jsonb default '{}'::jsonb
)
returns table (
  id uuid,
  family text,
  type text,
  reference_number text,
  source_sku text,
  title text,
  thread text,
  pitch text,
  length text,
  head text,
  material text,
  finish text,
  drive text,
  strength text,
  standard text,
  prototype boolean,
  demo boolean,
  synthetic boolean,
  provenance_kind text,
  provenance_note text,
  verification text
)
language sql
security definer
set search_path = catalog, public
as $$
  with normalized as (
    select lower(trim(p_query)) as q
  ), tokens as (
    select token
    from regexp_split_to_table((select q from normalized), '\s+') as token
    where token not in ('screw', 'screws', 'bolt', 'bolts', 'fastener', 'fasteners')
  ), filtered as (
    select
      c.id, c.family, c.type, c.reference_number, c.source_sku, c.title, c.thread,
      c.pitch, c.length, c.head, c.material, c.finish, c.drive, c.strength, c.standard,
      c.prototype, c.demo, c.synthetic, c.provenance_kind, c.provenance_note, c.verification
    from catalog.catalog_configurations c
    where (p_family is null or c.family = p_family)
      and (nullif(p_filters ->> 'family', '') is null or c.family = (p_filters ->> 'family'))
      and (nullif(p_filters ->> 'type', '') is null or c.type ilike '%' || (p_filters ->> 'type') || '%')
      and (nullif(p_filters ->> 'thread', '') is null or c.thread ilike '%' || (p_filters ->> 'thread') || '%')
      and (nullif(p_filters ->> 'pitch', '') is null or c.pitch ilike '%' || (p_filters ->> 'pitch') || '%')
      and (nullif(p_filters ->> 'length', '') is null or c.length ilike '%' || (p_filters ->> 'length') || '%')
      and (nullif(p_filters ->> 'head', '') is null or c.head ilike '%' || (p_filters ->> 'head') || '%')
      and (nullif(p_filters ->> 'material', '') is null or c.material ilike '%' || (p_filters ->> 'material') || '%')
      and (nullif(p_filters ->> 'finish', '') is null or c.finish ilike '%' || (p_filters ->> 'finish') || '%')
      and (nullif(p_filters ->> 'drive', '') is null or c.drive ilike '%' || (p_filters ->> 'drive') || '%')
      and (nullif(p_filters ->> 'strength', '') is null or c.strength ilike '%' || (p_filters ->> 'strength') || '%')
      and (nullif(p_filters ->> 'standard', '') is null or c.standard ilike '%' || (p_filters ->> 'standard') || '%')
  ), exact_reference as (
    select * from filtered where lower(reference_number) = (select q from normalized) limit 1
  ), exact_source_sku as (
    select * from filtered where lower(source_sku) = (select q from normalized) limit 1
  ), searchable as (
    select *, lower(concat_ws(' ', reference_number, source_sku, title, family, type, thread, pitch, length, head, material, finish, drive, strength, standard)) as haystack
    from filtered
  )
  select * from exact_reference
  union all
  select * from exact_source_sku where not exists (select 1 from exact_reference)
  union all
  select id, family, type, reference_number, source_sku, title, thread, pitch, length, head, material, finish, drive, strength, standard, prototype, demo, synthetic, provenance_kind, provenance_note, verification
  from searchable
  where not exists (select 1 from exact_reference)
    and not exists (select 1 from exact_source_sku)
    and (
      haystack ilike '%' || p_query || '%'
      or not exists (select 1 from tokens)
      or not exists (select 1 from tokens where searchable.haystack not like '%' || token || '%')
    )
  limit 25;
$$;

revoke all on function public.search_catalog_configurations(text, text, jsonb) from public, anon, authenticated;
grant execute on function public.search_catalog_configurations(text, text, jsonb) to service_role;
