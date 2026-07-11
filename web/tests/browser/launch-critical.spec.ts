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
  const supplierSearch = page.getByRole('heading', { name: 'Search Suppliers' }).locator('..');
  await expect(supplierSearch).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Supplier Pricing Matrix' })).toHaveCount(0);
  await expect(supplierSearch.getByText(/\$\d|estimated price|equivalent/i)).toHaveCount(0);
});

test('indexed part provides neutral supplier-search handoffs', async ({ page }) => {
  await page.goto('/partsource/parts/DIN912-M3X10');
  const supplierSearch = page.getByRole('heading', { name: 'Search Suppliers' }).locator('..');
  await expect(supplierSearch.getByRole('link').first()).toHaveAttribute('target', '_blank');
  await expect(supplierSearch.getByRole('button', { name: 'Add', exact: true })).toHaveCount(0);
  await expect(supplierSearch.getByRole('spinbutton')).toHaveCount(0);
});

test('bad query stays unindexed and does not show estimated pricing', async ({ page }) => {
  const search = page.getByPlaceholder('Enter McMaster part number or specifications...');
  await search.fill('definitely-not-a-real-part');
  await page.getByRole('button', { name: 'Search', exact: true }).click();

  await expect(page).toHaveURL(/\/parts\/DEFINITELY-NOT-A-REAL-PART$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('DEFINITELY-NOT-A-REAL-PART');
  await expect(page.getByText('Not Indexed', { exact: true })).toBeVisible();
  await expect(page.getByText(/verify every specification before ordering/i)).toBeVisible();
  const supplierSearch = page.getByRole('heading', { name: 'Search Suppliers' }).locator('..');
  await expect(supplierSearch).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Supplier Pricing Matrix' })).toHaveCount(0);
  await expect(supplierSearch.getByText(/\$\d|estimated price|equivalent/i)).toHaveCount(0);
});
