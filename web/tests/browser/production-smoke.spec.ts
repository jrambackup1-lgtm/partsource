import { expect, test } from '@playwright/test';

const productionBase = process.env.PRODUCTION_BASE_URL;
const base = (productionBase ?? 'http://127.0.0.1:3000/partsource/').replace(/\/$/, '');

test('production routes have correct transport and rendered states', async ({ page, request }) => {
  let response = await page.goto(`${base}/`);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Part Finder' })).toBeVisible();

  response = await page.goto(`${base}/parts/DIN912-M3X10`);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'DIN912-M3X10' })).toBeVisible();

  response = await page.goto(`${base}/?tab=bom`);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Active BOM Registry' })).toBeVisible();
  await expect(page.getByText('No active queued BOM items')).toBeVisible();

  response = await page.goto(`${base}/reference`);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Engineering Reference' })).toBeVisible();

  const sitemap = await request.get(`${base}/sitemap.xml`);
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('<loc>https://jrambackup1-lgtm.github.io/partsource/</loc>');

  const robots = await request.get(`${base}/robots.txt`);
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Sitemap: https://jrambackup1-lgtm.github.io/partsource/sitemap.xml');

  response = await page.goto(`${base}/definitely-not-a-real-route`);
  if (productionBase) expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Not Found' })).toBeVisible();
});
