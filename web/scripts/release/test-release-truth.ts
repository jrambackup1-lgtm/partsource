import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {
  createArtifactManifest,
  readAndVerifyArtifactManifest,
  validateArtifactManifest,
  writeArtifactManifest,
} from './artifact-manifest.ts';
import {validateReleaseMetadata} from './release-metadata.ts';
import {
  validateRemoteManifest,
  validateRemoteRelease,
  verifyDeploymentWithRetry,
} from './verify-deployed-release.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(scriptDirectory, '../..');
const repoRoot = path.resolve(webRoot, '..');
const tsxCli = path.join(webRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const generator = path.join('scripts', 'release', 'generate-release-metadata.ts');
const verifier = path.join('scripts', 'release', 'verify-release-metadata.ts');
const validSha = '0123456789abcdef0123456789abcdef01234567';
const otherSha = '89abcdef0123456789abcdef0123456789abcdef';
const builtAt = '2026-08-15T10:20:30.000Z';
const release = {
  schemaVersion: 1 as const,
  sourceSha: validSha,
  builtAt,
  artifactManifest: 'artifact-manifest.json' as const,
};

function cleanEnvironment(overrides: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  const environment = {...process.env};
  for (const name of [
    'CI', 'GITHUB_ACTIONS', 'GITHUB_SHA', 'GITHUB_OUTPUT',
    'PARTSOURCE_RELEASE_SHA', 'PARTSOURCE_RELEASE_BUILT_AT',
    'PARTSOURCE_ARTIFACT_ROOT', 'PARTSOURCE_ARTIFACT_DIGEST',
  ]) delete environment[name];
  return {...environment, ...overrides};
}

function run(script: string, environment: NodeJS.ProcessEnv) {
  return spawnSync(process.execPath, [tsxCli, script], {
    cwd: webRoot, encoding: 'utf8', env: environment,
  });
}
function assertSucceeded(result: ReturnType<typeof run>): void {
  assert.equal(result.status, 0, result.stderr || result.stdout);
}
function assertFailed(result: ReturnType<typeof run>, pattern: RegExp): void {
  assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stderr, pattern);
}

assert.deepEqual(validateReleaseMetadata(release), release);
for (const invalid of [
  null,
  {...release, schemaVersion: 2},
  {...release, sourceSha: validSha.toUpperCase()},
  {...release, builtAt: '2026-08-15'},
  {...release, artifactManifest: '../manifest.json'},
  {...release, extra: true},
]) assert.throws(() => validateReleaseMetadata(invalid));

const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'partsource-release-'));
try {
  const artifactRoot = path.join(tempDirectory, 'artifact');
  fs.mkdirSync(artifactRoot);
  fs.writeFileSync(path.join(artifactRoot, 'index.html'), '<h1>release</h1>\n');
  const baseEnv = {
    PARTSOURCE_ARTIFACT_ROOT: artifactRoot,
    PARTSOURCE_RELEASE_SHA: validSha,
    PARTSOURCE_RELEASE_BUILT_AT: builtAt,
  };
  const generated = run(generator, cleanEnvironment({...baseEnv, GITHUB_SHA: otherSha}));
  assertSucceeded(generated);
  assert.match(generated.stdout, /from PARTSOURCE_RELEASE_SHA/);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(artifactRoot, 'release.json'), 'utf8')), release);
  const manifestPath = path.join(artifactRoot, 'artifact-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.deepEqual(manifest.files.map((file: {path: string}) => file.path), ['index.html', 'release.json']);
  assert.deepEqual(createArtifactManifest(artifactRoot, manifestPath), manifest, 'manifest generation must be deterministic');

  const verified = run(verifier, cleanEnvironment({...baseEnv, CI: 'true', PARTSOURCE_ARTIFACT_DIGEST: manifest.artifactDigest}));
  assertSucceeded(verified);
  assert.match(verified.stdout, /Verified release metadata/);
  assertFailed(run(verifier, cleanEnvironment({...baseEnv, CI: 'true', PARTSOURCE_RELEASE_SHA: otherSha})), /SHA mismatch/);
  assertFailed(run(verifier, cleanEnvironment({...baseEnv, CI: 'true', PARTSOURCE_ARTIFACT_DIGEST: '0'.repeat(64)})), /Artifact digest mismatch/);

  const restore = () => {
    fs.rmSync(artifactRoot, {recursive: true, force: true});
    fs.mkdirSync(artifactRoot);
    fs.writeFileSync(path.join(artifactRoot, 'index.html'), '<h1>release</h1>\n');
    assertSucceeded(run(generator, cleanEnvironment(baseEnv)));
  };
  fs.writeFileSync(path.join(artifactRoot, 'index.html'), 'changed');
  assertFailed(run(verifier, cleanEnvironment(baseEnv)), /changed: index\.html/);
  restore();
  fs.rmSync(path.join(artifactRoot, 'index.html'));
  assertFailed(run(verifier, cleanEnvironment(baseEnv)), /missing: index\.html/);
  restore();
  fs.writeFileSync(path.join(artifactRoot, 'extra.txt'), 'unexpected');
  assertFailed(run(verifier, cleanEnvironment(baseEnv)), /unexpected: extra\.txt/);
  restore();

  const corruptManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  corruptManifest.artifactDigest = '0'.repeat(64);
  fs.writeFileSync(manifestPath, JSON.stringify(corruptManifest));
  assertFailed(run(verifier, cleanEnvironment(baseEnv)), /manifest digest mismatch/i);
  restore();
  const badSchema = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  badSchema.extra = true;
  fs.writeFileSync(manifestPath, JSON.stringify(badSchema));
  assertFailed(run(verifier, cleanEnvironment(baseEnv)), /unexpected or missing fields/);

  assert.throws(() => validateArtifactManifest({...manifest, files: [...manifest.files].reverse()}), /sorted/);
  assert.throws(() => validateArtifactManifest({...manifest, files: [{...manifest.files[0], path: '../escape'}]}), /parent segments/);
  assert.throws(() => writeArtifactManifest(artifactRoot, path.join(tempDirectory, 'outside.json')), /direct child/);

  restore();
  const link = path.join(artifactRoot, 'linked-file');
  try {
    fs.symlinkSync(path.join(artifactRoot, 'index.html'), link, 'file');
    assert.throws(() => createArtifactManifest(artifactRoot, manifestPath), /symbolic links/);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EPERM') throw error;
    console.log('Symlink creation unavailable; symlink rejection test skipped.');
  } finally {
    fs.rmSync(link, {force: true});
  }

  assertFailed(run(generator, cleanEnvironment({CI: 'true', PARTSOURCE_ARTIFACT_ROOT: artifactRoot, PARTSOURCE_RELEASE_BUILT_AT: builtAt})), /Refusing to infer production identity/);
  assertFailed(run(generator, cleanEnvironment({...baseEnv, PARTSOURCE_RELEASE_SHA: 'abc123'})), /40-character hexadecimal Git SHA/);
  assertFailed(run(generator, cleanEnvironment({...baseEnv, PARTSOURCE_RELEASE_BUILT_AT: 'bad'})), /ISO 8601 UTC timestamp/);
  const local = run(generator, cleanEnvironment({PARTSOURCE_ARTIFACT_ROOT: artifactRoot, PARTSOURCE_RELEASE_BUILT_AT: builtAt}));
  assertSucceeded(local);
  assert.match(local.stderr, /LOCAL\/NON-PRODUCTION/);
  const head = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: repoRoot, encoding: 'utf8'}).trim();
  assert.equal(JSON.parse(fs.readFileSync(path.join(artifactRoot, 'release.json'), 'utf8')).sourceSha, head);

  // Exercise deployed validation, full-byte verification, and propagation retry without network.
  restore();
  const remoteManifest = readAndVerifyArtifactManifest(artifactRoot, manifestPath);
  validateRemoteRelease(release, validSha);
  validateRemoteManifest(remoteManifest, remoteManifest.artifactDigest);
  assert.throws(() => validateRemoteRelease({...release, extra: true}, validSha), /closed release schema/);
  assert.throws(() => validateRemoteManifest({...remoteManifest, artifactDigest: '0'.repeat(64)}, remoteManifest.artifactDigest), /identity/);
  const realFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = (async (input: string | URL | Request) => {
    fetchCalls += 1;
    if (fetchCalls === 1) throw new Error('not propagated yet');
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
    const relative = decodeURIComponent(url.pathname.replace(/^\/partsource\//, ''));
    const bytes = fs.readFileSync(path.join(artifactRoot, relative));
    return new Response(bytes, {status: 200});
  }) as typeof fetch;
  try {
    const retry = await verifyDeploymentWithRetry(
      new URL('https://example.invalid/partsource/'), validSha, remoteManifest.artifactDigest, 2, 0,
    );
    assert.equal(retry.attempt, 2);
    assert.equal(retry.result.release.sourceSha, validSha);
  } finally {
    globalThis.fetch = realFetch;
  }
} finally {
  fs.rmSync(tempDirectory, {recursive: true, force: true});
}

const workflow = fs.readFileSync(path.join(repoRoot, '.github', 'workflows', 'deploy.yml'), 'utf8');
function workflowStep(name: string): string {
  const marker = `      - name: ${name}`;
  const start = workflow.indexOf(marker);
  assert.ok(start >= 0, `workflow step not found: ${name}`);
  const next = workflow.indexOf('\n      - name:', start + marker.length);
  return workflow.slice(start, next < 0 ? workflow.length : next);
}
const contractIndex = workflow.indexOf('name: Release truth contract');
const buildIndex = workflow.indexOf('name: Build Pages artifact once');
const generateIndex = workflow.indexOf('name: Generate release identity');
const verifyIndex = workflow.indexOf('name: Verify exact upload directory');
const uploadIndex = workflow.indexOf('name: Upload verified Pages artifact');
assert.ok(contractIndex >= 0 && buildIndex > contractIndex);
assert.ok(generateIndex > buildIndex, 'generator must run after final build');
assert.ok(verifyIndex > generateIndex && uploadIndex > verifyIndex);
assert.equal(workflow.indexOf('npm run build', generateIndex), -1, 'no build may follow identity generation');
assert.match(workflowStep('Release truth contract'), /run: npm run test:release/);
assert.match(workflowStep('Generate release identity'), /run: npm run release:metadata/);
assert.match(workflowStep('Generate release identity'), /PARTSOURCE_RELEASE_SHA: \$\{\{ github\.sha \}\}/);
assert.match(workflowStep('Verify exact upload directory'), /run: npm run release:verify/);
assert.match(workflowStep('Verify exact upload directory'), /PARTSOURCE_ARTIFACT_DIGEST:/);
assert.match(workflowStep('Upload verified Pages artifact'), /path: web\/dist/);
assert.match(workflowStep('Upload verified Pages artifact'), /name: pages-\$\{\{ github\.sha \}\}/);
assert.match(workflow, /artifact_name: pages-\$\{\{ github\.sha \}\}/);
assert.match(workflowStep('Verify propagated deployment identity'), /verify-deployed-release\.mjs/);
assert.match(pathToFileURL(path.join(webRoot, generator)).protocol, /file:/);

console.log('Release truth checks passed.');
