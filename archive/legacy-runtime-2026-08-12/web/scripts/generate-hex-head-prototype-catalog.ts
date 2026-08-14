import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Papa from 'papaparse';

type Row = Record<string, string>;

const here = dirname(fileURLToPath(import.meta.url));
const rows = Papa.parse<Row>(readFileSync(resolve(here, '../../data/hex-head-screws.csv'), 'utf8'), { header: true, skipEmptyLines: true }).data;

function clean(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed && trimmed !== '-' ? trimmed : '';
}

const records = rows.map((row, i) => {
  for (const key of ['sku', 'thread_size', 'length', 'material']) {
    if (!row[key]?.trim()) throw new Error(`Row ${i + 2} missing ${key}`);
  }

  return {
    partNumber: `PROTO-HEX-${row.sku}`,
    ...(clean(row.mcmaster_pn) ? { mcmaster: clean(row.mcmaster_pn) } : {}),
    title: clean(row.title),
    family: 'hex',
    type: 'Hex Head Screw',
    thread: clean(row.thread_size),
    pitch: clean(row.thread_pitch),
    length: clean(row.length),
    head: clean(row.head_type) || 'Hex',
    material: clean(row.material),
    finish: clean(row.finish),
    drive: clean(row.drive_style) || 'External Hex',
    strength: clean(row.fastener_strength_grade_class) || clean(row.tensile_strength) || clean(row.hardness),
    standard: clean(row.specifications_met),
    sourceSku: clean(row.sku),
    isPrototype: true,
    demo: true,
    synthetic: true,
    provenanceKind: 'internal-demo-seed',
    provenanceNote: 'Demo configuration facts imported from reviewed PartSource CSV packet hex-head-screws.csv. McMaster numbers are search clues only.',
    verification: 'demo-only',
  };
});

writeFileSync(resolve(here, '../src/data/hexHeadPrototypeCatalog.ts'), `// Generated. Do not edit.\nexport const HEX_HEAD_PROTOTYPE_CATALOG = ${JSON.stringify(records)} as const;\n`);
