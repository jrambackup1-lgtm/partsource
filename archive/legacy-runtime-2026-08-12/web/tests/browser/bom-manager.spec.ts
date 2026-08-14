import { expect, test } from '@playwright/test';

const base = '/partsource';
const storageKey = 'partsource_boms:v1';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
});

test('named BOM manager creates, switches, validates rename, and confirms deletion by UUID', async ({ page }) => {
  await page.goto(`${base}/?tab=bom`);

  await expect(page.getByText('No BOM yet').first()).toBeVisible();
  await expect(page.getByText('Create a named local BOM before adding or importing rows.')).toBeVisible();

  await page.getByRole('button', { name: 'Create BOM' }).first().click();
  await expect(page.getByRole('button', { name: 'BOM 1' })).toBeVisible();

  await page.getByRole('button', { name: 'Create BOM' }).first().click();
  await expect(page.getByRole('button', { name: 'BOM 2' })).toBeVisible();

  const firstRow = page.locator('tr').filter({ hasText: 'BOM 1' });
  await firstRow.getByRole('button', { name: 'Rename' }).click();
  await page.getByLabel('Rename BOM 1').fill('   ');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Enter a unique BOM name' })).toBeVisible();

  await page.getByLabel('Rename BOM 1').fill('bom 2');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Enter a unique BOM name' })).toBeVisible();

  await page.getByLabel('Rename BOM 1').fill('Shop BOM');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Shop BOM' })).toBeVisible();

  page.on('dialog', dialog => dialog.accept());
  await page.locator('tr').filter({ hasText: 'BOM 2' }).getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('button', { name: 'BOM 2' })).toHaveCount(0);

  const stored = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), storageKey);
  expect(stored.boms).toHaveLength(1);
  expect(stored.boms[0].name).toBe('Shop BOM');
  expect(stored.activeBomId).toBe(stored.boms[0].id);
});

test('duplicate deep-copies item snapshots with new UUIDs and delete selects next or null', async ({ page }) => {
  await page.addInitScript((key) => {
    const now = '2026-01-02T03:04:05.006Z';
    const item = {
      id: '22222222-2222-4222-8222-222222222222',
      quantity: 3,
      notes: 'bench',
      userUnitCostUsd: 0,
      origin: 'imported',
      verificationStatus: 'unverified-imported',
      selectionSnapshot: {
        originalMcmasterNumber: '91251A542',
        selectedCrossReferenceRecordId: null,
        alternativePartNumber: '91251A542',
        supplier: 'Unselected',
        description: 'Socket head cap screw',
        material: 'Alloy steel',
        verificationRevision: null,
      },
      partNumber: '91251A542',
      description: 'Socket head cap screw',
      material: 'Alloy steel',
      supplier: 'Unselected',
      qty: 3,
      unitCost: 0,
    };
    window.localStorage.setItem(key, JSON.stringify({
      version: 1,
      activeBomId: '11111111-1111-4111-8111-111111111111',
      boms: [{ id: '11111111-1111-4111-8111-111111111111', name: 'Shop BOM', createdAt: now, updatedAt: now, items: [item] }],
    }));
  }, storageKey);

  await page.goto(`${base}/?tab=bom`);
  await page.locator('tr').filter({ hasText: 'Shop BOM' }).getByRole('button', { name: 'Duplicate' }).click();
  await expect(page.getByRole('button', { name: 'Shop BOM copy' })).toBeVisible();

  let stored = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), storageKey);
  expect(stored.boms).toHaveLength(2);
  const original = stored.boms.find((bom: any) => bom.name === 'Shop BOM');
  const copy = stored.boms.find((bom: any) => bom.name === 'Shop BOM copy');
  expect(copy.id).not.toBe(original.id);
  expect(copy.items[0].id).not.toBe(original.items[0].id);
  expect(copy.items[0].selectionSnapshot).toEqual(original.items[0].selectionSnapshot);
  expect(stored.activeBomId).toBe(copy.id);

  page.on('dialog', dialog => dialog.accept());
  await page.locator('tr').filter({ hasText: 'Shop BOM copy' }).getByRole('button', { name: 'Delete' }).click();
  stored = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), storageKey);
  expect(stored.boms).toHaveLength(1);
  expect(stored.activeBomId).toBe(stored.boms[0].id);

  await page.locator('tr').filter({ hasText: 'Shop BOM' }).getByRole('button', { name: 'Delete' }).click();
  stored = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), storageKey);
  expect(stored.boms).toHaveLength(0);
  expect(stored.activeBomId).toBeNull();
});

test('part detail creates a named BOM in flow and appends frozen configuration snapshots', async ({ page }) => {
  await page.goto(`${base}/parts/DIN912-M3X10`);

  await expect(page.getByRole('heading', { name: 'Add frozen configuration to BOM' })).toBeVisible();
  await page.getByPlaceholder('BOM 1').fill('Detail Flow BOM');
  await page.getByLabel('Quantity').fill('4');
  await page.getByLabel('User-entered unit cost (optional)').fill('1.23');
  await page.getByLabel('User notes for this saved line').fill('Keep this exact reviewed configuration.');
  await page.getByRole('button', { name: 'Save configuration snapshot to BOM' }).click();

  await expect(page.getByRole('status')).toContainText('Saved frozen snapshot to Detail Flow BOM');
  let stored = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), storageKey);
  expect(stored.boms).toHaveLength(1);
  expect(stored.boms[0].name).toBe('Detail Flow BOM');
  expect(stored.boms[0].items).toHaveLength(1);
  const line = stored.boms[0].items[0];
  expect(line.quantity).toBe(4);
  expect(line.notes).toBe('Keep this exact reviewed configuration.');
  expect(line.userUnitCostUsd).toBe(1.23);
  expect(line.selectionSnapshot.inputText).toBe('DIN912-M3X10');
  expect(line.selectionSnapshot.alternativePartNumber).toBeTruthy();
  expect(line.selectionSnapshot.configurationFacts.find((fact: any) => fact.label === 'Thread')?.value).toBe('M3');
  expect(line.selectionSnapshot.supplierSearchDestinations.length).toBeGreaterThan(0);
  expect(line.selectionSnapshot.supplierSearchDestinations[0].requiresVerification).toBe(true);
  expect(line.selectionSnapshot.sourceNotes[0]).toMatch(/^Configuration source: configuration-/);

  await page.getByRole('button', { name: 'Save configuration snapshot to BOM' }).click();
  stored = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), storageKey);
  expect(stored.boms[0].items).toHaveLength(2);
  expect(stored.boms[0].items[1].id).not.toBe(stored.boms[0].items[0].id);
});

test('BOM portability quarantines malformed storage, confirms CSV import, and restores JSON atomically', async ({ page }) => {
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, '{not valid bom json');
  }, storageKey);

  await page.goto(`${base}/?tab=bom`);
  await expect(page.getByRole('alert').filter({ hasText: 'Malformed BOM storage was quarantined' })).toBeVisible();
  const quarantine = await page.evaluate(() => JSON.parse(window.localStorage.getItem('partsource_bom_quarantine:v1') || '[]'));
  expect(quarantine).toHaveLength(1);
  expect(quarantine[0].sourceKey).toBe(storageKey);

  const csv = [
    'mcmasterNumber,alternativePartNumber,crossReferenceRecordId,verificationRevision,partNumber,description,material,supplier,quantity,unitCost,notes',
    '91251A542,ALT-IMPORT,xref-old,old-rev,ALT-IMPORT,Imported screw,Steel,User supplier,2,1.25,keep',
    ',,,,,,,,0,1,bad quantity',
  ].join('\n');

  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('#csvFileInput').setInputFiles({ name: 'bom.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  let stored = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), storageKey);
  expect(stored.boms).toHaveLength(0);

  page.on('dialog', dialog => dialog.accept());
  await page.locator('#csvFileInput').setInputFiles({ name: 'bom.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  await expect.poll(async () => page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}').boms?.[0]?.items?.length ?? 0, storageKey)).toBe(1);
  stored = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), storageKey);
  expect(stored.boms[0].items[0].verificationStatus).toBe('unverified-imported');
  expect(stored.boms[0].items[0].userUnitCostUsd).toBe(1.25);

  const beforeRestore = stored;
  await page.locator('#bomBackupInput').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"format":"partsource-bom-backup","version":2}') });
  stored = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), storageKey);
  expect(stored).toEqual(beforeRestore);

  const backup = {
    format: 'partsource-bom-backup',
    version: 1,
    exportedAt: '2026-01-02T03:04:05.006Z',
    activeBomId: '11111111-1111-4111-8111-111111111111',
    boms: [{ ...beforeRestore.boms[0], id: '11111111-1111-4111-8111-111111111111', name: 'Restored BOM' }],
  };
  await page.locator('#bomBackupInput').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
  await expect.poll(async () => page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}').boms?.[0]?.name, storageKey)).toBe('Restored BOM');
});
