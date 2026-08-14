create or replace function public.search_catalog_configurations(
  p_query text,
  p_family text default null,
  p_filters jsonb default '{}'::jsonb
)
returns table (
  id uuid,
  family text,
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
  prototype boolean
)
language sql
security definer
set search_path = catalog, public
as $$
  with filtered as (
    select
      c.id, c.family, c.reference_number, c.source_sku, c.title, c.thread,
      c.pitch, c.length, c.material, c.finish, c.drive, c.standard, c.prototype
    from catalog.catalog_configurations c
    where (p_family is null or c.family = p_family)
      and (nullif(p_filters ->> 'thread', '') is null or c.thread ilike '%' || (p_filters ->> 'thread') || '%')
      and (nullif(p_filters ->> 'pitch', '') is null or c.pitch ilike '%' || (p_filters ->> 'pitch') || '%')
      and (nullif(p_filters ->> 'length', '') is null or c.length ilike '%' || (p_filters ->> 'length') || '%')
      and (nullif(p_filters ->> 'material', '') is null or c.material ilike '%' || (p_filters ->> 'material') || '%')
      and (nullif(p_filters ->> 'finish', '') is null or c.finish ilike '%' || (p_filters ->> 'finish') || '%')
      and (nullif(p_filters ->> 'drive', '') is null or c.drive ilike '%' || (p_filters ->> 'drive') || '%')
      and (nullif(p_filters ->> 'standard', '') is null or c.standard ilike '%' || (p_filters ->> 'standard') || '%')
  ), exact_reference as (
    select * from filtered where lower(reference_number) = lower(p_query) limit 1
  ), exact_source_sku as (
    select * from filtered where lower(source_sku) = lower(p_query) limit 1
  )
  select * from exact_reference
  union all
  select * from exact_source_sku where not exists (select 1 from exact_reference)
  union all
  select * from filtered
  where not exists (select 1 from exact_reference)
    and not exists (select 1 from exact_source_sku)
    and title ilike '%' || p_query || '%'
  limit 25;
$$;

revoke all on function public.search_catalog_configurations(text, text, jsonb) from public, anon, authenticated;
grant execute on function public.search_catalog_configurations(text, text, jsonb) to service_role;
