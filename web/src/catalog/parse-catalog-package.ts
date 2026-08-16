import {
  CATALOG_PACKAGE_SCHEMA_VERSION,
  type CatalogPackage,
  type CatalogLifecycleStatus,
  type FactDefinition,
  type FactPrimitive,
  type FactState,
  type TrustedCatalogApproval,
  catalogPackageDigest,
} from './contracts';

type ObjectValue = Record<string, unknown>;

const PACKAGE_KEYS = [
  'schemaVersion', 'manifest', 'hierarchy', 'families', 'familySchemaRevisions',
  'factDefinitions', 'facets', 'configurations', 'configurationRevisions',
  'identifierNamespaces', 'identifierMappings', 'provenance', 'lexicon',
] as const;
const FACT_STATES: readonly FactState[] = ['known', 'not_supplied', 'unknown', 'not_applicable', 'conflicting'];
const ID_PATTERN = /^[a-z][a-z0-9._:-]*$/;
const FINAL_DIGEST_PATTERN = /^sha256:[a-f0-9]{64}$/;
const PENDING_DIGEST_PATTERN = /^sha256:pending:[a-z0-9][a-z0-9.-]*$/;
const ISO_UTC_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const FORBIDDEN_UNICODE_PATTERN = /[\u0000-\u001f\u007f-\u009f\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/u;
const PROHIBITED_DISPLAY_CLAIM_PATTERN = /\b(?:certified|verified|equivalent|approved\s+(?:alternate\s+)?(?:equivalent|replacement)|alternate\s+equivalent|suppliers?|prices?|stock|availability|lead[\s-]*time)\b/iu;
const MAX_PACKAGE_BYTES = 2_000_000;
const MAX_PACKAGE_ROWS = 25_000;
const MAX_ARRAY_ITEMS = 10_000;
const MAX_STRING_LENGTH = 512;

export class CatalogPackageValidationError extends Error {
  constructor(readonly path: string, message: string) {
    super(`${path}: ${message}`);
    this.name = 'CatalogPackageValidationError';
  }
}

function fail(path: string, message: string): never {
  throw new CatalogPackageValidationError(path, message);
}

function assertInputBudget(input: unknown): void {
  const active = new WeakSet<object>();
  let nodes = 0;
  const visit = (value: unknown, path: string, depth: number): void => {
    if (++nodes > 100_000) fail('$', 'package exceeds structural node budget');
    if (depth > 16) fail(path, 'package exceeds maximum nesting depth');
    if (typeof value === 'string') {
      stringAt(value, path, false);
      return;
    }
    if (value === null || typeof value === 'boolean') return;
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) fail(path, 'non-finite numbers are forbidden');
      return;
    }
    if (typeof value !== 'object') fail(path, `non-JSON ${typeof value} value is forbidden`);
    if (active.has(value)) fail(path, 'cyclic package input is forbidden');
    active.add(value);
    if (Array.isArray(value)) {
      if (value.length > MAX_ARRAY_ITEMS) fail(path, `expected at most ${MAX_ARRAY_ITEMS} item(s)`);
      value.forEach((child, index) => visit(child, `${path}[${index}]`, depth + 1));
      active.delete(value);
      return;
    }
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) fail(path, 'expected plain object');
    const descriptors = Object.getOwnPropertyDescriptors(value);
    if (Object.keys(descriptors).length > 64) fail(path, 'object exceeds field-count budget');
    for (const [key, descriptor] of Object.entries(descriptors)) {
      if (descriptor.get || descriptor.set) fail(`${path}.${key}`, 'accessor fields are forbidden');
      visit(descriptor.value, `${path}.${key}`, depth + 1);
    }
    active.delete(value);
  };
  visit(input, '$', 0);
  const serialized = JSON.stringify(input);
  if (serialized === undefined) fail('$', 'expected JSON package input');
  if (new TextEncoder().encode(serialized).byteLength > MAX_PACKAGE_BYTES) {
    fail('$', `package exceeds ${MAX_PACKAGE_BYTES} UTF-8 bytes`);
  }
}

function objectAt(value: unknown, path: string, keys: readonly string[]): ObjectValue {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) fail(path, 'expected object');
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) fail(path, 'expected plain object');
  const ownKeys = Reflect.ownKeys(value);
  if (ownKeys.some(key => typeof key !== 'string')) fail(path, 'symbol fields are not allowed');
  const strings = ownKeys as string[];
  const unknown = strings.filter(key => !keys.includes(key));
  if (unknown.length) fail(path, `unknown field(s): ${unknown.join(', ')}`);
  const missing = keys.filter(key => !strings.includes(key));
  if (missing.length) fail(path, `missing field(s): ${missing.join(', ')}`);
  return value as ObjectValue;
}

function arrayAt(value: unknown, path: string, minimum = 0, maximum = MAX_ARRAY_ITEMS): unknown[] {
  if (!Array.isArray(value)) fail(path, 'expected array');
  const namedKeys = Object.keys(value).filter(key => !/^\d+$/.test(key));
  if (namedKeys.length) fail(path, `unknown array field(s): ${namedKeys.join(', ')}`);
  if (value.length < minimum) fail(path, `expected at least ${minimum} item(s)`);
  if (value.length > maximum) fail(path, `expected at most ${maximum} item(s)`);
  return value;
}

function stringAt(value: unknown, path: string, nonempty = true, maximum = MAX_STRING_LENGTH): string {
  if (typeof value !== 'string' || (nonempty && !value.trim())) fail(path, 'expected non-empty string');
  if (value.length > maximum) fail(path, `string exceeds ${maximum} characters`);
  if (FORBIDDEN_UNICODE_PATTERN.test(value)) fail(path, 'Unicode control or bidirectional formatting characters are forbidden');
  return value;
}

function displayStringAt(value: unknown, path: string, maximum = 160): string {
  const text = stringAt(value, path, true, maximum);
  if (PROHIBITED_DISPLAY_CLAIM_PATTERN.test(text)) fail(path, 'prohibited claim-bearing display text');
  return text;
}

function isoTimestampAt(value: unknown, path: string): string {
  const timestamp = stringAt(value, path, true, 24);
  const parsed = Date.parse(timestamp);
  if (!ISO_UTC_PATTERN.test(timestamp) || Number.isNaN(parsed) || new Date(parsed).toISOString() !== timestamp) {
    fail(path, 'expected a real ISO-8601 UTC calendar timestamp');
  }
  return timestamp;
}

function idAt(value: unknown, path: string): string {
  const valueString = stringAt(value, path);
  if (!ID_PATTERN.test(valueString)) fail(path, 'expected a lowercase stable ID');
  return valueString;
}

function numberAt(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) fail(path, 'expected finite number');
  return value;
}

function integerAt(value: unknown, path: string, minimum = 0): number {
  const numeric = numberAt(value, path);
  if (!Number.isInteger(numeric) || numeric < minimum) fail(path, `expected integer >= ${minimum}`);
  return numeric;
}

function literalAt<T extends string>(value: unknown, path: string, values: readonly T[]): T {
  if (typeof value !== 'string' || !values.includes(value as T)) fail(path, `expected one of: ${values.join(', ')}`);
  return value as T;
}

function nullableStringAt(value: unknown, path: string): string | null {
  return value === null ? null : stringAt(value, path);
}

function nullableIdAt(value: unknown, path: string): string | null {
  return value === null ? null : idAt(value, path);
}

function nullableNumberAt(value: unknown, path: string): number | null {
  return value === null ? null : numberAt(value, path);
}

function validateLifecycle(value: unknown, path: string): ObjectValue {
  const row = objectAt(value, path, ['status', 'effectiveAt', 'reason', 'correctsId', 'supersededById']);
  const status = literalAt<CatalogLifecycleStatus>(row.status, `${path}.status`, ['active', 'corrected', 'superseded', 'withdrawn']);
  isoTimestampAt(row.effectiveAt, `${path}.effectiveAt`);
  const reason = row.reason === null ? null : displayStringAt(row.reason, `${path}.reason`, 240);
  const correctsId = nullableIdAt(row.correctsId, `${path}.correctsId`);
  const supersededById = nullableIdAt(row.supersededById, `${path}.supersededById`);
  if (status === 'active' && (reason !== null || correctsId !== null || supersededById !== null)) fail(path, 'active lifecycle cannot carry correction, supersession, or withdrawal metadata');
  if (status === 'corrected' && (reason === null || correctsId === null || supersededById !== null)) fail(path, 'corrected lifecycle requires reason and correctsId only');
  if (status === 'superseded' && (reason === null || correctsId !== null || supersededById === null)) fail(path, 'superseded lifecycle requires reason and supersededById only');
  if (status === 'withdrawn' && (reason === null || correctsId !== null || supersededById !== null)) fail(path, 'withdrawn lifecycle requires a reason only');
  return row;
}

function primitiveAt(value: unknown, path: string): FactPrimitive {
  if (typeof value === 'string') return stringAt(value, path);
  return numberAt(value, path);
}

function unique(values: readonly string[], path: string): void {
  if (new Set(values).size !== values.length) fail(path, 'duplicate values are not allowed');
}

function sameMembers(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every(value => right.includes(value));
}

function normalizeIdentifier(value: string, namespace: ObjectValue): string {
  let normalized = value;
  if (namespace.unicodePolicy === 'NFKC') normalized = normalized.normalize('NFKC');
  if (namespace.trimPolicy === 'trim') normalized = normalized.trim();
  if (namespace.casePolicy === 'upper') normalized = normalized.toUpperCase();
  return normalized;
}

function normalizeLexiconTerm(value: string): string {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');
}

function valueKey(value: FactPrimitive): string {
  return `${typeof value}:${String(value)}`;
}

function assertAllowedPrimitive(value: FactPrimitive, definition: FactDefinition, path: string): void {
  if (definition.valueType === 'string_enum' && typeof value !== 'string') fail(path, 'expected an enumerated string');
  if (definition.valueType === 'number' && typeof value !== 'number') fail(path, 'expected a number');
  if (!definition.allowedValues.some(candidate => valueKey(candidate) === valueKey(value))) {
    fail(path, `value is outside fact definition ${definition.factId}`);
  }
  if (typeof value === 'number' && (definition.min !== null && value < definition.min || definition.max !== null && value > definition.max)) {
    fail(path, `value is outside bounds for ${definition.factId}`);
  }
}

function validateManifest(value: unknown, trustedApproval: TrustedCatalogApproval | undefined): void {
  const path = '$.manifest';
  const manifest = objectAt(value, path, [
    'releaseId', 'digest', 'publishedAt', 'allowedUse', 'dataOrigin', 'publicationStatus',
    'approvalId', 'reviewedBy', 'reviewedAt', 'permissionGrantId', 'correctsReleaseId',
    'supersedesReleaseId', 'withdrawnAt', 'withdrawalReason', 'notice',
  ]);
  idAt(manifest.releaseId, `${path}.releaseId`);
  const digest = stringAt(manifest.digest, `${path}.digest`);
  if (!FINAL_DIGEST_PATTERN.test(digest) && !PENDING_DIGEST_PATTERN.test(digest)) {
    fail(`${path}.digest`, 'expected finalized sha256:<64 lowercase hex> or a synthetic build placeholder');
  }
  isoTimestampAt(manifest.publishedAt, `${path}.publishedAt`);
  const allowedUse = literalAt(manifest.allowedUse, `${path}.allowedUse`, ['synthetic_demo_only', 'public_catalog']);
  const dataOrigin = literalAt(manifest.dataOrigin, `${path}.dataOrigin`, ['synthetic', 'approved_public_projection']);
  const status = literalAt(manifest.publicationStatus, `${path}.publicationStatus`, ['draft', 'authored_demo', 'approved_public', 'withdrawn']);
  const approvalId = nullableIdAt(manifest.approvalId, `${path}.approvalId`);
  const reviewedBy = manifest.reviewedBy === null ? null : displayStringAt(manifest.reviewedBy, `${path}.reviewedBy`);
  const reviewedAt = manifest.reviewedAt === null ? null : isoTimestampAt(manifest.reviewedAt, `${path}.reviewedAt`);
  const grantId = nullableIdAt(manifest.permissionGrantId, `${path}.permissionGrantId`);
  nullableIdAt(manifest.correctsReleaseId, `${path}.correctsReleaseId`);
  nullableIdAt(manifest.supersedesReleaseId, `${path}.supersedesReleaseId`);
  const withdrawnAt = manifest.withdrawnAt === null ? null : isoTimestampAt(manifest.withdrawnAt, `${path}.withdrawnAt`);
  const withdrawalReason = manifest.withdrawalReason === null ? null : displayStringAt(manifest.withdrawalReason, `${path}.withdrawalReason`, 240);
  const notice = stringAt(manifest.notice, `${path}.notice`);
  if (dataOrigin === 'synthetic') {
    if (allowedUse !== 'synthetic_demo_only') fail(path, 'synthetic data must be synthetic_demo_only');
    if (!/synthetic/i.test(notice)) fail(`${path}.notice`, 'synthetic origin must be visibly disclosed');
    if (status !== 'authored_demo') fail(`${path}.publicationStatus`, 'synthetic packages must be authored_demo');
    if (approvalId || reviewedBy || reviewedAt || grantId) fail(path, 'synthetic demo cannot carry public approval metadata');
  } else {
    if (!FINAL_DIGEST_PATTERN.test(digest)) fail(`${path}.digest`, 'public catalog digest must be finalized');
    if (allowedUse !== 'public_catalog') fail(path, 'approved public data must be public_catalog');
    if (!approvalId || !reviewedBy || !reviewedAt || !grantId) fail(path, 'public catalog requires complete approval metadata');
    if (!['approved_public', 'withdrawn'].includes(status)) fail(`${path}.publicationStatus`, 'public catalog must be approved_public or withdrawn');
    if (!trustedApproval
      || trustedApproval.releaseId !== manifest.releaseId
      || trustedApproval.digest !== digest
      || trustedApproval.approvalId !== approvalId
      || trustedApproval.permissionGrantId !== grantId) {
      fail(path, 'public catalog requires matching trusted out-of-envelope approval');
    }
  }
  if (status === 'withdrawn' ? (!withdrawnAt || !withdrawalReason) : (withdrawnAt !== null || withdrawalReason !== null)) fail(path, 'withdrawal metadata must exactly match withdrawn status');
}

function validateHierarchy(value: unknown): Map<string, ObjectValue> {
  const rows = arrayAt(value, '$.hierarchy', 1);
  const byId = new Map<string, ObjectValue>();
  rows.forEach((item, index) => {
    const path = `$.hierarchy[${index}]`;
    const row = objectAt(item, path, ['nodeId', 'parentNodeId', 'kind', 'label', 'order', 'familyId']);
    const id = idAt(row.nodeId, `${path}.nodeId`);
    if (byId.has(id)) fail(`${path}.nodeId`, 'duplicate hierarchy node ID');
    nullableStringAt(row.parentNodeId, `${path}.parentNodeId`);
    const kind = literalAt(row.kind, `${path}.kind`, ['category', 'family']);
    displayStringAt(row.label, `${path}.label`);
    integerAt(row.order, `${path}.order`);
    const familyId = nullableStringAt(row.familyId, `${path}.familyId`);
    if (kind === 'category' && familyId !== null) fail(`${path}.familyId`, 'category node cannot identify a family');
    if (kind === 'family' && (familyId === null || !ID_PATTERN.test(familyId))) fail(`${path}.familyId`, 'family node requires a stable family ID');
    byId.set(id, row);
  });
  const roots = rows.filter(item => (item as ObjectValue).parentNodeId === null);
  if (roots.length !== 1) fail('$.hierarchy', 'expected exactly one root');
  const siblingOrders = new Set<string>();
  for (const [id, row] of Array.from(byId.entries())) {
    const parentId = row.parentNodeId as string | null;
    if (parentId !== null && !byId.has(parentId)) fail(`$.hierarchy.${id}.parentNodeId`, 'dangling parent');
    if (parentId !== null && (byId.get(parentId)?.kind !== 'category')) fail(`$.hierarchy.${id}.parentNodeId`, 'parent must be a category');
    const siblingKey = `${parentId ?? '<root>'}|${String(row.order)}`;
    if (siblingOrders.has(siblingKey)) fail(`$.hierarchy.${id}.order`, 'duplicate sibling order');
    siblingOrders.add(siblingKey);
    const visited = new Set<string>([id]);
    let cursor = parentId;
    while (cursor !== null) {
      if (visited.has(cursor)) fail(`$.hierarchy.${id}`, 'hierarchy cycle');
      visited.add(cursor);
      cursor = byId.get(cursor)?.parentNodeId as string | null;
    }
  }
  return byId;
}

function validateFamilies(value: unknown, hierarchy: Map<string, ObjectValue>): Map<string, ObjectValue> {
  const rows = arrayAt(value, '$.families', 1);
  const byId = new Map<string, ObjectValue>();
  rows.forEach((item, index) => {
    const path = `$.families[${index}]`;
    const row = objectAt(item, path, ['familyId', 'label', 'hierarchyNodeId', 'currentSchemaRevisionId']);
    const familyId = idAt(row.familyId, `${path}.familyId`);
    if (byId.has(familyId)) fail(`${path}.familyId`, 'duplicate family ID');
    displayStringAt(row.label, `${path}.label`);
    const nodeId = idAt(row.hierarchyNodeId, `${path}.hierarchyNodeId`);
    const node = hierarchy.get(nodeId);
    if (!node || node.kind !== 'family' || node.familyId !== familyId) fail(`${path}.hierarchyNodeId`, 'family hierarchy node mismatch');
    idAt(row.currentSchemaRevisionId, `${path}.currentSchemaRevisionId`);
    byId.set(familyId, row);
  });
  const familyNodes = Array.from(hierarchy.values()).filter(node => node.kind === 'family');
  if (familyNodes.length !== rows.length || familyNodes.some(node => !byId.has(node.familyId as string))) {
    fail('$.families', 'every family hierarchy node must have exactly one family');
  }
  return byId;
}

function validateFactDefinitions(value: unknown, familyIds: Set<string>): Map<string, FactDefinition> {
  const rows = arrayAt(value, '$.factDefinitions', 1);
  const byId = new Map<string, FactDefinition>();
  rows.forEach((item, index) => {
    const path = `$.factDefinitions[${index}]`;
    const row = objectAt(item, path, ['factId', 'label', 'valueType', 'unit', 'allowedValues', 'min', 'max', 'scope', 'allowedStates']);
    const factId = idAt(row.factId, `${path}.factId`);
    if (byId.has(factId)) fail(`${path}.factId`, 'duplicate fact definition ID');
    displayStringAt(row.label, `${path}.label`);
    const valueType = literalAt(row.valueType, `${path}.valueType`, ['string_enum', 'number']);
    const unit = row.unit === null ? null : displayStringAt(row.unit, `${path}.unit`);
    const allowedValues = arrayAt(row.allowedValues, `${path}.allowedValues`, 1).map((entry, valueIndex) => primitiveAt(entry, `${path}.allowedValues[${valueIndex}]`));
    if (new Set(allowedValues.map(valueKey)).size !== allowedValues.length) fail(`${path}.allowedValues`, 'duplicate allowed values');
    const min = nullableNumberAt(row.min, `${path}.min`);
    const max = nullableNumberAt(row.max, `${path}.max`);
    if (valueType === 'string_enum') {
      if (unit !== null || min !== null || max !== null || allowedValues.some(entry => typeof entry !== 'string')) fail(path, 'invalid string_enum definition');
    } else {
      if (unit === null || min === null || max === null || min > max || allowedValues.some(entry => typeof entry !== 'number' || entry < min || entry > max)) fail(path, 'invalid number definition');
    }
    const scopePath = `${path}.scope`;
    if (row.scope === null || typeof row.scope !== 'object') fail(scopePath, 'expected scope object');
    const scopeKind = (row.scope as ObjectValue).kind;
    if (scopeKind === 'all_families') {
      objectAt(row.scope, scopePath, ['kind']);
    } else if (scopeKind === 'families') {
      const scope = objectAt(row.scope, scopePath, ['kind', 'familyIds']);
      const scopedFamilies = arrayAt(scope.familyIds, `${scopePath}.familyIds`, 1).map((entry, familyIndex) => idAt(entry, `${scopePath}.familyIds[${familyIndex}]`));
      unique(scopedFamilies, `${scopePath}.familyIds`);
      if (scopedFamilies.some(familyId => !familyIds.has(familyId))) fail(`${scopePath}.familyIds`, 'unknown family scope');
    } else {
      fail(`${scopePath}.kind`, 'expected all_families or families');
    }
    const allowedStates = arrayAt(row.allowedStates, `${path}.allowedStates`, 1).map((entry, stateIndex) => literalAt(entry, `${path}.allowedStates[${stateIndex}]`, FACT_STATES));
    unique(allowedStates, `${path}.allowedStates`);
    if (!allowedStates.includes('known')) fail(`${path}.allowedStates`, 'known state is required');
    byId.set(factId, row as unknown as FactDefinition);
  });
  return byId;
}

function validateSchemaRevisions(value: unknown, families: Map<string, ObjectValue>, facts: Map<string, FactDefinition>): Map<string, ObjectValue> {
  const rows = arrayAt(value, '$.familySchemaRevisions', 1);
  const byId = new Map<string, ObjectValue>();
  const familyRevisionKeys = new Set<string>();
  rows.forEach((item, index) => {
    const path = `$.familySchemaRevisions[${index}]`;
    const row = objectAt(item, path, ['familySchemaRevisionId', 'familyId', 'revision', 'factIds', 'facetIds']);
    const schemaId = idAt(row.familySchemaRevisionId, `${path}.familySchemaRevisionId`);
    if (byId.has(schemaId)) fail(`${path}.familySchemaRevisionId`, 'duplicate family schema revision ID');
    const familyId = idAt(row.familyId, `${path}.familyId`);
    if (!families.has(familyId)) fail(`${path}.familyId`, 'unknown family');
    const revision = integerAt(row.revision, `${path}.revision`, 1);
    const revisionKey = `${familyId}|${revision}`;
    if (familyRevisionKeys.has(revisionKey)) fail(`${path}.revision`, 'duplicate family schema revision number');
    familyRevisionKeys.add(revisionKey);
    const factIds = arrayAt(row.factIds, `${path}.factIds`, 1).map((entry, factIndex) => idAt(entry, `${path}.factIds[${factIndex}]`));
    unique(factIds, `${path}.factIds`);
    for (const factId of factIds) {
      const definition = facts.get(factId);
      if (!definition) fail(`${path}.factIds`, `unknown fact ${factId}`);
      if (definition.scope.kind === 'families' && !definition.scope.familyIds.includes(familyId)) fail(`${path}.factIds`, `family-field leakage: ${factId}`);
    }
    const facetIds = arrayAt(row.facetIds, `${path}.facetIds`).map((entry, facetIndex) => idAt(entry, `${path}.facetIds[${facetIndex}]`));
    unique(facetIds, `${path}.facetIds`);
    byId.set(schemaId, row);
  });
  for (const [familyId, family] of Array.from(families.entries())) {
    const currentId = family.currentSchemaRevisionId as string;
    const current = byId.get(currentId);
    if (!current || current.familyId !== familyId) fail(`$.families.${familyId}.currentSchemaRevisionId`, 'current schema revision mismatch');
    const revisions = Array.from(byId.values()).filter(row => row.familyId === familyId);
    if (!revisions.length || current.revision !== Math.max(...revisions.map(row => row.revision as number))) fail(`$.families.${familyId}.currentSchemaRevisionId`, 'current schema must be latest revision');
  }
  return byId;
}

function validateFacets(value: unknown, schemas: Map<string, ObjectValue>): void {
  const rows = arrayAt(value, '$.facets');
  const ids = new Set<string>();
  const bySchema = new Map<string, string[]>();
  const orders = new Set<string>();
  rows.forEach((item, index) => {
    const path = `$.facets[${index}]`;
    const row = objectAt(item, path, ['facetId', 'familySchemaRevisionId', 'factId', 'label', 'order']);
    const facetId = idAt(row.facetId, `${path}.facetId`);
    if (ids.has(facetId)) fail(`${path}.facetId`, 'duplicate facet ID');
    ids.add(facetId);
    const schemaId = idAt(row.familySchemaRevisionId, `${path}.familySchemaRevisionId`);
    const schema = schemas.get(schemaId);
    if (!schema) fail(`${path}.familySchemaRevisionId`, 'unknown family schema revision');
    const factId = idAt(row.factId, `${path}.factId`);
    if (!(schema.factIds as string[]).includes(factId)) fail(`${path}.factId`, 'facet fact is outside family schema');
    displayStringAt(row.label, `${path}.label`);
    const order = integerAt(row.order, `${path}.order`);
    const orderKey = `${schemaId}|${order}`;
    if (orders.has(orderKey)) fail(`${path}.order`, 'duplicate facet order in family schema');
    orders.add(orderKey);
    bySchema.set(schemaId, [...(bySchema.get(schemaId) ?? []), facetId]);
  });
  for (const [schemaId, schema] of Array.from(schemas.entries())) {
    if (!sameMembers(schema.facetIds as string[], bySchema.get(schemaId) ?? [])) fail(`$.familySchemaRevisions.${schemaId}.facetIds`, 'facet cardinality mismatch');
  }
}

function validateProvenance(value: unknown, manifest: ObjectValue): Map<string, ObjectValue> {
  const rows = arrayAt(value, '$.provenance', 1);
  const byId = new Map<string, ObjectValue>();
  rows.forEach((item, index) => {
    const path = `$.provenance[${index}]`;
    const row = objectAt(item, path, ['provenanceId', 'claimType', 'sourceKind', 'sourceId', 'publicationClass', 'permissionGrantId', 'evidenceRefs']);
    const id = idAt(row.provenanceId, `${path}.provenanceId`);
    if (byId.has(id)) fail(`${path}.provenanceId`, 'duplicate provenance ID');
    literalAt(row.claimType, `${path}.claimType`, ['fact', 'mapping']);
    const sourceKind = literalAt(row.sourceKind, `${path}.sourceKind`, ['synthetic_fixture', 'approved_public_projection']);
    displayStringAt(row.sourceId, `${path}.sourceId`);
    const publicationClass = literalAt(row.publicationClass, `${path}.publicationClass`, ['synthetic_demo', 'public']);
    const grantId = nullableIdAt(row.permissionGrantId, `${path}.permissionGrantId`);
    if (manifest.dataOrigin === 'synthetic' && (sourceKind !== 'synthetic_fixture' || publicationClass !== 'synthetic_demo' || grantId !== null)) fail(path, 'synthetic release requires synthetic provenance');
    if (manifest.dataOrigin === 'approved_public_projection' && (sourceKind !== 'approved_public_projection' || publicationClass !== 'public' || grantId !== manifest.permissionGrantId)) fail(path, 'public provenance must carry the manifest permission grant');
    const evidence = arrayAt(row.evidenceRefs, `${path}.evidenceRefs`, 1);
    const refs = new Set<string>();
    evidence.forEach((evidenceItem, evidenceIndex) => {
      const evidencePath = `${path}.evidenceRefs[${evidenceIndex}]`;
      const refRow = objectAt(evidenceItem, evidencePath, ['visibility', 'ref']);
      const visibility = literalAt(refRow.visibility, `${evidencePath}.visibility`, ['public', 'private']);
      const ref = stringAt(refRow.ref, `${evidencePath}.ref`);
      if (!ref.startsWith(`evidence:${visibility}:`)) fail(`${evidencePath}.ref`, `expected opaque evidence:${visibility}: reference`);
      if (refs.has(ref)) fail(`${path}.evidenceRefs`, 'duplicate evidence reference');
      refs.add(ref);
    });
    byId.set(id, row);
  });
  return byId;
}

function validateFactValue(value: unknown, definition: FactDefinition, path: string): void {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) fail(path, 'expected fact-state object');
  const state = literalAt((value as ObjectValue).state, `${path}.state`, FACT_STATES);
  if (!definition.allowedStates.includes(state)) fail(`${path}.state`, `state is not allowed for ${definition.factId}`);
  if (state === 'known') {
    const row = objectAt(value, path, ['state', 'value']);
    assertAllowedPrimitive(primitiveAt(row.value, `${path}.value`), definition, `${path}.value`);
  } else if (state === 'conflicting') {
    const row = objectAt(value, path, ['state', 'values', 'reason']);
    const values = arrayAt(row.values, `${path}.values`, 2).map((entry, index) => primitiveAt(entry, `${path}.values[${index}]`));
    if (new Set(values.map(valueKey)).size !== values.length) fail(`${path}.values`, 'conflicting values must be distinct');
    values.forEach((entry, index) => assertAllowedPrimitive(entry, definition, `${path}.values[${index}]`));
    stringAt(row.reason, `${path}.reason`);
  } else {
    const row = objectAt(value, path, ['state', 'reason']);
    stringAt(row.reason, `${path}.reason`);
  }
}

function validateConfigurations(
  configurationValue: unknown,
  revisionValue: unknown,
  families: Map<string, ObjectValue>,
  schemas: Map<string, ObjectValue>,
  definitions: Map<string, FactDefinition>,
  provenance: Map<string, ObjectValue>,
): Map<string, ObjectValue> {
  const configurationRows = arrayAt(configurationValue, '$.configurations', 1);
  const configurations = new Map<string, ObjectValue>();
  configurationRows.forEach((item, index) => {
    const path = `$.configurations[${index}]`;
    const row = objectAt(item, path, ['configurationId', 'familyId', 'currentRevisionId']);
    const id = idAt(row.configurationId, `${path}.configurationId`);
    if (configurations.has(id)) fail(`${path}.configurationId`, 'duplicate configuration ID');
    const familyId = idAt(row.familyId, `${path}.familyId`);
    if (!families.has(familyId)) fail(`${path}.familyId`, 'unknown family');
    idAt(row.currentRevisionId, `${path}.currentRevisionId`);
    configurations.set(id, row);
  });

  const revisionRows = arrayAt(revisionValue, '$.configurationRevisions', 1);
  const revisions = new Map<string, ObjectValue>();
  const numbered = new Set<string>();
  revisionRows.forEach((item, index) => {
    const path = `$.configurationRevisions[${index}]`;
    const row = objectAt(item, path, ['configurationRevisionId', 'configurationId', 'familyId', 'familySchemaRevisionId', 'revision', 'lifecycle', 'facts']);
    const revisionId = idAt(row.configurationRevisionId, `${path}.configurationRevisionId`);
    if (revisions.has(revisionId)) fail(`${path}.configurationRevisionId`, 'duplicate configuration revision ID');
    const configurationId = idAt(row.configurationId, `${path}.configurationId`);
    const configuration = configurations.get(configurationId);
    if (!configuration) fail(`${path}.configurationId`, 'dangling configuration revision');
    const familyId = idAt(row.familyId, `${path}.familyId`);
    if (configuration.familyId !== familyId) fail(`${path}.familyId`, 'configuration family mismatch');
    const schemaId = idAt(row.familySchemaRevisionId, `${path}.familySchemaRevisionId`);
    const schema = schemas.get(schemaId);
    if (!schema || schema.familyId !== familyId) fail(`${path}.familySchemaRevisionId`, 'family schema mismatch');
    const revision = integerAt(row.revision, `${path}.revision`, 1);
    validateLifecycle(row.lifecycle, `${path}.lifecycle`);
    const numberedKey = `${configurationId}|${revision}`;
    if (numbered.has(numberedKey)) fail(`${path}.revision`, 'duplicate configuration revision number');
    numbered.add(numberedKey);
    const assignmentRows = arrayAt(row.facts, `${path}.facts`, 1);
    const assignedFactIds: string[] = [];
    assignmentRows.forEach((assignmentItem, assignmentIndex) => {
      const assignmentPath = `${path}.facts[${assignmentIndex}]`;
      const assignment = objectAt(assignmentItem, assignmentPath, ['factId', 'value', 'provenanceIds']);
      const factId = idAt(assignment.factId, `${assignmentPath}.factId`);
      const definition = definitions.get(factId);
      if (!definition || !(schema.factIds as string[]).includes(factId)) fail(`${assignmentPath}.factId`, 'family-field leakage or unknown fact');
      assignedFactIds.push(factId);
      validateFactValue(assignment.value, definition, `${assignmentPath}.value`);
      const provenanceIds = arrayAt(assignment.provenanceIds, `${assignmentPath}.provenanceIds`, 1).map((entry, provenanceIndex) => idAt(entry, `${assignmentPath}.provenanceIds[${provenanceIndex}]`));
      unique(provenanceIds, `${assignmentPath}.provenanceIds`);
      for (const provenanceId of provenanceIds) if (provenance.get(provenanceId)?.claimType !== 'fact') fail(`${assignmentPath}.provenanceIds`, 'fact requires fact provenance');
    });
    unique(assignedFactIds, `${path}.facts`);
    if (!sameMembers(assignedFactIds, schema.factIds as string[])) fail(`${path}.facts`, 'fact cardinality must exactly match family schema');
    revisions.set(revisionId, row);
  });

  for (const [configurationId, configuration] of Array.from(configurations.entries())) {
    const ownRevisions = Array.from(revisions.entries()).filter(([, row]) => row.configurationId === configurationId);
    if (!ownRevisions.length) fail(`$.configurations.${configurationId}`, 'configuration requires at least one revision');
    const currentId = configuration.currentRevisionId as string;
    const current = revisions.get(currentId);
    if (!current || current.configurationId !== configurationId) fail(`$.configurations.${configurationId}.currentRevisionId`, 'current revision mismatch');
    if (!['active', 'corrected'].includes((current.lifecycle as ObjectValue).status as string)) fail(`$.configurations.${configurationId}.currentRevisionId`, 'current revision must be active or corrected');
    if (current.revision !== Math.max(...ownRevisions.map(([, row]) => row.revision as number))) fail(`$.configurations.${configurationId}.currentRevisionId`, 'current revision must be latest');
  }
  return revisions;
}

function validateNamespaces(value: unknown): Map<string, ObjectValue> {
  const rows = arrayAt(value, '$.identifierNamespaces', 1);
  const namespaces = new Map<string, ObjectValue>();
  rows.forEach((item, index) => {
    const path = `$.identifierNamespaces[${index}]`;
    const row = objectAt(item, path, ['namespaceId', 'label', 'trimPolicy', 'casePolicy', 'unicodePolicy']);
    const id = idAt(row.namespaceId, `${path}.namespaceId`);
    if (namespaces.has(id)) fail(`${path}.namespaceId`, 'duplicate namespace ID');
    displayStringAt(row.label, `${path}.label`);
    literalAt(row.trimPolicy, `${path}.trimPolicy`, ['trim']);
    literalAt(row.casePolicy, `${path}.casePolicy`, ['upper']);
    literalAt(row.unicodePolicy, `${path}.unicodePolicy`, ['NFKC']);
    namespaces.set(id, row);
  });
  return namespaces;
}

function validateLifecycleReferences(rows: readonly ObjectValue[], path: string, idField: string): void {
  const byId = new Map(rows.map(row => [row[idField] as string, row]));
  rows.forEach((row, index) => {
    const lifecycle = row.lifecycle as ObjectValue;
    for (const field of ['correctsId', 'supersededById'] as const) {
      const target = lifecycle[field] as string | null;
      if (target !== null && (!byId.has(target) || target === row[idField])) {
        fail(`${path}[${index}].lifecycle.${field}`, 'lifecycle reference must identify another record in the same collection');
      }
      if (target !== null) {
        const targetLifecycle = byId.get(target)!.lifecycle as ObjectValue;
        const reciprocalField = field === 'correctsId' ? 'supersededById' : 'correctsId';
        if (targetLifecycle[reciprocalField] !== row[idField]) fail(`${path}[${index}].lifecycle.${field}`, 'lifecycle correction and supersession references must be reciprocal');
        const replacementTime = field === 'correctsId' ? lifecycle.effectiveAt : targetLifecycle.effectiveAt;
        const replacedTime = field === 'correctsId' ? targetLifecycle.effectiveAt : lifecycle.effectiveAt;
        if (Date.parse(replacementTime as string) < Date.parse(replacedTime as string)) fail(`${path}[${index}].lifecycle.effectiveAt`, 'replacement lifecycle cannot predate the record it replaces');
      }
    }
  });
}

function validateMappings(value: unknown, namespaces: Map<string, ObjectValue>, revisions: Map<string, ObjectValue>, provenance: Map<string, ObjectValue>): void {
  const rows = arrayAt(value, '$.identifierMappings', 1);
  const ids = new Set<string>();
  const normalizedTargetPairs = new Set<string>();
  rows.forEach((item, index) => {
    const path = `$.identifierMappings[${index}]`;
    const row = objectAt(item, path, ['mappingId', 'namespaceId', 'identifier', 'configurationRevisionId', 'provenanceId', 'lifecycle']);
    const mappingId = idAt(row.mappingId, `${path}.mappingId`);
    if (ids.has(mappingId)) fail(`${path}.mappingId`, 'duplicate mapping ID');
    ids.add(mappingId);
    const namespaceId = idAt(row.namespaceId, `${path}.namespaceId`);
    const namespace = namespaces.get(namespaceId);
    if (!namespace) fail(`${path}.namespaceId`, 'unknown identifier namespace');
    const identifier = stringAt(row.identifier, `${path}.identifier`);
    const normalized = normalizeIdentifier(identifier, namespace);
    if (!normalized) fail(`${path}.identifier`, 'identifier normalizes to empty');
    const revisionId = idAt(row.configurationRevisionId, `${path}.configurationRevisionId`);
    const referencedRevision = revisions.get(revisionId);
    if (!referencedRevision) fail(`${path}.configurationRevisionId`, 'mapping references absent revision');
    const provenanceId = idAt(row.provenanceId, `${path}.provenanceId`);
    if (provenance.get(provenanceId)?.claimType !== 'mapping') fail(`${path}.provenanceId`, 'mapping requires mapping provenance');
    validateLifecycle(row.lifecycle, `${path}.lifecycle`);
    if (['active', 'corrected'].includes((row.lifecycle as ObjectValue).status as string)
      && ['superseded', 'withdrawn'].includes((referencedRevision.lifecycle as ObjectValue).status as string)) {
      fail(`${path}.configurationRevisionId`, 'active or corrected mapping cannot reference a superseded or withdrawn revision');
    }
    const pair = `${namespaceId}|${normalized}|${revisionId}`;
    if (normalizedTargetPairs.has(pair)) fail(path, 'duplicate normalized mapping target collision');
    normalizedTargetPairs.add(pair);
  });
  validateLifecycleReferences(rows as ObjectValue[], '$.identifierMappings', 'mappingId');
}

function validateLexicon(value: unknown, hierarchy: Map<string, ObjectValue>, families: Map<string, ObjectValue>, schemas: Map<string, ObjectValue>, facts: Map<string, FactDefinition>): void {
  const rows = arrayAt(value, '$.lexicon', 1);
  const ids = new Set<string>();
  const terms = new Set<string>();
  rows.forEach((item, index) => {
    const path = `$.lexicon[${index}]`;
    const row = objectAt(item, path, ['ruleId', 'match', 'term', 'normalizedTerm', 'targetType', 'targetId', 'familySchemaRevisionId', 'factId', 'factValue']);
    const ruleId = idAt(row.ruleId, `${path}.ruleId`);
    if (ids.has(ruleId)) fail(`${path}.ruleId`, 'duplicate lexicon rule ID');
    ids.add(ruleId);
    literalAt(row.match, `${path}.match`, ['exact_phrase']);
    const term = displayStringAt(row.term, `${path}.term`);
    const normalizedTerm = displayStringAt(row.normalizedTerm, `${path}.normalizedTerm`);
    if (normalizedTerm !== normalizeLexiconTerm(term)) fail(`${path}.normalizedTerm`, 'does not match deterministic normalization');
    if (terms.has(normalizedTerm)) fail(`${path}.normalizedTerm`, 'lexicon term collision');
    terms.add(normalizedTerm);
    const targetType = literalAt(row.targetType, `${path}.targetType`, ['hierarchy_node', 'family', 'fact_value']);
    const targetId = idAt(row.targetId, `${path}.targetId`);
    const schemaId = nullableStringAt(row.familySchemaRevisionId, `${path}.familySchemaRevisionId`);
    const factId = nullableStringAt(row.factId, `${path}.factId`);
    const factValue = row.factValue === null ? null : primitiveAt(row.factValue, `${path}.factValue`);
    if (targetType === 'hierarchy_node') {
      if (!hierarchy.has(targetId) || schemaId !== null || factId !== null || factValue !== null) fail(path, 'invalid hierarchy lexicon target');
    } else if (targetType === 'family') {
      if (!families.has(targetId) || schemaId === null || schemas.get(schemaId)?.familyId !== targetId || factId !== null || factValue !== null) fail(path, 'invalid family lexicon target');
    } else {
      const definition = facts.get(targetId);
      if (!definition || factId !== targetId || factValue === null) fail(path, 'invalid fact-value lexicon target');
      assertAllowedPrimitive(factValue, definition, `${path}.factValue`);
      if (schemaId !== null && !(schemas.get(schemaId)?.factIds as string[] | undefined)?.includes(targetId)) fail(`${path}.familySchemaRevisionId`, 'fact-value target leaks outside family schema');
      if (schemaId === null && definition.scope.kind !== 'all_families') fail(`${path}.familySchemaRevisionId`, 'family-scoped fact-value rule requires a family schema');
    }
  });
}

function cloneValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cloneValue);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as ObjectValue).map(([key, entry]) => [key, cloneValue(entry)]));
  }
  return value;
}

function deepFreeze(value: unknown): void {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return;
  Object.freeze(value);
  for (const child of Object.values(value)) deepFreeze(child);
}

/**
 * The sole public trust seam for catalog data. It validates unknown input,
 * rejects undeclared structure and inconsistent references, clones it, and
 * returns a deeply frozen package detached from the caller's object graph.
 */
export function parseCatalogPackage(input: unknown, trustedApproval?: TrustedCatalogApproval): CatalogPackage {
  assertInputBudget(input);
  const packageRow = objectAt(input, '$', PACKAGE_KEYS);
  const rowCount = PACKAGE_KEYS.reduce((total, key) => total + (Array.isArray(packageRow[key]) ? packageRow[key].length : 0), 0);
  if (rowCount > MAX_PACKAGE_ROWS) fail('$', `package exceeds ${MAX_PACKAGE_ROWS} total rows`);
  if (packageRow.schemaVersion !== CATALOG_PACKAGE_SCHEMA_VERSION) fail('$.schemaVersion', `expected ${CATALOG_PACKAGE_SCHEMA_VERSION}`);
  validateManifest(packageRow.manifest, trustedApproval);
  const manifest = packageRow.manifest as ObjectValue;
  const hierarchy = validateHierarchy(packageRow.hierarchy);
  const families = validateFamilies(packageRow.families, hierarchy);
  const definitions = validateFactDefinitions(packageRow.factDefinitions, new Set(families.keys()));
  const schemas = validateSchemaRevisions(packageRow.familySchemaRevisions, families, definitions);
  validateFacets(packageRow.facets, schemas);
  const provenance = validateProvenance(packageRow.provenance, manifest);
  const revisions = validateConfigurations(packageRow.configurations, packageRow.configurationRevisions, families, schemas, definitions, provenance);
  validateLifecycleReferences(packageRow.configurationRevisions as ObjectValue[], '$.configurationRevisions', 'configurationRevisionId');
  const namespaces = validateNamespaces(packageRow.identifierNamespaces);
  validateMappings(packageRow.identifierMappings, namespaces, revisions, provenance);
  validateLexicon(packageRow.lexicon, hierarchy, families, schemas, definitions);
  const declaredDigest = manifest.digest as string;
  const computedDigest = catalogPackageDigest(input as CatalogPackage);
  if (FINAL_DIGEST_PATTERN.test(declaredDigest) && computedDigest !== declaredDigest) fail('$.manifest.digest', `digest mismatch (computed ${computedDigest})`);
  const result = cloneValue(input);
  if (PENDING_DIGEST_PATTERN.test(declaredDigest)) (result as CatalogPackage & { manifest: { digest: string } }).manifest.digest = computedDigest;
  deepFreeze(result);
  return result as CatalogPackage;
}
