import { expect, test } from '@playwright/test';

async function search(page: import('@playwright/test').Page, query: string) { await page.goto('/partsource/'); await page.getByLabel('Query').fill(query); await page.getByRole('button', { name: 'Search' }).click(); }

test('B01–B07 broad, family, typed, AND, and empty catalog behavior', async ({ page }) => {
  await search(page, 'screws'); await expect(page.getByText('30 matching configurations')).toBeVisible();
  await search(page, 'countersunk screws'); await expect(page.getByText('Screws / Hex-socket screws / Countersunk socket screws')).toBeVisible(); await expect(page.locator('.poc-row')).toHaveCount(10);
  await search(page, 'M6 stainless socket head screws'); await expect(page.locator('.poc-row')).toHaveCount(2);
  await search(page, 'M8 30 mm black oxide button head screws'); await expect(page.locator('.poc-row')).toHaveCount(1);
  await search(page, 'M4 40 mm socket head screws'); await expect(page.getByText('No synthetic configuration matches this exact AND filter combination.')).toBeVisible();
});

test('B05 filter edits and B17 selected-row invalidation are deterministic', async ({ page }) => {
  await search(page, 'M6 socket head screws'); await expect(page.locator('.poc-row')).toHaveCount(3);
  await page.getByLabel('Material').selectOption('a2_stainless'); await expect(page.locator('.poc-row')).toHaveCount(2);
  await page.getByLabel('Length').selectOption('20'); await expect(page.locator('.poc-row')).toHaveCount(1);
  await page.getByRole('button', { name: /Remove Length 20 mm/ }).click(); await expect(page.locator('.poc-row')).toHaveCount(2);
  await page.locator('.poc-row button').first().click(); await expect(page.getByRole('complementary')).toBeVisible();
  await page.getByLabel('Length').selectOption('40'); await expect(page.getByRole('complementary')).toHaveCount(0);
});

test('B08–B14 exact highlight and distinct selection survive another row activation', async ({ page }) => {
  await search(page, 'PSYN-SCR-0006'); await expect(page.locator('.poc-highlighted')).toContainText('PSYN-SCR-0006');
  await page.getByRole('button', { name: /Open PSYN-SCR-0005 detail/ }).click(); await expect(page.getByRole('complementary')).toContainText('PSYN-SCR-0005'); await expect(page.locator('.poc-highlighted')).toContainText('PSYN-SCR-0006');
});
