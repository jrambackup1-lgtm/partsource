import * as assert from 'node:assert/strict';
import {
  SAFE_PUBLIC_CROSS_REFERENCE_PROJECTION,
  UNPUBLISHED_CROSS_REFERENCE_CONFIGURATIONS,
  UNPUBLISHED_CROSS_REFERENCE_CROSSES,
  UNPUBLISHED_CROSS_REFERENCE_EVIDENCE,
  UNPUBLISHED_CROSS_REFERENCE_REVIEWS,
  UNPUBLISHED_CROSS_REFERENCE_SOURCES,
  publishVerifiedEquivalenceCatalog,
  type VerifiedEquivalenceCatalogInput,
} from '../src/lib/unpublishedCrossReferenceCatalog';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function baseline(): VerifiedEquivalenceCatalogInput {
  return {
    sources: clone(UNPUBLISHED_CROSS_REFERENCE_SOURCES),
    configurations: clone(UNPUBLISHED_CROSS_REFERENCE_CONFIGURATIONS),
    evidence: clone(UNPUBLISHED_CROSS_REFERENCE_EVIDENCE),
    reviews: clone(UNPUBLISHED_CROSS_REFERENCE_REVIEWS),
    crosses: clone(UNPUBLISHED_CROSS_REFERENCE_CROSSES),
  };
}

function publish(input: VerifiedEquivalenceCatalogInput) {
  return publishVerifiedEquivalenceCatalog(input, {
    version: 'test-version',
    publishedAt: '2026-08-09T00:00:00.000Z',
    now: '2026-08-09T00:00:00.000Z',
  });
}

const published = SAFE_PUBLIC_CROSS_REFERENCE_PROJECTION;
assert.equal(published.version, 'unpublished-cross-reference-poc-2026-08-09');
assert.equal(published.records.length, 0, 'no production verified records publish before reviewed source clearance');

const clearedPilot = baseline();
clearedPilot.sources[0].status = 'approved';
clearedPilot.sources[0].publicDisplayAllowed = true;
clearedPilot.sources[0].approvedAt = '2026-08-09';
clearedPilot.sources[0].approvedBy = 'test independent reviewer';

const clearedPublished = publish(clearedPilot);
assert.equal(clearedPublished.records.length, 2, 'approved pilot input publishes two verified records');
assert.deepEqual(
  clearedPublished.records.map(record => record.mcmasterIdentifier).sort(),
  ['91290A115', '93475A210'],
  'published identifiers are exact reviewed McMaster identifiers',
);

for (const record of clearedPublished.records) {
  assert.match(record.recordId, /^xref-/);
  assert.match(record.recordRevision, /^xref-rev-/);
  assert.match(record.mcmasterIdentifier, /^\d{5,6}[A-Z]\d{3,4}$/);
  assert.ok(record.alternativeIdentifier.length > 0, 'alternative identifier included');
  assert.ok(record.alternativeSupplier.length > 0, 'alternative supplier snapshot included');
  assert.ok(record.canonicalConfigurationId.length > 0, 'canonical configuration reference included');
  assert.ok(record.normalizedFacts.type.length > 0, 'normalized facts included');
  assert.ok(record.evidenceReferences.length > 0, 'evidence references included');
  assert.ok(record.evidenceReferences.every(e => e.references.length > 0), 'evidence locators included');
  assert.equal(record.review.status, 'approved', 'review is approved');
  assert.ok(record.review.revision.length > 0, 'review revision included');
  assert.equal(record.lifecycle.status, 'current', 'lifecycle is current');
  assert.ok(!record.recordId.includes('fixture'), 'fixtures excluded');
}

assert.equal(clearedPublished.records.some(record => record.mcmasterIdentifier === '99999A999'), false, 'synthetic fixture record excluded');

const cases: Array<[string, (input: VerifiedEquivalenceCatalogInput) => void]> = [
  ['unapproved source', input => { input.sources[0].status = 'discovery'; }],
  ['stale lifecycle', input => { input.crosses[0].lifecycle.status = 'stale'; }],
  ['withdrawn lifecycle', input => { input.crosses[0].lifecycle.status = 'withdrawn'; input.crosses[0].lifecycle.withdrawnAt = '2026-08-09'; }],
  ['conflicted lifecycle', input => { input.crosses[0].lifecycle.status = 'conflicted'; input.crosses[0].lifecycle.conflictId = 'conflict-1'; }],
  ['expired lifecycle', input => { input.crosses[0].lifecycle.expiresAt = '2026-08-08T00:00:00.000Z'; }],
  ['configuration-only relationship', input => { input.crosses[0].relationship = 'configuration-only'; }],
  ['incomplete evidence', input => { input.evidence[0].status = 'incomplete'; }],
  ['unapproved review', input => { input.reviews[0].status = 'pending'; }],
  ['incomplete canonical facts', input => { input.configurations[0].normalizedFacts.material = ''; }],
  ['missing evidence reference', input => { input.evidence[0].references = []; }],
  ['review does not approve cross evidence', input => { input.reviews[0].evidenceIds = ['ev-93475a210-din125-m3-a2']; }],
];

for (const [name, mutate] of cases) {
  const input = clone(clearedPilot);
  mutate(input);
  const output = publish(input);
  assert.equal(
    output.records.some(record => record.mcmasterIdentifier === '91290A115'),
    false,
    `${name} must fail closed`,
  );
}

console.log('unpublished cross-reference projection tests passed');
