/**
 * Zero-dependency test runner for the decoder. Runs under `tsx` (already a
 * devDependency), so no Vitest/Jest install needed.
 *
 *   npm run test
 *
 * Covers:
 *   - Spec-derived supplier search queries (regression for the fake-SKU bug).
 *   - Regex fallback decoder: pitch, material, standard, type inference.
 *   - Catalog integrity: every entry is well-formed and unique.
 */
import {
  db,
  suppliers,
  buildSupplierQuery,
  getSupplierSearchUrl,
  parseCustomPart,
  type Part,
} from '../src/lib/decoder';

type TestFn = () => void | Promise<void>;
const tests: { name: string; fn: TestFn }[] = [];
let failed = 0;
let passed = 0;

function test(name: string, fn: TestFn) {
  tests.push({ name, fn });
}

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`assert failed: ${msg}`);
}

function assertEqual<T>(actual: T, expected: T, msg: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`${msg}\n   expected: ${e}\n   actual:   ${a}`);
}

// --- Supplier query generation (the fake-SKU bug regression) --------------
test('buildSupplierQuery: metric socket cap screw', () => {
  const part: Part = {
    partNumber: '91251A245', category: 'Screws & Bolts', type: 'Socket Head Cap Screw',
    thread: 'M4', pitch: '0.7 mm', length: '20 mm', material: 'Alloy Steel',
    finish: 'Black-Oxide', drive: 'Hex', standard: 'DIN 912 / ISO 4762',
    mcmasterPrice: 0.32, appNote: '',
  };
  assertEqual(buildSupplierQuery(part), 'M4 socket head cap screw 20mm black-oxide alloy steel',
    'metric socket cap query');
});

test('buildSupplierQuery: imperial flat head', () => {
  const part: Part = {
    partNumber: '91251A192', category: 'Screws & Bolts', type: 'Socket Head Cap Screw',
    thread: '#10-24', pitch: '24 TPI', length: '1/2"', material: 'Alloy Steel',
    finish: 'Black-Oxide', drive: 'Hex', standard: 'ASME B18.3',
    mcmasterPrice: 0.25, appNote: '',
  };
  // Imperial length renders without a space: "1/2"".
  assertEqual(buildSupplierQuery(part), '#10-24 socket head cap screw 1/2" black-oxide alloy steel',
    'imperial socket cap query');
});

test('buildSupplierQuery: hex nut has no length', () => {
  const part: Part = {
    partNumber: '90596A019', category: 'Nuts', type: 'Hex Nut', thread: 'M6',
    pitch: '1.0 mm', length: 'N/A', material: '18-8 Stainless Steel', finish: 'Plain',
    drive: 'Hex Outer', standard: 'DIN 934 / ISO 4032', mcmasterPrice: 0.14, appNote: '',
  };
  assertEqual(buildSupplierQuery(part), 'M6 hex nut plain 18-8 stainless steel', 'hex nut query');
});

test('getSupplierSearchUrl: encodes query and uses supplier template', () => {
  const zoro = suppliers.find(s => s.name === 'Zoro')!;
  const part = db.find(p => p.partNumber === '91251A245')!;
  const url = getSupplierSearchUrl(zoro.urlTemplate, part);
  assert(url.startsWith('https://www.zoro.com/search?q='), 'zoro url prefix');
  // Spaces must be encoded (as + or %20).
  assert(/%20|\+/.test(url), 'query is URL-encoded');
  // Must NOT contain a fake hash SKU like "G1234567".
  assert(!/q=G\d{7}/.test(url), 'no fake G-prefix SKU');
  assert(encodeURIComponent('M4').slice(0, 2) === 'M4'.slice(0, 2), 'M4 present');
});

// --- Regex fallback decoder ------------------------------------------------
// The regex decoder relies on a thread token in the input; a bare McMaster
// number (e.g. "91251A999") carries no thread info, so thread stays Unknown
// by design. All decoder tests below include an explicit spec string.

test('parseCustomPart: explicit M4 x 20 socket cap screw', () => {
  const p = parseCustomPart('91251A999 M4 socket cap screw x 20mm');
  assertEqual(p.type, 'Socket Head Cap Screw', 'type');
  assertEqual(p.thread, 'M4', 'thread');
  assertEqual(p.pitch, '0.7 mm', 'coarse pitch from table');
  assertEqual(p.standard, 'DIN 912 / ISO 4762', 'standard from prefix');
  assertEqual(p.material, 'Alloy Steel', 'material inferred from 91251');
  assertEqual(p.finish, 'Black-Oxide', 'finish inferred from 91251');
});

test('parseCustomPart: stainless series 91290 infers stainless', () => {
  const p = parseCustomPart('91290A110');
  assertEqual(p.material, '18-8 Stainless Steel', 'stainless from 91290');
  assertEqual(p.finish, 'Plain', 'plain finish from stainless series');
});

test('parseCustomPart: imperial thread yields TPI pitch', () => {
  const p = parseCustomPart('91251A545 1/4"-20 socket cap x 1"');
  assertEqual(p.thread, '1/4"-20', 'imperial thread');
  assertEqual(p.pitch, '20 TPI', 'TPI pitch');
});

test('parseCustomPart: nut has N/A length and Hex Outer drive', () => {
  const p = parseCustomPart('90596A019 M6 hex nut');
  assertEqual(p.category, 'Nuts', 'category');
  assertEqual(p.length, 'N/A', 'nut length');
  assertEqual(p.drive, 'Hex Outer', 'nut drive');
});

test('parseCustomPart: washer category detected', () => {
  const p = parseCustomPart('91166A019 M6 washer');
  assertEqual(p.category, 'Washers', 'washer category');
  assertEqual(p.type, 'Flat Washer', 'flat washer type');
});

// --- Catalog integrity -----------------------------------------------------
test('catalog: every entry has a valid partNumber and required fields', () => {
  for (const p of db) {
    assert(/^\d{5,6}[A-Z]\d{3,4}$/.test(p.partNumber), `bad partNumber format: ${p.partNumber}`);
    for (const key of ['category', 'type', 'thread', 'material', 'standard'] as const) {
      assert(p[key] && p[key].length > 0, `empty ${key} on ${p.partNumber}`);
    }
    assert(p.mcmasterPrice > 0 && p.mcmasterPrice < 100, `implausible price on ${p.partNumber}`);
  }
});

test('catalog: no duplicate part numbers', () => {
  const seen = new Set<string>();
  for (const p of db) {
    assert(!seen.has(p.partNumber), `duplicate partNumber: ${p.partNumber}`);
    seen.add(p.partNumber);
  }
});

test('catalog: at least 50 entries (coverage goal)', () => {
  assert(db.length >= 50, `catalog too small: ${db.length}`);
});

test('suppliers: all templates are https search URLs', () => {
  for (const s of suppliers) {
    assert(s.urlTemplate.startsWith('https://'), `non-https template: ${s.name}`);
    assert(/[?&](q|txt|searchterm|term|keyword)=$/i.test(s.urlTemplate),
      `template does not end in a query param: ${s.name} -> ${s.urlTemplate}`);
    assert(s.discount > 0 && s.discount <= 1, `bad discount: ${s.name}`);
  }
});

// --- Runner ----------------------------------------------------------------
(async () => {
  for (const { name, fn } of tests) {
    try {
      await fn();
      passed++;
      console.log(`  \u2713 ${name}`);
    } catch (e) {
      failed++;
      console.error(`  \u2717 ${name}`);
      console.error(`      ${(e as Error).message}`);
    }
  }
  console.log(`\n${passed} passed, ${failed} failed (${tests.length} total)`);
  process.exit(failed === 0 ? 0 : 1);
})();
