import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {parse} from 'yaml';

const webRoot = path.resolve(import.meta.dirname, '..');
const repoRoot = path.resolve(webRoot, '..');
const read = (file: string) => fs.readFileSync(path.join(repoRoot, file), 'utf8');
const parseWorkflow = (file: string) => parse(read(file));
const tsxCli = path.join(webRoot, 'node_modules/tsx/dist/cli.mjs');
const validSha = '0123456789abcdef0123456789abcdef01234567';
const builtAt = '2026-07-12T10:20:30.000Z';

const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'partsource-release-'));
try {
  const output = path.join(tempDirectory, 'release.json');
  const generated = spawnSync(process.execPath, [tsxCli, 'scripts/generate-release-metadata.ts'], {
    cwd: webRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      RELEASE_SHA: validSha,
      RELEASE_BUILT_AT: builtAt,
      RELEASE_OUTPUT: output,
    },
  });
  assert.equal(generated.status, 0, generated.stderr || generated.stdout);
  assert.deepEqual(JSON.parse(fs.readFileSync(output, 'utf8')), {
    sha: validSha,
    builtAt,
  });

  const invalid = spawnSync(process.execPath, [tsxCli, 'scripts/generate-release-metadata.ts'], {
    cwd: webRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      RELEASE_SHA: 'abc123',
      RELEASE_BUILT_AT: builtAt,
      RELEASE_OUTPUT: output,
    },
  });
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /40-character hexadecimal Git SHA/);

  const nonHex = spawnSync(process.execPath, [tsxCli, 'scripts/generate-release-metadata.ts'], {
    cwd: webRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      RELEASE_SHA: 'z123456789abcdef0123456789abcdef01234567',
      RELEASE_BUILT_AT: builtAt,
      RELEASE_OUTPUT: output,
    },
  });
  assert.notEqual(nonHex.status, 0);
  assert.match(nonHex.stderr, /40-character hexadecimal Git SHA/);
} finally {
  fs.rmSync(tempDirectory, {recursive: true, force: true});
}

const deploy = parseWorkflow('.github/workflows/deploy.yml');
assert.deepEqual(deploy.on.push.branches, ['master']);
assert.equal(deploy.jobs.verify.if, "github.ref == 'refs/heads/master'");
const generateStep = deploy.jobs.verify.steps.find((step: any) => step.name === 'Generate release metadata');
assert.equal(generateStep.env.RELEASE_SHA, '${{ github.sha }}');
assert.equal(generateStep.run, 'npx tsx scripts/generate-release-metadata.ts');
assert.ok(deploy.jobs.verify.steps.indexOf(generateStep) < deploy.jobs.verify.steps.findIndex((step: any) => step.uses === 'actions/upload-pages-artifact@v3'));
assert.equal(deploy.jobs.smoke.with.expected_sha, '${{ github.sha }}');

const monitoring = parseWorkflow('.github/workflows/production-monitoring.yml');
assert.deepEqual(monitoring.on.workflow_call.inputs.expected_sha, {
  description: 'Full commit SHA expected after a deployment',
  required: false,
  type: 'string',
  default: '',
});
const routeProbe = monitoring.jobs['check-production-routes'].steps.find((step: any) => step.run).run;
assert.match(routeProbe, /partsource\/release\.json/);
assert.match(routeProbe, /\^\[0-9a-fA-F\]\{40\}\$/);
assert.match(routeProbe, /EXPECTED_SHA/);
assert.match(routeProbe, /metadata\.sha !== expectedSha/);
assert.match(routeProbe, /Date\.parse\(metadata\.builtAt\)/);
assert.match(routeProbe, /new Date\(metadata\.builtAt\)\.toISOString\(\) !== metadata\.builtAt/);

const canonicalSite = 'https://jrambackup1-lgtm.github.io/partsource/';
assert.match(read('web/vite.config.ts'), new RegExp(canonicalSite.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.match(read('research/release-truth.md'), new RegExp(canonicalSite.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.match(read('research/release-truth.md'), /Canonical branch: `master`/);

console.log('Release truth checks passed.');
