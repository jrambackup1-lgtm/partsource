import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  BOM_QUARANTINE_STORAGE_KEY,
  BOM_STORAGE_KEY,
  LEGACY_BOM_STORAGE_KEY,
  createBomItem,
  createEmptyBomStore,
  migrateLegacyBomPayload,
  serializeBOMStore,
  validateBomStore,
  type BOMItem,
  type BomQuarantineRecord,
  type BomStore,
} from '../lib/bomStorage';
import {
  addItemToBom,
  buildBOMExportRows,
  calculateBOMTotals,
  createBom,
  createBomBackupPayload,
  deleteBom,
  deleteBomLineItem,
  duplicateBom,
  getActiveBom,
  parseBomBackupPayload,
  renameBom,
  updateBomItemQuantity,
  validateBomCsvRows,
} from '../lib/bom';

export type { BOMItem } from '../lib/bomStorage';

export function createCatalogCommercialFields() {
  return { supplier: 'Unselected', unitCost: 0 } as const;
}

export function parseImportedUnitCost(value: unknown): number {
  if (value === undefined || value === null || value === '') return 0;
  const parsed = typeof value === 'number'
    ? value
    : Number.parseFloat(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

const appendQuarantineRecords = (records: BomQuarantineRecord[]) => {
  if (records.length === 0) return;
  const existingRaw = localStorage.getItem(BOM_QUARANTINE_STORAGE_KEY);
  let existing: BomQuarantineRecord[] = [];
  if (existingRaw) {
    try {
      const parsed = JSON.parse(existingRaw);
      if (Array.isArray(parsed)) existing = parsed as BomQuarantineRecord[];
    } catch {
      existing = [];
    }
  }
  localStorage.setItem(BOM_QUARANTINE_STORAGE_KEY, JSON.stringify([...existing, ...records]));
};

const readInitialStore = (): { store: BomStore; warning: string | null } => {
  try {
    const stored = localStorage.getItem(BOM_STORAGE_KEY);
    if (stored !== null) {
      try {
        return { store: validateBomStore(JSON.parse(stored)), warning: null };
      } catch {
        const emptyStore = createEmptyBomStore();
        appendQuarantineRecords([{ sourceKey: BOM_STORAGE_KEY, capturedAt: new Date().toISOString(), reason: 'Current BOM store JSON was malformed or failed validation.', payload: stored }]);
        localStorage.setItem(BOM_STORAGE_KEY, serializeBOMStore(emptyStore));
        return { store: emptyStore, warning: 'Malformed BOM storage was quarantined and a new empty local store was started.' };
      }
    }

    const legacy = localStorage.getItem(LEGACY_BOM_STORAGE_KEY);
    if (legacy === null) return { store: createEmptyBomStore(), warning: null };

    const { store, quarantine } = migrateLegacyBomPayload(legacy);
    try {
      if (quarantine.length > 0) {
        appendQuarantineRecords(quarantine);
      }
      localStorage.setItem(BOM_STORAGE_KEY, serializeBOMStore(store));
      localStorage.removeItem(LEGACY_BOM_STORAGE_KEY);
      return {
        store,
        warning: quarantine.length > 0 ? 'Some malformed legacy BOM rows were quarantined. Download recovery before clearing browser data.' : null,
      };
    } catch {
      return { store, warning: 'BOM migration loaded in memory, but browser storage failed. Legacy data was left recoverable.' };
    }
  } catch {
    return { store: createEmptyBomStore(), warning: 'BOM storage could not be read. Local BOM changes may not persist.' };
  }
};

export function useBOM() {
  const [bomStore, setBomStore] = useState<BomStore>(createEmptyBomStore);
  const [persistenceWarning, setPersistenceWarning] = useState<string | null>(null);

  useEffect(() => {
    const initial = readInitialStore();
    setBomStore(initial.store);
    setPersistenceWarning(initial.warning);
  }, []);

  const activeBom = getActiveBom(bomStore);
  const bomList = activeBom?.items ?? [];

  const saveStore = (candidate: BomStore) => {
    const validStore = validateBomStore(candidate);
    setBomStore(validStore);
    try {
      localStorage.setItem(BOM_STORAGE_KEY, serializeBOMStore(validStore));
      setPersistenceWarning(null);
    } catch {
      setPersistenceWarning('BOM persistence failed. Your in-memory changes are usable but may be lost on refresh.');
    }
  };

  const ensureActiveBom = (store: BomStore): BomStore => (
    store.activeBomId === null ? createBom(store) : store
  );

  const clearBom = () => saveStore(createEmptyBomStore());

  const createNamedBom = (name?: string): BomStore => {
    const nextStore = createBom(bomStore, typeof name === 'string' ? name : undefined);
    saveStore(nextStore);
    return nextStore;
  };

  const switchBom = (bomId: string) => {
    if (!bomStore.boms.some(bom => bom.id === bomId)) return;
    saveStore({ ...bomStore, activeBomId: bomId });
  };

  const renameNamedBom = (bomId: string, name: string) => saveStore(renameBom(bomStore, bomId, name));

  const duplicateNamedBom = (bomId: string) => saveStore(duplicateBom(bomStore, bomId));

  const deleteNamedBom = (bomId: string) => saveStore(deleteBom(bomStore, bomId));

  const addToBOM = (item: Omit<BOMItem, 'id'>, targetBomId?: string) => {
    const withActiveBom = ensureActiveBom(bomStore);
    const active = targetBomId
      ? withActiveBom.boms.find(bom => bom.id === targetBomId)
      : getActiveBom(withActiveBom);
    if (!active) return null;
    const bomItem = createBomItem({ ...item, selectionSnapshot: { ...item.selectionSnapshot } });
    saveStore(addItemToBom(withActiveBom, active.id, bomItem));
    return bomItem;
  };

  const addToNewNamedBOM = (item: Omit<BOMItem, 'id'>, name?: string) => {
    const withNewBom = createBom(bomStore, name);
    const active = getActiveBom(withNewBom);
    if (!active) return null;
    const bomItem = createBomItem({ ...item, selectionSnapshot: { ...item.selectionSnapshot } });
    saveStore(addItemToBom(withNewBom, active.id, bomItem));
    return { bomItem, bom: active };
  };

  const updateBomQty = (id: string, qty: number) => {
    if (!activeBom || !Number.isInteger(qty) || qty < 1) return;
    saveStore(updateBomItemQuantity(bomStore, activeBom.id, id, qty));
  };

  const deleteBomItem = (id: string) => {
    if (!activeBom) return;
    saveStore(deleteBomLineItem(bomStore, activeBom.id, id));
  };

  const exportBOM = () => {
    if (bomList.length === 0) {
      alert('BOM is empty.');
      return;
    }
    const csv = Papa.unparse(buildBOMExportRows(bomList));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeBom?.name.replace(/[^a-z0-9_-]+/gi, '_') || 'partsource_bom'}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportBackup = () => {
    const payload = createBomBackupPayload(bomStore);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'partsource_bom_backup.json';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const restoreBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const nextStore = parseBomBackupPayload(String(reader.result ?? ''));
        const lineCount = nextStore.boms.reduce((count, bom) => count + bom.items.length, 0);
        if (!window.confirm(`Restore ${nextStore.boms.length} BOMs with ${lineCount} total lines? This replaces all local BOMs in this browser.`)) return;
        saveStore(nextStore);
        alert('BOM backup restored.');
      } catch (error) {
        alert(error instanceof Error ? error.message : 'BOM backup restore failed validation.');
      }
    };
    reader.readAsText(file);
  };

  const exportPDF = async () => {
    if (bomList.length === 0) {
      alert('BOM is empty.');
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const autoTableModule = await import('jspdf-autotable');
      const autoTable = autoTableModule.default || (autoTableModule as any);
      const doc = new jsPDF() as any;
      const { totalCost, lineCount: totalItems, totalQuantity: totalQty } = calculateBOMTotals(bomList);

      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text('partsource.io', 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text('Industrial Hardware Sourcing', 14, 28);
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text('Bill of Materials Summary', 14, 40);
      doc.setFontSize(11);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 50);
      doc.text(`Total Unique Items: ${totalItems}`, 14, 56);
      doc.text(`Total Quantity: ${totalQty}`, 14, 62);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`User-entered Total Cost: $${totalCost.toFixed(2)}`, 14, 70);

      autoTable(doc, {
        startY: 80,
        head: [['Part Number', 'Description', 'Supplier', 'Qty', 'Unit Cost', 'Total']],
        body: bomList.map(item => [
          item.partNumber,
          item.description,
          item.supplier,
          item.quantity.toString(),
          `$${item.userUnitCostUsd.toFixed(2)}`,
          `$${(item.quantity * item.userUnitCostUsd).toFixed(2)}`,
        ]),
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], textColor: 255 },
        styles: { fontSize: 9 },
        columnStyles: { 4: { halign: 'right' }, 5: { halign: 'right' } },
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`Page ${i} of ${pageCount} | Generated by partsource.io - Built by Jay - jayar.co`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      }
      doc.save('partsource_bom_summary.pdf');
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const importCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        const normalized = header.toLowerCase().trim().replace(/[\s_-]+/g, ' ');
        if (['mcmaster number', 'mc master number', 'original mcmaster number'].includes(normalized)) return 'mcmasterNumber';
        if (['alternative part number', 'alternate part number', 'alternative'].includes(normalized)) return 'alternativePartNumber';
        if (['cross reference record id', 'cross-reference record id', 'record id'].includes(normalized)) return 'crossReferenceRecordId';
        if (['verification revision', 'record revision', 'revision'].includes(normalized)) return 'verificationRevision';
        if (['part number', 'part #', 'part#', 'pn', 'part no', 'part no.', 'partno', 'sku', 'item', 'item #', 'item number', 'itemno', 'item no'].includes(normalized)) return 'partNumber';
        if (['qty', 'quantity', 'count', 'amount', 'qnty', 'pcs', 'pieces'].includes(normalized)) return 'quantity';
        if (['unit cost', 'unitcost', 'user unit cost', 'user unit cost usd'].includes(normalized)) return 'unitCost';
        if (['description', 'desc', 'part description', 'item description', 'details'].includes(normalized)) return 'description';
        if (['material', 'mat', 'substance', 'alloy', 'composition'].includes(normalized)) return 'material';
        if (['supplier', 'vendor', 'source', 'manufacturer', 'mfg', 'distributor'].includes(normalized)) return 'supplier';
        if (['notes', 'note', 'comment', 'comments'].includes(normalized)) return 'notes';
        return header;
      },
      complete: (results) => {
        const rows = results.data as Record<string, unknown>[];
        if (results.errors.length > 0) {
          alert(`CSV parse failed: ${results.errors[0].message}`);
          return;
        }
        const { acceptedItems, rejectedRows } = validateBomCsvRows(rows);
        const rejectedSummary = rejectedRows.length > 0
          ? `\n\nRejected rows:\n${rejectedRows.slice(0, 8).map(rejection => `Row ${rejection.rowNumber}: ${rejection.reason}`).join('\n')}${rejectedRows.length > 8 ? `\n…and ${rejectedRows.length - 8} more.` : ''}`
          : '';
        if (acceptedItems.length === 0) {
          alert(`No valid BOM rows were found.${rejectedSummary}`);
          return;
        }
        if (!window.confirm(`Import ${acceptedItems.length} valid rows into the active BOM?${rejectedSummary}`)) return;

        const withActiveBom = ensureActiveBom(bomStore);
        const active = getActiveBom(withActiveBom);
        if (!active) return;
        let workingStore = withActiveBom;
        acceptedItems.forEach(bomItem => {
          workingStore = addItemToBom(workingStore, active.id, bomItem);
        });

        saveStore(workingStore);
        alert(`Successfully imported ${acceptedItems.length} items into ${active.name}.${rejectedRows.length > 0 ? ` ${rejectedRows.length} rows were rejected.` : ''}`);
      },
    });
  };

  return {
    bomStore,
    activeBom,
    bomList,
    persistenceWarning,
    addToBOM,
    addToNewNamedBOM,
    updateBomQty,
    deleteBomItem,
    exportBOM,
    exportBackup,
    exportPDF,
    importCSV,
    restoreBackup,
    clearBom,
    createNamedBom,
    switchBom,
    renameNamedBom,
    duplicateNamedBom,
    deleteNamedBom,
  };
}
