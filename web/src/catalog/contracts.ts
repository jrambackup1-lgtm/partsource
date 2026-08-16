export const CATALOG_PACKAGE_SCHEMA_VERSION = 1 as const;

export type CatalogDigest = `sha256:${string}`;
export type CatalogLifecycleStatus = 'active' | 'corrected' | 'superseded' | 'withdrawn';
export type FactState = 'known' | 'not_supplied' | 'unknown' | 'not_applicable' | 'conflicting';
export type FactPrimitive = string | number;

export type KnownFactValue = Readonly<{ state: 'known'; value: FactPrimitive }>;
export type AbsentFactValue = Readonly<{
  state: 'not_supplied' | 'unknown' | 'not_applicable';
  reason: string;
}>;
export type ConflictingFactValue = Readonly<{
  state: 'conflicting';
  values: readonly FactPrimitive[];
  reason: string;
}>;
export type FactValue = KnownFactValue | AbsentFactValue | ConflictingFactValue;

export type FactScope =
  | Readonly<{ kind: 'all_families' }>
  | Readonly<{ kind: 'families'; familyIds: readonly string[] }>;

export interface FactDefinition {
  readonly factId: string;
  readonly label: string;
  readonly valueType: 'string_enum' | 'number';
  readonly unit: string | null;
  readonly allowedValues: readonly FactPrimitive[];
  readonly min: number | null;
  readonly max: number | null;
  readonly scope: FactScope;
  readonly allowedStates: readonly FactState[];
}

export interface CatalogManifest {
  readonly releaseId: string;
  /** SHA-256 of the canonical package serialization, which omits only this field. */
  readonly digest: CatalogDigest;
  readonly publishedAt: string;
  readonly allowedUse: 'synthetic_demo_only' | 'private_dev_only' | 'public_catalog';
  readonly dataOrigin: 'synthetic' | 'cofounder_private_dev' | 'approved_public_projection';
  readonly publicationStatus: 'draft' | 'authored_demo' | 'dev_release' | 'approved_public' | 'withdrawn';
  /** Externally authorized review identity; null only for non-public demo packages. */
  readonly approvalId: string | null;
  readonly reviewedBy: string | null;
  readonly reviewedAt: string | null;
  readonly permissionGrantId: string | null;
  readonly correctsReleaseId: string | null;
  readonly supersedesReleaseId: string | null;
  readonly withdrawnAt: string | null;
  readonly withdrawalReason: string | null;
  readonly notice: string;
}

/** Approval supplied by a trusted release registry, never from the package envelope. */
export interface TrustedCatalogApproval {
  readonly releaseId: string;
  readonly digest: CatalogDigest;
  readonly approvalId: string;
  readonly permissionGrantId: string;
}

export interface CatalogLifecycle {
  readonly status: CatalogLifecycleStatus;
  readonly effectiveAt: string;
  readonly reason: string | null;
  readonly correctsId: string | null;
  readonly supersededById: string | null;
}

export interface HierarchyNode {
  readonly nodeId: string;
  readonly parentNodeId: string | null;
  readonly kind: 'category' | 'family';
  readonly label: string;
  readonly order: number;
  readonly familyId: string | null;
}

export interface CatalogFamily {
  readonly familyId: string;
  readonly label: string;
  readonly hierarchyNodeId: string;
  readonly currentSchemaRevisionId: string;
}

export interface FamilySchemaRevision {
  readonly familySchemaRevisionId: string;
  readonly familyId: string;
  readonly revision: number;
  /** Every configuration revision carries exactly one explicit FactValue for every factId. */
  readonly factIds: readonly string[];
  readonly facetIds: readonly string[];
}

export interface FacetDefinition {
  readonly facetId: string;
  readonly familySchemaRevisionId: string;
  readonly factId: string;
  readonly label: string;
  readonly order: number;
}

export interface EvidenceReference {
  readonly visibility: 'public' | 'private';
  /** Opaque reference only; private evidence content is never embedded in the package. */
  readonly ref: string;
}

export interface ProvenanceRecord {
  readonly provenanceId: string;
  readonly claimType: 'fact' | 'mapping';
  readonly sourceKind: 'synthetic_fixture' | 'cofounder_private_dev' | 'approved_public_projection';
  readonly sourceId: string;
  readonly publicationClass: 'synthetic_demo' | 'private_dev' | 'public';
  readonly permissionGrantId: string | null;
  readonly evidenceRefs: readonly EvidenceReference[];
}

export interface FactAssignment {
  readonly factId: string;
  readonly value: FactValue;
  readonly provenanceIds: readonly string[];
}

export interface CatalogConfiguration {
  readonly configurationId: string;
  readonly familyId: string;
  readonly currentRevisionId: string;
}

export interface ConfigurationRevision {
  readonly configurationRevisionId: string;
  readonly configurationId: string;
  readonly familyId: string;
  readonly familySchemaRevisionId: string;
  readonly revision: number;
  readonly lifecycle: CatalogLifecycle;
  readonly facts: readonly FactAssignment[];
}

export interface IdentifierNamespace {
  readonly namespaceId: string;
  readonly label: string;
  readonly trimPolicy: 'trim';
  readonly casePolicy: 'upper';
  readonly unicodePolicy: 'NFKC';
  /**
   * Anchored recognition pattern over the normalized identifier form. The
   * resolver uses it to route identifier-shaped input into the exact path
   * (u3): separator-free vendor part numbers must attempt exact resolution
   * and fail as "identifier not found", never as unrecognized search terms.
   */
  readonly identifierPattern: string;
}

export interface IdentifierMapping {
  readonly mappingId: string;
  readonly namespaceId: string;
  readonly identifier: string;
  readonly configurationRevisionId: string;
  readonly provenanceId: string;
  readonly lifecycle: CatalogLifecycle;
}

export interface LexiconRule {
  readonly ruleId: string;
  readonly match: 'exact_phrase';
  readonly term: string;
  readonly normalizedTerm: string;
  readonly targetType: 'hierarchy_node' | 'family' | 'fact_value';
  readonly targetId: string;
  readonly familySchemaRevisionId: string | null;
  readonly factId: string | null;
  readonly factValue: FactPrimitive | null;
}

export interface CatalogPackage {
  readonly schemaVersion: typeof CATALOG_PACKAGE_SCHEMA_VERSION;
  readonly manifest: CatalogManifest;
  readonly hierarchy: readonly HierarchyNode[];
  readonly families: readonly CatalogFamily[];
  readonly familySchemaRevisions: readonly FamilySchemaRevision[];
  readonly factDefinitions: readonly FactDefinition[];
  readonly facets: readonly FacetDefinition[];
  readonly configurations: readonly CatalogConfiguration[];
  readonly configurationRevisions: readonly ConfigurationRevision[];
  readonly identifierNamespaces: readonly IdentifierNamespace[];
  readonly identifierMappings: readonly IdentifierMapping[];
  readonly provenance: readonly ProvenanceRecord[];
  readonly lexicon: readonly LexiconRule[];
}

/**
 * Canonical JSON used by publication tooling. Object keys are recursively
 * sorted, array order is preserved, and only `manifest.digest` is omitted.
 * The parser rules out non-JSON primitives and non-finite numbers first.
 * This stays browser-safe so Node build tooling hashes exactly these bytes
 * without adding a Node dependency to runtime exports.
 */
export function serializeCatalogPackageForDigest(value: CatalogPackage): string {
  const canonicalize = (entry: unknown, path: string): string => {
    if (entry === null || typeof entry === 'boolean' || typeof entry === 'string') return JSON.stringify(entry);
    if (typeof entry === 'number') {
      if (!Number.isFinite(entry)) throw new TypeError(`Cannot canonicalize non-finite number at ${path}`);
      return JSON.stringify(entry);
    }
    if (Array.isArray(entry)) {
      return `[${entry.map((child, index) => canonicalize(child, `${path}[${index}]`)).join(',')}]`;
    }
    if (typeof entry === 'object') {
      const object = entry as Record<string, unknown>;
      const keys = Object.keys(object)
        .filter(key => !(path === '$.manifest' && key === 'digest'))
        .sort();
      return `{${keys.map(key => `${JSON.stringify(key)}:${canonicalize(object[key], `${path}.${key}`)}`).join(',')}}`;
    }
    throw new TypeError(`Cannot canonicalize ${typeof entry} at ${path}`);
  };

  return canonicalize(value, '$');
}

/** Browser-safe synchronous SHA-256 for deterministic package verification. */
export function sha256Hex(text: string): string {
  const bytes = new TextEncoder().encode(text);
  const bitLength = bytes.length * 8;
  const size = Math.ceil((bytes.length + 9) / 64) * 64;
  const padded = new Uint8Array(size);
  padded.set(bytes); padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(size - 8, Math.floor(bitLength / 0x1_0000_0000), false);
  view.setUint32(size - 4, bitLength >>> 0, false);
  const k = new Uint32Array([
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
  ]);
  const h = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
  const w = new Uint32Array(64);
  const r = (v: number, n: number) => (v >>> n) | (v << (32 - n));
  for (let offset = 0; offset < size; offset += 64) {
    for (let i = 0; i < 16; i += 1) w[i] = view.getUint32(offset + i * 4, false);
    for (let i = 16; i < 64; i += 1) {
      const a = w[i - 15], b = w[i - 2];
      w[i] = (w[i - 16] + (r(a,7)^r(a,18)^(a>>>3)) + w[i - 7] + (r(b,17)^r(b,19)^(b>>>10))) >>> 0;
    }
    let [a,b,c,d,e,f,g,z] = h;
    for (let i = 0; i < 64; i += 1) {
      const t1 = (z + (r(e,6)^r(e,11)^r(e,25)) + ((e&f)^(~e&g)) + k[i] + w[i]) >>> 0;
      const t2 = ((r(a,2)^r(a,13)^r(a,22)) + ((a&b)^(a&c)^(b&c))) >>> 0;
      z=g; g=f; f=e; e=(d+t1)>>>0; d=c; c=b; b=a; a=(t1+t2)>>>0;
    }
    h[0]=(h[0]+a)>>>0; h[1]=(h[1]+b)>>>0; h[2]=(h[2]+c)>>>0; h[3]=(h[3]+d)>>>0;
    h[4]=(h[4]+e)>>>0; h[5]=(h[5]+f)>>>0; h[6]=(h[6]+g)>>>0; h[7]=(h[7]+z)>>>0;
  }
  return Array.from(h, value => value.toString(16).padStart(8, '0')).join('');
}

export function catalogPackageDigest(value: CatalogPackage): CatalogDigest {
  return `sha256:${sha256Hex(serializeCatalogPackageForDigest(value))}`;
}
