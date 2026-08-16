import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {TextDecoder} from 'node:util';
import {fileURLToPath} from 'node:url';

export const APPROVED_SOURCE_ID = 'confidential-cofounder-local-csv-v1';
export const GENERATED_TEST_SOURCE_ID = 'generated-boundary-test-fixture-v1';
export const AUDIT_MODE = 'local-metadata-dry-run';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const APPROVED_CSV_ROOT = path.join(REPO_ROOT, 'archive', 'legacy-runtime-2026-08-12', 'data');

const SOURCE_POLICIES = new Map([
  [APPROVED_SOURCE_ID, {
    allowedInput: 'provided-local-csv-only',
    allowedOutput: 'aggregate-metadata-only',
    publicationPermitted: false,
    allowedFamilies: new Map([
      ['hex-head-screws', 'hex-head-screws.csv'],
      ['rounded-head-screws', 'rounded-head-screws.csv'],
      ['socket-head-cap-screws', 'socket-head-cap-screws.csv'],
    ]),
  }],
  [GENERATED_TEST_SOURCE_ID, {
    allowedInput: 'generated-temporary-test-fixtures-only',
    allowedOutput: 'aggregate-metadata-only',
    publicationPermitted: false,
    testFixturesOnly: true,
  }],
]);

const DANGEROUS_HEADER_RULES = [
  ['supplier', /(^|_)(supplier|vendor|distributor|seller|manufacturer|brand)(_|$)/],
  ['price', /(^|_)(price|cost|currency|msrp)(_|$)/],
  ['stock', /(^|_)(stock|inventory|availability|available|lead_time|leadtime|moq|minimum_order|pack_quantity|pack_qty)(_|$)/],
  ['equivalence', /(^|_)(equivalent|equivalence|cross_reference|crossreference|alternate|alternative|replacement|interchangeable|substitute)(_|$)/],
  ['offer_or_order', /(^|_)(offer|quote|order|checkout|purchase)(_|$)/],
  ['approval_or_suitability', /(^|_)(approved|approval|verified|suitability|fitment|recommended)(_|$)/],
  ['confidential_origin_or_asset', /(^|_)(source_url|origin|source_owner|upstream_source|download|listing_url|product_url|url|image|image_url)(_|$)/],
];

const DIMENSION_HEADER = /(^|_)(diameter|diam|length|width|height|depth|thickness|pitch|radius|angle|dimension|size|thread|tpi|distance|offset|across_flats|across_corners|head_height|drive_size)(_|$)/;
const IDENTIFIER_HEADER = /(^|_)(part_number|part_no|catalog_number|catalog_no|identifier|item_number|item_no|sku|model_number|model_no|record_id|title)(_|$)/;
const UNIT_HEADER_RULES = [
  ['mm', /(^|_)(mm|millimeter|millimeters)(_|$)/],
  ['cm', /(^|_)(cm|centimeter|centimeters)(_|$)/],
  ['m', /(^|_)(meter|meters)(_|$)/],
  ['in', /(^|_)(in|inch|inches)(_|$)/],
  ['deg', /(^|_)(deg|degree|degrees)(_|$)/],
  ['tpi', /(^|_)(tpi|threads_per_inch)(_|$)/],
  ['n', /(^|_)(n|newton|newtons)(_|$)/],
  ['kn', /(^|_)(kn|kilonewton|kilonewtons)(_|$)/],
  ['nm', /(^|_)(nm|newton_meter|newton_meters)(_|$)/],
  ['mpa', /(^|_)(mpa|megapascal|megapascals)(_|$)/],
  ['psi', /(^|_)(psi)(_|$)/],
];
const UNIT_VALUE_RULES = [
  ['mm', /(?:^|[^a-z])(?:mm|millimet(?:er|re)s?)(?:$|[^a-z])/i],
  ['cm', /(?:^|[^a-z])(?:cm|centimet(?:er|re)s?)(?:$|[^a-z])/i],
  ['in', /(?:^|[^a-z])(?:in(?:ch(?:es)?)?|\")(?=$|[^a-z])/i],
  ['deg', /(?:°|(?:^|[^a-z])deg(?:ree)?s?(?:$|[^a-z]))/i],
  ['tpi', /(?:^|[^a-z])tpi(?:$|[^a-z])/i],
  ['kn', /(?:^|[^a-z])kn(?:$|[^a-z])/i],
  ['n', /(?:^|[^a-z])n(?:$|[^a-z])/i],
  ['nm', /(?:^|[^a-z])n[· .-]?m(?:$|[^a-z])/i],
  ['mpa', /(?:^|[^a-z])mpa(?:$|[^a-z])/i],
  ['psi', /(?:^|[^a-z])psi(?:$|[^a-z])/i],
];

export class AuditBoundaryError extends Error {
  constructor(message, exitCode = 64) {
    super(message);
    this.name = 'AuditBoundaryError';
    this.exitCode = exitCode;
  }
}

function normalizeHeader(value) {
  return value
    .normalize('NFKC')
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function isMissing(value) {
  const normalized = value.trim();
  return normalized === '' || normalized === '-';
}

function percentageBasisPoints(part, whole) {
  return whole === 0 ? 0 : Math.round((part / whole) * 10_000);
}

function parseCsv(text, fileName) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  let justClosedQuote = false;
  let line = 1;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
          justClosedQuote = true;
        }
      } else {
        if (character === '\n') line += 1;
        field += character;
      }
      continue;
    }

    if (justClosedQuote) {
      if (character === ',') {
        row.push(field);
        field = '';
        justClosedQuote = false;
        continue;
      }
      if (character === '\r' && text[index + 1] === '\n') {
        index += 1;
        line += 1;
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        justClosedQuote = false;
        continue;
      }
      if (character === '\n' || character === '\r') {
        line += 1;
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        justClosedQuote = false;
        continue;
      }
      throw new AuditBoundaryError(`Malformed CSV in ${fileName}: unexpected character after a closing quote near line ${line}.`, 2);
    }

    if (character === '"') {
      if (field !== '') throw new AuditBoundaryError(`Malformed CSV in ${fileName}: quote inside an unquoted field near line ${line}.`, 2);
      quoted = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\r' && text[index + 1] === '\n') {
      index += 1;
      line += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (character === '\n' || character === '\r') {
      line += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (quoted) throw new AuditBoundaryError(`Malformed CSV in ${fileName}: unterminated quoted field.`, 2);
  if (justClosedQuote || field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  while (rows.length > 0 && rows.at(-1).length === 1 && rows.at(-1)[0] === '') rows.pop();
  return rows;
}

function readCsv(filePath) {
  const fileName = path.basename(filePath);
  if (path.extname(fileName).toLowerCase() !== '.csv') {
    throw new AuditBoundaryError(`Refusing non-CSV input: ${fileName}.`);
  }
  let bytes;
  try {
    bytes = fs.readFileSync(filePath);
  } catch {
    throw new AuditBoundaryError(`Unable to read local CSV input: ${fileName}.`);
  }
  let text;
  try {
    text = new TextDecoder('utf-8', {fatal: true}).decode(bytes);
  } catch {
    throw new AuditBoundaryError(`CSV input is not valid UTF-8: ${fileName}.`, 2);
  }
  return parseCsv(text, fileName);
}

function classifyDangerousHeaders(normalizedHeaders) {
  const counts = new Map(DANGEROUS_HEADER_RULES.map(([category]) => [category, 0]));
  let fieldCount = 0;
  for (const header of normalizedHeaders) {
    let dangerous = false;
    for (const [category, pattern] of DANGEROUS_HEADER_RULES) {
      if (pattern.test(header)) {
        dangerous = true;
        counts.set(category, counts.get(category) + 1);
      }
    }
    if (dangerous) fieldCount += 1;
  }
  return {
    fieldCount,
    categories: [...counts.entries()]
      .filter(([, count]) => count > 0)
      .map(([category, count]) => ({category, count})),
  };
}

function headerUnit(header) {
  return UNIT_HEADER_RULES.find(([, pattern]) => pattern.test(header))?.[0] ?? null;
}

function valueUnits(value) {
  const units = [];
  for (const [unit, pattern] of UNIT_VALUE_RULES) {
    if (pattern.test(value)) units.push(unit);
  }
  return units;
}

function auditFile(familyId, filePath) {
  const fileName = path.basename(filePath);
  const rows = readCsv(filePath);
  if (rows.length === 0) {
    return {
      familyId,
      fileName,
      header: {columnCount: 0, blankCount: 0, normalizedDuplicateCount: 0, dangerousFieldCount: 0, dangerousFieldCategories: []},
      rows: {recordCount: 0, rowWidthMismatchCount: 0, exactDuplicateRowCount: 0},
      missingness: {missingCellCount: 0, completeCellCount: 0, columnsWithMissingCount: 0, columns: []},
      duplicates: {identifierColumnCount: 0, duplicateIdentifierValueCount: 0, blankIdentifierCellCount: 0},
      dimensions: {fieldCount: 0, headerDeclaredUnitFieldCount: 0, populatedCellCount: 0, cellsWithRecognizedUnitCount: 0, cellsWithoutRecognizedUnitCount: 0, mixedUnitFieldCount: 0, recognizedUnits: []},
      checks: [{check: 'non_empty_csv', status: 'fail'}],
    };
  }

  const rawHeaders = rows[0];
  const normalizedHeaders = rawHeaders.map(normalizeHeader);
  const dataRows = rows.slice(1);
  const columnCount = rawHeaders.length;
  const blankCount = normalizedHeaders.filter(header => header === '').length;
  const normalizedDuplicateCount = normalizedHeaders.length - new Set(normalizedHeaders).size;
  const dangerousHeaders = classifyDangerousHeaders(normalizedHeaders);
  const dangerousFieldCategories = dangerousHeaders.categories;
  const dangerousFieldCount = dangerousHeaders.fieldCount;
  const rowWidthMismatchCount = dataRows.filter(row => row.length !== columnCount).length;
  const exactDuplicateRowCount = dataRows.length - new Set(dataRows.map(row => JSON.stringify(row))).size;

  const columns = normalizedHeaders.map((header, columnIndex) => {
    const missingCount = dataRows.reduce((count, row) => count + (isMissing(row[columnIndex] ?? '') ? 1 : 0), 0);
    return {
      columnRef: `column-${String(columnIndex + 1).padStart(3, '0')}`,
      classification: IDENTIFIER_HEADER.test(header) ? 'identifier_candidate' : DIMENSION_HEADER.test(header) ? 'dimension_candidate' : 'other_technical_candidate',
      missingCount,
      missingRateBasisPoints: percentageBasisPoints(missingCount, dataRows.length),
    };
  });
  const missingCellCount = columns.reduce((sum, column) => sum + column.missingCount, 0);
  const totalExpectedCells = dataRows.length * columnCount;

  const identifierIndexes = normalizedHeaders
    .map((header, index) => IDENTIFIER_HEADER.test(header) ? index : -1)
    .filter(index => index >= 0);
  let duplicateIdentifierValueCount = 0;
  let blankIdentifierCellCount = 0;
  for (const index of identifierIndexes) {
    const seen = new Set();
    for (const row of dataRows) {
      const value = row[index] ?? '';
      if (isMissing(value)) {
        blankIdentifierCellCount += 1;
        continue;
      }
      const normalized = value.normalize('NFKC').trim().toLocaleLowerCase('en-US');
      if (seen.has(normalized)) duplicateIdentifierValueCount += 1;
      else seen.add(normalized);
    }
  }

  const dimensionIndexes = normalizedHeaders
    .map((header, index) => DIMENSION_HEADER.test(header) ? index : -1)
    .filter(index => index >= 0);
  const unitCounts = new Map();
  let headerDeclaredUnitFieldCount = 0;
  let populatedDimensionCellCount = 0;
  let cellsWithRecognizedUnitCount = 0;
  let mixedUnitFieldCount = 0;
  for (const index of dimensionIndexes) {
    const declaredUnit = headerUnit(normalizedHeaders[index]);
    if (declaredUnit) headerDeclaredUnitFieldCount += 1;
    const fieldUnits = new Set(declaredUnit ? [declaredUnit] : []);
    for (const row of dataRows) {
      const value = row[index] ?? '';
      if (isMissing(value)) continue;
      populatedDimensionCellCount += 1;
      const units = declaredUnit ? [declaredUnit] : valueUnits(value);
      if (units.length > 0) cellsWithRecognizedUnitCount += 1;
      for (const unit of units) {
        fieldUnits.add(unit);
        unitCounts.set(unit, (unitCounts.get(unit) ?? 0) + 1);
      }
    }
    if (fieldUnits.size > 1) mixedUnitFieldCount += 1;
  }

  const checks = [
    {check: 'non_empty_csv', status: columnCount > 0 && dataRows.length > 0 ? 'pass' : 'fail'},
    {check: 'header_shape', status: blankCount === 0 && normalizedDuplicateCount === 0 ? 'pass' : 'fail'},
    {check: 'commercial_and_dangerous_fields_absent', status: dangerousFieldCount === 0 ? 'pass' : 'fail'},
    {check: 'row_width_consistent', status: rowWidthMismatchCount === 0 ? 'pass' : 'fail'},
    {check: 'exact_rows_unique', status: exactDuplicateRowCount === 0 ? 'pass' : 'fail'},
    {check: 'identifier_candidates_present', status: identifierIndexes.length > 0 ? 'pass' : 'fail'},
    {check: 'identifier_candidates_unique_and_present', status: duplicateIdentifierValueCount === 0 && blankIdentifierCellCount === 0 ? 'pass' : 'fail'},
    {check: 'dimension_candidates_present', status: dimensionIndexes.length > 0 ? 'pass' : 'fail'},
    {
      check: 'dimension_units_observable',
      status: dimensionIndexes.length > 0 && populatedDimensionCellCount > 0 && cellsWithRecognizedUnitCount === populatedDimensionCellCount ? 'pass' : 'review',
    },
  ];

  return {
    familyId,
    fileName,
    header: {columnCount, blankCount, normalizedDuplicateCount, dangerousFieldCount, dangerousFieldCategories},
    rows: {recordCount: dataRows.length, rowWidthMismatchCount, exactDuplicateRowCount},
    missingness: {
      missingCellCount,
      completeCellCount: Math.max(0, totalExpectedCells - missingCellCount),
      columnsWithMissingCount: columns.filter(column => column.missingCount > 0).length,
      columns,
    },
    duplicates: {identifierColumnCount: identifierIndexes.length, duplicateIdentifierValueCount, blankIdentifierCellCount},
    dimensions: {
      fieldCount: dimensionIndexes.length,
      headerDeclaredUnitFieldCount,
      populatedCellCount: populatedDimensionCellCount,
      cellsWithRecognizedUnitCount,
      cellsWithoutRecognizedUnitCount: populatedDimensionCellCount - cellsWithRecognizedUnitCount,
      mixedUnitFieldCount,
      recognizedUnits: [...unitCounts.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([unit, count]) => ({unit, count})),
    },
    checks,
  };
}

function validateAttestation(attestationPath, sourceId) {
  if (!attestationPath) throw new AuditBoundaryError('Refusing audit: a review attestation is required before any CSV is read.');
  let raw;
  let value;
  try {
    raw = fs.readFileSync(attestationPath);
    value = JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(raw));
  } catch {
    throw new AuditBoundaryError('Refusing audit: review attestation must be readable UTF-8 JSON.');
  }
  const acknowledgements = value?.acknowledgements;
  const valid = value?.schemaVersion === 1
    && value?.sourceId === sourceId
    && value?.scope === 'local-metadata-audit-only'
    && value?.decision === 'approved-for-local-audit-only'
    && typeof value?.reviewer === 'string' && value.reviewer.trim().length > 0
    && typeof value?.reviewedAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.reviewedAt)
    && acknowledgements?.nonPublishing === true
    && acknowledgements?.aggregateOutputOnly === true
    && acknowledgements?.confidentialOriginMustNotBePublished === true
    && acknowledgements?.mechanicalReviewNotCompleted === true
    && acknowledgements?.publicationApprovalNotGranted === true
    && Object.keys(value).every(key => ['schemaVersion', 'sourceId', 'scope', 'decision', 'reviewer', 'reviewedAt', 'acknowledgements'].includes(key))
    && Object.keys(acknowledgements ?? {}).every(key => [
      'nonPublishing',
      'aggregateOutputOnly',
      'confidentialOriginMustNotBePublished',
      'mechanicalReviewNotCompleted',
      'publicationApprovalNotGranted',
    ].includes(key));
  if (!valid) throw new AuditBoundaryError('Refusing audit: review attestation is missing required local-only boundary acknowledgements.');
  return {
    present: true,
    scope: value.scope,
    decision: value.decision,
    digest: `sha256:${crypto.createHash('sha256').update(raw).digest('hex')}`,
  };
}

function assertTempOutput(outputPath) {
  if (!outputPath) throw new AuditBoundaryError('Refusing audit: --output is required and must be inside the operating-system temporary directory.');
  const resolved = path.resolve(outputPath);
  const temporaryRoot = path.resolve(os.tmpdir());
  const relative = path.relative(temporaryRoot, resolved);
  if (relative === '' || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new AuditBoundaryError('Refusing audit: aggregate output must be inside the operating-system temporary directory.');
  }
  if (path.extname(resolved).toLowerCase() !== '.json') {
    throw new AuditBoundaryError('Refusing audit: aggregate output must use a .json filename.');
  }
  return resolved;
}

function isBelow(root, candidate) {
  const relative = path.relative(path.resolve(root), path.resolve(candidate));
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function validateSourceInputs(sourceId, sourcePolicy, families) {
  if (sourceId === APPROVED_SOURCE_ID) {
    for (const entry of families) {
      const expectedFileName = sourcePolicy.allowedFamilies.get(entry.familyId);
      const resolvedInput = path.resolve(entry.filePath);
      if (!expectedFileName
        || path.basename(resolvedInput) !== expectedFileName
        || path.dirname(resolvedInput).toLocaleLowerCase('en-US') !== APPROVED_CSV_ROOT.toLocaleLowerCase('en-US')) {
        throw new AuditBoundaryError('Refusing audit: approved confidential source ID is restricted to its registered local CSV family files.');
      }
    }
    return;
  }
  if (sourcePolicy.testFixturesOnly) {
    for (const entry of families) {
      if (!isBelow(os.tmpdir(), entry.filePath)) {
        throw new AuditBoundaryError('Refusing audit: generated test fixtures must remain inside the operating-system temporary directory.');
      }
    }
  }
}

export function runAudit({sourceId, attestationPath, outputPath, families, expectedFamilies, publicationRequested = false}) {
  if (publicationRequested) throw new AuditBoundaryError('Publication is not implemented or permitted. This tool only performs a local metadata dry-run.');
  const sourcePolicy = SOURCE_POLICIES.get(sourceId);
  if (!sourcePolicy) throw new AuditBoundaryError('Refusing audit: unapproved source ID.');
  const attestation = validateAttestation(attestationPath, sourceId);
  const resolvedOutput = assertTempOutput(outputPath);
  if (!Array.isArray(families) || families.length === 0) throw new AuditBoundaryError('Refusing audit: at least one --family family-id=local.csv input is required.');
  if (!Array.isArray(expectedFamilies) || expectedFamilies.length === 0) throw new AuditBoundaryError('Refusing audit: at least one --expect-family value is required.');

  const familyIds = families.map(entry => entry.familyId);
  if (new Set(familyIds).size !== familyIds.length) throw new AuditBoundaryError('Refusing audit: family IDs must be unique.');
  if (new Set(expectedFamilies).size !== expectedFamilies.length) throw new AuditBoundaryError('Refusing audit: expected family IDs must be unique.');
  for (const familyId of [...familyIds, ...expectedFamilies]) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(familyId)) throw new AuditBoundaryError('Refusing audit: family IDs must use lowercase kebab-case.');
  }
  validateSourceInputs(sourceId, sourcePolicy, families);

  const expectedSet = new Set(expectedFamilies);
  const observedSet = new Set(familyIds);
  const missingExpectedFamilies = expectedFamilies.filter(familyId => !observedSet.has(familyId));
  const unexpectedFamilies = familyIds.filter(familyId => !expectedSet.has(familyId));
  const auditedFiles = families
    .map(entry => auditFile(entry.familyId, path.resolve(entry.filePath)))
    .sort((left, right) => left.familyId.localeCompare(right.familyId));
  const failedCheckCount = auditedFiles.reduce((sum, file) => sum + file.checks.filter(check => check.status === 'fail').length, 0);
  const reviewCheckCount = auditedFiles.reduce((sum, file) => sum + file.checks.filter(check => check.status === 'review').length, 0);
  const structuralAuditPass = failedCheckCount === 0 && missingExpectedFamilies.length === 0 && unexpectedFamilies.length === 0;

  const report = {
    schemaVersion: 1,
    mode: AUDIT_MODE,
    source: {
      sourceId,
      approvedForLocalAudit: true,
      allowedInput: sourcePolicy.allowedInput,
      allowedOutput: sourcePolicy.allowedOutput,
    },
    attestation,
    publication: {
      attempted: false,
      permitted: false,
      recordsEmitted: 0,
      rawValuesEmitted: 0,
      rawHeadersEmitted: 0,
      confidentialOriginEmitted: false,
    },
    familyCoverage: {
      expectedFamilyCount: expectedFamilies.length,
      observedFamilyCount: familyIds.length,
      missingExpectedFamilies,
      unexpectedFamilies,
      complete: missingExpectedFamilies.length === 0 && unexpectedFamilies.length === 0,
    },
    summary: {
      fileCount: auditedFiles.length,
      recordCount: auditedFiles.reduce((sum, file) => sum + file.rows.recordCount, 0),
      columnCountAcrossFiles: auditedFiles.reduce((sum, file) => sum + file.header.columnCount, 0),
      missingCellCount: auditedFiles.reduce((sum, file) => sum + file.missingness.missingCellCount, 0),
      exactDuplicateRowCount: auditedFiles.reduce((sum, file) => sum + file.rows.exactDuplicateRowCount, 0),
      duplicateIdentifierValueCount: auditedFiles.reduce((sum, file) => sum + file.duplicates.duplicateIdentifierValueCount, 0),
      dangerousFieldCount: auditedFiles.reduce((sum, file) => sum + file.header.dangerousFieldCount, 0),
      dimensionFieldCount: auditedFiles.reduce((sum, file) => sum + file.dimensions.fieldCount, 0),
      failedCheckCount,
      reviewCheckCount,
    },
    files: auditedFiles,
    decision: {
      structuralAuditPass,
      promotionEligible: false,
      publicationAuthorized: false,
      blockers: [
        'record-level mechanical sampling is not completed',
        'qualified family/domain review is not completed',
        'identifier namespace and collision review is not completed',
        'field transformation and unit normalization review is not completed',
        'publication approval for an exact release digest is not granted',
      ],
    },
  };

  fs.mkdirSync(path.dirname(resolvedOutput), {recursive: true});
  const temporaryOutput = `${resolvedOutput}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryOutput, `${JSON.stringify(report, null, 2)}\n`, {encoding: 'utf8', flag: 'wx'});
  fs.renameSync(temporaryOutput, resolvedOutput);
  return {report, outputPath: resolvedOutput, exitCode: structuralAuditPass ? 0 : 2};
}
