import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const repoRoot = path.resolve(import.meta.dirname, '../..');
const read = (file: string) => fs.readFileSync(path.join(repoRoot, file), 'utf8');
const parseWorkflow = (file: string) => {
  const workflow = parse(read(file));
  assert.equal(typeof workflow, 'object', `${file} must parse as YAML`);
  return workflow;
};
const runCommands = (job: any) => job.steps.filter((step: any) => step.run).map((step: any) => step.run.trim());

const ci = parseWorkflow('.github/workflows/ci.yml');
assert.deepEqual(Object.keys(ci.on).sort(), ['pull_request', 'push']);
assert.equal(ci.on.push, null);
assert.equal(ci.on.pull_request, null);
assert.deepEqual(Object.keys(ci.jobs), ['verify']);
assert.equal('if' in ci.jobs.verify, false);
assert.deepEqual(runCommands(ci.jobs.verify).slice(0, 7), [
  'npm ci',
  'npm run lint',
  'npm test',
  'npx tsx scripts/test-production-monitoring.ts\nnpx tsx scripts/test-release-truth.ts',
  'npm run build',
  'npx playwright install --with-deps chromium',
  'npm run test:browser',
]);

const deploy = parseWorkflow('.github/workflows/deploy.yml');
assert.deepEqual(Object.keys(deploy.on).sort(), ['push', 'workflow_dispatch']);
assert.deepEqual(deploy.on.push.branches, ['master']);
assert.equal(deploy.on.workflow_dispatch, null);
assert.deepEqual(Object.keys(deploy.jobs), ['verify', 'deploy', 'smoke']);
assert.equal('needs' in deploy.jobs.verify, false);
assert.equal(deploy.jobs.deploy.needs, 'verify');
assert.equal(deploy.jobs.smoke.needs, 'deploy');
assert.equal(deploy.jobs.smoke.uses, './.github/workflows/production-monitoring.yml');
assert.equal('if' in deploy.jobs.deploy, false);
assert.equal('if' in deploy.jobs.smoke, false);
assert.equal(deploy.jobs.verify.if, "github.ref == 'refs/heads/master'");
assert.deepEqual(runCommands(deploy.jobs.verify).slice(0, 8), [
  'npm ci',
  'npm run lint',
  'npm test',
  'npx tsx scripts/test-production-monitoring.ts\nnpx tsx scripts/test-release-truth.ts',
  'npm run build',
  'npx playwright install --with-deps chromium',
  'npm run test:browser',
  'npx tsx scripts/generate-release-metadata.ts',
]);
const pagesArtifact = deploy.jobs.verify.steps.find((step: any) => step.uses === 'actions/upload-pages-artifact@v3');
assert.deepEqual(pagesArtifact.with, {
  name: 'pages-${{ github.sha }}',
  path: 'web/dist',
  'retention-days': 1,
});
const deployPages = deploy.jobs.deploy.steps.find((step: any) => step.uses === 'actions/deploy-pages@v4');
assert.equal(deployPages.with.artifact_name, 'pages-${{ github.sha }}');

const monitoring = parseWorkflow('.github/workflows/production-monitoring.yml');
assert.deepEqual(Object.keys(monitoring.on).sort(), ['schedule', 'workflow_call', 'workflow_dispatch']);
assert.deepEqual(monitoring.on.schedule, [{ cron: '17,47 * * * *' }]);
assert.deepEqual(monitoring.on.workflow_call.inputs.expected_sha, {
  description: 'Full commit SHA expected after a deployment',
  required: false,
  type: 'string',
  default: '',
});
assert.equal(monitoring.on.workflow_dispatch, null);
assert.deepEqual(Object.keys(monitoring.jobs), ['check-production-routes', 'check-rendered-production']);
assert.equal('if' in monitoring.jobs['check-production-routes'], false);
assert.equal('if' in monitoring.jobs['check-rendered-production'], false);
assert.equal(monitoring.jobs['check-production-routes'].env.RELEASE_CHECK_NONCE, '${{ github.run_id }}-${{ github.run_attempt }}');
const curlProbe = monitoring.jobs['check-production-routes'].steps.find((step: any) => step.run).run;
assert.match(curlProbe, /release\.json\?check=\$\{RELEASE_CHECK_NONCE\}/);
assert.match(curlProbe, /--header "Cache-Control: no-cache, no-store, max-age=0, must-revalidate"/);
assert.match(curlProbe, /--header "Pragma: no-cache"/);
const expectedTuples = [
  'https://jrambackup1-lgtm.github.io/partsource/|200|PartSource.io',
  'https://jrambackup1-lgtm.github.io/partsource/parts/DIN912-M3X10|200|DIN912-M3X10',
  'https://jrambackup1-lgtm.github.io/partsource/?tab=bom|200|PartSource.io',
  'https://jrambackup1-lgtm.github.io/partsource/reference|200|Engineering Reference',
  'https://jrambackup1-lgtm.github.io/partsource/sitemap.xml|200|<urlset',
  'https://jrambackup1-lgtm.github.io/partsource/robots.txt|200|User-agent: *',
  'https://jrambackup1-lgtm.github.io/partsource/definitely-not-a-real-route|404|PartSource.io',
];
for (const tuple of expectedTuples) assert.match(curlProbe, new RegExp(tuple.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
const rendered = monitoring.jobs['check-rendered-production'];
assert.equal(rendered.needs, 'check-production-routes');
assert.equal(rendered.env.PRODUCTION_BASE_URL, 'https://jrambackup1-lgtm.github.io/partsource/');
assert.deepEqual(rendered.steps.map((step: any) => step.uses ?? step.run), [
  'actions/checkout@v4',
  'actions/setup-node@v4',
  'npm ci',
  'npx playwright install --with-deps chromium',
  'npx playwright test tests/browser/production-smoke.spec.ts',
]);
assert.deepEqual(rendered.steps.slice(2).map((step: any) => step['working-directory']), ['web', 'web', 'web']);

const rehearsal = read('.github/scripts/rehearse-rollback.ps1');
const runbook = read('research/production-runbook.md');
assert.match(rehearsal, /UTF8/);
assert.match(rehearsal, /PASS: candidate revision/);
assert.match(runbook, /candidate revision/i);
assert.match(runbook, /production-proven SHA/i);
assert.match(runbook, /Owner:/);
assert.match(runbook, /Evidence:/);
assert.match(runbook, /Do not claim.*rehears/i);

const readme = read('README.md');
assert.match(readme, /actions\/workflows\/ci\.yml\/badge\.svg/);
assert.match(readme, /actions\/workflows\/production-monitoring\.yml\/badge\.svg/);

console.log('Production workflow contract checks passed.');
