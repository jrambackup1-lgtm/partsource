begin;
select plan(8);

select ok(
  exists (select 1 from pg_namespace where nspname = 'catalog'),
  'catalog schema exists'
);

select ok(
  exists (
    select 1
    from pg_class table_class
    join pg_namespace schema_name on schema_name.oid = table_class.relnamespace
    where schema_name.nspname = 'catalog'
      and table_class.relname = 'catalog_configurations'
      and table_class.relkind = 'r'
  ),
  'catalog configurations table exists'
);

select is(
  (select count(*)::integer from information_schema.columns where table_schema = 'catalog' and table_name = 'catalog_configurations'),
  14,
  'catalog table has only its fourteen configuration columns'
);

select ok(
  exists (
    select 1
    from pg_class table_class
    join pg_namespace schema_name on schema_name.oid = table_class.relnamespace
    where schema_name.nspname = 'catalog'
      and table_class.relname = 'catalog_configurations'
      and table_class.relrowsecurity
  ),
  'catalog table has row-level security enabled'
);

select ok(
  case
    when exists (select 1 from pg_namespace where nspname = 'catalog')
      then not has_schema_privilege('anon', 'catalog', 'usage')
        and not has_schema_privilege('authenticated', 'catalog', 'usage')
    else false
  end,
  'browser roles cannot use the catalog schema'
);

select ok(
  coalesce((
    select not has_table_privilege('anon', table_class.oid, 'select')
      and not has_table_privilege('authenticated', table_class.oid, 'select')
    from pg_class table_class
    join pg_namespace schema_name on schema_name.oid = table_class.relnamespace
    where schema_name.nspname = 'catalog'
      and table_class.relname = 'catalog_configurations'
  ), false),
  'browser roles cannot select catalog records'
);

select is(
  (select count(*)::integer from information_schema.columns where table_schema = 'catalog' and table_name = 'catalog_configurations' and column_name in ('price', 'inventory', 'availability', 'supplier', 'offer', 'equivalent')),
  0,
  'catalog table has no commercial or equivalence fields'
);

select is(
  (select count(*)::integer from pg_indexes where schemaname = 'catalog' and tablename = 'catalog_configurations'),
  7,
  'catalog table has primary-key and six search indexes'
);

select * from finish();
rollback;
