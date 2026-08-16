#!/usr/bin/env node
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {AuditBoundaryError, runAudit} from './audit-core.mjs';

function usage() {
  return [
    'Local, non-publishing catalog metadata audit',
    '',
    'Usage:',
    '  node tools/catalog-pilot/audit.mjs \\',
    '    --source-id confidential-cofounder-local-csv-v1 \\',
    '    --review-attestation <local-attestation.json> \\',
    '    --expect-family <family-id> [--expect-family ...] \\',
    '    --family <family-id>=<local.csv> [--family ...] \\',
    '    --output <OS-temp-directory/report.json>',
    '',
    'There is intentionally no publication, export, import, or record-emission mode.',
  ].join('\n');
}

function takeValue(argumentsList, index, option) {
  const value = argumentsList[index + 1];
  if (!value || value.startsWith('--')) throw new AuditBoundaryError(`Missing value for ${option}.`);
  return value;
}

export function parseArguments(argumentsList) {
  const options = {families: [], expectedFamilies: [], publicationRequested: false};
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === '--help' || argument === '-h') return {help: true};
    if (argument === '--publish' || argument === '--publication' || argument === '--export' || argument === '--import') {
      options.publicationRequested = true;
      continue;
    }
    if (argument === '--source-id') {
      options.sourceId = takeValue(argumentsList, index, argument);
      index += 1;
      continue;
    }
    if (argument === '--review-attestation') {
      options.attestationPath = takeValue(argumentsList, index, argument);
      index += 1;
      continue;
    }
    if (argument === '--output') {
      options.outputPath = takeValue(argumentsList, index, argument);
      index += 1;
      continue;
    }
    if (argument === '--expect-family') {
      options.expectedFamilies.push(takeValue(argumentsList, index, argument));
      index += 1;
      continue;
    }
    if (argument === '--family') {
      const specification = takeValue(argumentsList, index, argument);
      const separator = specification.indexOf('=');
      if (separator <= 0 || separator === specification.length - 1) {
        throw new AuditBoundaryError('--family must use family-id=local.csv syntax.');
      }
      options.families.push({familyId: specification.slice(0, separator), filePath: specification.slice(separator + 1)});
      index += 1;
      continue;
    }
    throw new AuditBoundaryError(`Unknown option: ${argument}.`);
  }
  return options;
}

export function main(argumentsList = process.argv.slice(2)) {
  try {
    const options = parseArguments(argumentsList);
    if (options.help) {
      process.stdout.write(`${usage()}\n`);
      return 0;
    }
    const result = runAudit(options);
    process.stdout.write(`Catalog pilot metadata audit completed: ${result.report.decision.structuralAuditPass ? 'pass' : 'blocked'}.\n`);
    return result.exitCode;
  } catch (error) {
    if (error instanceof AuditBoundaryError) {
      process.stderr.write(`${error.message}\n`);
      return error.exitCode;
    }
    process.stderr.write('Catalog pilot audit failed closed because of an unexpected local processing error.\n');
    return 70;
  }
}

const isEntrypoint = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isEntrypoint) process.exitCode = main();
