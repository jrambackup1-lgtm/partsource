import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {writeArtifactManifest} from './artifact-manifest.ts';
import {validateReleaseMetadata} from './release-metadata.ts';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(scriptDirectory, '../..');

function isContinuousIntegration(): boolean {
  return process.env.GITHUB_ACTIONS === 'true' || process.env.CI === 'true';
}

function resolveReleaseSha(): {sha: string; source: string} {
  if (process.env.PARTSOURCE_RELEASE_SHA !== undefined) {
    return {sha: process.env.PARTSOURCE_RELEASE_SHA, source: 'PARTSOURCE_RELEASE_SHA'};
  }
  if (process.env.GITHUB_SHA !== undefined) {
    return {sha: process.env.GITHUB_SHA, source: 'GITHUB_SHA'};
  }
  if (isContinuousIntegration()) {
    throw new Error(
      'No release SHA was supplied in CI. Refusing to infer production identity from checkout state.',
    );
  }

  const sha = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: webRoot, encoding: 'utf8'}).trim();
  console.warn(
    'LOCAL/NON-PRODUCTION release metadata: no PARTSOURCE_RELEASE_SHA or GITHUB_SHA was supplied; using git HEAD.',
  );
  return {sha, source: 'local git HEAD'};
}

const artifactRoot = process.env.PARTSOURCE_ARTIFACT_ROOT
  ? path.resolve(process.cwd(), process.env.PARTSOURCE_ARTIFACT_ROOT)
  : path.join(webRoot, 'dist');
const output = path.join(artifactRoot, 'release.json');
const manifestOutput = path.join(artifactRoot, 'artifact-manifest.json');

const {sha, source} = resolveReleaseSha();
const builtAt = process.env.PARTSOURCE_RELEASE_BUILT_AT ?? new Date().toISOString();
const metadata = validateReleaseMetadata({
  schemaVersion: 1,
  sourceSha: sha,
  builtAt,
  artifactManifest: 'artifact-manifest.json',
});
fs.mkdirSync(path.dirname(output), {recursive: true});
fs.writeFileSync(output, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
console.log(`Wrote release metadata for ${metadata.sourceSha} from ${source} to ${output}`);

// This must be last: release.json is part of the identity; the manifest excludes only itself.
const manifest = writeArtifactManifest(artifactRoot, manifestOutput);
console.log(
  `Wrote artifact manifest for ${manifest.files.length} files with digest ${manifest.artifactDigest} to ${manifestOutput}`,
);
if (process.env.GITHUB_OUTPUT !== undefined) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `artifact_digest=${manifest.artifactDigest}\n`, 'utf8');
}
