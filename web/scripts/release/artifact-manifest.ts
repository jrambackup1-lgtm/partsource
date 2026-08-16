import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export interface ArtifactFileIdentity {
  path: string;
  bytes: number;
  sha256: string;
}

export interface ArtifactManifest {
  schemaVersion: 1;
  algorithm: 'sha256';
  artifactDigest: string;
  files: ArtifactFileIdentity[];
}

const MANIFEST_KEYS = ['algorithm', 'artifactDigest', 'files', 'schemaVersion'];
const FILE_KEYS = ['bytes', 'path', 'sha256'];
const SHA256 = /^[0-9a-f]{64}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertExactKeys(value: Record<string, unknown>, expected: string[], description: string): void {
  const keys = Object.keys(value).sort();
  if (keys.length !== expected.length || keys.some((key, index) => key !== expected[index])) {
    throw new Error(`${description} has unexpected or missing fields.`);
  }
}

function hashBytes(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalManifestBody(files: ArtifactFileIdentity[]): string {
  return `${JSON.stringify({schemaVersion: 1, algorithm: 'sha256', files})}\n`;
}

function validateRelativePath(value: unknown): string {
  if (
    typeof value !== 'string'
    || value.length === 0
    || value.startsWith('/')
    || value.includes('\\')
    || /[\u0000-\u001f\u007f]/.test(value)
  ) {
    throw new Error('Artifact manifest paths must be canonical relative POSIX paths.');
  }
  const segments = value.split('/');
  if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) {
    throw new Error('Artifact manifest paths must not contain empty, current, or parent segments.');
  }
  return value;
}

function collectFiles(root: string, excludedFile: string): ArtifactFileIdentity[] {
  const resolvedRoot = path.resolve(root);
  const resolvedExcludedFile = path.resolve(excludedFile);
  if (path.dirname(resolvedExcludedFile) !== resolvedRoot) {
    throw new Error('Artifact manifest must be a direct child of the artifact root.');
  }
  const files: ArtifactFileIdentity[] = [];

  function visit(directory: string): void {
    const entries = fs.readdirSync(directory, {withFileTypes: true})
      .sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      if (path.resolve(absolute) === resolvedExcludedFile) {
        continue;
      }
      if (entry.isSymbolicLink()) {
        throw new Error(`Artifact directory must not contain symbolic links: ${absolute}`);
      }
      if (entry.isDirectory()) {
        visit(absolute);
        continue;
      }
      if (!entry.isFile()) {
        throw new Error(`Artifact directory contains a non-regular file: ${absolute}`);
      }
      const relative = validateRelativePath(path.relative(resolvedRoot, absolute).split(path.sep).join('/'));
      const contents = fs.readFileSync(absolute);
      files.push({path: relative, bytes: contents.length, sha256: hashBytes(contents)});
    }
  }

  const rootStat = fs.lstatSync(resolvedRoot);
  if (rootStat.isSymbolicLink()) {
    throw new Error(`Artifact root must not be a symbolic link: ${resolvedRoot}`);
  }
  if (!rootStat.isDirectory()) {
    throw new Error(`Artifact root is not a directory: ${resolvedRoot}`);
  }
  visit(resolvedRoot);
  files.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
  return files;
}

export function validateArtifactManifest(value: unknown): ArtifactManifest {
  if (!isRecord(value)) {
    throw new Error('Artifact manifest must be a JSON object.');
  }
  assertExactKeys(value, MANIFEST_KEYS, 'Artifact manifest');
  if (value.schemaVersion !== 1 || value.algorithm !== 'sha256' || !Array.isArray(value.files)) {
    throw new Error('Artifact manifest schemaVersion, algorithm, or files field is invalid.');
  }
  if (typeof value.artifactDigest !== 'string' || !SHA256.test(value.artifactDigest)) {
    throw new Error('Artifact manifest digest must be a lowercase SHA-256 value.');
  }

  let previousPath: string | undefined;
  const files = value.files.map((candidate): ArtifactFileIdentity => {
    if (!isRecord(candidate)) {
      throw new Error('Every artifact manifest file entry must be an object.');
    }
    assertExactKeys(candidate, FILE_KEYS, 'Artifact manifest file entry');
    const filePath = validateRelativePath(candidate.path);
    if (previousPath !== undefined && filePath <= previousPath) {
      throw new Error('Artifact manifest file entries must be uniquely sorted by path.');
    }
    previousPath = filePath;
    if (!Number.isSafeInteger(candidate.bytes) || (candidate.bytes as number) < 0) {
      throw new Error(`Artifact manifest byte count is invalid for ${filePath}.`);
    }
    if (typeof candidate.sha256 !== 'string' || !SHA256.test(candidate.sha256)) {
      throw new Error(`Artifact manifest SHA-256 is invalid for ${filePath}.`);
    }
    return {path: filePath, bytes: candidate.bytes as number, sha256: candidate.sha256};
  });

  const expectedDigest = hashBytes(canonicalManifestBody(files));
  if (value.artifactDigest !== expectedDigest) {
    throw new Error(`Artifact manifest digest mismatch: expected ${expectedDigest}, received ${value.artifactDigest}.`);
  }
  return {schemaVersion: 1, algorithm: 'sha256', artifactDigest: value.artifactDigest, files};
}

export function createArtifactManifest(root: string, manifestFile: string): ArtifactManifest {
  const files = collectFiles(root, manifestFile);
  const artifactDigest = hashBytes(canonicalManifestBody(files));
  return {schemaVersion: 1, algorithm: 'sha256', artifactDigest, files};
}

export function writeArtifactManifest(root: string, manifestFile: string): ArtifactManifest {
  const manifest = createArtifactManifest(root, manifestFile);
  fs.mkdirSync(path.dirname(manifestFile), {recursive: true});
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return manifest;
}

export function readAndVerifyArtifactManifest(root: string, manifestFile: string): ArtifactManifest {
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to read valid JSON artifact manifest at ${manifestFile}.`, {cause: error});
  }
  const manifest = validateArtifactManifest(parsed);
  const actual = createArtifactManifest(root, manifestFile);
  const expectedByPath = new Map(manifest.files.map((file) => [file.path, file]));
  const actualByPath = new Map(actual.files.map((file) => [file.path, file]));
  const missing = manifest.files.filter((file) => !actualByPath.has(file.path)).map((file) => file.path);
  const unexpected = actual.files.filter((file) => !expectedByPath.has(file.path)).map((file) => file.path);
  const changed = actual.files.filter((file) => {
    const expected = expectedByPath.get(file.path);
    return expected !== undefined && (expected.bytes !== file.bytes || expected.sha256 !== file.sha256);
  }).map((file) => file.path);
  if (missing.length || unexpected.length || changed.length) {
    const details = [
      missing.length ? `missing: ${missing.join(', ')}` : '',
      unexpected.length ? `unexpected: ${unexpected.join(', ')}` : '',
      changed.length ? `changed: ${changed.join(', ')}` : '',
    ].filter(Boolean).join('; ');
    throw new Error(`Artifact directory does not exactly match its manifest (${details}).`);
  }
  if (actual.artifactDigest !== manifest.artifactDigest) {
    throw new Error(
      `Artifact digest mismatch: expected ${manifest.artifactDigest}, received ${actual.artifactDigest}.`,
    );
  }
  return manifest;
}
