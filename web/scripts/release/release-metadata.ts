export interface ReleaseMetadata {
  schemaVersion: 1;
  sourceSha: string;
  builtAt: string;
  artifactManifest: 'artifact-manifest.json';
}

const RELEASE_KEYS = ['artifactManifest', 'builtAt', 'schemaVersion', 'sourceSha'];
const FULL_GIT_SHA = /^[0-9a-f]{40}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateReleaseMetadata(value: unknown): ReleaseMetadata {
  if (!isRecord(value)) {
    throw new Error('Release metadata must be a JSON object.');
  }
  const keys = Object.keys(value).sort();
  if (keys.length !== RELEASE_KEYS.length || keys.some((key, index) => key !== RELEASE_KEYS[index])) {
    throw new Error('Release metadata has unexpected or missing fields.');
  }
  if (value.schemaVersion !== 1) {
    throw new Error('Release metadata schemaVersion must be 1.');
  }
  if (typeof value.sourceSha !== 'string' || !FULL_GIT_SHA.test(value.sourceSha)) {
    throw new Error('Release metadata sourceSha must be a full lowercase 40-character hexadecimal Git SHA.');
  }
  if (
    typeof value.builtAt !== 'string'
    || Number.isNaN(Date.parse(value.builtAt))
    || new Date(value.builtAt).toISOString() !== value.builtAt
  ) {
    throw new Error('Release metadata builtAt must be a canonical ISO 8601 UTC timestamp.');
  }
  if (value.artifactManifest !== 'artifact-manifest.json') {
    throw new Error('Release metadata artifactManifest must be "artifact-manifest.json".');
  }
  return {
    schemaVersion: 1,
    sourceSha: value.sourceSha,
    builtAt: value.builtAt,
    artifactManifest: 'artifact-manifest.json',
  };
}
