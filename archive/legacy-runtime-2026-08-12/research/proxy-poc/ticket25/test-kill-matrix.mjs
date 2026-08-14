import assert from 'node:assert/strict';
import test from 'node:test';

import {
  canonicalJson,
  compileProxyRequest,
} from './proxy-poc.mjs';

const COMPLETE_RAW = [
  'family=socket_head_cap_screw',
  'head_profile=standard_profile',
  'drive=internal_hex',
  'thread=M3x0.5 mm',
  'thread_form=metric_m',
  'thread_role=external',
  'thread_series=coarse',
  'direction=right_hand',
  'tolerance=6g',
  'thread_extent=full',
  'length=10 mm under_head',
  'drive_size=2.5 mm',
  'assembly=plain',
  'material=alloy_steel',
  'finish=black_oxide',
  'property_class=12.9',
  'standard_reference=ISO 4762',
].join('; ');

function activeCatalog() {
  return {
    schemaVersion: 'ticket25/catalog-v1',
    activeManifestId: 'manifest-1',
    manifests: [{
      id: 'manifest-1',
      revision: '1',
      digest: 'sha256:ticket25-manifest-1',
      expectedDigest: 'sha256:ticket25-manifest-1',
      lifecycle: 'active',
    }],
    configurations: [{
      id: 'cfg-m3-10',
      revision: '1',
      manifestId: 'manifest-1',
      lifecycle: 'active',
      profileId: 'ticket25-shcs-metric-coarse-standard-internal-hex',
      facts: {
        productForm: 'socket_head_cap_screw',
        headProfile: 'standard_profile',
        driveType: 'internal_hex',
        threadSystem: 'metric',
        threadForm: 'metric_m',
        threadRole: 'external',
        threadSeries: 'coarse',
        diameter: '3',
        diameterUnit: 'mm',
        pitch: '0.5',
        pitchUnit: 'mm',
        threadDirection: 'right_hand',
        threadTolerance: '6g',
        threadExtent: 'full',
        length: '10',
        lengthUnit: 'mm',
        lengthBasis: 'under_head',
        driveSize: '2.5',
        driveSizeUnit: 'mm',
        assemblyForm: 'plain',
        material: 'alloy_steel',
        finish: 'black_oxide',
        propertyClass: '12.9',
        standardReference: 'ISO 4762',
      },
    }],
    mappings: [{
      id: 'map-ticket25-1',
      revision: '1',
      manifestId: 'manifest-1',
      lifecycle: 'active',
      namespace: 'ticket25_fixture',
      value: 'T25-SHCS-M3-10',
      configurationId: 'cfg-m3-10',
      configurationRevision: '1',
    }],
    withdrawals: [],
  };
}

function completeRequest() {
  return {
    schemaVersion: 'ticket25/request-v1',
    rawInput: COMPLETE_RAW,
    identifier: null,
    manifestId: 'manifest-1',
  };
}

function clone(value) {
  return structuredClone(value);
}

function replaceFact(rawInput, key, value) {
  return rawInput
    .split('; ')
    .map(segment => segment.startsWith(`${key}=`) ? `${key}=${value}` : segment)
    .join('; ');
}

function removeFact(rawInput, key) {
  return rawInput
    .split('; ')
    .filter(segment => !segment.startsWith(`${key}=`))
    .join('; ');
}

function assertBlocked(result, code) {
  assert.equal(result.kind, 'blocked');
  assert.equal(result.block.code, code);
  assert.equal(result.selectionState, 'blocked');
  assert.equal(result.handoffState, 'prohibited');
  assert.deepEqual(result.actions, []);
  assert.equal(typeof result.block.nextAction.code, 'string');
  assert.equal(typeof result.block.nextAction.label, 'string');
  assert.ok(result.block.nextAction.code.length > 0);
  assert.ok(result.block.nextAction.label.length > 0);
}

function assertDeepFrozen(value, seen = new Set()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) assertDeepFrozen(child, seen);
}

test('complete explicit clue yields one frozen synthetic candidate-review packet with no actions', () => {
  const result = compileProxyRequest(completeRequest(), activeCatalog());

  assert.equal(result.kind, 'synthetic_candidate_review');
  assert.equal(result.selectionState, 'candidate_review');
  assert.equal(result.handoffState, 'prohibited');
  assert.deepEqual(result.actions, []);
  assert.equal(result.packet.observationCount, 1);
  assert.match(result.packet.disclaimer, /synthetic/i);
  assert.doesNotMatch(canonicalJson(result), /supplier|https?:\/\//i);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.packet), true);
  assert.equal(Object.isFrozen(result.packet.facts), true);
});

test('every omitted critical clue field blocks instead of defaulting', () => {
  const keys = [
    'family', 'head_profile', 'drive', 'thread', 'thread_form', 'thread_role',
    'thread_series', 'direction', 'tolerance', 'thread_extent', 'length',
    'drive_size', 'assembly', 'material', 'finish', 'property_class',
    'standard_reference',
  ];

  for (const key of keys) {
    const request = completeRequest();
    request.rawInput = removeFact(request.rawInput, key);
    assertBlocked(compileProxyRequest(request, activeCatalog()), 'missing_profile_fact');
  }
});

test('neighboring fastener forms are deterministic negative controls', () => {
  const mutations = [
    ['family', 'set_screw'],
    ['head_profile', 'pan'],
    ['head_profile', 'button'],
    ['head_profile', 'low'],
    ['head_profile', 'flat_countersunk'],
    ['drive', 'external_hex'],
    ['assembly', 'shoulder'],
    ['assembly', 'captive_washer'],
  ];

  for (const [key, value] of mutations) {
    const request = completeRequest();
    request.rawInput = replaceFact(request.rawInput, key, value);
    assertBlocked(compileProxyRequest(request, activeCatalog()), 'excluded_profile');
  }
});

test('wrong units, pitch, series, role, and direction block thread semantics', () => {
  const mutations = [
    ['thread', 'M3x0.5 in'],
    ['thread', 'M3x0.7 mm'],
    ['thread_series', 'fine'],
    ['thread_role', 'internal'],
    ['direction', 'left_hand'],
  ];

  for (const [key, value] of mutations) {
    const request = completeRequest();
    request.rawInput = replaceFact(request.rawInput, key, value);
    assertBlocked(compileProxyRequest(request, activeCatalog()), 'thread_semantics_conflict');
  }
});

test('conflicting repeated claims select neither side', () => {
  const request = completeRequest();
  request.rawInput += '; direction=left_hand';
  assertBlocked(compileProxyRequest(request, activeCatalog()), 'invalid_clue');
});

test('identifier mapping preserves explicit zero, one, and many cardinality', () => {
  const oneRequest = completeRequest();
  oneRequest.identifier = { namespace: 'ticket25_fixture', value: 'T25-SHCS-M3-10' };
  const one = compileProxyRequest(oneRequest, activeCatalog());
  assert.equal(one.kind, 'synthetic_candidate_review');
  assert.equal(one.identity.state, 'one');
  assert.equal(one.selectionState, 'candidate_review');

  const zeroRequest = clone(oneRequest);
  zeroRequest.identifier.value = 'UNKNOWN';
  assertBlocked(compileProxyRequest(zeroRequest, activeCatalog()), 'identifier_not_found');

  const manyCatalog = activeCatalog();
  manyCatalog.mappings.push({
    ...clone(manyCatalog.mappings[0]),
    id: 'map-ticket25-2',
    configurationId: 'cfg-other',
  });
  const many = compileProxyRequest(oneRequest, manyCatalog);
  assertBlocked(many, 'identifier_ambiguous');
  assert.deepEqual(many.identity.mappingRefs, ['map-ticket25-1', 'map-ticket25-2']);
});

test('missing identifier namespace blocks without guessing', () => {
  const request = completeRequest();
  request.identifier = { namespace: '', value: 'T25-SHCS-M3-10' };
  assertBlocked(compileProxyRequest(request, activeCatalog()), 'namespace_required');
});

test('critical synthetic fact deletion cannot survive exact identifier resolution', () => {
  const request = completeRequest();
  request.identifier = { namespace: 'ticket25_fixture', value: 'T25-SHCS-M3-10' };

  for (const field of Object.keys(activeCatalog().configurations[0].facts)) {
    const catalog = activeCatalog();
    delete catalog.configurations[0].facts[field];
    assertBlocked(compileProxyRequest(request, catalog), 'invalid_catalog_schema');
  }
});

test('complete-looking duplicate observations never become false unique', () => {
  const catalog = activeCatalog();
  catalog.configurations.push({
    ...clone(catalog.configurations[0]),
    id: 'cfg-m3-10-duplicate',
  });
  assertBlocked(compileProxyRequest(completeRequest(), catalog), 'candidate_ambiguous');
});

test('manifest absence, mismatch, unavailable state, and wrong requested manifest block', () => {
  const absent = activeCatalog();
  absent.activeManifestId = null;
  assertBlocked(compileProxyRequest(completeRequest(), absent), 'no_manifest');

  const mismatch = activeCatalog();
  mismatch.manifests[0].digest = 'sha256:mutated';
  assertBlocked(compileProxyRequest(completeRequest(), mismatch), 'manifest_digest_mismatch');

  const unavailable = activeCatalog();
  unavailable.manifests[0].lifecycle = 'unavailable';
  assertBlocked(compileProxyRequest(completeRequest(), unavailable), 'lifecycle_blocked');

  const wrongRequest = completeRequest();
  wrongRequest.manifestId = 'manifest-404';
  assertBlocked(compileProxyRequest(wrongRequest, activeCatalog()), 'outside_manifest');
});

test('unknown lifecycle values fail closed at every release seam', () => {
  const manifestCatalog = activeCatalog();
  manifestCatalog.manifests[0].lifecycle = 'ACTIVE';
  assertBlocked(compileProxyRequest(completeRequest(), manifestCatalog), 'unknown_lifecycle');

  const configurationCatalog = activeCatalog();
  configurationCatalog.configurations[0].lifecycle = 'mystery';
  assertBlocked(compileProxyRequest(completeRequest(), configurationCatalog), 'unknown_lifecycle');

  const mappingCatalog = activeCatalog();
  mappingCatalog.mappings[0].lifecycle = 'mystery';
  const request = completeRequest();
  request.identifier = { namespace: 'ticket25_fixture', value: 'T25-SHCS-M3-10' };
  assertBlocked(compileProxyRequest(request, mappingCatalog), 'unknown_lifecycle');
});

test('correction, supersession, and withdrawal block new packets', () => {
  for (const lifecycle of ['corrected', 'superseded', 'withdrawn']) {
    const catalog = activeCatalog();
    catalog.configurations[0].lifecycle = lifecycle;
    assertBlocked(compileProxyRequest(completeRequest(), catalog), 'lifecycle_blocked');
  }

  const withdrawn = activeCatalog();
  withdrawn.withdrawals.push({
    targetType: 'configuration',
    targetId: 'cfg-m3-10',
    reasonCode: 'fixture-correction-required',
  });
  assertBlocked(compileProxyRequest(completeRequest(), withdrawn), 'withdrawn');
});

test('rollback can point to an immutable manifest but cannot revive a withdrawn record', () => {
  const rollback = activeCatalog();
  rollback.manifests[0].lifecycle = 'rollback_active';
  const packet = compileProxyRequest(completeRequest(), rollback);
  assert.equal(packet.kind, 'synthetic_candidate_review');

  rollback.withdrawals.push({
    targetType: 'configuration',
    targetId: 'cfg-m3-10',
    reasonCode: 'current-withdrawal-deny',
  });
  assertBlocked(compileProxyRequest(completeRequest(), rollback), 'withdrawn');
});

test('old packet bytes stay stable after correction and caller mutation', () => {
  const request = completeRequest();
  const catalog = activeCatalog();
  const packet = compileProxyRequest(request, catalog);
  const before = canonicalJson(packet);

  request.rawInput = 'mutated';
  catalog.configurations[0].facts.pitch = '9';
  catalog.configurations[0].lifecycle = 'corrected';

  assert.equal(canonicalJson(packet), before);
  assertDeepFrozen(packet);
});

test('catalog row order and repeated compilation are byte-deterministic', () => {
  const request = completeRequest();
  const catalog = activeCatalog();
  catalog.configurations.unshift({
    ...clone(catalog.configurations[0]),
    id: 'cfg-unrelated',
    facts: { ...clone(catalog.configurations[0].facts), length: '20' },
  });
  const first = canonicalJson(compileProxyRequest(request, catalog));
  catalog.configurations.reverse();
  const second = canonicalJson(compileProxyRequest(request, catalog));
  const third = canonicalJson(compileProxyRequest(request, catalog));
  assert.equal(first, second);
  assert.equal(second, third);
});

test('unknown or private catalog fields block at projection and never leak', () => {
  const catalog = activeCatalog();
  catalog.configurations[0].sourceSku = 'PRIVATE-SENTINEL-9371';
  const result = compileProxyRequest(completeRequest(), catalog);
  assertBlocked(result, 'invalid_catalog_schema');
  assert.doesNotMatch(canonicalJson(result), /PRIVATE-SENTINEL-9371|sourceSku/);
});

test('request schema rejects extra keys instead of silently accepting them', () => {
  const request = { ...completeRequest(), futureField: 'unsafe' };
  assertBlocked(compileProxyRequest(request, activeCatalog()), 'invalid_request_schema');
});

test('every terminal result uses an exact browser-safe top-level allowlist', () => {
  const packet = compileProxyRequest(completeRequest(), activeCatalog());
  assert.deepEqual(Object.keys(packet).sort(), [
    'actions', 'excludedClaims', 'handoffState', 'identity', 'kind', 'ledger',
    'manifest', 'packet', 'profile', 'schemaVersion', 'selectionState',
    'suppliedRequest',
  ]);

  const request = completeRequest();
  request.rawInput = removeFact(request.rawInput, 'length');
  const blockedResult = compileProxyRequest(request, activeCatalog());
  assert.deepEqual(Object.keys(blockedResult).sort(), [
    'actions', 'block', 'handoffState', 'identity', 'kind', 'ledger',
    'manifest', 'profile', 'schemaVersion', 'selectionState', 'suppliedRequest',
  ]);
});

test('all deterministic blocked fixtures have exactly one precise next action and zero handoff actions', () => {
  const fixtures = [];
  const partial = completeRequest();
  partial.rawInput = removeFact(partial.rawInput, 'material');
  fixtures.push([partial, activeCatalog()]);

  const collisionRequest = completeRequest();
  collisionRequest.identifier = { namespace: 'ticket25_fixture', value: 'T25-SHCS-M3-10' };
  const collisionCatalog = activeCatalog();
  collisionCatalog.mappings.push({ ...clone(collisionCatalog.mappings[0]), id: 'map-collision' });
  fixtures.push([collisionRequest, collisionCatalog]);

  const unavailable = activeCatalog();
  unavailable.manifests[0].lifecycle = 'unavailable';
  fixtures.push([completeRequest(), unavailable]);

  const withdrawn = activeCatalog();
  withdrawn.withdrawals.push({ targetType: 'manifest', targetId: 'manifest-1', reasonCode: 'deny' });
  fixtures.push([completeRequest(), withdrawn]);

  for (const [request, catalog] of fixtures) {
    const result = compileProxyRequest(request, catalog);
    assert.equal(result.kind, 'blocked');
    assert.deepEqual(result.actions, []);
    assert.deepEqual(Object.keys(result.block.nextAction).sort(), ['code', 'label']);
    assert.ok(result.block.nextAction.label.split(' ').length >= 5);
  }
});
