import type { FactPrimitive, HierarchyNode, LexiconRule } from '../contracts';
import type { CatalogFilter, CatalogIndex, QueryConflict, QueryInterpretation } from './types';
import { primitiveKey, samePrimitive } from './catalog-index';

export function normalizeNaturalQuery(query: string): string {
  return query
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/(?<=[\p{L}\p{N}])[-‐‑‒–—](?=[\p{L}\p{N}])/gu, ' ')
    .toLocaleLowerCase('en-US');
}

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function phraseExpression(term: string): RegExp {
  const body = term.split(/\s+/).map(escapeRegExp).join('\\s+');
  return new RegExp(`(?<![\\p{L}\\p{N}_])${body}(?![\\p{L}\\p{N}_])`, 'gu');
}

function isAncestor(index: CatalogIndex, possibleAncestorId: string, nodeId: string): boolean {
  return (index.hierarchyPathById.get(nodeId) ?? []).some(node => node.nodeId === possibleAncestorId);
}

function deepestSafeNode(index: CatalogIndex, nodes: readonly HierarchyNode[]): { node: HierarchyNode | null; conflict: readonly string[] } {
  if (!nodes.length) {
    const root = index.package.hierarchy.find(node => node.parentNodeId === null) ?? null;
    return { node: root, conflict: [] };
  }
  const unique = Array.from(new Map(nodes.map(node => [node.nodeId, node])).values());
  const sorted = [...unique].sort((a, b) =>
    (index.hierarchyPathById.get(b.nodeId)?.length ?? 0) - (index.hierarchyPathById.get(a.nodeId)?.length ?? 0));
  const deepest = sorted[0];
  const incompatible = sorted.filter(node => !isAncestor(index, node.nodeId, deepest.nodeId) && !isAncestor(index, deepest.nodeId, node.nodeId));
  if (!incompatible.length) return { node: deepest, conflict: [] };
  const paths = [deepest, ...incompatible].map(node => index.hierarchyPathById.get(node.nodeId) ?? []);
  let common: HierarchyNode | null = null;
  for (let pathIndex = 0; pathIndex < Math.min(...paths.map(path => path.length)); pathIndex += 1) {
    const candidate = paths[0][pathIndex];
    if (!paths.every(path => path[pathIndex]?.nodeId === candidate.nodeId)) break;
    common = candidate;
  }
  return { node: common, conflict: [deepest.nodeId, ...incompatible.map(node => node.nodeId)] };
}

function numericDefinition(index: CatalogIndex, factId: string) {
  const definition = index.factDefinitionsById.get(factId);
  return definition?.valueType === 'number' ? definition : undefined;
}

function isAllowed(index: CatalogIndex, factId: string, value: FactPrimitive): boolean {
  return index.factDefinitionsById.get(factId)?.allowedValues.some(candidate => samePrimitive(candidate, value)) ?? false;
}

/** Interpret only published exact phrases plus the explicit metric dimension grammar. */
export function interpretCatalogQuery(index: CatalogIndex, query: string): QueryInterpretation {
  const normalizedQuery = normalizeNaturalQuery(query);
  let remaining = normalizedQuery;
  const recognizedRules: LexiconRule[] = [];
  const factValues = new Map<string, FactPrimitive[]>();
  const hierarchyNodes: HierarchyNode[] = [];
  const familyValues: string[] = [];

  const addFact = (factId: string, value: FactPrimitive): void => {
    const values = factValues.get(factId) ?? [];
    if (!values.some(candidate => samePrimitive(candidate, value))) values.push(value);
    factValues.set(factId, values);
  };
  const consume = (expression: RegExp, onMatch: (match: RegExpExecArray) => boolean): void => {
    remaining = remaining.replace(expression, (...args: unknown[]) => {
      const match = args.slice(0, -2) as unknown as RegExpExecArray;
      return onMatch(match) ? ' '.repeat(String(args[0]).length) : String(args[0]);
    });
  };

  for (const rule of index.lexiconRules) {
    consume(phraseExpression(rule.normalizedTerm), () => {
      recognizedRules.push(rule);
      if (rule.targetType === 'hierarchy_node') hierarchyNodes.push(index.hierarchyById.get(rule.targetId)!);
      else if (rule.targetType === 'family') {
        familyValues.push(rule.targetId);
        hierarchyNodes.push(index.hierarchyById.get(index.familiesById.get(rule.targetId)!.hierarchyNodeId)!);
      } else addFact(rule.factId!, rule.factValue!);
      return true;
    });
  }

  const diameter = numericDefinition(index, 'nominal_diameter_mm');
  const pitch = numericDefinition(index, 'pitch_mm');
  const length = numericDefinition(index, 'length_mm');
  if (diameter && pitch) {
    consume(/\bm(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\b/gu, match => {
      const diameterValue = Number(match[1]);
      const pitchValue = Number(match[2]);
      if (!isAllowed(index, diameter.factId, diameterValue) || !isAllowed(index, pitch.factId, pitchValue)) return false;
      addFact(diameter.factId, diameterValue);
      addFact(pitch.factId, pitchValue);
      return true;
    });
  }
  if (diameter) {
    consume(/\bm(\d+(?:\.\d+)?)\b/gu, match => {
      const value = Number(match[1]);
      if (!isAllowed(index, diameter.factId, value)) return false;
      addFact(diameter.factId, value);
      return true;
    });
  }
  if (pitch) {
    consume(/\bpitch\s+(\d+(?:\.\d+)?)\s*mm\b|\b(\d+(?:\.\d+)?)\s*mm\s+pitch\b/gu, match => {
      const value = Number(match[1] ?? match[2]);
      if (!isAllowed(index, pitch.factId, value)) return false;
      addFact(pitch.factId, value);
      return true;
    });
  }
  if (length) {
    consume(/\b(\d+(?:\.\d+)?)\s*mm\b/gu, match => {
      const value = Number(match[1]);
      if (!isAllowed(index, length.factId, value)) return false;
      addFact(length.factId, value);
      return true;
    });
  }

  const conflicts: QueryConflict[] = [];
  const uniqueFamilies = Array.from(new Set(familyValues));
  if (uniqueFamilies.length > 1) conflicts.push({ field: 'familyId', values: uniqueFamilies });
  const selectedFamilyId = uniqueFamilies.length === 1 ? uniqueFamilies[0] : null;
  const depth = deepestSafeNode(index, hierarchyNodes);
  if (depth.conflict.length) conflicts.push({ field: 'hierarchyNodeId', values: depth.conflict });
  for (const [factId, values] of factValues) {
    if (values.length > 1) conflicts.push({ field: factId, values });
  }

  const familyNode = selectedFamilyId ? index.hierarchyById.get(index.familiesById.get(selectedFamilyId)!.hierarchyNodeId)! : null;
  const contextNode = depth.conflict.length ? depth.node : familyNode ?? depth.node;
  if (selectedFamilyId && depth.node && !isAncestor(index, depth.node.nodeId, familyNode!.nodeId) && !isAncestor(index, familyNode!.nodeId, depth.node.nodeId)) {
    conflicts.push({ field: 'hierarchyNodeId', values: [depth.node.nodeId, familyNode!.nodeId] });
  }

  const filterOrder = new Map(index.package.factDefinitions.map((definition, order) => [definition.factId, order]));
  const filters: CatalogFilter[] = Array.from(factValues.entries())
    .filter(([, values]) => values.length === 1)
    .map(([factId, values]) => ({ factId, value: values[0], source: 'query' as const }))
    .sort((a, b) => (filterOrder.get(a.factId) ?? Number.MAX_SAFE_INTEGER) - (filterOrder.get(b.factId) ?? Number.MAX_SAFE_INTEGER));
  const unsupportedTerms = remaining.trim().split(/\s+/).filter(Boolean);
  const hierarchyPath = contextNode ? index.hierarchyPathById.get(contextNode.nodeId) ?? [] : [];

  return Object.freeze({
    originalQuery: query,
    normalizedQuery,
    familyId: selectedFamilyId,
    hierarchyNodeId: contextNode?.nodeId ?? null,
    hierarchyPath,
    filters: Object.freeze(filters),
    recognizedRuleIds: Object.freeze(Array.from(new Set(recognizedRules.map(rule => rule.ruleId)))),
    unsupportedTerms: Object.freeze(unsupportedTerms),
    conflicts: Object.freeze(conflicts),
  });
}
