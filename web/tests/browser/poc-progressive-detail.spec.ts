import { expect, test } from '@playwright/test';

test('desktop explicit detail is complementary and keeps exact highlight distinct', async ({ page }) => {
  await page.goto('/partsource/');
  await page.getByLabel('Query').fill('PSYN-SCR-0001');
  await page.getByRole('button', { name: 'Search' }).click();
  const trigger = page.getByRole('button', { name: /Open PSYN-SCR-0002 detail/ });
  await trigger.click();
  const detail = page.getByRole('complementary');
  await expect(detail).toContainText('PSYN-SCR-0002');
  await expect(detail).not.toHaveAttribute('aria-modal');
  await expect(page.locator('.poc-highlighted')).toContainText('PSYN-SCR-0001');
  await detail.getByRole('button', { name: 'Close detail' }).click();
  await expect(trigger).toBeFocused();
});

test('narrow detail is inert modal with focused close control', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/partsource/');
  await page.getByLabel('Query').fill('M4 screws');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('button', { name: /Open PSYN-SCR-0001 detail/ }).press('Enter');
  const detail = page.getByRole('dialog');
  await expect(detail).toHaveAttribute('aria-modal', 'true');
  await expect(page.locator('.poc-workspace')).toHaveAttribute('inert', '');
  await expect(detail.getByRole('button', { name: 'Close detail' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.poc-workspace')).not.toHaveAttribute('inert');
});
