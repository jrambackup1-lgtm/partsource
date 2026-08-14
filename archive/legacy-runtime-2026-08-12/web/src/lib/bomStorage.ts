export const BOM_STORAGE_KEY = 'partsource_boms:v1';
export const LEGACY_BOM_STORAGE_KEY = 'partsource_bom';
export const BOM_QUARANTINE_STORAGE_KEY = 'partsource_bom_quarantine:v1';
export const BOM_STORAGE_VERSION = 1;

export type BomItemOrigin = 'verified' | 'imported' | 'legacy';
export type BomItemVerificationStatus = 'verified' | 'unverified-imported' | 'legacy-unverified';

export interface BomSelectionSnapshot {
  inputText: string;
  originalMcmasterNumber: string;
  selectedCrossReferenceRecordId: string | null;
  alternativePartNumber: string;
  supplier: string;
  description: string;
  material: string;
  verificationRevision: string | null;
  configurationFacts: { label: string; value: string }[];
  supplierSearchDestinations: { name: string; label: string; url: string; query: string; requiresVerification: true }[];
  sourceNotes: string[];
}

export interface BOMItem {
  id: string;
  quantity: number;
  notes: string;
  userUnitCostUsd: number;
  origin: BomItemOrigin;
  verificationStatus: BomItemVerificationStatus;
  selectionSnapshot: BomSelectionSnapshot;

  // Backward-compatible UI aliases. They are validated as mirrors of the immutable snapshot/canonical fields.
  partNumber: string;
  description: string;
  material: string;
  supplier: string;
  qty: number;
  unitCost: number;
}

export interface Bom {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  items: BOMItem[];
}

export interface BomStore {
  version: 1;
  activeBomId: string | null;
  boms: Bom[];
}

export interface BomQuarantineRecord {
  sourceKey: string;
  capturedAt: string;
  reason: string;
  payload: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const NAME_MAX_LENGTH = 80;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';
const isNullableString = (value: unknown): value is string | null => value === null || typeof value === 'string';
const isUuid = (value: unknown): value is string => isString(value) && UUID_RE.test(value);
const isIsoDate = (value: unknown): value is string => isString(value) && ISO_DATE_RE.test(value) && !Number.isNaN(Date.parse(value));
const isPositiveInteger = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value > 0;
const isNonNegativeFinite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;

const normalizeFactList = (value: unknown): { label: string; value: string }[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((fact) => {
    if (!isRecord(fact) || !isString(fact.label) || !isString(fact.value)) return [];
    const label = fact.label.trim();
    if (!label) return [];
    return [{ label, value: fact.value.trim() }];
  });
};

const normalizeSupplierDestinations = (value: unknown): { name: string; label: string; url: string; query: string; requiresVerification: true }[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((destination) => {
    if (!isRecord(destination) || !isString(destination.name) || !isString(destination.label) || !isString(destination.url)) return [];
    const name = destination.name.trim();
    const label = destination.label.trim();
    const url = destination.url.trim();
    if (!name || !label || !url) return [];
    return [{
      name,
      label,
      url,
      query: isString(destination.query) ? destination.query.trim() : '',
      requiresVerification: true as const,
    }];
  });
};

const normalizeStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => isString(entry) && entry.trim() ? [entry.trim()] : []);
};

export const createBomUuid = (): string => {
  const randomUUID = globalThis.crypto?.randomUUID?.bind(globalThis.crypto);
  if (randomUUID) return randomUUID();
  // RFC4122 v4 fallback for older browsers/tests.
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (Number(c) ^ (Math.random() * 16 >> Number(c) / 4)).toString(16),
  );
};

export const createEmptyBomStore = (): BomStore => ({ version: 1, activeBomId: null, boms: [] });

export const normalizeBomName = (name: string): string => name.trim().replace(/\s+/g, ' ');

export const validateBomName = (name: unknown): string | null => {
  if (!isString(name)) return null;
  const normalized = normalizeBomName(name);
  if (normalized.length < 1 || normalized.length > NAME_MAX_LENGTH) return null;
  return normalized;
};

export const createSelectionSnapshot = (input: {
  inputText?: string;
  originalMcmasterNumber?: string;
  selectedCrossReferenceRecordId?: string | null;
  alternativePartNumber?: string;
  supplier?: string;
  description?: string;
  material?: string;
  verificationRevision?: string | null;
  partNumber?: string;
  configurationFacts?: { label: string; value: string }[];
  supplierSearchDestinations?: { name: string; label: string; url: string; query?: string; requiresVerification?: true }[];
  sourceNotes?: string[];
}): BomSelectionSnapshot => {
  const partNumber = String(input.originalMcmasterNumber ?? input.partNumber ?? input.alternativePartNumber ?? '').trim();
  return Object.freeze({
    inputText: String(input.inputText ?? partNumber).trim() || partNumber,
    originalMcmasterNumber: partNumber,
    selectedCrossReferenceRecordId: input.selectedCrossReferenceRecordId ?? null,
    alternativePartNumber: String(input.alternativePartNumber ?? input.partNumber ?? partNumber).trim(),
    supplier: String(input.supplier ?? 'Unselected').trim() || 'Unselected',
    description: String(input.description ?? '').trim(),
    material: String(input.material ?? '').trim(),
    verificationRevision: input.verificationRevision ?? null,
    configurationFacts: normalizeFactList(input.configurationFacts),
    supplierSearchDestinations: normalizeSupplierDestinations(input.supplierSearchDestinations),
    sourceNotes: normalizeStringList(input.sourceNotes),
  });
};

export const createBomItem = (input: {
  id?: string;
  quantity?: number;
  qty?: number;
  notes?: string;
  userUnitCostUsd?: number;
  unitCost?: number;
  origin?: BomItemOrigin;
  verificationStatus?: BomItemVerificationStatus;
  selectionSnapshot?: BomSelectionSnapshot;
  originalMcmasterNumber?: string;
  selectedCrossReferenceRecordId?: string | null;
  alternativePartNumber?: string;
  partNumber?: string;
  supplier?: string;
  description?: string;
  material?: string;
  verificationRevision?: string | null;
  inputText?: string;
  configurationFacts?: { label: string; value: string }[];
  supplierSearchDestinations?: { name: string; label: string; url: string; query?: string; requiresVerification?: true }[];
  sourceNotes?: string[];
}): BOMItem => {
  const snapshot = input.selectionSnapshot ?? createSelectionSnapshot(input);
  const quantity = input.quantity ?? input.qty ?? 1;
  const userUnitCostUsd = input.userUnitCostUsd ?? input.unitCost ?? 0;
  return {
    id: input.id ?? createBomUuid(),
    quantity,
    notes: input.notes ?? '',
    userUnitCostUsd,
    origin: input.origin ?? 'imported',
    verificationStatus: input.verificationStatus ?? 'unverified-imported',
    selectionSnapshot: snapshot,
    partNumber: snapshot.alternativePartNumber || snapshot.originalMcmasterNumber,
    description: snapshot.description,
    material: snapshot.material,
    supplier: snapshot.supplier,
    qty: quantity,
    unitCost: userUnitCostUsd,
  };
};

const validateSelectionSnapshot = (value: unknown): BomSelectionSnapshot | null => {
  if (!isRecord(value)) return null;
  if (!isString(value.originalMcmasterNumber) || value.originalMcmasterNumber.trim().length === 0) return null;
  if (!isNullableString(value.selectedCrossReferenceRecordId)) return null;
  if (!isString(value.alternativePartNumber) || value.alternativePartNumber.trim().length === 0) return null;
  if (!isString(value.supplier) || value.supplier.trim().length === 0) return null;
  if (!isString(value.description)) return null;
  if (!isString(value.material)) return null;
  if (!isNullableString(value.verificationRevision)) return null;
  const inputText = isString(value.inputText) && value.inputText.trim() ? value.inputText.trim() : value.originalMcmasterNumber.trim();
  return {
    inputText,
    originalMcmasterNumber: value.originalMcmasterNumber.trim(),
    selectedCrossReferenceRecordId: value.selectedCrossReferenceRecordId,
    alternativePartNumber: value.alternativePartNumber.trim(),
    supplier: value.supplier.trim(),
    description: value.description,
    material: value.material,
    verificationRevision: value.verificationRevision,
    configurationFacts: normalizeFactList(value.configurationFacts),
    supplierSearchDestinations: normalizeSupplierDestinations(value.supplierSearchDestinations),
    sourceNotes: normalizeStringList(value.sourceNotes),
  };
};

export const validateBOMItem = (value: unknown): BOMItem | null => {
  if (!isRecord(value)) return null;
  if (!isUuid(value.id)) return null;
  if (!isPositiveInteger(value.quantity)) return null;
  if (!isString(value.notes)) return null;
  if (!isNonNegativeFinite(value.userUnitCostUsd)) return null;
  if (value.origin !== 'verified' && value.origin !== 'imported' && value.origin !== 'legacy') return null;
  if (value.verificationStatus !== 'verified' && value.verificationStatus !== 'unverified-imported' && value.verificationStatus !== 'legacy-unverified') return null;
  const snapshot = validateSelectionSnapshot(value.selectionSnapshot);
  if (!snapshot) return null;
  if (value.qty !== value.quantity || value.unitCost !== value.userUnitCostUsd) return null;
  if (value.partNumber !== (snapshot.alternativePartNumber || snapshot.originalMcmasterNumber)) return null;
  if (value.description !== snapshot.description || value.material !== snapshot.material || value.supplier !== snapshot.supplier) return null;
  return { ...value, selectionSnapshot: snapshot } as BOMItem;
};

export const validateBOMItems = (value: unknown): BOMItem[] => {
  if (!Array.isArray(value)) return [];
  const ids = new Set<string>();
  const valid: BOMItem[] = [];
  for (const item of value) {
    const checked = validateBOMItem(item);
    if (!checked || ids.has(checked.id)) continue;
    ids.add(checked.id);
    valid.push(checked);
  }
  return valid;
};

export const validateBomStore = (value: unknown): BomStore => {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.boms) || !isNullableString(value.activeBomId)) {
    throw new Error('Invalid BOM store envelope.');
  }

  const bomIds = new Set<string>();
  const names = new Set<string>();
  const boms: Bom[] = [];
  for (const bom of value.boms) {
    if (!isRecord(bom) || !isUuid(bom.id)) throw new Error('Invalid BOM id.');
    if (bomIds.has(bom.id)) throw new Error('Duplicate BOM id.');
    bomIds.add(bom.id);

    const name = validateBomName(bom.name);
    if (!name) throw new Error('Invalid BOM name.');
    const nameKey = name.toLocaleLowerCase();
    if (names.has(nameKey)) throw new Error('Duplicate BOM name.');
    names.add(nameKey);

    if (!isIsoDate(bom.createdAt) || !isIsoDate(bom.updatedAt)) throw new Error('Invalid BOM timestamps.');
    if (Date.parse(bom.updatedAt) < Date.parse(bom.createdAt)) throw new Error('BOM updatedAt precedes createdAt.');
    if (!Array.isArray(bom.items)) throw new Error('Invalid BOM items.');
    const items = validateBOMItems(bom.items);
    if (items.length !== bom.items.length) throw new Error('Invalid or duplicate BOM item.');
    boms.push({ id: bom.id, name, createdAt: bom.createdAt, updatedAt: bom.updatedAt, items });
  }

  if (value.activeBomId !== null && !bomIds.has(value.activeBomId)) throw new Error('Active BOM id does not exist.');
  return { version: 1, activeBomId: value.activeBomId, boms };
};

export function parseStoredBOMStore(raw: string | null): BomStore {
  if (!raw) return createEmptyBomStore();
  try {
    return validateBomStore(JSON.parse(raw));
  } catch {
    return createEmptyBomStore();
  }
}

export function serializeBOMStore(store: BomStore): string {
  return JSON.stringify(validateBomStore(store));
}

// Legacy compatibility: the active BOM's items are still available to older UI/tests.
export function parseStoredBOM(raw: string | null): { items: BOMItem[]; needsMigration: boolean } {
  const store = parseStoredBOMStore(raw);
  return { items: store.boms.find(bom => bom.id === store.activeBomId)?.items ?? [], needsMigration: false };
}

export function serializeBOM(items: BOMItem[]): string {
  const now = new Date().toISOString();
  const bomId = createBomUuid();
  return serializeBOMStore({
    version: 1,
    activeBomId: items.length ? bomId : null,
    boms: items.length ? [{ id: bomId, name: 'BOM 1', createdAt: now, updatedAt: now, items }] : [],
  });
}

const isLegacyLineCandidate = (value: unknown): value is Record<string, unknown> =>
  isRecord(value)
  && isString(value.partNumber) && value.partNumber.trim().length > 0
  && (value.qty === undefined || isPositiveInteger(value.qty))
  && (value.unitCost === undefined || isNonNegativeFinite(value.unitCost));

const extractLegacyRows = (parsed: unknown): unknown[] | null => {
  if (Array.isArray(parsed)) return parsed;
  if (isRecord(parsed) && (parsed.version === 1 || parsed.version === 2) && Array.isArray(parsed.items)) return parsed.items;
  return null;
};

export function migrateLegacyBomPayload(raw: string, now = new Date().toISOString()): { store: BomStore; quarantine: BomQuarantineRecord[] } {
  const quarantine: BomQuarantineRecord[] = [];
  try {
    const parsed: unknown = JSON.parse(raw);
    const rows = extractLegacyRows(parsed);
    if (!rows) {
      return { store: createEmptyBomStore(), quarantine: [{ sourceKey: LEGACY_BOM_STORAGE_KEY, capturedAt: now, reason: 'Unsupported legacy BOM shape.', payload: raw }] };
    }
    const items: BOMItem[] = [];
    rows.forEach((row, index) => {
      if (!isLegacyLineCandidate(row)) {
        quarantine.push({ sourceKey: LEGACY_BOM_STORAGE_KEY, capturedAt: now, reason: `Rejected legacy row ${index}.`, payload: JSON.stringify(row) });
        return;
      }
      const item = createBomItem({
        partNumber: String(row.partNumber).trim(),
        description: isString(row.description) ? row.description : 'Legacy Part',
        material: isString(row.material) ? row.material : '',
        supplier: isString(row.supplier) ? row.supplier : 'Unselected',
        qty: isPositiveInteger(row.qty) ? row.qty : 1,
        unitCost: isNonNegativeFinite(row.unitCost) ? row.unitCost : 0,
        notes: isString(row.notes) ? row.notes : '',
        origin: 'legacy',
        verificationStatus: 'legacy-unverified',
      });
      items.push(item);
    });
    if (!items.length) return { store: createEmptyBomStore(), quarantine };
    const bomId = createBomUuid();
    return {
      store: { version: 1, activeBomId: bomId, boms: [{ id: bomId, name: 'Migrated BOM', createdAt: now, updatedAt: now, items }] },
      quarantine,
    };
  } catch {
    return { store: createEmptyBomStore(), quarantine: [{ sourceKey: LEGACY_BOM_STORAGE_KEY, capturedAt: now, reason: 'Legacy BOM JSON parse failed.', payload: raw }] };
  }
}
