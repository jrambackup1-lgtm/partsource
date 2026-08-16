import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

const FULL_GIT_SHA = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;

function hash(value) {
  return createHash('sha256').update(value).digest('hex');
}

function exactKeys(value, expected) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...expected].sort());
}

export function validateRemoteRelease(value, expectedSha) {
  if (!exactKeys(value, ['schemaVersion', 'sourceSha', 'builtAt', 'artifactManifest'])) {
    throw new Error('Deployed release.json does not have the closed release schema.');
  }
  if (value.schemaVersion !== 1 || value.artifactManifest !== 'artifact-manifest.json') {
    throw new Error('Deployed release.json has an unsupported schema version or manifest link.');
  }
  if (!FULL_GIT_SHA.test(value.sourceSha) || value.sourceSha !== expectedSha) {
    throw new Error(`Deployed release SHA mismatch: expected ${expectedSha}, received ${String(value.sourceSha)}.`);
  }
  if (
    typeof value.builtAt !== 'string'
    || Number.isNaN(Date.parse(value.builtAt))
    || new Date(value.builtAt).toISOString() !== value.builtAt
  ) {
    throw new Error('Deployed release builtAt is not a canonical UTC timestamp.');
  }
}

export function validateRemoteManifest(value, expectedDigest) {
  if (!exactKeys(value, ['schemaVersion', 'algorithm', 'artifactDigest', 'files'])) {
    throw new Error('Deployed artifact manifest does not have the closed manifest schema.');
  }
  if (
    value.schemaVersion !== 1
    || value.algorithm !== 'sha256'
    || value.artifactDigest !== expectedDigest
    || !SHA256.test(value.artifactDigest)
    || !Array.isArray(value.files)
  ) {
    throw new Error('Deployed artifact manifest identity does not match the expected artifact digest.');
  }
  let previous = '';
  for (const file of value.files) {
    if (
      !exactKeys(file, ['path', 'bytes', 'sha256'])
      || typeof file.path !== 'string'
      || file.path === ''
      || file.path.startsWith('/')
      || file.path.includes('\\')
      || /[\u0000-\u001f\u007f]/.test(file.path)
      || file.path.split('/').some((segment) => segment === '' || segment === '.' || segment === '..')
      || file.path <= previous
      || !Number.isSafeInteger(file.bytes)
      || file.bytes < 0
      || !SHA256.test(file.sha256)
    ) {
      throw new Error('Deployed artifact manifest contains an invalid or unsorted file entry.');
    }
    previous = file.path;
  }
  const body = `${JSON.stringify({schemaVersion: 1, algorithm: 'sha256', files: value.files})}\n`;
  if (hash(body) !== value.artifactDigest) {
    throw new Error('Deployed artifact manifest has an invalid aggregate digest.');
  }
  return value;
}

async function fetchBytes(url) {
  const response = await fetch(url, {headers: {'cache-control': 'no-cache'}});
  if (!response.ok) {
    throw new Error(`${url.pathname} returned HTTP ${response.status}.`);
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function verifyDeployment(baseUrl, expectedSha, expectedDigest) {
  const releaseUrl = new URL('release.json', baseUrl);
  releaseUrl.searchParams.set('verify', expectedSha);
  const releaseBytes = await fetchBytes(releaseUrl);
  let release;
  try {
    release = JSON.parse(releaseBytes.toString('utf8'));
  } catch (error) {
    throw new Error('Deployed release.json is not valid JSON.', {cause: error});
  }
  validateRemoteRelease(release, expectedSha);

  const manifestUrl = new URL('artifact-manifest.json', baseUrl);
  manifestUrl.searchParams.set('verify', expectedSha);
  const manifestBytes = await fetchBytes(manifestUrl);
  let parsedManifest;
  try {
    parsedManifest = JSON.parse(manifestBytes.toString('utf8'));
  } catch (error) {
    throw new Error('Deployed artifact-manifest.json is not valid JSON.', {cause: error});
  }
  const manifest = validateRemoteManifest(parsedManifest, expectedDigest);
  const releaseEntry = manifest.files.find((file) => file.path === 'release.json');
  if (!releaseEntry || releaseEntry.bytes !== releaseBytes.length || releaseEntry.sha256 !== hash(releaseBytes)) {
    throw new Error('Fetched release.json bytes do not match the deployed artifact manifest.');
  }

  for (const file of manifest.files) {
    const fileUrl = new URL(file.path.split('/').map(encodeURIComponent).join('/'), baseUrl);
    fileUrl.searchParams.set('verify', expectedSha);
    const bytes = file.path === 'release.json' ? releaseBytes : await fetchBytes(fileUrl);
    if (bytes.length !== file.bytes || hash(bytes) !== file.sha256) {
      throw new Error(`Fetched ${file.path} does not match the deployed artifact manifest.`);
    }
  }
  return {release, manifest};
}

export async function verifyDeploymentWithRetry(baseUrl, expectedSha, expectedDigest, attempts, delayMs) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const result = await verifyDeployment(baseUrl, expectedSha, expectedDigest);
      return {result, attempt};
    } catch (error) {
      lastError = error;
      console.warn(`Deployment verification attempt ${attempt}/${attempts} failed: ${error.message}`);
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}

async function main() {
  const baseUrl = process.env.PARTSOURCE_DEPLOYED_BASE_URL;
  const expectedSha = process.env.PARTSOURCE_RELEASE_SHA;
  const expectedDigest = process.env.PARTSOURCE_ARTIFACT_DIGEST;
  if (!baseUrl || !FULL_GIT_SHA.test(expectedSha ?? '') || !SHA256.test(expectedDigest ?? '')) {
    throw new Error(
      'PARTSOURCE_DEPLOYED_BASE_URL, a full PARTSOURCE_RELEASE_SHA, and PARTSOURCE_ARTIFACT_DIGEST are required.',
    );
  }
  const attempts = Number.parseInt(process.env.PARTSOURCE_VERIFY_ATTEMPTS ?? '12', 10);
  const delayMs = Number.parseInt(process.env.PARTSOURCE_VERIFY_DELAY_MS ?? '10000', 10);
  if (!Number.isSafeInteger(attempts) || attempts < 1 || !Number.isSafeInteger(delayMs) || delayMs < 0) {
    throw new Error('Deployment verification retry settings are invalid.');
  }

  const {result, attempt} = await verifyDeploymentWithRetry(
    new URL(baseUrl), expectedSha, expectedDigest, attempts, delayMs,
  );
  console.log(
    `Verified deployed SHA ${result.release.sourceSha} and artifact ${result.manifest.artifactDigest}`
    + ` (${result.manifest.files.length} files) on attempt ${attempt}.`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
