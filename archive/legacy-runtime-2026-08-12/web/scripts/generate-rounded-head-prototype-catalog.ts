import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Papa from 'papaparse';

type Row = Record<string, string>;

const here = dirname(fileURLToPath(import.meta.url));
const rows = Papa.parse<Row>(readFileSync(resolve(here, '../../data/rounded-head-screws.csv'), 'utf8'), { header: true, skipEmptyLines: true }).data;

function clean(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed && trimmed !== '-' ? trimmed : '';
}

const records = rows.map((row, i) => {
  for (const key of ['sku', 'thread_size', 'length', 'material', 'mcmaster_pn']) {
    if (!row[key]?.trim()) throw new Error(`Row ${i + 2} missing ${key}`);
  }

  const head = [clean(row.rounded_head_profile), clean(row.rounded_head_style), clean(row.head_type)].filter(Boolean).join(' ') || 'Rounded';

  return {
    partNumber: `PROTO-ROUND-${row.mcmaster_pn}`,
    mcmaster: clean(row.mcmaster_pn),
    title: clean(row.title),
    family: 'rounded',
    type: 'Rounded Head Screw',
    thread: clean(row.thread_size),
    pitch: clean(row.thread_pitch),
    length: clean(row.length),
    head,
    material: clean(row.material),
    finish: clean(row.finish),
    drive: clean(row.drive_style),
    strength: clean(row.fastener_strength_grade_class) || clean(row.tensile_strength) || clean(row.hardness),
    standard: clean(row.specifications_met),
    sourceSku: clean(row.sku),
    isPrototype: true,
    demo: true,
    synthetic: true,
    provenanceKind: 'internal-demo-seed',
    provenanceNote: 'Demo configuration facts imported from reviewed PartSource CSV packet rounded-head-screws.csv. McMaster numbers are search clues only.',
    verification: 'demo-only',
  };
});

writeFileSync(resolve(here, '../src/data/roundedHeadPrototypeCatalog.ts'), `// Generated. Do not edit.\nexport const ROUNDED_HEAD_PROTOTYPE_CATALOG = ${JSON.stringify(records)} as const;\n`);
