create table if not exists catalog.catalog_search_rate_limits (
  key text primary key,
  count integer not null default 0,
  reset_at timestamptz not null
);

alter table catalog.catalog_search_rate_limits enable row level security;

revoke all on table catalog.catalog_search_rate_limits from public, anon, authenticated;

create or replace function public.take_catalog_search_rate_limit(
  p_key text,
  p_window_seconds integer,
  p_max_requests integer
)
returns boolean
language sql
security definer
set search_path = catalog, public
as $$
  with updated as (
    insert into catalog.catalog_search_rate_limits (key, count, reset_at)
    values (p_key, 1, now() + make_interval(secs => p_window_seconds))
    on conflict (key) do update set
      count = case
        when catalog.catalog_search_rate_limits.reset_at <= now() then 1
        else catalog.catalog_search_rate_limits.count + 1
      end,
      reset_at = case
        when catalog.catalog_search_rate_limits.reset_at <= now()
          then now() + make_interval(secs => p_window_seconds)
        else catalog.catalog_search_rate_limits.reset_at
      end
    returning count
  )
  select count > p_max_requests from updated;
$$;

revoke all on function public.take_catalog_search_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.take_catalog_search_rate_limit(text, integer, integer) to service_role;
