import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '../..');
const read = (file: string) => fs.readFileSync(path.join(repoRoot, file), 'utf8');

const workflow = read('.github/workflows/production-monitoring.yml');
const deploy = read('.github/workflows/deploy.yml');
const runbook = read('research/production-runbook.md');
const readme = read('README.md');

const assertInOrder = (source: string, snippets: string[]) => {
  let cursor = -1;
  for (const snippet of snippets) {
    const next = source.indexOf(snippet, cursor + 1);
    assert.notEqual(next, -1, `missing required workflow step: ${snippet}`);
    assert.ok(next > cursor, `workflow step is out of order: ${snippet}`);
    cursor = next;
  }
};

assert.match(workflow, /schedule:/);
assert.match(workflow, /workflow_dispatch:/);
assert.match(workflow, /https:\/\/jrambackup1-lgtm\.github\.io\/partsource\//);
assert.match(workflow, /partsource\/parts\/DIN912-M3X10/);
assert.match(workflow, /partsource\/\?tab=bom/);
assert.match(workflow, /partsource\/reference/);
assert.match(workflow, /partsource\/sitemap\.xml/);
assert.match(workflow, /partsource\/robots\.txt/);
assert.match(workflow, /partsource\/definitely-not-a-real-route/);
assert.match(workflow, /curl[^\n]*--fail/);
assert.match(workflow, /expected_status/);
assert.match(workflow, /expected_content/);
assert.match(workflow, /workflow_call:/);

assert.match(deploy, /branches:\s*\["master"\]/);
assert.match(deploy, /workflow_dispatch:/);
assertInOrder(deploy, [
  'npm ci',
  'npm run lint',
  'npm test',
  'npm run build',
  'npm run test:browser',
  'actions/upload-pages-artifact@',
]);
assert.match(deploy, /name:\s*pages-\$\{\{ github\.sha \}\}/);
assert.match(deploy, /needs:\s*verify/);
assert.match(deploy, /artifact_name:\s*pages-\$\{\{ github\.sha \}\}/);
assert.match(deploy, /uses:\s*\.\/\.github\/workflows\/production-monitoring\.yml/);

assert.match(runbook, /Owner:/);
assert.match(runbook, /Evidence:/);
assert.match(runbook, /rehears/i);
assert.match(runbook, /non-production|temporary checkout/i);
assert.match(runbook, /Do not claim.*rehears/i);
assert.match(readme, /actions\/workflows\/ci\.yml\/badge\.svg/);
assert.match(readme, /actions\/workflows\/production-monitoring\.yml\/badge\.svg/);

console.log('Production monitoring checks passed.');
