import assert from 'node:assert/strict';
import {
  buildSyntheticCatalogPackageInput,
  CatalogPackageValidationError,
  catalogPackageDigest,
  parseCatalogPackage,
} from '../../src/catalog/index';

const fixture = (): any => structuredClone(buildSyntheticCatalogPackageInput());
const rejects = (mutate: (input: any) => void, expected: RegExp): void => {
  const input = fixture();
  mutate(input);
  assert.throws(
    () => parseCatalogPackage(input),
    (error: unknown) => error instanceof CatalogPackageValidationError && expected.test(error.message),
  );
};

rejects(input => { input.manifest.unreviewed = true; }, /unknown field.*unreviewed/);
rejects(input => { input.price = 12.50; }, /unknown field.*price/);
rejects(input => { input.configurations[0].supplier = 'Synthetic Supplier'; }, /unknown field.*supplier/);

rejects(input => {
  input.configurationRevisions[0].facts.pop();
}, /fact cardinality must exactly match family schema/);

rejects(input => {
  input.familySchemaRevisions.find((schema: any) => schema.familyId === 'shcs').factIds.push('countersink_angle_deg');
}, /family-field leakage: countersink_angle_deg/);

rejects(input => {
  const original = input.identifierMappings[0];
  input.identifierMappings.push({
    ...original,
    mappingId: 'synmap-v1-adversarial-normalized-duplicate',
    identifier: `  ${original.identifier.toLowerCase()}  `,
  });
}, /duplicate normalized mapping target collision/);

rejects(input => {
  input.identifierMappings[0].configurationRevisionId = 'absent:r1';
}, /mapping references absent revision/);

rejects(input => {
  const prior = input.configurationRevisions[0];
  const replacement = structuredClone(prior);
  replacement.configurationRevisionId = `${prior.configurationId}:r2`;
  replacement.revision = 2;
  replacement.lifecycle = {
    status: 'corrected', effectiveAt: '2026-08-12T00:00:00.000Z', reason: 'Corrected record',
    correctsId: prior.configurationRevisionId, supersededById: null,
  };
  prior.lifecycle = {
    status: 'superseded', effectiveAt: '2026-08-11T00:00:00.000Z', reason: 'Corrected record',
    correctsId: null, supersededById: replacement.configurationRevisionId,
  };
  input.configurations[0].currentRevisionId = replacement.configurationRevisionId;
  input.configurationRevisions.push(replacement);
}, /active or corrected mapping cannot reference a superseded or withdrawn revision/);

rejects(input => {
  input.identifierMappings[0].provenanceId = 'prov.fact.synthetic.v1';
}, /mapping requires mapping provenance/);

rejects(input => {
  input.manifest.digest = 'sha256:not-a-digest';
}, /expected finalized sha256/);

rejects(input => {
  input.manifest.allowedUse = 'public_catalog';
}, /synthetic data must be synthetic_demo_only/);

rejects(input => {
  input.lexicon.push({ ...input.lexicon[0], ruleId: 'lex.collision' });
}, /lexicon term collision/);

rejects(input => { input.manifest.publishedAt = '2026-02-30T00:00:00.000Z'; }, /real ISO-8601/);
rejects(input => { input.configurationRevisions[0].lifecycle.effectiveAt = '2026-13-01T00:00:00.000Z'; }, /real ISO-8601/);
rejects(input => { input.configurationRevisions[0].lifecycle.status = 'superseded'; }, /superseded lifecycle requires/);
rejects(input => {
  input.identifierMappings[0].lifecycle = {
    status: 'superseded', effectiveAt: '2026-08-11T00:00:00.000Z', reason: 'Replaced',
    correctsId: null, supersededById: 'missing.mapping',
  };
}, /lifecycle reference must identify another record/);
rejects(input => { input.identifierNamespaces = new Array(10_001).fill(input.identifierNamespaces[0]); }, /expected at most 10000 item/);
rejects(input => {
  input.manifest.digest = catalogPackageDigest(input);
  input.hierarchy[0].label = 'Changed after publication';
}, /digest mismatch/);

for (const mutate of [
  (input: any) => { input.hierarchy[0].label = 'Certified approved alternate equivalent'; },
  (input: any) => { input.families[0].label = 'Certified approved alternate equivalent'; },
  (input: any) => { input.factDefinitions[0].label = 'Certified approved alternate equivalent'; },
  (input: any) => { input.facets[0].label = 'Certified approved alternate equivalent'; },
  (input: any) => { input.identifierNamespaces[0].label = 'Certified approved alternate equivalent'; },
  (input: any) => {
    input.lexicon[0].term = 'Certified approved alternate equivalent';
    input.lexicon[0].normalizedTerm = 'certified approved alternate equivalent';
  },
  (input: any) => { input.provenance[0].sourceId = 'Certified approved alternate equivalent'; },
]) rejects(mutate, /prohibited claim-bearing display text/);

const publicInput = fixture();
Object.assign(publicInput.manifest, {
  allowedUse: 'public_catalog', dataOrigin: 'approved_public_projection', publicationStatus: 'approved_public',
  approvalId: 'approval.release.v1', reviewedBy: 'Release reviewer', reviewedAt: '2026-08-12T00:00:00.000Z',
  permissionGrantId: 'grant.release.v1',
});
for (const record of publicInput.provenance) Object.assign(record, {
  sourceKind: 'approved_public_projection', publicationClass: 'public', permissionGrantId: 'grant.release.v1',
});
publicInput.manifest.digest = catalogPackageDigest(publicInput);
const trustedApproval = {
  releaseId: publicInput.manifest.releaseId,
  digest: publicInput.manifest.digest,
  approvalId: publicInput.manifest.approvalId,
  permissionGrantId: publicInput.manifest.permissionGrantId,
};
assert.throws(() => parseCatalogPackage(publicInput), /trusted out-of-envelope approval/);
assert.throws(() => parseCatalogPackage(publicInput, { ...trustedApproval, approvalId: 'approval.other' }), /trusted out-of-envelope approval/);
assert.equal(parseCatalogPackage(publicInput, trustedApproval).manifest.publicationStatus, 'approved_public');

console.log('catalog adversarial validation tests: ok');
