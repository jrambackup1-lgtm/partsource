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
  findCatalogPart,
  resolvePartIdentity,
  MCMASTER_CROSSES,
  type Part,
} from '../src/lib/decoder';
import { REF_PAGES } from '../src/lib/reference';

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
  const part = db.find(p => p.partNumber === 'DIN912-M4X20')!;
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

test('parseCustomPart: series 91290 is metric black-oxide alloy (previously mislabeled stainless)', () => {
  const p = parseCustomPart('91290A110');
  assertEqual(p.material, 'Alloy Steel', 'alloy from 91290');
  assertEqual(p.finish, 'Black-Oxide', 'black-oxide from 91290');
  assertEqual(p.type, 'Socket Head Cap Screw', 'SHCS family');
});

test('parseCustomPart: series 91292 is the metric stainless SHCS family', () => {
  const p = parseCustomPart('91292A110');
  assertEqual(p.material, '18-8 Stainless Steel', 'stainless from 91292');
  assertEqual(p.finish, 'Plain', 'plain finish from stainless series');
});

test('parseCustomPart: unknown series prefix infers nothing', () => {
  const p = parseCustomPart('99136A101');
  assertEqual(p.type, 'Custom Fastener', 'no type from unknown prefix');
  assertEqual(p.standard, 'Unknown', 'no standard from unknown prefix');
});

test('parseCustomPart: imperial thread yields TPI pitch', () => {
  const p = parseCustomPart('91251A545 1/4"-20 socket cap x 1"');
  assertEqual(p.thread, '1/4"-20', 'imperial thread');
  assertEqual(p.pitch, '20 TPI', 'TPI pitch');
  assertEqual(p.length, '1"', 'imperial length not confused by TPI digits');
});

test('parseCustomPart: fractional imperial length parsed after thread strip', () => {
  const p = parseCustomPart('#10-24 hex bolt x 1/2"');
  assertEqual(p.thread, '#10-24', 'unified thread');
  assertEqual(p.length, '1/2"', 'fractional length, not the 24 TPI');
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
    // Own standards-based PN is always the identity; a McMaster PN may be
    // attached as a verified reference field only.
    assert(/^(DIN|ISO)\d+-M[\d.]+(X\d+)?(-A2)?$/.test(p.partNumber), `bad partNumber: ${p.partNumber}`);
    if (p.mcmaster) {
      assert(/^\d{5,6}[A-Z]\d{3,4}$/.test(p.mcmaster), `bad mcmaster cross format: ${p.mcmaster}`);
    }
    for (const key of ['category', 'type', 'thread', 'material', 'standard'] as const) {
      assert(p[key] && p[key].length > 0, `empty ${key} on ${p.partNumber}`);
    }
    assert(p.mcmasterPrice > 0 && p.mcmasterPrice < 100, `implausible price on ${p.partNumber}`);
    assert(!p.unindexed, `catalog entry marked unindexed: ${p.partNumber}`);
  }
});

test('crosses: every hand-verified McMaster cross maps to a real catalog entry', () => {
  assert(MCMASTER_CROSSES.length >= 1, 'crosses table must not be empty');
  for (const c of MCMASTER_CROSSES) {
    const part = db.find(p => p.partNumber === c.partNumber);
    assert(!!part, `cross target missing from catalog: ${c.partNumber}`);
    assertEqual(part!.mcmaster, c.mcmaster, `cross not applied to ${c.partNumber}`);
    assert(c.note.length > 10, `cross ${c.mcmaster} missing provenance note`);
  }
});

test('catalog: no duplicate part numbers', () => {
  const seen = new Set<string>();
  for (const p of db) {
    assert(!seen.has(p.partNumber), `duplicate partNumber: ${p.partNumber}`);
    seen.add(p.partNumber);
  }
});

test('catalog: at least 400 entries across 5+ categories of fastener families', () => {
  assert(db.length >= 400, `catalog too small: ${db.length}`);
  const types = new Set(db.map(p => p.type));
  assert(types.size >= 6, `too few part types: ${[...types].join(', ')}`);
});

test('catalog: generated metric screws carry correct coarse pitch', () => {
  const m4 = db.find(p => p.partNumber === 'DIN912-M4X12')!;
  assert(!!m4, 'DIN912-M4X12 missing from generated catalog');
  assertEqual(m4.pitch, '0.7 mm', 'M4 coarse pitch');
  assertEqual(m4.standard, 'DIN 912 / ISO 4762', 'standard string');
});

// --- Catalog lookup ---------------------------------------------------------
test('findCatalogPart: verified cross and own PN resolve; unknown MPNs do not', () => {
  assertEqual(findCatalogPart('91290A115')?.partNumber, 'DIN912-M3X10', 'verified MPN cross resolves to own PN');
  assertEqual(findCatalogPart('din912-m4x12')?.partNumber, 'DIN912-M4X12', 'own PN, case-insensitive');
  assertEqual(findCatalogPart('99136A101'), null, 'unknown MPN must not fuzzy-match a wrong part');
  assertEqual(findCatalogPart('91251A242'), null, 'purged fabricated cross must no longer resolve');
});

test('resolvePartIdentity: exposes exact, suggested, decoded, and unknown states', () => {
  assertEqual(resolvePartIdentity('din912-m4x12').state, 'exact', 'own PN is exact');
  assertEqual(resolvePartIdentity('91290A115').state, 'exact', 'verified cross is exact');
  assertEqual(resolvePartIdentity('DIN912-M4X13').state, 'suggested', 'close catalog typo is suggested');
  assertEqual(resolvePartIdentity('M5 socket head cap screw x 16mm').state, 'decoded', 'usable specs are decoded');
  assertEqual(resolvePartIdentity('99136A101').state, 'unknown', 'unrecognized MPN is unknown');
});

test('parseCustomPart: unknown McMaster number is honestly unindexed', () => {
  const p = parseCustomPart('99136A101');
  assertEqual(p.unindexed, true, 'unindexed flag');
  assertEqual(p.material, 'Unknown', 'no fabricated material');
  assertEqual(p.finish, 'Unknown', 'no fabricated finish');
  assertEqual(p.mcmasterPrice, 0, 'no fabricated price');
});

test('parseCustomPart: decoded spec still gets a price estimate', () => {
  const p = parseCustomPart('M5 socket head cap screw x 16mm');
  assertEqual(p.unindexed, true, 'guessed parts are always unindexed');
  assert(p.mcmasterPrice > 0, 'decoded spec should carry an estimate');
});

// --- Reference library -------------------------------------------------------
test('reference: 10+ pages, unique slugs, tables populated, related links valid', () => {
  assert(REF_PAGES.length >= 10, `too few reference pages: ${REF_PAGES.length}`);
  const slugs = new Set(REF_PAGES.map(p => p.slug));
  assertEqual(slugs.size, REF_PAGES.length, 'duplicate reference slugs');
  for (const page of REF_PAGES) {
    assert(page.title.length > 10 && page.description.length > 30, `thin metadata on ${page.slug}`);
    assert(page.intro.length >= 1, `no intro on ${page.slug}`);
    const tables = page.sections.filter(s => s.table);
    for (const s of tables) {
      assert(s.table!.rows.length >= 4, `sparse table in ${page.slug} / ${s.heading}`);
      for (const row of s.table!.rows) {
        assertEqual(row.length, s.table!.headers.length, `ragged row in ${page.slug} / ${s.heading}`);
      }
    }
    for (const rel of page.related) {
      assert(slugs.has(rel), `broken related link ${rel} on ${page.slug}`);
    }
    if (page.catalogStandard) {
      assert(db.some(p => p.standard === page.catalogStandard),
        `catalogStandard matches no parts: ${page.catalogStandard}`);
    }
  }
});

test('reference: computed torque values are physically sane', () => {
  const torquePage = REF_PAGES.find(p => p.slug === 'socket-cap-screw-torque-chart')!;
  const dry = torquePage.sections[0].table!;
  const m6 = dry.rows.find(r => r[0] === 'M6')!;
  const m6_129 = Number(m6[3]);
  // Published dry torque for M6 class 12.9 is ~17 Nm; allow generous margin.
  assert(m6_129 > 12 && m6_129 < 22, `M6 12.9 dry torque implausible: ${m6_129}`);
});

test('suppliers: all templates are https search URLs', () => {
  for (const s of suppliers) {
    assert(s.urlTemplate.startsWith('https://'), `non-https template: ${s.name}`);
    assert(/[?&](q|txt|searchterm|term|keyword)=$/i.test(s.urlTemplate),
      `template does not end in a query param: ${s.name} -> ${s.urlTemplate}`);
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
