import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import Papa from 'papaparse';
import { Pool } from 'pg';

type SourceRow = Record<string, string>;

type CatalogConfiguration = {
  id: string;
  family: 'socket' | 'hex' | 'rounded';
  type: string;
  reference_number: string | null;
  source_sku: string | null;
  title: string | null;
  thread: string | null;
  pitch: string | null;
  length: string | null;
  head: string | null;
  material: string | null;
  finish: string | null;
  drive: string | null;
  strength: string | null;
  standard: string | null;
  prototype: true;
  demo: true;
  synthetic: true;
  provenance_kind: 'internal-demo-seed';
  provenance_note: string;
  verification: 'demo-only';
};

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const dataDirectory = resolve(currentDirectory, '../../data');
config({ path: resolve(currentDirectory, '../.env.local') });

const sources = [
  { family: 'socket' as const, filename: 'socket-head-cap-screws.csv' },
  { family: 'hex' as const, filename: 'hex-head-screws.csv' },
  { family: 'rounded' as const, filename: 'rounded-head-screws.csv' },
];

function normalize(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed && trimmed !== '-' ? trimmed : null;
}

function deterministicId(family: CatalogConfiguration['family'], sku: string): string {
  const hash = createHash('sha256').update(`${family}\u0000${sku}`).digest('hex');
  const bytes = Buffer.from(hash.slice(0, 32), 'hex');
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function familyType(family: CatalogConfiguration['family']): string {
  if (family === 'socket') return 'Socket Head Cap Screw';
  if (family === 'hex') return 'Hex Head Screw';
  return 'Rounded Head Screw';
}

function headType(row: SourceRow, family: CatalogConfiguration['family']): string {
  const parts = [normalize(row.socket_head_profile), normalize(row.rounded_head_profile), normalize(row.rounded_head_style), normalize(row.head_type)]
    .filter(Boolean) as string[];
  if (parts.length > 0) return parts.join(' ');
  if (family === 'socket') return 'Socket';
  if (family === 'hex') return 'Hex';
  return 'Rounded';
}

function strength(row: SourceRow): string | null {
  return normalize(row.fastener_strength_grade_class) ?? normalize(row.tensile_strength) ?? normalize(row.hardness);
}

function parseSource(family: CatalogConfiguration['family'], filename: string): CatalogConfiguration[] {
  const parsed = Papa.parse<SourceRow>(readFileSync(resolve(dataDirectory, filename), 'utf8'), {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error(`Unable to parse ${filename}: ${parsed.errors[0].message}`);
  }

  return parsed.data.map((row, index) => {
    const sku = normalize(row.sku);
    if (!sku) {
      throw new Error(`${filename} row ${index + 2} is missing sku`);
    }

    return {
      id: deterministicId(family, sku),
      family,
      type: familyType(family),
      reference_number: normalize(row.mcmaster_pn),
      source_sku: sku,
      title: normalize(row.title),
      thread: normalize(row.thread_size),
      pitch: normalize(row.thread_pitch),
      length: normalize(row.length),
      head: headType(row, family),
      material: normalize(row.material),
      finish: normalize(row.finish),
      drive: normalize(row.drive_style),
      strength: strength(row),
      standard: normalize(row.specifications_met),
      prototype: true,
      demo: true,
      synthetic: true,
      provenance_kind: 'internal-demo-seed',
      provenance_note: `Demo configuration facts imported from reviewed PartSource CSV packet ${filename}. McMaster numbers are search clues only.`,
      verification: 'demo-only',
    };
  });
}

export function buildCatalogImport() {
  const records = sources.flatMap(source => parseSource(source.family, source.filename));
  const counts = {
    socket: records.filter(record => record.family === 'socket').length,
    hex: records.filter(record => record.family === 'hex').length,
    rounded: records.filter(record => record.family === 'rounded').length,
    total: records.length,
  };

  if (new Set(records.map(record => record.id)).size !== records.length) {
    throw new Error('Catalog import generated duplicate IDs');
  }

  return { records, counts };
}

const columns = [
  'id',
  'family',
  'type',
  'reference_number',
  'source_sku',
  'title',
  'thread',
  'pitch',
  'length',
  'head',
  'material',
  'finish',
  'drive',
  'strength',
  'standard',
  'prototype',
  'demo',
  'synthetic',
  'provenance_kind',
  'provenance_note',
  'verification',
] as const;

export function buildUpsertQuery(records: CatalogConfiguration[]) {
  const values = records.flatMap(record => columns.map(column => record[column]));
  const rows = records.map((_, rowIndex) => {
    const offset = rowIndex * columns.length;
    return `(${columns.map((_, columnIndex) => `$${offset + columnIndex + 1}`).join(', ')})`;
  });

  return {
    text: `insert into catalog.catalog_configurations (${columns.join(', ')}) values ${rows.join(', ')} on conflict (id) do update set ${columns.slice(1).map(column => `${column} = excluded.${column}`).join(', ')}`,
    values,
  };
}

async function importToSupabase(records: CatalogConfiguration[]) {
  const databaseUrl = process.env.SUPABASE_DB_URL;
  if (!databaseUrl) {
    throw new Error('SUPABASE_DB_URL is required for --live');
  }

  const pool = new Pool({ connectionString: databaseUrl });
  try {
    for (let start = 0; start < records.length; start += 500) {
      const query = buildUpsertQuery(records.slice(start, start + 500));
      await pool.query(query);
    }
  } finally {
    await pool.end();
  }
}

async function main() {
  const result = buildCatalogImport();
  console.log(JSON.stringify({ mode: process.argv.includes('--live') ? 'live' : 'dry-run', counts: result.counts }));

  if (process.argv.includes('--live')) {
    await importToSupabase(result.records);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void main();
}
