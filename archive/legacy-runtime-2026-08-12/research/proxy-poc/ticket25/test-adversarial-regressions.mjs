import assert from 'node:assert/strict';
import test from 'node:test';

import { compileProxyRequest } from './proxy-poc.mjs';
import { COMPLETE_RAW, makeFixture } from './fixtures.mjs';

function candidateFixture() {
  return makeFixture('candidate');
}

function replaceFact(rawInput, key, value) {
  return rawInput
    .split('; ')
    .map(segment => segment.startsWith(`${key}=`) ? `${key}=${value}` : segment)
    .join('; ');
}

test('manifest identity changes when released configuration content changes', () => {
  const fixture = candidateFixture();
  fixture.catalog.configurations[0].facts.material = 'stainless_steel';
  fixture.request.rawInput = replaceFact(COMPLETE_RAW, 'material', 'stainless_steel');

  const result = compileProxyRequest(fixture.request, fixture.catalog);
  assert.equal(result.kind, 'blocked');
  assert.equal(result.block.code, 'manifest_digest_mismatch');
});

test('compound thread, length, and drive-size conflicts never resolve last-wins', () => {
  for (const conflictingPrefix of [
    'thread=M4x0.7 mm',
    'length=99 mm under_head',
    'drive_size=9 mm',
  ]) {
    const fixture = candidateFixture();
    fixture.request.rawInput = `${conflictingPrefix}; ${COMPLETE_RAW}`;
    const result = compileProxyRequest(fixture.request, fixture.catalog);
    assert.equal(result.kind, 'blocked', conflictingPrefix);
    assert.equal(result.block.code, 'invalid_clue', conflictingPrefix);
  }
});

test('duplicate active manifest identity blocks before first-row selection', () => {
  const fixture = candidateFixture();
  fixture.catalog.manifests.push({
    ...structuredClone(fixture.catalog.manifests[0]),
    lifecycle: 'unavailable',
  });

  const result = compileProxyRequest(fixture.request, fixture.catalog);
  assert.equal(result.kind, 'blocked');
  assert.equal(result.block.code, 'manifest_identity_collision');
});

test('duplicate configuration identity blocks exact-identifier resolution', () => {
  const fixture = candidateFixture();
  fixture.request.identifier = {
    namespace: 'ticket25_fixture',
    value: 'T25-SHCS-M3-10',
  };
  fixture.catalog.configurations.push(structuredClone(fixture.catalog.configurations[0]));

  const result = compileProxyRequest(fixture.request, fixture.catalog);
  assert.equal(result.kind, 'blocked');
  assert.equal(result.block.code, 'configuration_identity_collision');
});

test('non-enumerable unknown catalog fields fail the exact schema boundary', () => {
  const fixture = candidateFixture();
  Object.defineProperty(fixture.catalog.configurations[0], 'sourceSku', {
    enumerable: false,
    value: 'PRIVATE-NONENUMERABLE-SENTINEL',
  });

  const result = compileProxyRequest(fixture.request, fixture.catalog);
  assert.equal(result.kind, 'blocked');
  assert.equal(result.block.code, 'invalid_catalog_schema');
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE-NONENUMERABLE-SENTINEL|sourceSku/);
});

test('hostile accessors fail closed without escaping the compiler', () => {
  const fixture = candidateFixture();
  const hostileRequest = {};
  Object.defineProperties(hostileRequest, {
    schemaVersion: { enumerable: true, value: 'ticket25/request-v1' },
    rawInput: {
      enumerable: true,
      get() {
        throw new Error('getter fired');
      },
    },
    identifier: { enumerable: true, value: null },
    manifestId: { enumerable: true, value: 'manifest-1' },
  });

  let result;
  assert.doesNotThrow(() => {
    result = compileProxyRequest(hostileRequest, fixture.catalog);
  });
  assert.equal(result.kind, 'blocked');
});

test('unknown lifecycle values fail closed even on unrelated records', () => {
  const fixture = candidateFixture();
  fixture.catalog.mappings.push({
    ...structuredClone(fixture.catalog.mappings[0]),
    id: 'map-unrelated-unknown-lifecycle',
    value: 'UNRELATED',
    lifecycle: 'MYSTERY',
  });

  const result = compileProxyRequest(fixture.request, fixture.catalog);
  assert.equal(result.kind, 'blocked');
  assert.equal(result.block.code, 'unknown_lifecycle');
});

test('whitespace-only normalized identifiers cannot become exact identity', () => {
  const fixture = candidateFixture();
  fixture.request.identifier = { namespace: 'ticket25_fixture', value: '   ' };
  fixture.catalog.mappings[0].value = '   ';

  const result = compileProxyRequest(fixture.request, fixture.catalog);
  assert.equal(result.kind, 'blocked');
  assert.equal(result.block.code, 'identifier_value_required');
});

test('blocked next action names the exact missing fact', () => {
  const fixture = candidateFixture();
  fixture.request.rawInput = COMPLETE_RAW
    .split('; ')
    .filter(segment => !segment.startsWith('material='))
    .join('; ');

  const result = compileProxyRequest(fixture.request, fixture.catalog);
  assert.equal(result.kind, 'blocked');
  assert.match(result.block.nextAction.label, /material/i);
});

test('correction fixture is append-only and preserves the prior immutable revision', () => {
  const fixture = makeFixture('corrected');
  const revisions = fixture.catalog.configurations
    .filter(configuration => configuration.id === 'cfg-m3-10')
    .map(configuration => configuration.revision);

  assert.ok(revisions.length >= 2);
  assert.ok(revisions.includes('1'));
  assert.ok(fixture.catalog.configurations.some(configuration => configuration.revision === '1' && configuration.lifecycle === 'active'));
});

test('one shared ledger carries supplied, parsed, catalog, and conflict claims', () => {
  const fixture = candidateFixture();
  const result = compileProxyRequest(fixture.request, fixture.catalog);

  assert.equal(result.kind, 'synthetic_candidate_review');
  for (const entry of result.ledger) {
    assert.ok(Array.isArray(entry.claims), entry.field);
    assert.ok(entry.claims.some(claim => claim.origin === 'supplied'), entry.field);
    assert.ok(entry.claims.some(claim => claim.origin === 'parsed'), entry.field);
    assert.ok(entry.claims.some(claim => claim.origin === 'synthetic_catalog'), entry.field);
  }
});
