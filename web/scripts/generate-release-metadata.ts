import fs from 'node:fs';
import path from 'node:path';

const sha = process.env.RELEASE_SHA ?? '';
const builtAt = process.env.RELEASE_BUILT_AT ?? new Date().toISOString();
const output = process.env.RELEASE_OUTPUT ?? path.resolve(import.meta.dirname, '../dist/release.json');

if (!/^[0-9a-fA-F]{40}$/.test(sha)) {
  throw new Error('RELEASE_SHA must be a full 40-character hexadecimal Git SHA.');
}

if (Number.isNaN(Date.parse(builtAt)) || new Date(builtAt).toISOString() !== builtAt) {
  throw new Error('RELEASE_BUILT_AT must be an ISO 8601 UTC timestamp.');
}

fs.mkdirSync(path.dirname(output), {recursive: true});
fs.writeFileSync(output, `${JSON.stringify({sha, builtAt}, null, 2)}\n`, 'utf8');
console.log(`Wrote release metadata for ${sha} to ${output}`);
