import { expect, test } from '@playwright/test';

test('unique exact IDs highlight within family context and unsafe mappings fail closed', async ({ page }) => {
  await page.goto('/partsource/');
  const search = page.getByLabel('Query');

  await search.fill('  psyn-scr-0001  ');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByText('Screws / Hex-socket screws / Socket-head cap screws')).toBeVisible();
  await expect(page.getByText('10 matching configurations')).toBeVisible();
  const highlighted = page.locator('.poc-highlighted');
  await expect(highlighted).toContainText('PSYN-SCR-0001');
  await expect(highlighted).toContainText('highlighted, not selected');

  await search.fill('PSYN-SCR-9999');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByRole('heading', { name: 'Exact identifier not found' })).toBeVisible();
  await expect(page.locator('.poc-results')).toHaveCount(0);

  await search.fill('PSYN-SCR-COLLIDE');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByRole('heading', { name: 'Exact identifier is not unique' })).toBeVisible();
  await expect(page.locator('.poc-results')).toHaveCount(0);
});
