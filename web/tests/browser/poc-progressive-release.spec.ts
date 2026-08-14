import { expect, test } from '@playwright/test';

async function search(page: import('@playwright/test').Page, query: string) { await page.goto('/partsource/'); await page.getByLabel('Query').fill(query); await page.getByRole('button', { name: 'Search' }).click(); }

test('B15 close after replacement selection restores catalog highlight, focus, and scroll', async ({ page }) => {
  await search(page, 'PSYN-SCR-0006');
  await page.getByRole('button', { name: /Open PSYN-SCR-0006 detail/ }).focus(); await page.evaluate(() => window.scrollTo(0, 400));
  await page.getByRole('button', { name: /Open PSYN-SCR-0006 detail/ }).press('Enter');
  await page.getByRole('button', { name: /Open PSYN-SCR-0005 detail/ }).click();
  await expect(page.getByRole('complementary')).toContainText('PSYN-SCR-0005');
  await page.getByRole('button', { name: 'Close detail' }).click();
  await expect(page.getByRole('complementary')).toHaveCount(0);
  await expect(page.locator('.poc-highlighted')).toContainText('PSYN-SCR-0006');
  await expect(page.locator('[aria-pressed=true]')).toHaveCount(0);
  await expect(page.locator('[data-record-id="synrec-v1-shcs-05"]')).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(400);
});

test('B16 320px exact flow is modal, preserves highlight, and has no horizontal page scroll', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 }); await search(page, 'PSYN-SCR-0006');
  await expect(page.getByRole('dialog')).toHaveCount(0); await expect(page.locator('.poc-highlighted')).toContainText('PSYN-SCR-0006');
  await page.getByRole('button', { name: /Open PSYN-SCR-0006 detail/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible(); await expect(page.getByRole('dialog')).toHaveCSS('height', '720px');
  await page.getByRole('button', { name: 'Close detail' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0); await expect(page.locator('.poc-highlighted')).toContainText('PSYN-SCR-0006');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});

test('B18 invalid selected URL variants retain safe list without opening detail', async ({ page }) => {
  for (const selected of ['', 'synrec-v1-shcs-99', 'synrec-v1-bhss-01', 'PSYN-SCR-COLLIDE']) {
    await page.goto(`/partsource/?v=1&q=socket+head+screws&family=shcs&selected=${selected}`);
    await expect(page.getByRole('heading', { name: 'Invalid selection' })).toBeVisible(); await expect(page.getByRole('complementary')).toHaveCount(0); await expect(page.locator('.poc-row')).toHaveCount(10);
  }
});

test('dynamic browser boundary has no errors, external/catalog requests, prohibited claims, or isolated detail route', async ({ page }) => {
  const consoleErrors: string[] = []; const pageErrors: string[] = []; const requests: string[] = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); }); page.on('pageerror', error => pageErrors.push(error.message)); page.on('request', request => requests.push(request.url()));
  await search(page, 'PSYN-SCR-0006'); await page.getByRole('button', { name: /Open PSYN-SCR-0006 detail/ }).click(); await page.getByRole('button', { name: 'Close detail' }).click();
  expect(consoleErrors).toEqual([]); expect(pageErrors).toEqual([]);
  const allowedOrigin = new URL(page.url()).origin;
  for (const raw of requests) { const url = new URL(raw); expect(url.origin).toBe(allowedOrigin); expect(url.pathname).not.toMatch(/\/(?:api|supabase|catalog|supplier|parts|bom|embed)(?:\/|$)/i); }
  const prohibited = /\b(?:approved|suitable|equivalent|replacement|certified|verified|alternate|compare|shortlist|favorite|cart|export|quote|in stock|availability|lead time|price)\b/i;
  const text = (await page.locator('body').innerText()).replace('Synthetic POC data — not an engineering reference or supplier listing.', '');
  expect(text).not.toMatch(prohibited);
  const accessibleControls = await page.locator('button,a,[role="button"],[role="link"]').evaluateAll(elements => elements.map(element => `${element.textContent ?? ''} ${element.getAttribute('aria-label') ?? ''} ${element.getAttribute('title') ?? ''}`));
  for (const control of accessibleControls) expect(control).not.toMatch(prohibited);
  const metadata = await page.locator('meta,script[type="application/ld+json"],[itemscope],[itemtype],[itemprop]').evaluateAll(elements => elements.map(element => element.outerHTML).join('\n'));
  expect(metadata).not.toMatch(/Product|Offer|supplier|price|availability/i);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
  await page.goto('/partsource/parts/PSYN-SCR-0001'); await expect(page.getByRole('heading', { name: 'Workspace route unavailable' })).toBeVisible(); await expect(page.getByRole('heading', { name: 'Progressive catalog' })).toHaveCount(0);
});
