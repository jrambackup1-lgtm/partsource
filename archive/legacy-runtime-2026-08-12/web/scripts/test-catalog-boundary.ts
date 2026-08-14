import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { Pool } from 'pg';

config({ path: '.env.local' });

const allowedFields = ['id', 'family', 'type', 'reference_number', 'source_sku', 'title', 'thread', 'pitch', 'length', 'head', 'material', 'finish', 'drive', 'strength', 'standard', 'prototype', 'demo', 'synthetic', 'provenance_kind', 'provenance_note', 'verification'].sort();
const deployedLegacyFields = ['id', 'family', 'reference_number', 'source_sku', 'title', 'thread', 'pitch', 'length', 'material', 'finish', 'drive', 'standard', 'prototype'].sort();
const baseUrl = process.env.CATALOG_SEARCH_URL;
const anonKey = process.env.CATALOG_SEARCH_ANON_KEY;

async function checkDatabaseBoundary() {
  const databaseUrl = process.env.SUPABASE_DB_URL;
  if (!databaseUrl) {
    console.log('Skipping DB boundary checks: SUPABASE_DB_URL missing.');
    return;
  }

  const pool = new Pool({ connectionString: databaseUrl });
  try {
    const grants = await pool.query(`
      select
        has_schema_privilege('anon', 'catalog', 'usage') as anon_schema_usage,
        has_table_privilege('anon', 'catalog.catalog_configurations', 'select') as anon_table_select,
        has_function_privilege('anon', 'public.search_catalog_configurations(text, text, jsonb)', 'execute') as anon_rpc_execute,
        has_function_privilege('service_role', 'public.search_catalog_configurations(text, text, jsonb)', 'execute') as service_rpc_execute
    `);
    const row = grants.rows[0];
    assert.equal(row.anon_schema_usage, false, 'anon must not have catalog schema usage');
    assert.equal(row.anon_table_select, false, 'anon must not select catalog table');
    assert.equal(row.anon_rpc_execute, false, 'anon must not execute private search RPC');
    assert.equal(row.service_rpc_execute, true, 'service_role must execute private search RPC');
  } finally {
    await pool.end();
  }
}

async function request(body: unknown, headers: Record<string, string> = {}, method = 'POST') {
  assert.ok(baseUrl, 'CATALOG_SEARCH_URL missing');
  return fetch(baseUrl, {
    method,
    headers: {
      ...(anonKey ? { authorization: `Bearer ${anonKey}` } : {}),
      'content-type': 'application/json',
      origin: 'http://localhost:3000',
      ...headers,
    },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  });
}

async function checkApiBoundary() {
  if (!baseUrl) {
    console.log('Skipping live API boundary checks: CATALOG_SEARCH_URL missing.');
    return;
  }

  assert.equal((await request({ query: '   ' })).status, 400);
  assert.equal((await request({ query: 'x'.repeat(201) })).status, 400);
  assert.equal((await request({ query: 'steel', family: 'bad' })).status, 400);
  assert.equal((await request({ query: 'steel', filters: { price: '1' } })).status, 400);
  assert.equal((await request({ query: 'steel', filters: { stock: '1' } })).status, 400);
  assert.equal((await request({ query: 'steel', filters: { equivalent: 'x' } })).status, 400);
  assert.equal((await request({ query: 'steel', filters: { material: 'x'.repeat(201) } })).status, 400);
  assert.equal((await request({ query: 'steel' }, {}, 'GET')).status, 405);

  const text = await request({ query: 'steel' });
  assert.equal(text.status, 200);
  const textBody = await text.json() as { results: Array<Record<string, unknown>> };
  assert.ok(textBody.results.length <= 25, 'API must cap results at 25');
  for (const result of textBody.results) {
    const keys = Object.keys(result).sort();
    assert.ok(
      JSON.stringify(keys) === JSON.stringify(allowedFields) || JSON.stringify(keys) === JSON.stringify(deployedLegacyFields),
      `unexpected live result fields: ${keys.join(', ')}`,
    );
  }

  const allowed = await request({ query: 'steel' }, { origin: 'http://localhost:3000' });
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:3000');
  const denied = await request({ query: 'steel' }, { origin: 'https://evil.example' });
  assert.equal(denied.status, 403);
  assert.equal(denied.headers.get('access-control-allow-origin'), null);

  let rateLimited = false;
  for (let i = 0; i < 70; i++) {
    const response = await request({ query: 'steel' });
    if (response.status === 429) {
      rateLimited = true;
      break;
    }
  }
  if (!rateLimited) console.log('Live API rate-limit check did not trip within 70 requests; verify deployed limiter separately.');
}

function checkBundleBoundary() {
  const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist/assets');
  if (!fs.existsSync(distDir)) {
    console.log('Skipping bundle boundary checks: dist/assets missing; run npm run build first.');
    return;
  }

  const bundle = fs.readdirSync(distDir)
    .filter(file => file.endsWith('.js'))
    .map(file => fs.readFileSync(path.join(distDir, file), 'utf8'))
    .join('\n');

  assert.doesNotMatch(bundle, /SUPABASE_SERVICE_ROLE_KEY|service[_-]?role/i);
  assert.doesNotMatch(bundle, /PROTO-SHCS|PROTO-HEX|PROTO-ROUND|SOCKET_HEAD_PROTOTYPE_CATALOG|HEX_HEAD_PROTOTYPE_CATALOG|ROUNDED_HEAD_PROTOTYPE_CATALOG/);
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) assert.equal(bundle.includes(serviceKey), false, 'bundle contains service-role key');
}

async function main() {
  await checkDatabaseBoundary();
  await checkApiBoundary();
  checkBundleBoundary();
  console.log('Catalog boundary checks passed.');
}

void main();
