import {
  createBomItem,
  createBomUuid,
  normalizeBomName,
  validateBomStore,
  type BOMItem,
  type Bom,
  type BomSelectionSnapshot,
  type BomStore,
} from './bomStorage';

export const createBOMItemId = createBomUuid;

const nowIso = () => new Date().toISOString();

export const calculateLineTotal = (item: Pick<BOMItem, 'quantity' | 'userUnitCostUsd'> | Pick<BOMItem, 'qty' | 'unitCost'>): number => {
  const quantity = 'quantity' in item ? item.quantity : item.qty;
  const unitCost = 'userUnitCostUsd' in item ? item.userUnitCostUsd : item.unitCost;
  return quantity * unitCost;
};

export const calculateBOMTotals = (items: BOMItem[]) => items.reduce(
  (totals, item) => ({
    lineCount: totals.lineCount + 1,
    totalQuantity: totals.totalQuantity + item.quantity,
    totalCost: totals.totalCost + calculateLineTotal(item),
  }),
  { lineCount: 0, totalQuantity: 0, totalCost: 0 },
);

export const calculateSupplierTotal = (
  items: BOMItem[],
  getBasePrice: (item: BOMItem) => number,
  multiplier: number,
): number => items.reduce((total, item) => total + getBasePrice(item) * multiplier * item.quantity, 0);

export const updateBOMQuantity = (items: BOMItem[], id: string, quantity: number): BOMItem[] => {
  if (!Number.isInteger(quantity) || quantity < 1) return items;
  return items.map(item => item.id === id ? { ...item, quantity, qty: quantity } : item);
};

export const deleteBOMItem = (items: BOMItem[], id: string): BOMItem[] =>
  items.filter(item => item.id !== id);

export const buildBOMExportRows = (items: BOMItem[]) => items.map(item => ({
  mcmasterNumber: item.selectionSnapshot.originalMcmasterNumber,
  alternativePartNumber: item.selectionSnapshot.alternativePartNumber,
  crossReferenceRecordId: item.selectionSnapshot.selectedCrossReferenceRecordId ?? '',
  verificationRevision: item.selectionSnapshot.verificationRevision ?? '',
  partNumber: item.partNumber,
  description: item.description,
  material: item.material,
  supplier: item.supplier,
  quantity: item.quantity,
  unitCost: item.userUnitCostUsd,
  notes: item.notes,
}));

export type BomCsvRow = Record<string, unknown>;

export interface CurrentVerifiedBomRecord {
  recordId: string;
  recordRevision: string;
  mcmasterIdentifier: string;
  alternativeIdentifier: string;
  alternativeSupplier: string;
}

export interface BomCsvImportRejectedRow {
  rowNumber: number;
  reason: string;
  row: BomCsvRow;
}

export interface BomCsvImportValidationResult {
  acceptedItems: BOMItem[];
  rejectedRows: BomCsvImportRejectedRow[];
}

export interface BomBackupPayload {
  format: 'partsource-bom-backup';
  version: 1;
  exportedAt: string;
  activeBomId: string | null;
  boms: Bom[];
}

const readCell = (row: BomCsvRow, names: string[]): string => {
  for (const name of names) {
    const value = row[name];
    if (value !== undefined && value !== null) return String(value).trim();
  }
  return '';
};

const parseCsvQuantity = (value: string): number | null => {
  if (!value) return 1;
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export const parseCsvUnitCost = (value: string): number | null => {
  if (!value) return 0;
  const normalized = value.replace(/^\$/, '').trim();
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return null;
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

const exactCurrentRecordMatch = (
  input: {
    crossReferenceRecordId: string;
    verificationRevision: string;
    mcmasterNumber: string;
    alternativePartNumber: string;
    supplier: string;
  },
  currentRecords: CurrentVerifiedBomRecord[],
): boolean => currentRecords.some(record => (
  record.recordId === input.crossReferenceRecordId
  && record.recordRevision === input.verificationRevision
  && record.mcmasterIdentifier === input.mcmasterNumber
  && record.alternativeIdentifier === input.alternativePartNumber
  && record.alternativeSupplier === input.supplier
));

export const validateBomCsvRows = (
  rows: BomCsvRow[],
  currentRecords: CurrentVerifiedBomRecord[] = [],
): BomCsvImportValidationResult => {
  const acceptedItems: BOMItem[] = [];
  const rejectedRows: BomCsvImportRejectedRow[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const mcmasterNumber = readCell(row, ['mcmasterNumber', 'McMaster number', 'McMaster Number', 'originalMcmasterNumber']);
    const alternativePartNumber = readCell(row, ['alternativePartNumber', 'Alternative part number', 'Alternative Part Number']);
    const partNumber = readCell(row, ['partNumber', 'Part Number', 'part number']);
    const effectivePartNumber = alternativePartNumber || partNumber || mcmasterNumber;
    const description = readCell(row, ['description', 'Description']);
    const material = readCell(row, ['material', 'Material']);
    const supplier = readCell(row, ['supplier', 'Supplier']) || 'Unselected';
    const crossReferenceRecordId = readCell(row, ['crossReferenceRecordId', 'Cross-reference record ID', 'Cross Reference Record ID']);
    const verificationRevision = readCell(row, ['verificationRevision', 'Verification revision', 'Verification Revision']);
    const notes = readCell(row, ['notes', 'Notes']);
    const quantity = parseCsvQuantity(readCell(row, ['quantity', 'Quantity', 'qty', 'Qty']));
    const unitCost = parseCsvUnitCost(readCell(row, ['unitCost', 'Unit cost', 'Unit Cost', 'userUnitCostUsd']));

    if (!effectivePartNumber) {
      rejectedRows.push({ rowNumber, reason: 'Missing part number.', row });
      return;
    }
    if (!quantity) {
      rejectedRows.push({ rowNumber, reason: 'Quantity must be a positive whole number.', row });
      return;
    }
    if (unitCost === null) {
      rejectedRows.push({ rowNumber, reason: 'Unit cost must be a non-negative number.', row });
      return;
    }

    const isVerified = crossReferenceRecordId.length > 0 && verificationRevision.length > 0 && exactCurrentRecordMatch({
      crossReferenceRecordId,
      verificationRevision,
      mcmasterNumber: mcmasterNumber || effectivePartNumber,
      alternativePartNumber: effectivePartNumber,
      supplier,
    }, currentRecords);

    acceptedItems.push(createBomItem({
      originalMcmasterNumber: mcmasterNumber || effectivePartNumber,
      alternativePartNumber: effectivePartNumber,
      partNumber: effectivePartNumber,
      description: description || 'Imported Part',
      material,
      supplier,
      qty: quantity,
      unitCost,
      notes,
      origin: isVerified ? 'verified' : 'imported',
      verificationStatus: isVerified ? 'verified' : 'unverified-imported',
      selectedCrossReferenceRecordId: crossReferenceRecordId || null,
      verificationRevision: verificationRevision || null,
      inputText: mcmasterNumber || effectivePartNumber,
      sourceNotes: ['Imported from selected-BOM CSV.'],
    }));
  });

  return { acceptedItems, rejectedRows };
};

export const createBomBackupPayload = (store: BomStore, exportedAt = nowIso()): BomBackupPayload => {
  const valid = validateBomStore(store);
  return { format: 'partsource-bom-backup', version: 1, exportedAt, activeBomId: valid.activeBomId, boms: valid.boms };
};

export const parseBomBackupPayload = (raw: string): BomStore => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Backup JSON could not be parsed.');
  }
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid BOM backup payload.');
  const payload = parsed as Partial<BomBackupPayload>;
  if (payload.format !== 'partsource-bom-backup' || payload.version !== 1) {
    throw new Error('Unsupported BOM backup format or version.');
  }
  if (typeof payload.exportedAt !== 'string' || Number.isNaN(Date.parse(payload.exportedAt))) {
    throw new Error('Invalid BOM backup export timestamp.');
  }
  return validateBomStore({ version: 1, activeBomId: payload.activeBomId, boms: payload.boms });
};

export const getActiveBom = (store: BomStore): Bom | null =>
  store.boms.find(bom => bom.id === store.activeBomId) ?? null;

export const nextBomName = (boms: Pick<Bom, 'name'>[]): string => {
  const names = new Set(boms.map(bom => normalizeBomName(bom.name).toLocaleLowerCase()));
  let index = 1;
  while (names.has(`bom ${index}`)) index += 1;
  return `BOM ${index}`;
};

const uniqueCopyName = (baseName: string, boms: Pick<Bom, 'name'>[]): string => {
  const names = new Set(boms.map(bom => normalizeBomName(bom.name).toLocaleLowerCase()));
  const base = `${normalizeBomName(baseName)} copy`.slice(0, 80).trim();
  if (!names.has(base.toLocaleLowerCase())) return base;
  for (let index = 2; index < 1000; index += 1) {
    const suffix = ` ${index}`;
    const candidate = `${base.slice(0, 80 - suffix.length).trim()}${suffix}`;
    if (!names.has(candidate.toLocaleLowerCase())) return candidate;
  }
  throw new Error('Unable to create unique BOM copy name.');
};

export const createBom = (store: BomStore, name = nextBomName(store.boms)): BomStore => {
  const timestamp = nowIso();
  const bom: Bom = { id: createBomUuid(), name, createdAt: timestamp, updatedAt: timestamp, items: [] };
  return validateBomStore({ ...store, activeBomId: bom.id, boms: [...store.boms, bom] });
};

export const renameBom = (store: BomStore, bomId: string, name: string): BomStore => {
  const timestamp = nowIso();
  return validateBomStore({
    ...store,
    boms: store.boms.map(bom => bom.id === bomId ? { ...bom, name, updatedAt: timestamp } : bom),
  });
};

export const duplicateBom = (store: BomStore, bomId: string): BomStore => {
  const source = store.boms.find(bom => bom.id === bomId);
  if (!source) return store;
  const timestamp = nowIso();
  const copy: Bom = {
    id: createBomUuid(),
    name: uniqueCopyName(source.name, store.boms),
    createdAt: timestamp,
    updatedAt: timestamp,
    items: source.items.map(item => createBomItem({ ...item, id: createBomUuid(), selectionSnapshot: { ...item.selectionSnapshot } as BomSelectionSnapshot })),
  };
  return validateBomStore({ ...store, activeBomId: copy.id, boms: [...store.boms, copy] });
};

export const deleteBom = (store: BomStore, bomId: string): BomStore => {
  const index = store.boms.findIndex(bom => bom.id === bomId);
  if (index < 0) return store;
  const boms = store.boms.filter(bom => bom.id !== bomId);
  let activeBomId = store.activeBomId;
  if (store.activeBomId === bomId) {
    activeBomId = boms.length === 0 ? null : boms[Math.min(index, boms.length - 1)].id;
  }
  return validateBomStore({ ...store, activeBomId, boms });
};

export const addItemToBom = (store: BomStore, bomId: string, item: Omit<BOMItem, 'id'> | BOMItem): BomStore => {
  const timestamp = nowIso();
  const boms = store.boms.map(bom => {
    if (bom.id !== bomId) return bom;
    const newItem = createBomItem({ ...item, id: 'id' in item && item.id ? item.id : createBomUuid(), selectionSnapshot: { ...item.selectionSnapshot } });
    return { ...bom, updatedAt: timestamp, items: [...bom.items, newItem] };
  });
  return validateBomStore({ ...store, boms });
};

export const updateBomItemQuantity = (store: BomStore, bomId: string, itemId: string, quantity: number): BomStore => {
  const timestamp = nowIso();
  return validateBomStore({
    ...store,
    boms: store.boms.map(bom => bom.id === bomId ? { ...bom, updatedAt: timestamp, items: updateBOMQuantity(bom.items, itemId, quantity) } : bom),
  });
};

export const deleteBomLineItem = (store: BomStore, bomId: string, itemId: string): BomStore => {
  const timestamp = nowIso();
  return validateBomStore({
    ...store,
    boms: store.boms.map(bom => bom.id === bomId ? { ...bom, updatedAt: timestamp, items: deleteBOMItem(bom.items, itemId) } : bom),
  });
};
