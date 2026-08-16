import type { CatalogPackage, FactPrimitive, HierarchyNode, IdentifierMapping, IdentifierNamespace } from '../contracts';
import type { CatalogIndex, IndexedConfiguration } from './types';

export function normalizeIdentifier(identifier: string, namespace: IdentifierNamespace): string {
  let normalized = identifier;
  if (namespace.unicodePolicy === 'NFKC') normalized = normalized.normalize('NFKC');
  if (namespace.trimPolicy === 'trim') normalized = normalized.trim();
  if (namespace.casePolicy === 'upper') normalized = normalized.toUpperCase();
  return normalized;
}

export function qualifiedIdentifierKey(namespaceId: string, normalizedIdentifier: string): string {
  return `${namespaceId}\u0000${normalizedIdentifier}`;
}

export function primitiveKey(value: FactPrimitive): string {
  return `${typeof value}:${String(value)}`;
}

export function samePrimitive(left: FactPrimitive, right: FactPrimitive): boolean {
  return typeof left === typeof right && left === right;
}

function append<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const current = map.get(key);
  if (current) current.push(value);
  else map.set(key, [value]);
}

function frozenArrayMap<K, V>(source: Map<K, V[]>): ReadonlyMap<K, readonly V[]> {
  for (const values of source.values()) Object.freeze(values);
  return immutableMap(source);
}

function immutableMap<K, V>(source: ReadonlyMap<K, V>): ReadonlyMap<K, V> {
  const target = new Map(source);
  const rejectMutation = (): never => { throw new TypeError('CatalogIndex maps are immutable'); };
  return Object.freeze(new Proxy(target, {
    get(map, property) {
      if (property === 'set' || property === 'delete' || property === 'clear') return rejectMutation;
      const value = Reflect.get(map, property, map) as unknown;
      return typeof value === 'function' ? value.bind(map) : value;
    },
  })) as ReadonlyMap<K, V>;
}

/** Builds deterministic lookup indexes from the validated production package contract. */
export function createCatalogIndex(catalogPackage: CatalogPackage): CatalogIndex {
  const hierarchyById = new Map(catalogPackage.hierarchy.map(node => [node.nodeId, node]));
  const hierarchyChildrenMutable = new Map<string | null, HierarchyNode[]>();
  for (const node of catalogPackage.hierarchy) append(hierarchyChildrenMutable, node.parentNodeId, node);
  for (const children of hierarchyChildrenMutable.values()) {
    children.sort((a, b) => a.order - b.order || a.nodeId.localeCompare(b.nodeId));
  }

  const hierarchyPathById = new Map<string, readonly HierarchyNode[]>();
  const pathFor = (node: HierarchyNode): readonly HierarchyNode[] => {
    const cached = hierarchyPathById.get(node.nodeId);
    if (cached) return cached;
    const path = node.parentNodeId === null
      ? [node]
      : [...pathFor(hierarchyById.get(node.parentNodeId)!), node];
    Object.freeze(path);
    hierarchyPathById.set(node.nodeId, path);
    return path;
  };
  for (const node of catalogPackage.hierarchy) pathFor(node);

  const familiesById = new Map(catalogPackage.families.map(family => [family.familyId, family]));
  const schemasById = new Map(catalogPackage.familySchemaRevisions.map(schema => [schema.familySchemaRevisionId, schema]));
  const currentSchemaByFamilyId = new Map(catalogPackage.families.map(family => [
    family.familyId,
    schemasById.get(family.currentSchemaRevisionId)!,
  ]));
  const factDefinitionsById = new Map(catalogPackage.factDefinitions.map(definition => [definition.factId, definition]));

  const facetsByFamilyMutable = new Map<string, typeof catalogPackage.facets[number][]>();
  for (const facet of catalogPackage.facets) {
    const schema = schemasById.get(facet.familySchemaRevisionId)!;
    append(facetsByFamilyMutable, schema.familyId, facet);
  }
  for (const facets of facetsByFamilyMutable.values()) {
    facets.sort((a, b) => a.order - b.order || a.facetId.localeCompare(b.facetId));
  }

  const revisionsById = new Map(catalogPackage.configurationRevisions.map(revision => [revision.configurationRevisionId, revision]));
  const configurationsById = new Map<string, IndexedConfiguration>();
  const configurationsByFamilyMutable = new Map<string, IndexedConfiguration[]>();
  for (const configuration of catalogPackage.configurations) {
    const revision = revisionsById.get(configuration.currentRevisionId)!;
    const indexed: IndexedConfiguration = {
      configuration,
      revision,
      facts: immutableMap(new Map(revision.facts.map(fact => [fact.factId, fact]))),
    };
    configurationsById.set(configuration.configurationId, indexed);
    append(configurationsByFamilyMutable, configuration.familyId, indexed);
  }

  const familyOrder = new Map<string, number>();
  for (const family of catalogPackage.families) {
    const path = hierarchyPathById.get(family.hierarchyNodeId)!;
    // A lexicographically comparable hierarchy-order path is represented by its
    // rank in a traversal sorted by node order.
    familyOrder.set(family.familyId, catalogPackage.families.indexOf(family) + path.reduce((sum, node) => sum + node.order, 0) / 1000);
  }
  const compareKnown = (left: IndexedConfiguration, right: IndexedConfiguration): number => {
    const familyDifference = (familyOrder.get(left.configuration.familyId) ?? 0) - (familyOrder.get(right.configuration.familyId) ?? 0);
    if (familyDifference) return familyDifference;
    const schema = currentSchemaByFamilyId.get(left.configuration.familyId)!;
    for (const factId of schema.factIds) {
      const leftValue = left.facts.get(factId)?.value;
      const rightValue = right.facts.get(factId)?.value;
      if (leftValue?.state !== 'known' || rightValue?.state !== 'known') {
        const stateDifference = String(leftValue?.state).localeCompare(String(rightValue?.state));
        if (stateDifference) return stateDifference;
        continue;
      }
      if (samePrimitive(leftValue.value, rightValue.value)) continue;
      if (typeof leftValue.value === 'number' && typeof rightValue.value === 'number') return leftValue.value - rightValue.value;
      const definition = factDefinitionsById.get(factId)!;
      const leftOrder = definition.allowedValues.findIndex(value => samePrimitive(value, leftValue.value));
      const rightOrder = definition.allowedValues.findIndex(value => samePrimitive(value, rightValue.value));
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return String(leftValue.value).localeCompare(String(rightValue.value));
    }
    return left.configuration.configurationId.localeCompare(right.configuration.configurationId);
  };
  for (const configurations of configurationsByFamilyMutable.values()) configurations.sort(compareKnown);

  const mappingsByQualifiedMutable = new Map<string, IdentifierMapping[]>();
  const mappingsByNormalizedMutable = new Map<string, IdentifierMapping[]>();
  const mappingsByRevisionMutable = new Map<string, IdentifierMapping[]>();
  const namespacesById = new Map(catalogPackage.identifierNamespaces.map(namespace => [namespace.namespaceId, namespace]));
  const namespaceRecognition = Object.freeze(catalogPackage.identifierNamespaces.map(namespace => Object.freeze({
    namespaceId: namespace.namespaceId,
    pattern: new RegExp(namespace.identifierPattern, 'u'),
  })));
  for (const mapping of catalogPackage.identifierMappings) {
    if (!['active', 'corrected'].includes(mapping.lifecycle.status)) continue;
    const normalized = normalizeIdentifier(mapping.identifier, namespacesById.get(mapping.namespaceId)!);
    append(mappingsByQualifiedMutable, qualifiedIdentifierKey(mapping.namespaceId, normalized), mapping);
    append(mappingsByNormalizedMutable, normalized, mapping);
    append(mappingsByRevisionMutable, mapping.configurationRevisionId, mapping);
  }

  return Object.freeze({
    package: catalogPackage,
    hierarchyById: immutableMap(hierarchyById),
    hierarchyChildren: frozenArrayMap(hierarchyChildrenMutable),
    hierarchyPathById: immutableMap(hierarchyPathById),
    familiesById: immutableMap(familiesById),
    schemasById: immutableMap(schemasById),
    currentSchemaByFamilyId: immutableMap(currentSchemaByFamilyId),
    factDefinitionsById: immutableMap(factDefinitionsById),
    facetsByFamilyId: frozenArrayMap(facetsByFamilyMutable),
    configurationsById: immutableMap(configurationsById),
    configurationsByFamilyId: frozenArrayMap(configurationsByFamilyMutable),
    revisionsById: immutableMap(revisionsById),
    mappingsByQualifiedIdentifier: frozenArrayMap(mappingsByQualifiedMutable),
    mappingsByNormalizedIdentifier: frozenArrayMap(mappingsByNormalizedMutable),
    mappingsByConfigurationRevisionId: frozenArrayMap(mappingsByRevisionMutable),
    namespacesById: immutableMap(namespacesById),
    namespaceRecognition,
    provenanceById: immutableMap(new Map(catalogPackage.provenance.map(record => [record.provenanceId, record]))),
    lexiconRules: Object.freeze([...catalogPackage.lexicon].sort((a, b) =>
      b.normalizedTerm.length - a.normalizedTerm.length || a.ruleId.localeCompare(b.ruleId))),
  });
}
