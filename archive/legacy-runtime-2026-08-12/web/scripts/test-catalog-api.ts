import * as assert from 'node:assert/strict';
import { buildSupplierSearchDestinations, catalogResultToPart, searchCatalog } from '../src/lib/catalogApi';

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

function installEnv() {
  process.env.VITE_CATALOG_SEARCH_URL = 'https://example.test/functions/v1/catalog-search';
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY = 'anon-test-key';
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
}

async function withMockFetch(handler: (input: RequestInfo | URL, init?: RequestInit) => Response | Promise<Response>, run: () => Promise<void>) {
  globalThis.fetch = handler as typeof fetch;
  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function main() {
  installEnv();

  let called = false;
  await withMockFetch(() => {
    called = true;
    return Response.json({ results: [] });
  }, async () => {
    const results = await searchCatalog('   ');
    assert.deepEqual(results, []);
    assert.equal(called, false, 'blank query should not hit network');
  });

  await withMockFetch((input, init) => {
    assert.equal(String(input), 'https://example.test/functions/v1/catalog-search');
    assert.equal(init?.method, 'POST');
    const headers = new Headers(init?.headers);
    assert.equal(headers.get('authorization'), 'Bearer anon-test-key');
    assert.equal(headers.get('authorization')?.includes('service_role'), false);
    assert.equal(init?.body, JSON.stringify({ query: 'steel', filters: {} }));
    return Response.json({
      results: Array.from({ length: 30 }, (_, index) => ({
        id: String(index),
        family: 'hex',
        type: 'Hex Head Screw',
        reference_number: `90002A${String(index).padStart(3, '0')}`,
        source_sku: null,
        title: 'Hex head screw',
        thread: 'M6',
        pitch: '1 mm',
        length: '20 mm',
        head: 'Hex',
        material: 'Steel',
        finish: 'Zinc-Plated',
        drive: 'Hex Outer',
        strength: 'Class 8.8',
        standard: 'ASME B18.2.1',
        prototype: true,
        demo: true,
        synthetic: true,
        provenance_kind: 'internal-demo-seed',
        provenance_note: 'Demo configuration facts imported from reviewed PartSource CSV packet.',
        verification: 'demo-only',
      })),
    });
  }, async () => {
    const results = await searchCatalog('steel');
    assert.equal(results.length, 25, 'client enforces 25 result cap');
  });

  await withMockFetch((_input, init) => {
    assert.equal(init?.body, JSON.stringify({ query: 'M4 screws', filters: { family: 'socket', thread: 'M4', head: 'Socket' } }));
    return Response.json({ results: [] });
  }, async () => {
    await searchCatalog('M4 screws', { family: 'socket', thread: 'M4', head: 'Socket' });
  });

  await withMockFetch(() => Response.json({ results: [{ id: '1', family: 'hex', type: 'Hex Head Screw', reference_number: '90002A101', source_sku: null, title: null, thread: null, pitch: null, length: null, head: null, material: null, finish: null, drive: null, strength: null, standard: null, prototype: true, demo: true, synthetic: true, provenance_kind: 'internal-demo-seed', provenance_note: 'Demo configuration facts imported from reviewed PartSource CSV packet.', verification: 'demo-only', price: 1 }] }), async () => {
    await assert.rejects(() => searchCatalog('90002A101'), /commercial-data boundary/);
  });

  await withMockFetch(() => Response.json({ error: 'query is too long' }, { status: 400 }), async () => {
    await assert.rejects(() => searchCatalog('x'.repeat(201)), /query is too long/);
  });

  await withMockFetch(() => { throw new Error('offline'); }, async () => {
    await assert.rejects(() => searchCatalog('steel'), /offline/);
  });

  const part = catalogResultToPart({
    id: '1',
    family: 'socket',
    type: 'Socket Head Cap Screw',
    reference_number: '93615A110',
    source_sku: '0009FA01257',
    title: 'Low profile socket head screw',
    thread: '4-40',
    pitch: null,
    length: '1/4"',
    head: 'Low Socket',
    material: '18-8 Stainless Steel',
    finish: null,
    drive: 'Hex',
    strength: '70000 psi',
    standard: null,
    prototype: true,
    demo: true,
    synthetic: true,
    provenance_kind: 'internal-demo-seed',
    provenance_note: 'Demo configuration facts imported from reviewed PartSource CSV packet.',
    verification: 'demo-only',
  });
  assert.equal(part.partNumber, '93615A110');
  assert.equal(part.sourceSku, '0009FA01257');
  assert.equal(part.mcmasterPrice, 0);
  assert.equal(part.offers, undefined);
  assert.equal(part.appNote, 'Configuration — verify before sourcing');

  const destinations = buildSupplierSearchDestinations(part);
  assert.ok(destinations.length > 0);
  for (const destination of destinations) {
    assert.equal(destination.state, 'supplier-search-destination');
    assert.equal(destination.requiresVerification, true);
    assert.match(destination.label, /^Search this configuration on /);
    assert.doesNotMatch(destination.label, /equivalent|replacement|buy|quote|stock|available/i);
    assert.equal('price' in destination, false);
  }

  process.env = originalEnv;
  console.log('Catalog API client checks passed.');
}

void main();
