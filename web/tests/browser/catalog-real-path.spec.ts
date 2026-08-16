import { expect, test } from '@playwright/test';

/**
 * Real-catalog user-path coverage (f5). Runs only through the dev-server
 * Playwright configuration (`npm run test:browser:real`): the dev release is
 * dev-server-only by the publication gates, so the preview/production suite
 * is structurally unable to reach it. Requires `npm run catalog:build-real`.
 * Every navigation may load and verify the ~110 MB release — timeouts are
 * generous and workers are serialized by the config.
 */
const base = '/';

test.setTimeout(300_000);

async function search(page: import('@playwright/test').Page, query: string) {
  await page.getByLabel('Search the catalog').fill(query);
  await page.getByRole('button', { name: 'Search' }).click();
}

async function waitForRealCatalog(page: import('@playwright/test').Page) {
  await expect(page.locator('.catalog-pill')).toContainText('Dev catalog', { timeout: 240_000 });
  await expect(page.locator('.notice')).toContainText('Development data');
}

test('dev default is the real catalog with truthful labels', async ({ page }) => {
  await page.goto(base);
  await waitForRealCatalog(page);
  await expect(page.getByRole('button', { name: /View all 26953 parts/ })).toBeVisible();
  await expect(page.locator('.notice')).not.toContainText('SYNTHETIC DATA');
});

test('M4 screw (owner phrasing) shows the family chooser; entering a family keeps M4', async ({ page }) => {
  await page.goto(base);
  await waitForRealCatalog(page);
  await search(page, 'M4 screw');
  await expect(page.locator('.family-chooser .chooser-family').first()).toBeVisible({ timeout: 30_000 });
  const families = await page.locator('.family-chooser .chooser-family').count();
  expect(families).toBeGreaterThan(1);
  await expect(page.locator('table')).toHaveCount(0);
  await page.locator('.family-chooser .chooser-family').first().click();
  await expect(page.getByRole('region', { name: 'Active constraints' })).toContainText('Nominal diameter: 4 mm');
  await expect(page.locator('.result-heading')).toContainText(/matching parts/);
});

test('exact PN opens the correct family with a visible highlighted row', async ({ page }) => {
  await page.goto(base);
  await waitForRealCatalog(page);
  await search(page, '92655A331');
  await expect(page.getByRole('heading', { name: /Heavy Hex Head Screws/i })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.exact-banner')).toContainText('Part 92655A331 matches');
  // f4: the app lands on the page containing the highlighted row.
  await expect(page.locator('.table-wrap tr.exact-row')).toHaveCount(1);
  await expect(page.locator('.pager')).toContainText(/Page \d+ of \d+/);
  // The scroll-into-view runs on the next animation frame after the page
  // lands — poll rather than sample once (CI runners schedule frames later).
  await expect.poll(async () => page.locator('.table-wrap tr.exact-row').evaluate(
    element => { const rect = element.getBoundingClientRect(); return rect.top >= 0 && rect.bottom <= window.innerHeight; }),
  { timeout: 15_000 }).toBe(true);
});

test('rows and detail show the real PN; diagnostics stay optional', async ({ page }) => {
  await page.goto(base);
  await waitForRealCatalog(page);
  await search(page, '92655A331');
  const firstRow = page.locator('.table-wrap tbody .row-id').first();
  await expect(firstRow).toHaveText(/^\d{5}[A-Z]\d{3}$/);
  await firstRow.click();
  await expect(page.locator('#inspector-title')).toHaveText(/^\d{5}[A-Z]\d{3}$/);
  await expect(page.getByRole('heading', { name: 'Part number' })).toBeVisible();
  await expect(page.locator('.identity-list').first()).toContainText('Cofounder dataset (local dev)');
  await expect(page.locator('details.technical-evidence')).not.toHaveAttribute('open');
});

test('absent PN fails as identifier-not-found with the submission echoed', async ({ page }) => {
  await page.goto(base);
  await waitForRealCatalog(page);
  await search(page, '99999Z999');
  await expect(page.getByRole('heading', { name: 'Exact identifier not found' })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.status-card')).toContainText('99999Z999');
});
