import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/partsource/', { waitUntil: 'domcontentloaded' });
});

test('search opens the exact indexed part page', async ({ page }) => {
  const search = page.getByPlaceholder('Enter McMaster part number or specifications...');
  await search.fill('91290A115');
  await page.getByRole('button', { name: 'Search', exact: true }).click();

  await expect(page).toHaveURL(/\/parts\/DIN912-M3X10$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('DIN912-M3X10');
  await expect(page.getByText('Indexed Catalog', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Supplier Pricing Matrix' })).toBeVisible();
});

test('buyer can add, edit, and export a BOM line', async ({ page }) => {
  await page.goto('/partsource/parts/DIN912-M3X10');
  const supplierRow = page.getByRole('row').filter({ hasText: 'McMaster-Carr' });
  await supplierRow.getByRole('spinbutton').fill('2');
  await supplierRow.getByRole('button', { name: 'Add', exact: true }).click();

  await page.getByRole('link', { name: 'BOM Manager' }).click();
  const bomRow = page.getByRole('row').filter({ hasText: 'DIN912-M3X10' });
  await expect(bomRow).toBeVisible();

  const quantity = bomRow.getByRole('spinbutton');
  await quantity.fill('4');
  await expect(quantity).toHaveValue('4');
  await expect(page.getByText('Total Quantity').locator('..').getByText('4', { exact: true })).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).last().click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('partsource_bom.csv');
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const csv = Buffer.concat(chunks).toString('utf8');
  expect(csv).toContain('DIN912-M3X10');
  expect(csv).toContain(',4,');
});

test('bad query stays unindexed and does not show estimated pricing', async ({ page }) => {
  const search = page.getByPlaceholder('Enter McMaster part number or specifications...');
  await search.fill('definitely-not-a-real-part');
  await page.getByRole('button', { name: 'Search', exact: true }).click();

  await expect(page).toHaveURL(/\/parts\/DEFINITELY-NOT-A-REAL-PART$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('DEFINITELY-NOT-A-REAL-PART');
  await expect(page.getByText('Not Indexed', { exact: true })).toBeVisible();
  await expect(page.getByText(/could not decode reliable specifications/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Search This Part Number at Suppliers' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Supplier Pricing Matrix' })).toHaveCount(0);
});
