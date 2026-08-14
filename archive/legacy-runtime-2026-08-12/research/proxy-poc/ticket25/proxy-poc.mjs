const REQUEST_SCHEMA = 'ticket25/request-v1';
const CATALOG_SCHEMA = 'ticket25/catalog-v1';
const RESULT_SCHEMA = 'ticket25/result-v1';
const RULE_VERSION = 'ticket25-parser-v1';
const PROFILE_ID = 'ticket25-shcs-metric-coarse-standard-internal-hex';
const PROFILE_REVISION = 'ticket25-synthetic-v1';

const FACT_FIELDS = [
  'productForm',
  'headProfile',
  'driveType',
  'threadSystem',
  'threadForm',
  'threadRole',
  'threadSeries',
  'diameter',
  'diameterUnit',
  'pitch',
  'pitchUnit',
  'threadDirection',
  'threadTolerance',
  'threadExtent',
  'length',
  'lengthUnit',
  'lengthBasis',
  'driveSize',
  'driveSizeUnit',
  'assemblyForm',
  'material',
  'finish',
  'propertyClass',
  'standardReference',
];

const FACT_KEY_MAP = Object.freeze({
  family: 'productForm',
  head_profile: 'headProfile',
  drive: 'driveType',
  thread_form: 'threadForm',
  thread_role: 'threadRole',
  thread_series: 'threadSeries',
  direction: 'threadDirection',
  tolerance: 'threadTolerance',
  thread_extent: 'threadExtent',
  assembly: 'assemblyForm',
  material: 'material',
  finish: 'finish',
  property_class: 'propertyClass',
  standard_reference: 'standardReference',
});

const PROFILE_EXPECTED = Object.freeze({
  productForm: 'socket_head_cap_screw',
  headProfile: 'standard_profile',
  driveType: 'internal_hex',
  threadSystem: 'metric',
  threadForm: 'metric_m',
  threadRole: 'external',
  threadSeries: 'coarse',
  diameterUnit: 'mm',
  pitchUnit: 'mm',
  threadDirection: 'right_hand',
  lengthUnit: 'mm',
  lengthBasis: 'under_head',
  driveSizeUnit: 'mm',
  assemblyForm: 'plain',
});

const SYNTHETIC_COARSE_PAIRS = Object.freeze({
  '3': '0.5',
  '4': '0.7',
});

const KNOWN_LIFECYCLES = new Set([
  'active',
  'rollback_active',
  'candidate_unreviewed',
  'reviewed_inactive',
  'unavailable',
  'corrected',
  'superseded',
  'withdrawn',
]);

const BLOCKS = Object.freeze({
  invalid_request_schema: ['The request shape is outside the Ticket 25 interface.', 'correct_request_schema', 'Correct the request to the declared Ticket 25 schema.'],
  invalid_catalog_schema: ['The synthetic catalog shape contains an unknown or unsafe field.', 'correct_catalog_schema', 'Remove the unapproved field at the synthetic catalog projection seam.'],
  invalid_clue: ['The supplied clue could not be parsed without guessing.', 'correct_clue_syntax', 'Express the named fact with an explicit value and unit.'],
  missing_profile_fact: ['A profile-defining fact is missing.', 'supply_missing_profile_fact', 'Supply the named profile fact from the original clue or synthetic fixture evidence.'],
  excluded_profile: ['The clue is outside the one Ticket 25 candidate profile.', 'route_neighboring_form', 'Preserve the clue for review under the correct neighboring profile.'],
  thread_semantics_conflict: ['The thread designation conflicts with the synthetic candidate profile.', 'resolve_thread_semantics', 'Confirm diameter, pitch, unit, series, and direction from the original evidence.'],
  request_catalog_conflict: ['A supplied fact conflicts with the synthetic observation.', 'resolve_named_conflict', 'Review the named supplied and synthetic claims; choose neither until corrected.'],
  no_manifest: ['No active synthetic manifest is available.', 'provide_active_manifest', 'Provide one explicit immutable synthetic manifest identity.'],
  outside_manifest: ['The request and active synthetic manifest identities differ.', 'choose_active_manifest', 'Use the identified active synthetic manifest or request a separate review.'],
  manifest_digest_mismatch: ['The synthetic manifest digest does not match its trusted fixture digest.', 'rebuild_manifest', 'Rebuild and verify the immutable synthetic manifest fixture.'],
  unknown_lifecycle: ['An unknown lifecycle value was rejected.', 'correct_lifecycle', 'Correct the lifecycle value to the closed Ticket 25 enum.'],
  lifecycle_blocked: ['The requested synthetic record is not active for new review packets.', 'review_lifecycle_delta', 'Review the correction, supersession, withdrawal, or inactive-state evidence.'],
  withdrawn: ['A current synthetic withdrawal deny blocks the record.', 'review_withdrawal', 'Inspect the withdrawal evidence before any new review packet.'],
  namespace_required: ['Identifier namespace is required.', 'supply_identifier_namespace', 'Supply the identifier namespace without guessing it.'],
  identifier_not_found: ['No active namespace-qualified synthetic mapping exists.', 'verify_identifier_mapping', 'Verify the identifier and namespace against the synthetic mapping evidence.'],
  identifier_ambiguous: ['Multiple namespace-qualified synthetic mappings remain.', 'review_identifier_collision', 'Review every colliding mapping before continuing.'],
  configuration_missing: ['The referenced synthetic observation is absent.', 'restore_configuration_evidence', 'Restore the referenced synthetic observation and its revision evidence.'],
  candidate_not_found: ['No synthetic observation agrees with every explicit clue fact.', 'review_candidate_gap', 'Review the exact clue-to-observation differences without broadening the query.'],
  candidate_ambiguous: ['Multiple synthetic observations agree with the supplied clue.', 'resolve_candidate_ambiguity', 'Add one missing discriminating fact from the original evidence.'],
  processing_unavailable: ['The bounded compiler did not complete.', 'retry_current_clue', 'Retry the current clue against the identified Ticket 25 compiler and manifest.'],
});

function isPlainDataObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  if (Object.getPrototypeOf(value) !== Object.prototype) return false;
  if (Object.getOwnPropertySymbols(value).length > 0) return false;
  return Object.values(Object.getOwnPropertyDescriptors(value)).every(descriptor => 'value' in descriptor);
}

function hasExactKeys(value, allowed, required = allowed) {
  if (!isPlainDataObject(value)) return false;
  const keys = Object.keys(value).sort();
  if (keys.some(key => !allowed.includes(key))) return false;
  return required.every(key => keys.includes(key));
}

function isFiniteDecimalString(value) {
  return typeof value === 'string' && /^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value);
}

function safeString(value, max = 2000) {
  return typeof value === 'string' && value.length > 0 && value.length <= max;
}

function normalizeDecimal(value) {
  if (!isFiniteDecimalString(value)) return null;
  const [whole, fraction = ''] = value.split('.');
  const trimmed = fraction.replace(/0+$/, '');
  return trimmed ? `${whole}.${trimmed}` : whole;
}

function cloneJson(value) {
  if (Array.isArray(value)) return value.map(cloneJson);
  if (value && typeof value === 'object') {
    const clone = {};
    for (const key of Object.keys(value)) clone[key] = cloneJson(value[key]);
    return clone;
  }
  return value;
}

export function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    const canonical = {};
    for (const key of Object.keys(value).sort()) canonical[key] = canonicalize(value[key]);
    return canonical;
  }
  return value;
}

export function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

function parseClue(rawInput) {
  const facts = {};
  const errors = [];
  const segments = rawInput.split(';').map(segment => segment.trim()).filter(Boolean);

  if (segments.length === 0) errors.push('rawInput');

  for (const segment of segments) {
    const separator = segment.indexOf('=');
    if (separator < 1) {
      errors.push(`syntax:${segment}`);
      continue;
    }

    const key = segment.slice(0, separator).trim();
    const rawValue = segment.slice(separator + 1).trim();
    if (!rawValue) {
      errors.push(`empty:${key}`);
      continue;
    }

    if (Object.hasOwn(FACT_KEY_MAP, key)) {
      const field = FACT_KEY_MAP[key];
      if (Object.hasOwn(facts, field) && facts[field] !== rawValue) errors.push(`conflict:${field}`);
      else facts[field] = rawValue;
      continue;
    }

    if (key === 'thread') {
      const match = /^M(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)\s+(mm|in)$/.exec(rawValue);
      if (!match) {
        errors.push('thread');
        continue;
      }
      facts.threadSystem = 'metric';
      facts.diameter = normalizeDecimal(match[1]);
      facts.diameterUnit = 'mm';
      facts.pitch = normalizeDecimal(match[2]);
      facts.pitchUnit = match[3];
      continue;
    }

    if (key === 'length') {
      const match = /^(\d+(?:\.\d+)?)\s+(mm|in)\s+(under_head|overall)$/.exec(rawValue);
      if (!match) {
        errors.push('length');
        continue;
      }
      facts.length = normalizeDecimal(match[1]);
      facts.lengthUnit = match[2];
      facts.lengthBasis = match[3];
      continue;
    }

    if (key === 'drive_size') {
      const match = /^(\d+(?:\.\d+)?)\s+(mm|in)$/.exec(rawValue);
      if (!match) {
        errors.push('driveSize');
        continue;
      }
      facts.driveSize = normalizeDecimal(match[1]);
      facts.driveSizeUnit = match[2];
      continue;
    }

    errors.push(`unknown:${key}`);
  }

  const ledger = FACT_FIELDS.map(field => ({
    field,
    state: Object.hasOwn(facts, field) ? 'known' : 'missing',
    origin: Object.hasOwn(facts, field) ? 'parsed' : 'none',
    value: Object.hasOwn(facts, field) ? facts[field] : null,
    ruleVersion: RULE_VERSION,
  }));

  return { facts, errors: errors.sort(), ledger };
}

function profile() {
  return {
    id: PROFILE_ID,
    revision: PROFILE_REVISION,
    authority: 'synthetic_non_authoritative',
    engineeringSelectionAllowed: false,
  };
}

function emptyIdentity() {
  return { state: 'not_requested', namespace: null, normalizedValue: null, mappingRefs: [] };
}

function manifestView(state = 'unresolved', manifest = null) {
  return {
    state,
    id: manifest?.id ?? null,
    revision: manifest?.revision ?? null,
    digest: manifest?.digest ?? null,
  };
}

function suppliedRequestView(request) {
  return {
    rawInput: typeof request?.rawInput === 'string' ? request.rawInput : '',
    identifier: request?.identifier && isPlainDataObject(request.identifier)
      ? {
          namespace: typeof request.identifier.namespace === 'string' ? request.identifier.namespace : null,
          value: typeof request.identifier.value === 'string' ? request.identifier.value : null,
        }
      : null,
    manifestId: typeof request?.manifestId === 'string' ? request.manifestId : null,
  };
}

function blocked(code, request, ledger = [], identity = emptyIdentity(), manifest = manifestView()) {
  const [reason, actionCode, actionLabel] = BLOCKS[code] ?? BLOCKS.processing_unavailable;
  return deepFreeze({
    schemaVersion: RESULT_SCHEMA,
    kind: 'blocked',
    profile: profile(),
    suppliedRequest: suppliedRequestView(request),
    ledger: cloneJson(ledger),
    identity: cloneJson(identity),
    manifest: cloneJson(manifest),
    block: {
      code,
      reason,
      nextAction: { code: actionCode, label: actionLabel },
    },
    selectionState: 'blocked',
    handoffState: 'prohibited',
    actions: [],
  });
}

function validateRequest(request) {
  if (!hasExactKeys(request, ['schemaVersion', 'rawInput', 'identifier', 'manifestId'])) return false;
  if (request.schemaVersion !== REQUEST_SCHEMA || !safeString(request.rawInput)) return false;
  if (request.manifestId !== null && !safeString(request.manifestId, 120)) return false;
  if (request.identifier === null) return true;
  return hasExactKeys(request.identifier, ['namespace', 'value'])
    && typeof request.identifier.namespace === 'string'
    && request.identifier.namespace.length <= 80
    && safeString(request.identifier.value, 200);
}

function validateCatalog(catalog) {
  if (!hasExactKeys(catalog, ['schemaVersion', 'activeManifestId', 'manifests', 'configurations', 'mappings', 'withdrawals'])) return false;
  if (catalog.schemaVersion !== CATALOG_SCHEMA) return false;
  if (catalog.activeManifestId !== null && !safeString(catalog.activeManifestId, 120)) return false;
  if (!Array.isArray(catalog.manifests) || !Array.isArray(catalog.configurations) || !Array.isArray(catalog.mappings) || !Array.isArray(catalog.withdrawals)) return false;

  for (const manifest of catalog.manifests) {
    if (!hasExactKeys(manifest, ['id', 'revision', 'digest', 'expectedDigest', 'lifecycle'])) return false;
    if (![manifest.id, manifest.revision, manifest.digest, manifest.expectedDigest, manifest.lifecycle].every(value => safeString(value, 200))) return false;
  }

  for (const configuration of catalog.configurations) {
    if (!hasExactKeys(configuration, ['id', 'revision', 'manifestId', 'lifecycle', 'profileId', 'facts'])) return false;
    if (![configuration.id, configuration.revision, configuration.manifestId, configuration.lifecycle, configuration.profileId].every(value => safeString(value, 200))) return false;
    if (!hasExactKeys(configuration.facts, FACT_FIELDS)) return false;
    if (!FACT_FIELDS.every(field => safeString(configuration.facts[field], 500))) return false;
  }

  for (const mapping of catalog.mappings) {
    if (!hasExactKeys(mapping, ['id', 'revision', 'manifestId', 'lifecycle', 'namespace', 'value', 'configurationId', 'configurationRevision'])) return false;
    if (!Object.values(mapping).every(value => safeString(value, 500))) return false;
  }

  for (const withdrawal of catalog.withdrawals) {
    if (!hasExactKeys(withdrawal, ['targetType', 'targetId', 'reasonCode'])) return false;
    if (!['manifest', 'mapping', 'configuration'].includes(withdrawal.targetType)) return false;
    if (!safeString(withdrawal.targetId, 200) || !safeString(withdrawal.reasonCode, 200)) return false;
  }

  return true;
}

function lifecycleKnown(value) {
  return KNOWN_LIFECYCLES.has(value);
}

function hasWithdrawal(catalog, targetType, targetId) {
  return catalog.withdrawals.some(withdrawal => withdrawal.targetType === targetType && withdrawal.targetId === targetId);
}

function requestProfileFailure(facts) {
  for (const [field, expected] of Object.entries(PROFILE_EXPECTED)) {
    if (!Object.hasOwn(facts, field)) return 'missing_profile_fact';
    if (facts[field] !== expected) {
      if (field.startsWith('thread') || field === 'diameterUnit' || field === 'pitchUnit') return 'thread_semantics_conflict';
      return 'excluded_profile';
    }
  }

  for (const field of FACT_FIELDS) {
    if (!Object.hasOwn(facts, field)) return 'missing_profile_fact';
  }

  if (SYNTHETIC_COARSE_PAIRS[facts.diameter] !== facts.pitch) return 'thread_semantics_conflict';
  return null;
}

function configurationFailure(configuration) {
  if (configuration.profileId !== PROFILE_ID) return 'excluded_profile';
  for (const [field, expected] of Object.entries(PROFILE_EXPECTED)) {
    if (configuration.facts[field] !== expected) return field.startsWith('thread') ? 'thread_semantics_conflict' : 'excluded_profile';
  }
  if (SYNTHETIC_COARSE_PAIRS[configuration.facts.diameter] !== configuration.facts.pitch) return 'thread_semantics_conflict';
  return null;
}

function factsAgree(requestFacts, configurationFacts) {
  return FACT_FIELDS.every(field => requestFacts[field] === configurationFacts[field]);
}

function resolveManifest(request, catalog, ledger) {
  if (!catalog.activeManifestId) return { result: blocked('no_manifest', request, ledger) };
  const manifest = catalog.manifests.find(candidate => candidate.id === catalog.activeManifestId);
  if (!manifest) return { result: blocked('no_manifest', request, ledger) };
  const view = manifestView('resolved', manifest);
  if (!lifecycleKnown(manifest.lifecycle)) return { result: blocked('unknown_lifecycle', request, ledger, emptyIdentity(), view) };
  if (manifest.digest !== manifest.expectedDigest) return { result: blocked('manifest_digest_mismatch', request, ledger, emptyIdentity(), view) };
  if (request.manifestId && request.manifestId !== manifest.id) return { result: blocked('outside_manifest', request, ledger, emptyIdentity(), view) };
  if (hasWithdrawal(catalog, 'manifest', manifest.id)) return { result: blocked('withdrawn', request, ledger, emptyIdentity(), view) };
  if (!['active', 'rollback_active'].includes(manifest.lifecycle)) return { result: blocked('lifecycle_blocked', request, ledger, emptyIdentity(), view) };
  return { manifest, view };
}

function resolveIdentity(request, catalog, manifest, ledger) {
  if (!request.identifier) return { identity: emptyIdentity(), configurations: null };
  const namespace = request.identifier.namespace.trim();
  const normalizedValue = request.identifier.value.trim();
  if (!namespace) return { result: blocked('namespace_required', request, ledger) };

  const matching = catalog.mappings
    .filter(mapping => mapping.namespace === namespace && mapping.value.trim() === normalizedValue && mapping.manifestId === manifest.id)
    .sort((a, b) => a.id.localeCompare(b.id, 'en'));

  const identity = {
    state: matching.length === 0 ? 'zero' : matching.length === 1 ? 'one' : 'many',
    namespace,
    normalizedValue,
    mappingRefs: matching.map(mapping => mapping.id),
  };

  if (matching.length === 0) return { result: blocked('identifier_not_found', request, ledger, identity, manifestView('resolved', manifest)) };
  if (matching.length > 1) return { result: blocked('identifier_ambiguous', request, ledger, identity, manifestView('resolved', manifest)) };

  const mapping = matching[0];
  if (!lifecycleKnown(mapping.lifecycle)) return { result: blocked('unknown_lifecycle', request, ledger, identity, manifestView('resolved', manifest)) };
  if (mapping.lifecycle !== 'active') return { result: blocked('lifecycle_blocked', request, ledger, identity, manifestView('resolved', manifest)) };
  if (hasWithdrawal(catalog, 'mapping', mapping.id)) return { result: blocked('withdrawn', request, ledger, identity, manifestView('resolved', manifest)) };

  const configuration = catalog.configurations.find(candidate => candidate.id === mapping.configurationId && candidate.revision === mapping.configurationRevision);
  if (!configuration) return { result: blocked('configuration_missing', request, ledger, identity, manifestView('resolved', manifest)) };
  return { identity, configurations: [configuration] };
}

function candidatePacket(request, parsed, identity, manifest, configurations) {
  const configuration = configurations[0];
  const facts = FACT_FIELDS.map(field => ({
    field,
    value: configuration.facts[field],
    requestState: parsed.facts[field] === undefined ? 'not_supplied' : 'known',
    catalogState: 'known',
    comparison: parsed.facts[field] === undefined ? 'not_compared' : parsed.facts[field] === configuration.facts[field] ? 'agrees' : 'conflict',
    requestOrigin: parsed.facts[field] === undefined ? 'none' : 'parsed',
    catalogOrigin: 'synthetic_catalog',
    ruleVersion: RULE_VERSION,
  }));

  return deepFreeze({
    schemaVersion: RESULT_SCHEMA,
    kind: 'synthetic_candidate_review',
    profile: profile(),
    suppliedRequest: suppliedRequestView(request),
    ledger: cloneJson(parsed.ledger),
    identity: cloneJson(identity),
    manifest: manifestView('synthetic_active', manifest),
    packet: {
      packetClass: 'research_only',
      observationState: 'synthetic_candidate_review',
      observationCount: configurations.length,
      profileId: PROFILE_ID,
      profileRevision: PROFILE_REVISION,
      facts,
      syntheticManifest: {
        id: manifest.id,
        revision: manifest.revision,
        digest: manifest.digest,
      },
      disclaimer: 'Synthetic proxy observation for review only. No engineering selection or public release.',
    },
    selectionState: 'candidate_review',
    handoffState: 'prohibited',
    excludedClaims: [
      'unique_engineering_selection',
      'verified',
      'approved',
      'equivalent',
      'suitable',
      'bom_ready',
      'orderable',
      'stock',
      'price',
      'availability',
    ],
    actions: [],
  });
}

export function compileProxyRequest(request, catalog) {
  try {
    if (!validateRequest(request)) return blocked('invalid_request_schema', request);
    const parsed = parseClue(request.rawInput);
    if (!validateCatalog(catalog)) return blocked('invalid_catalog_schema', request, parsed.ledger);
    if (parsed.errors.length > 0) return blocked('invalid_clue', request, parsed.ledger);

    const profileFailure = requestProfileFailure(parsed.facts);
    if (profileFailure) return blocked(profileFailure, request, parsed.ledger);

    const manifestResolution = resolveManifest(request, catalog, parsed.ledger);
    if (manifestResolution.result) return manifestResolution.result;
    const { manifest, view } = manifestResolution;

    const identityResolution = resolveIdentity(request, catalog, manifest, parsed.ledger);
    if (identityResolution.result) return identityResolution.result;
    const identity = identityResolution.identity;

    let configurations = identityResolution.configurations
      ?? catalog.configurations.filter(configuration => configuration.manifestId === manifest.id && factsAgree(parsed.facts, configuration.facts));

    configurations = configurations.slice().sort((a, b) => `${a.id}@${a.revision}`.localeCompare(`${b.id}@${b.revision}`, 'en'));

    if (configurations.length === 0) return blocked('candidate_not_found', request, parsed.ledger, identity, view);
    if (configurations.length > 1) return blocked('candidate_ambiguous', request, parsed.ledger, identity, view);

    const configuration = configurations[0];
    if (!lifecycleKnown(configuration.lifecycle)) return blocked('unknown_lifecycle', request, parsed.ledger, identity, view);
    if (configuration.lifecycle !== 'active') return blocked('lifecycle_blocked', request, parsed.ledger, identity, view);
    if (configuration.manifestId !== manifest.id) return blocked('outside_manifest', request, parsed.ledger, identity, view);
    if (hasWithdrawal(catalog, 'configuration', configuration.id)) return blocked('withdrawn', request, parsed.ledger, identity, view);

    const candidateFailure = configurationFailure(configuration);
    if (candidateFailure) return blocked(candidateFailure, request, parsed.ledger, identity, view);

    if (!factsAgree(parsed.facts, configuration.facts)) return blocked('request_catalog_conflict', request, parsed.ledger, identity, view);

    return candidatePacket(request, parsed, identity, manifest, configurations);
  } catch {
    return blocked('processing_unavailable', request);
  }
}

export const TICKET25_CONSTANTS = deepFreeze({
  requestSchema: REQUEST_SCHEMA,
  catalogSchema: CATALOG_SCHEMA,
  resultSchema: RESULT_SCHEMA,
  ruleVersion: RULE_VERSION,
  profileId: PROFILE_ID,
  profileRevision: PROFILE_REVISION,
  factFields: FACT_FIELDS.slice(),
});
