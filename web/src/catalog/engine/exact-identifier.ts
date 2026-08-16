import type { CatalogIndex, ExactIdentifierResolution, AcrossNamespaceIdentifierResolution } from './types';
import { normalizeIdentifier, qualifiedIdentifierKey } from './catalog-index';

function configurationIds(index: CatalogIndex, revisionIds: readonly string[]): readonly string[] {
  return revisionIds.map(revisionId => index.revisionsById.get(revisionId)?.configurationId).filter((id): id is string => Boolean(id));
}

/** Resolve within one declared namespace. Zero, one and many describe mapping cardinality, never a guess. */
export function resolveExactIdentifier(
  index: CatalogIndex,
  namespaceId: string,
  identifier: string,
): ExactIdentifierResolution {
  const namespace = index.package.identifierNamespaces.find(candidate => candidate.namespaceId === namespaceId);
  const normalizedIdentifier = namespace ? normalizeIdentifier(identifier, namespace) : identifier; 
  const mappings = namespace
    ? index.mappingsByQualifiedIdentifier.get(qualifiedIdentifierKey(namespaceId, normalizedIdentifier)) ?? []
    : [];
  const configurationRevisionIds = mappings.map(mapping => mapping.configurationRevisionId);
  return Object.freeze({
    state: mappings.length === 0 ? 'zero' : mappings.length === 1 ? 'one' : 'many',
    namespaceId,
    submittedIdentifier: identifier,
    normalizedIdentifier,
    mappings,
    configurationRevisionIds,
    configurationIds: configurationIds(index, configurationRevisionIds),
  });
}

/**
 * Resolve an unqualified identifier without allowing one namespace to win over
 * another. Callers that know the namespace should use resolveExactIdentifier.
 */
export function resolveExactIdentifierAcrossNamespaces(
  index: CatalogIndex,
  identifier: string,
): AcrossNamespaceIdentifierResolution {
  const matches = index.package.identifierNamespaces
    .map(namespace => resolveExactIdentifier(index, namespace.namespaceId, identifier))
    .filter(match => match.state !== 'zero');
  const mappings = matches.flatMap(match => match.mappings);
  const configurationRevisionIds = mappings.map(mapping => mapping.configurationRevisionId);
  return Object.freeze({
    state: mappings.length === 0 ? 'zero' : mappings.length === 1 ? 'one' : 'many',
    submittedIdentifier: identifier,
    matches,
    mappings,
    configurationRevisionIds,
    configurationIds: configurationIds(index, configurationRevisionIds),
  });
}
