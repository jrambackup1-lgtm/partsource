import { expect, test } from '@playwright/test';

test('starts from the approved local synthetic bundle', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/partsource/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'Progressive catalog' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Screws' })).toBeVisible();
  await expect(page.getByText('Synthetic POC data — not an engineering reference or supplier listing.')).toBeVisible();
  expect(requests.filter(url => /supplier|mcmaster|supabase|api\//i.test(url))).toEqual([]);
});
