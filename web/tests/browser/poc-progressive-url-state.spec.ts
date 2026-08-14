import { expect, test } from '@playwright/test';

test('direct selected URL closes to the safe list and focuses its row', async ({ page }) => {
  await page.goto('/partsource/?v=1&q=screws&selected=synrec-v1-shcs-01');
  await expect(page.getByRole('complementary')).toContainText('PSYN-SCR-0001');
  await page.getByRole('button', { name: 'Close detail' }).click();
  await expect(page).not.toHaveURL(/selected=/);
  await expect(page.getByRole('button', { name: /Open PSYN-SCR-0001 detail/ })).toBeFocused();
});

test('browser Back restores the selected entry catalog state and focus', async ({ page }) => {
  await page.goto('/partsource/');
  await page.getByLabel('Query').fill('screws');
  await page.getByRole('button', { name: 'Search' }).click();
  const trigger = page.getByRole('button', { name: /Open PSYN-SCR-0001 detail/ });
  await trigger.click(); await expect(page.getByRole('complementary')).toBeVisible();
  await page.goBack(); await expect(page.getByRole('complementary')).toHaveCount(0);
  await expect(trigger).toBeFocused(); await expect(page.getByText('30 matching configurations')).toBeVisible();
});

test('invalid selected record retains safe catalog context without detail', async ({ page }) => {
  await page.goto('/partsource/?v=1&q=screws&selected=PSYN-SCR-0001');
  await expect(page.getByRole('heading', { name: 'Invalid selection' })).toBeVisible();
  await expect(page.locator('.poc-results')).toHaveCount(1);
});

test('malformed encoding and contradictory family URLs fail closed', async ({ page }) => {
  await page.goto('/partsource/?v=1&q=%E0%A4');
  await expect(page.getByRole('heading', { name: 'Invalid URL state' })).toBeVisible();
  await expect(page.locator('.poc-results')).toHaveCount(0);
  await page.goto('/partsource/?v=1&q=socket%20head%20screws&family=bhss');
  await expect(page.getByRole('heading', { name: 'Invalid URL state' })).toBeVisible();
  await expect(page.locator('.poc-results')).toHaveCount(0);
});
