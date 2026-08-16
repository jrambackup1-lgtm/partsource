import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readAndVerifyArtifactManifest} from './artifact-manifest.ts';
import {validateReleaseMetadata} from './release-metadata.ts';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(scriptDirectory, '../..');
const artifactRoot = process.env.PARTSOURCE_ARTIFACT_ROOT
  ? path.resolve(process.cwd(), process.env.PARTSOURCE_ARTIFACT_ROOT)
  : path.join(webRoot, 'dist');
const input = path.join(artifactRoot, 'release.json');
const manifestInput = path.join(artifactRoot, 'artifact-manifest.json');

let parsed: unknown;
try {
  parsed = JSON.parse(fs.readFileSync(input, 'utf8'));
} catch (error) {
  throw new Error(`Unable to read valid JSON release metadata at ${input}.`, {cause: error});
}

const metadata = validateReleaseMetadata(parsed);
const expectedSha = process.env.PARTSOURCE_RELEASE_SHA ?? process.env.GITHUB_SHA;
if ((process.env.GITHUB_ACTIONS === 'true' || process.env.CI === 'true') && expectedSha === undefined) {
  throw new Error('PARTSOURCE_RELEASE_SHA or GITHUB_SHA is required when verifying release metadata in CI.');
}
if (expectedSha !== undefined && metadata.sourceSha !== expectedSha) {
  throw new Error(`Release metadata SHA mismatch: expected ${expectedSha}, received ${metadata.sourceSha}.`);
}

const manifest = readAndVerifyArtifactManifest(artifactRoot, manifestInput);
const releaseRelativePath = path.relative(artifactRoot, input).split(path.sep).join('/');
if (!manifest.files.some((file) => file.path === releaseRelativePath)) {
  throw new Error('Artifact manifest does not include the verified release metadata file.');
}
const expectedDigest = process.env.PARTSOURCE_ARTIFACT_DIGEST;
if (expectedDigest !== undefined && manifest.artifactDigest !== expectedDigest) {
  throw new Error(
    `Artifact digest mismatch: expected ${expectedDigest}, received ${manifest.artifactDigest}.`,
  );
}

console.log(
  `Verified release metadata ${metadata.sourceSha} and ${manifest.files.length}-file artifact ${manifest.artifactDigest}`
  + `${expectedSha === undefined ? ' [LOCAL/NON-PRODUCTION; no expected SHA supplied]' : ''}.`,
);
