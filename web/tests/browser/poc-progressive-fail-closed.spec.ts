import { expect, test } from '@playwright/test';

test('conflicting and unsupported query constraints fail closed', async ({ page }) => {
  await page.goto('/partsource/');
  const search = page.getByLabel('Query');

  await search.fill('M4 M6 screws');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByRole('heading', { name: 'Conflicting supported values' })).toBeVisible();
  await expect(page.getByText('nominalDiameterMm: 4, 6')).toBeVisible();
  await expect(page.locator('.poc-results')).toHaveCount(0);

  await search.fill('M4 screws in stock');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByRole('heading', { name: 'Unsupported query constraint' })).toBeVisible();
  await expect(page.getByText(/Unsupported: in stock/)).toBeVisible();
  await expect(page.locator('.poc-results')).toHaveCount(0);

  await search.fill('M4 0.7 screws');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByRole('heading', { name: 'Unsupported query constraint' })).toBeVisible();
});
