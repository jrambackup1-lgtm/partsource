import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(scriptDirectory, '../..');
const repoRoot = path.resolve(webRoot, '..');
const auditCli = path.join(repoRoot, 'tools', 'catalog-pilot', 'audit.mjs');
const approvedSourceId = 'generated-boundary-test-fixture-v1';
const confidentialSourceId = 'confidential-cofounder-local-csv-v1';

function run(argumentsList: string[]) {
  return spawnSync(process.execPath, [auditCli, ...argumentsList], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: {...process.env},
  });
}

function assertSucceeded(result: ReturnType<typeof run>): void {
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

function attestation(sourceId = approvedSourceId, overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: 1,
    sourceId,
    scope: 'local-metadata-audit-only',
    decision: 'approved-for-local-audit-only',
    reviewer: 'generated-fixture-reviewer',
    reviewedAt: '2026-08-15',
    acknowledgements: {
      nonPublishing: true,
      aggregateOutputOnly: true,
      confidentialOriginMustNotBePublished: true,
      mechanicalReviewNotCompleted: true,
      publicationApprovalNotGranted: true,
    },
    ...overrides,
  };
}

function commonArguments(attestationPath: string, output: string, input: string, familyId = 'safe-family') {
  return [
    '--source-id', approvedSourceId,
    '--review-attestation', attestationPath,
    '--expect-family', familyId,
    '--family', `${familyId}=${input}`,
    '--output', output,
  ];
}

const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'partsource-catalog-pilot-test-'));
try {
  const attestationPath = path.join(temporaryDirectory, 'attestation.json');
  const safeCsv = path.join(temporaryDirectory, 'safe.csv');
  const unsafeCsv = path.join(temporaryDirectory, 'unsafe.csv');
  const malformedCsv = path.join(temporaryDirectory, 'malformed.csv');
  fs.writeFileSync(attestationPath, `${JSON.stringify(attestation(), null, 2)}\n`);
  fs.writeFileSync(
    safeCsv,
    [
      'part_number,nominal_diameter_mm,length_mm,material',
      'PS-SAFE-001,6,20,steel',
      'PS-SAFE-002,8,25,"alloy, steel"',
      '',
    ].join('\n'),
  );
  fs.writeFileSync(
    unsafeCsv,
    [
      'part_number,nominal_diameter_mm,vendor_name,unit_cost,on_hand_stock,replacement_part',
      'PS-UNSAFE-001,6,private-vendor,12.34,10,PS-OTHER-999',
      '',
    ].join('\n'),
  );
  fs.writeFileSync(
    malformedCsv,
    [
      'part_number,part number,length',
      'PS-DUPLICATE-001,PS-DUPLICATE-001,12',
      'PS-DUPLICATE-001,PS-DUPLICATE-001,12',
      '',
    ].join('\n'),
  );

  const firstOutput = path.join(temporaryDirectory, 'safe-report-1.json');
  const secondOutput = path.join(temporaryDirectory, 'safe-report-2.json');
  const firstSafe = run(commonArguments(attestationPath, firstOutput, safeCsv));
  const secondSafe = run(commonArguments(attestationPath, secondOutput, safeCsv));
  assertSucceeded(firstSafe);
  assertSucceeded(secondSafe);
  assert.equal(firstSafe.stdout, 'Catalog pilot metadata audit completed: pass.\n');
  assert.equal(firstSafe.stderr, '');

  const firstReportText = fs.readFileSync(firstOutput, 'utf8');
  const secondReportText = fs.readFileSync(secondOutput, 'utf8');
  assert.equal(firstReportText, secondReportText, 'aggregate audit replay must be deterministic');
  const safeReport = JSON.parse(firstReportText);
  assert.equal(safeReport.mode, 'local-metadata-dry-run');
  assert.equal(safeReport.summary.recordCount, 2);
  assert.equal(safeReport.summary.dangerousFieldCount, 0);
  assert.equal(safeReport.files[0].dimensions.fieldCount, 2);
  assert.equal(safeReport.files[0].dimensions.cellsWithRecognizedUnitCount, 4);
  assert.equal(safeReport.files[0].duplicates.duplicateIdentifierValueCount, 0);
  assert.equal(safeReport.familyCoverage.complete, true);
  assert.equal(safeReport.decision.structuralAuditPass, true);
  assert.equal(safeReport.decision.promotionEligible, false);
  assert.equal(safeReport.decision.publicationAuthorized, false);
  assert.deepEqual(safeReport.publication, {
    attempted: false,
    permitted: false,
    recordsEmitted: 0,
    rawValuesEmitted: 0,
    rawHeadersEmitted: 0,
    confidentialOriginEmitted: false,
  });
  for (const forbiddenRawText of [
    'part_number',
    'nominal_diameter_mm',
    'length_mm',
    'PS-SAFE-001',
    'alloy, steel',
    safeCsv,
  ]) {
    assert.ok(!firstReportText.includes(forbiddenRawText), `raw fixture content/path leaked: ${forbiddenRawText}`);
  }
  assert.equal(safeReport.files[0].fileName, 'safe.csv', 'safe basename is the only input identity retained');

  const unsafeOutput = path.join(temporaryDirectory, 'unsafe-report.json');
  const unsafe = run(commonArguments(attestationPath, unsafeOutput, unsafeCsv));
  assert.equal(unsafe.status, 2, unsafe.stderr || unsafe.stdout);
  assert.equal(unsafe.stdout, 'Catalog pilot metadata audit completed: blocked.\n');
  const unsafeReportText = fs.readFileSync(unsafeOutput, 'utf8');
  const unsafeReport = JSON.parse(unsafeReportText);
  assert.equal(unsafeReport.decision.structuralAuditPass, false);
  assert.equal(unsafeReport.summary.dangerousFieldCount, 4);
  assert.deepEqual(
    unsafeReport.files[0].header.dangerousFieldCategories.map((entry: {category: string}) => entry.category),
    ['supplier', 'price', 'stock', 'equivalence'],
  );
  for (const forbiddenRawText of [
    'vendor_name',
    'unit_cost',
    'on_hand_stock',
    'replacement_part',
    'private-vendor',
    '12.34',
    'PS-OTHER-999',
  ]) {
    assert.ok(!unsafeReportText.includes(forbiddenRawText), `unsafe raw fixture content leaked: ${forbiddenRawText}`);
  }

  const malformedOutput = path.join(temporaryDirectory, 'malformed-report.json');
  const malformed = run(commonArguments(attestationPath, malformedOutput, malformedCsv));
  assert.equal(malformed.status, 2, malformed.stderr || malformed.stdout);
  const malformedReport = JSON.parse(fs.readFileSync(malformedOutput, 'utf8'));
  assert.equal(malformedReport.files[0].header.normalizedDuplicateCount, 1);
  assert.equal(malformedReport.files[0].rows.exactDuplicateRowCount, 1);
  assert.ok(malformedReport.files[0].duplicates.duplicateIdentifierValueCount > 0);

  const noAttestationOutput = path.join(temporaryDirectory, 'must-not-exist-no-attestation.json');
  const noAttestationArguments = commonArguments(attestationPath, noAttestationOutput, safeCsv);
  noAttestationArguments.splice(noAttestationArguments.indexOf('--review-attestation'), 2);
  noAttestationArguments[noAttestationArguments.indexOf('--family') + 1] = `safe-family=${path.join(temporaryDirectory, 'does-not-exist.csv')}`;
  const noAttestation = run(noAttestationArguments);
  assert.notEqual(noAttestation.status, 0);
  assert.match(noAttestation.stderr, /review attestation is required before any CSV is read/);
  assert.equal(fs.existsSync(noAttestationOutput), false);

  const invalidAttestationPath = path.join(temporaryDirectory, 'invalid-attestation.json');
  fs.writeFileSync(invalidAttestationPath, JSON.stringify(attestation(approvedSourceId, {
    acknowledgements: {...attestation().acknowledgements, publicationApprovalNotGranted: false},
  })));
  const invalidAttestationOutput = path.join(temporaryDirectory, 'must-not-exist-invalid-attestation.json');
  const invalidAttestation = run(commonArguments(invalidAttestationPath, invalidAttestationOutput, safeCsv));
  assert.notEqual(invalidAttestation.status, 0);
  assert.match(invalidAttestation.stderr, /missing required local-only boundary acknowledgements/);
  assert.equal(fs.existsSync(invalidAttestationOutput), false);

  const unapprovedOutput = path.join(temporaryDirectory, 'must-not-exist-unapproved.json');
  const unapprovedArguments = commonArguments(attestationPath, unapprovedOutput, safeCsv);
  unapprovedArguments[unapprovedArguments.indexOf(approvedSourceId)] = 'unapproved-source';
  const unapproved = run(unapprovedArguments);
  assert.notEqual(unapproved.status, 0);
  assert.match(unapproved.stderr, /unapproved source ID/);
  assert.equal(fs.existsSync(unapprovedOutput), false);

  const mislabeledConfidentialOutput = path.join(temporaryDirectory, 'must-not-exist-mislabeled-confidential.json');
  const confidentialAttestationPath = path.join(temporaryDirectory, 'confidential-attestation.json');
  fs.writeFileSync(confidentialAttestationPath, JSON.stringify(attestation(confidentialSourceId)));
  const mislabeledArguments = commonArguments(confidentialAttestationPath, mislabeledConfidentialOutput, safeCsv);
  mislabeledArguments[mislabeledArguments.indexOf(approvedSourceId)] = confidentialSourceId;
  const mislabeledConfidential = run(mislabeledArguments);
  assert.notEqual(mislabeledConfidential.status, 0);
  assert.match(mislabeledConfidential.stderr, /restricted to its registered local CSV family files/);
  assert.equal(fs.existsSync(mislabeledConfidentialOutput), false);

  for (const prohibitedOption of ['--publish', '--publication', '--import', '--export']) {
    const prohibitedOutput = path.join(temporaryDirectory, `must-not-exist-${prohibitedOption.slice(2)}.json`);
    const prohibited = run([...commonArguments(attestationPath, prohibitedOutput, safeCsv), prohibitedOption]);
    assert.notEqual(prohibited.status, 0);
    assert.match(prohibited.stderr, /Publication is not implemented or permitted/);
    assert.equal(fs.existsSync(prohibitedOutput), false);
  }

  const outsideTemporaryOutput = path.join(repoRoot, 'catalog-pilot-report-must-not-exist.json');
  const outsideTemporary = run(commonArguments(attestationPath, outsideTemporaryOutput, safeCsv));
  assert.notEqual(outsideTemporary.status, 0);
  assert.match(outsideTemporary.stderr, /must be inside the operating-system temporary directory/);
  assert.equal(fs.existsSync(outsideTemporaryOutput), false);

  const missingFamilyOutput = path.join(temporaryDirectory, 'missing-family-report.json');
  const missingFamily = run([
    ...commonArguments(attestationPath, missingFamilyOutput, safeCsv),
    '--expect-family', 'second-family',
  ]);
  assert.equal(missingFamily.status, 2, missingFamily.stderr || missingFamily.stdout);
  const missingFamilyReport = JSON.parse(fs.readFileSync(missingFamilyOutput, 'utf8'));
  assert.equal(missingFamilyReport.familyCoverage.complete, false);
  assert.deepEqual(missingFamilyReport.familyCoverage.missingExpectedFamilies, ['second-family']);
  assert.equal(missingFamilyReport.decision.promotionEligible, false);
} finally {
  fs.rmSync(temporaryDirectory, {recursive: true, force: true});
}

console.log('catalog pilot boundary tests: ok');
