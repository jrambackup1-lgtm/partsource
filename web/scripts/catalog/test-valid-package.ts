import assert from 'node:assert/strict';
import { buildSyntheticCatalogPackageInput, catalogPackageDigest, parseCatalogPackage, sha256Hex, SYNTHETIC_CATALOG_NOTICE } from '../../src/catalog/index';

const input = buildSyntheticCatalogPackageInput() as Record<string, any>;
const parsed = parseCatalogPackage(input);

assert.equal(parsed.schemaVersion, 1);
assert.equal(parsed.manifest.releaseId, 'partsource.synthetic.screws.v1');
assert.match(parsed.manifest.digest, /^sha256:[a-f0-9]{64}$/);
assert.equal(parsed.manifest.digest, catalogPackageDigest(parsed), 'synthetic package exports a finalized canonical digest');
assert.match(input.manifest.digest, /^sha256:pending:/, 'build input may carry its pre-publication placeholder');
assert.equal(parsed.manifest.notice, SYNTHETIC_CATALOG_NOTICE);
assert.equal(parsed.families.length, 3);
assert.equal(parsed.configurations.length, 30);
assert.equal(parsed.configurationRevisions.length, 30);
assert.equal(parsed.identifierMappings.length, 32);

const css = parsed.familySchemaRevisions.find(schema => schema.familyId === 'css');
const shcs = parsed.familySchemaRevisions.find(schema => schema.familyId === 'shcs');
assert.ok(css?.factIds.includes('countersink_angle_deg'));
assert.ok(!shcs?.factIds.includes('countersink_angle_deg'));

const normalizedCollision = parsed.identifierMappings.filter(mapping =>
  mapping.namespaceId === 'partsource_synthetic_v1'
  && mapping.identifier.normalize('NFKC').trim().toUpperCase() === 'PSYN-SCR-COLLIDE'
);
assert.equal(normalizedCollision.length, 2, 'supported many-cardinality exact mapping is retained');
assert.notEqual(normalizedCollision[0].configurationRevisionId, normalizedCollision[1].configurationRevisionId);

const sample = parsed.configurationRevisions.find(revision => revision.configurationRevisionId === 'synrec-v1-css-06:r1');
assert.equal(sample?.facts.find(fact => fact.factId === 'nominal_diameter_mm')?.value.state, 'known');
assert.deepEqual(sample?.facts.find(fact => fact.factId === 'countersink_angle_deg')?.value, { state: 'known', value: 90 });

assert.ok(Object.isFrozen(parsed));
assert.ok(Object.isFrozen(parsed.manifest));
assert.ok(Object.isFrozen(parsed.configurationRevisions));
assert.ok(Object.isFrozen(parsed.configurationRevisions[0].facts[0].value));

input.manifest.notice = 'caller mutated this after parsing';
assert.equal(parsed.manifest.notice, SYNTHETIC_CATALOG_NOTICE, 'parser returns a detached clone');
assert.throws(() => {
  (parsed.manifest as { notice: string }).notice = 'mutation';
}, TypeError);

const firstReplay = JSON.stringify(parseCatalogPackage(buildSyntheticCatalogPackageInput()));
const secondReplay = JSON.stringify(parseCatalogPackage(buildSyntheticCatalogPackageInput()));
assert.equal(firstReplay, secondReplay, 'synthetic extraction and package replay are deterministic');
assert.equal(sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', 'browser-safe SHA-256 matches the standard vector');
const finalized = structuredClone(buildSyntheticCatalogPackageInput()) as Record<string, any>;
finalized.manifest.digest = catalogPackageDigest(finalized as any);
assert.equal(parseCatalogPackage(finalized).manifest.digest, finalized.manifest.digest, 'a correctly finalized digest verifies synchronously');

const prohibited = new Set(['supplier', 'suppliers', 'price', 'stock', 'availability', 'equivalent', 'equivalence', 'suitability']);
const walk = (value: unknown): void => {
  if (Array.isArray(value)) return value.forEach(walk);
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      assert.ok(!prohibited.has(key.toLowerCase()), `truth-boundary field leaked: ${key}`);
      walk(child);
    }
  }
};
walk(parsed);

console.log('catalog valid-package tests: ok');
