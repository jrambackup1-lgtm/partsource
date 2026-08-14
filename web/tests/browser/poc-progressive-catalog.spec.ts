import { expect, test } from '@playwright/test';

const base = '/partsource/';

test('broad and family catalog queries preserve context and use deterministic AND filters', async ({ page }) => {
  await page.goto(base);
  const search = page.getByLabel('Query');
  await search.fill('screws');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByText('30 matching configurations')).toBeVisible();
  await expect(page.getByText('PSYN-SCR-0001')).toBeVisible();

  await search.fill('socket head cap screws');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByText('Screws / Hex-socket screws / Socket-head cap screws')).toBeVisible();
  await expect(page.getByText('10 matching configurations')).toBeVisible();
  await expect(page.getByLabel('Family', { exact: true })).toHaveCount(0);

  await search.fill('M4 screws');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByText('6 matching configurations')).toBeVisible();
  await expect(page.getByRole('button', { name: /Remove Diameter M4/ })).toBeVisible();
  await page.getByLabel('Length').selectOption('40');
  await expect(page.getByText('0 matching configurations')).toBeVisible();
  await expect(page.getByText('No synthetic configuration matches this exact AND filter combination.')).toBeVisible();
  await page.getByRole('button', { name: /Remove Length 40 mm/ }).click();
  await expect(page.getByText('6 matching configurations')).toBeVisible();
});

test('rows retain mechanical context and unsafe queries retain safe context without a result list', async ({ page }) => {
  await page.goto(base);
  await page.getByLabel('Query').fill('PSYN-SCR-0006');
  await page.getByRole('button', { name: 'Search' }).click();
  const row = page.locator('.poc-highlighted');
  await expect(row).toContainText('Socket-head cap screws');
  await expect(row).toContainText('20 mm (under head)');
  await expect(row).toContainText('Finish: passivated');
  await expect(row).toContainText('Drive: internal hex');
  await expect(row).toContainText('Head profile: cylindrical');
  await expect(row).toContainText('Synthetic POC fixture');

  await page.getByLabel('Query').fill('M6 titanium socket head screws');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByText('Screws / Hex-socket screws / Socket-head cap screws')).toBeVisible();
  await expect(page.getByText(/Recognized filters: .*Diameter: M6/)).toBeVisible();
  await expect(page.locator('.poc-results')).toHaveCount(0);
});

test('removing an active filter moves keyboard focus to the updated result summary', async ({ page }) => {
  await page.goto(base);
  await page.getByLabel('Query').fill('M6 screws');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('button', { name: /Remove Diameter M6/ }).click();
  await expect(page.locator('#catalog-results-summary')).toBeFocused();
  await expect(page.getByText('30 matching configurations')).toBeVisible();
});
