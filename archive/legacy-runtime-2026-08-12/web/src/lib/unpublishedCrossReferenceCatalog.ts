import type { Part } from './decoder';

// Test-only unpublished candidate projection. Do not import this module from
// UI/runtime code until source clearance explicitly approves public mappings.

export type SourceApprovalStatus = 'approved' | 'blocked' | 'discovery' | 'conditional' | 'withdrawn';
export type CrossReferenceRelationship = 'verified-equivalent' | 'configuration-only' | 'candidate-match' | 'conflicted';
export type EvidenceStatus = 'complete' | 'incomplete' | 'stale' | 'withdrawn' | 'conflicted';
export type ReviewStatus = 'approved' | 'pending' | 'rejected' | 'stale' | 'conflicted' | 'withdrawn';
export type LifecycleStatus = 'current' | 'stale' | 'withdrawn' | 'conflicted' | 'draft';

export interface SourceRecord {
  id: string;
  name: string;
  owner: string;
  status: SourceApprovalStatus;
  permissionEvidence: string;
  approvedAt?: string;
  approvedBy?: string;
  permittedFields: string[];
  publicDisplayAllowed: boolean;
  fixture?: boolean;
}

export interface CanonicalConfiguration {
  id: string;
  partNumber: string;
  revision: string;
  normalizedFacts: Pick<Part, 'category' | 'type' | 'thread' | 'pitch' | 'length' | 'material' | 'finish' | 'drive' | 'standard'>;
  sourceIds: string[];
  fixture?: boolean;
}

export interface EvidenceReference {
  label: string;
  locator: string;
}

export interface EvidenceRecord {
  id: string;
  status: EvidenceStatus;
  sourceId: string;
  references: EvidenceReference[];
  observedAt: string;
  summary: string;
  supportsFacts: Array<keyof CanonicalConfiguration['normalizedFacts'] | 'mcmasterIdentifier' | 'alternativeIdentifier'>;
  fixture?: boolean;
}

export interface IndependentReviewRecord {
  id: string;
  revision: string;
  status: ReviewStatus;
  reviewer: string;
  reviewedAt: string;
  evidenceIds: string[];
  decision: string;
  fixture?: boolean;
}

export interface LifecycleRecord {
  status: LifecycleStatus;
  verifiedAt: string;
  expiresAt?: string;
  withdrawnAt?: string;
  conflictId?: string;
}

export interface CrossReferenceRecord {
  id: string;
  revision: string;
  relationship: CrossReferenceRelationship;
  mcmasterIdentifier: string;
  alternativeIdentifier: string;
  alternativeSupplier: string;
  manufacturerSnapshot?: {
    name: string;
    partNumber: string;
  };
  canonicalConfigurationId: string;
  sourceId: string;
  evidenceIds: string[];
  reviewId: string;
  lifecycle: LifecycleRecord;
  fixture?: boolean;
}

export interface PublishedVerifiedEquivalentRecord {
  recordId: string;
  recordRevision: string;
  mcmasterIdentifier: string;
  alternativeIdentifier: string;
  alternativeSupplier: string;
  manufacturerSnapshot?: CrossReferenceRecord['manufacturerSnapshot'];
  canonicalConfigurationId: string;
  normalizedFacts: CanonicalConfiguration['normalizedFacts'];
  evidenceReferences: Array<{
    evidenceId: string;
    sourceId: string;
    references: EvidenceReference[];
    observedAt: string;
    summary: string;
  }>;
  review: {
    reviewId: string;
    revision: string;
    reviewer: string;
    reviewedAt: string;
    status: 'approved';
  };
  lifecycle: Extract<LifecycleRecord, { status: 'current' }> | LifecycleRecord & { status: 'current' };
}

export interface PublishedCatalogVersion {
  version: string;
  publishedAt: string;
  records: PublishedVerifiedEquivalentRecord[];
}

export interface VerifiedEquivalenceCatalogInput {
  sources: SourceRecord[];
  configurations: CanonicalConfiguration[];
  evidence: EvidenceRecord[];
  reviews: IndependentReviewRecord[];
  crosses: CrossReferenceRecord[];
}

export const UNPUBLISHED_CROSS_REFERENCE_CATALOG_VERSION = 'unpublished-cross-reference-poc-2026-08-09';

const mcmasterIdentifierPattern = /^\d{5,6}[A-Z]\d{3,4}$/;

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isCurrent(lifecycle: LifecycleRecord, nowIso: string): boolean {
  if (lifecycle.status !== 'current') return false;
  if (!hasText(lifecycle.verifiedAt)) return false;
  if (lifecycle.expiresAt && lifecycle.expiresAt <= nowIso) return false;
  if (lifecycle.withdrawnAt || lifecycle.conflictId) return false;
  return true;
}

function completeConfiguration(config: CanonicalConfiguration | undefined): config is CanonicalConfiguration {
  if (!config || config.fixture) return false;
  if (!hasText(config.id) || !hasText(config.partNumber) || !hasText(config.revision)) return false;
  const facts = config.normalizedFacts;
  return !!facts
    && hasText(facts.category)
    && hasText(facts.type)
    && hasText(facts.thread)
    && hasText(facts.pitch)
    && hasText(facts.length)
    && hasText(facts.material)
    && hasText(facts.finish)
    && hasText(facts.drive)
    && hasText(facts.standard);
}

function approvedSource(source: SourceRecord | undefined): source is SourceRecord {
  return !!source
    && !source.fixture
    && source.status === 'approved'
    && source.publicDisplayAllowed === true
    && hasText(source.permissionEvidence)
    && hasText(source.approvedAt)
    && hasText(source.approvedBy)
    && source.permittedFields.length > 0;
}

function completeEvidence(evidence: EvidenceRecord | undefined, source: SourceRecord | undefined): evidence is EvidenceRecord {
  return !!evidence
    && !evidence.fixture
    && evidence.status === 'complete'
    && approvedSource(source)
    && evidence.references.length > 0
    && evidence.references.every(ref => hasText(ref.label) && hasText(ref.locator))
    && hasText(evidence.observedAt)
    && hasText(evidence.summary)
    && evidence.supportsFacts.length > 0;
}

function approvedReview(review: IndependentReviewRecord | undefined, evidenceById: Map<string, EvidenceRecord>): review is IndependentReviewRecord {
  return !!review
    && !review.fixture
    && review.status === 'approved'
    && hasText(review.id)
    && hasText(review.revision)
    && hasText(review.reviewer)
    && hasText(review.reviewedAt)
    && hasText(review.decision)
    && review.evidenceIds.length > 0
    && review.evidenceIds.every(id => evidenceById.has(id));
}

function publishableCross(
  cross: CrossReferenceRecord,
  indexes: {
    sourceById: Map<string, SourceRecord>;
    configById: Map<string, CanonicalConfiguration>;
    evidenceById: Map<string, EvidenceRecord>;
    reviewById: Map<string, IndependentReviewRecord>;
  },
  nowIso: string,
): PublishedVerifiedEquivalentRecord | null {
  if (cross.fixture) return null;
  if (cross.relationship !== 'verified-equivalent') return null;
  if (!hasText(cross.id) || !hasText(cross.revision)) return null;
  if (!mcmasterIdentifierPattern.test(cross.mcmasterIdentifier)) return null;
  if (!hasText(cross.alternativeIdentifier) || !hasText(cross.alternativeSupplier)) return null;
  if (!isCurrent(cross.lifecycle, nowIso)) return null;

  const source = indexes.sourceById.get(cross.sourceId);
  if (!approvedSource(source)) return null;

  const configuration = indexes.configById.get(cross.canonicalConfigurationId);
  if (!completeConfiguration(configuration)) return null;

  const evidence = cross.evidenceIds.map(id => indexes.evidenceById.get(id));
  if (evidence.length === 0 || evidence.some(record => !completeEvidence(record, record ? indexes.sourceById.get(record.sourceId) : undefined))) {
    return null;
  }

  const review = indexes.reviewById.get(cross.reviewId);
  if (!approvedReview(review, indexes.evidenceById)) return null;
  if (!cross.evidenceIds.every(id => review.evidenceIds.includes(id))) return null;

  return {
    recordId: cross.id,
    recordRevision: cross.revision,
    mcmasterIdentifier: cross.mcmasterIdentifier,
    alternativeIdentifier: cross.alternativeIdentifier,
    alternativeSupplier: cross.alternativeSupplier,
    manufacturerSnapshot: cross.manufacturerSnapshot,
    canonicalConfigurationId: configuration.id,
    normalizedFacts: configuration.normalizedFacts,
    evidenceReferences: evidence.map(record => ({
      evidenceId: record!.id,
      sourceId: record!.sourceId,
      references: record!.references,
      observedAt: record!.observedAt,
      summary: record!.summary,
    })),
    review: {
      reviewId: review.id,
      revision: review.revision,
      reviewer: review.reviewer,
      reviewedAt: review.reviewedAt,
      status: 'approved',
    },
    lifecycle: cross.lifecycle as PublishedVerifiedEquivalentRecord['lifecycle'],
  };
}

export function publishVerifiedEquivalenceCatalog(
  input: VerifiedEquivalenceCatalogInput,
  options: { version?: string; publishedAt?: string; now?: string } = {},
): PublishedCatalogVersion {
  const nowIso = options.now ?? new Date().toISOString();
  const indexes = {
    sourceById: new Map(input.sources.map(source => [source.id, source])),
    configById: new Map(input.configurations.map(config => [config.id, config])),
    evidenceById: new Map(input.evidence.map(record => [record.id, record])),
    reviewById: new Map(input.reviews.map(review => [review.id, review])),
  };

  return {
    version: options.version ?? UNPUBLISHED_CROSS_REFERENCE_CATALOG_VERSION,
    publishedAt: options.publishedAt ?? nowIso,
    records: input.crosses
      .map(cross => publishableCross(cross, indexes, nowIso))
      .filter((record): record is PublishedVerifiedEquivalentRecord => record !== null),
  };
}

export const UNPUBLISHED_CROSS_REFERENCE_SOURCES: SourceRecord[] = [
  {
    id: 'src-partsource-manual-verification-pilot',
    name: 'PartSource unpublished cross-reference pilot candidates',
    owner: 'PartSource',
    status: 'discovery',
    permissionEvidence: 'Candidate records only. Production publication waits for ticket 05 reviewed pilot evidence and source clearance.',
    permittedFields: ['mcmasterIdentifier', 'alternativeIdentifier', 'normalizedFacts', 'evidenceReferences', 'reviewRevision', 'lifecycle'],
    publicDisplayAllowed: false,
  },
  {
    id: 'src-fixture-unapproved',
    name: 'Synthetic fixture source - never publish',
    owner: 'PartSource test fixture',
    status: 'discovery',
    permissionEvidence: '',
    permittedFields: [],
    publicDisplayAllowed: false,
    fixture: true,
  },
];

export const UNPUBLISHED_CROSS_REFERENCE_CONFIGURATIONS: CanonicalConfiguration[] = [
  {
    id: 'cfg-din912-m3x10',
    partNumber: 'DIN912-M3X10',
    revision: 'cfg-rev-2026-08-09',
    normalizedFacts: {
      category: 'Screws & Bolts',
      type: 'Socket Head Cap Screw',
      thread: 'M3',
      pitch: '0.5 mm',
      length: '10 mm',
      material: 'Alloy Steel',
      finish: 'Black-Oxide',
      drive: 'Hex',
      standard: 'DIN 912 / ISO 4762',
    },
    sourceIds: ['src-partsource-manual-verification-pilot'],
  },
  {
    id: 'cfg-din125-m3-a2',
    partNumber: 'DIN125-M3-A2',
    revision: 'cfg-rev-2026-08-09',
    normalizedFacts: {
      category: 'Washers',
      type: 'Flat Washer',
      thread: 'M3',
      pitch: 'N/A',
      length: 'N/A',
      material: '18-8 Stainless Steel',
      finish: 'Plain',
      drive: 'N/A',
      standard: 'DIN 125A / ISO 7089',
    },
    sourceIds: ['src-partsource-manual-verification-pilot'],
  },
  {
    id: 'cfg-fixture',
    partNumber: 'FIXTURE-M3',
    revision: 'fixture',
    normalizedFacts: {
      category: 'Fixture', type: 'Fixture', thread: 'M3', pitch: '0.5 mm', length: '10 mm', material: 'Fixture', finish: 'Fixture', drive: 'Fixture', standard: 'Fixture',
    },
    sourceIds: ['src-fixture-unapproved'],
    fixture: true,
  },
];

export const UNPUBLISHED_CROSS_REFERENCE_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'ev-91290a115-din912-m3x10',
    status: 'complete',
    sourceId: 'src-partsource-manual-verification-pilot',
    references: [
      { label: 'PartSource unpublished cross-reference note', locator: 'web/src/lib/unpublishedCrossReferenceCatalog.ts#ev-91290a115-din912-m3x10' },
      { label: 'Product truth exact-equivalence requirements', locator: 'research/product-contract.md#exact-mcmaster-lookup-result-state-contract' },
    ],
    observedAt: '2026-08-09',
    summary: '91290A115 reviewed as M3×10 black-oxide alloy socket head cap screw matching the canonical DIN912-M3X10 configuration.',
    supportsFacts: ['mcmasterIdentifier', 'alternativeIdentifier', 'type', 'thread', 'pitch', 'length', 'material', 'finish', 'drive', 'standard'],
  },
  {
    id: 'ev-93475a210-din125-m3-a2',
    status: 'complete',
    sourceId: 'src-partsource-manual-verification-pilot',
    references: [
      { label: 'PartSource unpublished cross-reference note', locator: 'web/src/lib/unpublishedCrossReferenceCatalog.ts#ev-93475a210-din125-m3-a2' },
      { label: 'Product truth exact-equivalence requirements', locator: 'research/product-contract.md#exact-mcmaster-lookup-result-state-contract' },
    ],
    observedAt: '2026-08-09',
    summary: '93475A210 reviewed as M3 18-8 stainless flat washer matching the canonical DIN125-M3-A2 configuration.',
    supportsFacts: ['mcmasterIdentifier', 'alternativeIdentifier', 'type', 'thread', 'pitch', 'length', 'material', 'finish', 'drive', 'standard'],
  },
  {
    id: 'ev-fixture',
    status: 'complete',
    sourceId: 'src-fixture-unapproved',
    references: [{ label: 'Synthetic fixture', locator: 'fixture://do-not-publish' }],
    observedAt: '2026-08-09',
    summary: 'Synthetic fixture evidence; must never publish.',
    supportsFacts: ['mcmasterIdentifier'],
    fixture: true,
  },
];

export const UNPUBLISHED_CROSS_REFERENCE_REVIEWS: IndependentReviewRecord[] = [
  {
    id: 'rev-91290a115-din912-m3x10',
    revision: 'review-rev-2026-08-09',
    status: 'approved',
    reviewer: 'PartSource independent review',
    reviewedAt: '2026-08-09',
    evidenceIds: ['ev-91290a115-din912-m3x10'],
    decision: 'Candidate reviewed for internal cross-reference projection only; public publication remains blocked until source clearance.',
  },
  {
    id: 'rev-93475a210-din125-m3-a2',
    revision: 'review-rev-2026-08-09',
    status: 'approved',
    reviewer: 'PartSource independent review',
    reviewedAt: '2026-08-09',
    evidenceIds: ['ev-93475a210-din125-m3-a2'],
    decision: 'Candidate reviewed for internal cross-reference projection only; public publication remains blocked until source clearance.',
  },
  {
    id: 'rev-fixture',
    revision: 'fixture',
    status: 'approved',
    reviewer: 'Fixture reviewer',
    reviewedAt: '2026-08-09',
    evidenceIds: ['ev-fixture'],
    decision: 'Synthetic fixture only.',
    fixture: true,
  },
];

export const UNPUBLISHED_CROSS_REFERENCE_CROSSES: CrossReferenceRecord[] = [
  {
    id: 'xref-91290a115-din912-m3x10',
    revision: 'xref-rev-2026-08-09',
    relationship: 'verified-equivalent',
    mcmasterIdentifier: '91290A115',
    alternativeIdentifier: 'DIN912-M3X10',
    alternativeSupplier: 'pending reviewed pilot source',
    manufacturerSnapshot: { name: 'Pending reviewed pilot source', partNumber: 'DIN912-M3X10' },
    canonicalConfigurationId: 'cfg-din912-m3x10',
    sourceId: 'src-partsource-manual-verification-pilot',
    evidenceIds: ['ev-91290a115-din912-m3x10'],
    reviewId: 'rev-91290a115-din912-m3x10',
    lifecycle: { status: 'current', verifiedAt: '2026-08-09', expiresAt: '2027-08-09' },
  },
  {
    id: 'xref-93475a210-din125-m3-a2',
    revision: 'xref-rev-2026-08-09',
    relationship: 'verified-equivalent',
    mcmasterIdentifier: '93475A210',
    alternativeIdentifier: 'DIN125-M3-A2',
    alternativeSupplier: 'pending reviewed pilot source',
    manufacturerSnapshot: { name: 'Pending reviewed pilot source', partNumber: 'DIN125-M3-A2' },
    canonicalConfigurationId: 'cfg-din125-m3-a2',
    sourceId: 'src-partsource-manual-verification-pilot',
    evidenceIds: ['ev-93475a210-din125-m3-a2'],
    reviewId: 'rev-93475a210-din125-m3-a2',
    lifecycle: { status: 'current', verifiedAt: '2026-08-09', expiresAt: '2027-08-09' },
  },
  {
    id: 'xref-fixture',
    revision: 'fixture',
    relationship: 'verified-equivalent',
    mcmasterIdentifier: '99999A999',
    alternativeIdentifier: 'FIXTURE-M3',
    alternativeSupplier: 'Synthetic fixture - never publish',
    canonicalConfigurationId: 'cfg-fixture',
    sourceId: 'src-fixture-unapproved',
    evidenceIds: ['ev-fixture'],
    reviewId: 'rev-fixture',
    lifecycle: { status: 'current', verifiedAt: '2026-08-09', expiresAt: '2099-01-01' },
    fixture: true,
  },
];

export const SAFE_PUBLIC_CROSS_REFERENCE_PROJECTION = publishVerifiedEquivalenceCatalog({
  sources: UNPUBLISHED_CROSS_REFERENCE_SOURCES,
  configurations: UNPUBLISHED_CROSS_REFERENCE_CONFIGURATIONS,
  evidence: UNPUBLISHED_CROSS_REFERENCE_EVIDENCE,
  reviews: UNPUBLISHED_CROSS_REFERENCE_REVIEWS,
  crosses: UNPUBLISHED_CROSS_REFERENCE_CROSSES,
}, {
  version: UNPUBLISHED_CROSS_REFERENCE_CATALOG_VERSION,
  publishedAt: '2026-08-09T00:00:00.000Z',
  now: '2026-08-09T00:00:00.000Z',
});

export const PUBLISHED_MCMASTER_CROSSES = SAFE_PUBLIC_CROSS_REFERENCE_PROJECTION.records.map(record => ({
  mcmaster: record.mcmasterIdentifier,
  partNumber: record.alternativeIdentifier,
  note: `${record.recordId} ${record.recordRevision}; evidence ${record.evidenceReferences.map(ref => ref.evidenceId).join(', ')}; review ${record.review.reviewId} ${record.review.revision}`,
}));
