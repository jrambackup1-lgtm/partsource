import { expect, test } from '@playwright/test';

test('selected detail retains latest filter return snapshot for Close and Back', async ({ page }) => {
  await page.goto('/partsource/');
  await page.getByLabel('Query').fill('M6 socket head screws'); await page.getByRole('button', { name: 'Search' }).click();
  await page.locator('.poc-row button').first().click(); await page.getByLabel('Material').selectOption('a2_stainless');
  await expect(page.getByRole('complementary')).toBeVisible(); await page.getByRole('button', { name: 'Close detail' }).click();
  await expect(page.getByRole('complementary')).toHaveCount(0); await expect(page.getByText('2 matching configurations')).toBeVisible(); expect(page.url()).toContain('material=a2_stainless');
  await page.locator('.poc-row button').first().click(); await page.getByLabel('Finish').selectOption('passivated'); await page.goBack();
  await expect(page.getByRole('complementary')).toHaveCount(0); await expect(page.getByText('2 matching configurations')).toBeVisible(); expect(page.url()).toContain('finish=passivated');
});
