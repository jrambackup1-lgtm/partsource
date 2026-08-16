import { expect, test } from '@playwright/test';

const base = '/partsource/';

async function search(page: import('@playwright/test').Page, query: string) {
  await page.getByLabel('Query').fill(query);
  await page.getByRole('button', { name: 'Search' }).click();
}

test('supports home examples, broad browse, current hierarchy, and family facets', async ({ page }) => {
  await page.goto(base);
  await expect(page).toHaveTitle('PartSource | Structured Component Catalog');
  await expect(page.locator('.notice .release')).toContainText(/Catalog: partsource\.synthetic\.screws\.v1 · sha256:[a-f0-9]{12}/);
  await expect(page.getByRole('button', { name: 'M4 screws' })).toBeVisible();
  await page.getByRole('button', { name: 'Browse all screws' }).click();
  await expect(page.getByText('30 matching configurations')).toBeVisible();
  await expect(page.getByLabel('Query')).toHaveValue('screws');
  await expect(page.getByRole('button', { name: /Screws 30/ })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: /Socket-head cap screws/ }).first().click();
  await expect(page.getByRole('heading', { name: 'Socket-head cap screws' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Socket-head cap screws/ }).first()).toHaveAttribute('aria-current', 'page');
  await page.getByLabel('Material').selectOption('a2_stainless');
  await expect(page.getByText('6 matching configurations')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Active constraints' })).toContainText('Material: A2 Stainless');
});

test('does not broaden stainless or generic head aliases', async ({ page }) => {
  await page.goto(base);
  await search(page, 'stainless screws');
  await expect(page.getByRole('heading', { name: 'Search terms not recognized' })).toBeVisible();
  await expect(page.locator('table')).toHaveCount(0);
  await search(page, 'button head screws');
  await expect(page.getByRole('heading', { name: 'Search terms not recognized' })).toBeVisible();
  await expect(page.locator('table')).toHaveCount(0);
  // The spec-published family alias (B02) routes context; it adds no typed fact.
  await search(page, 'socket head screws');
  await expect(page.getByRole('heading', { name: 'Socket-head cap screws' })).toBeVisible();
  await expect(page.getByText('10 matching configurations')).toBeVisible();
  await search(page, 'A2 stainless socket head cap screws');
  await expect(page.getByText('6 matching configurations')).toBeVisible();
});

test('exact match becomes visibly and accessibly selected with mapping provenance', async ({ page }) => {
  await page.goto(base);
  await search(page, 'psyn-scr-0001');
  await expect(page.getByText('Exact identifier match highlighted')).toBeVisible();
  await expect(page.getByRole('table').getByText('Exact match · not selected')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const row = page.getByRole('button', { name: 'Inspect PSYN-SCR-0001' });
  await row.click();
  const inspector = page.getByRole('complementary', { name: 'PSYN-SCR-0001' });
  await expect(inspector).toBeVisible();
  await expect(page.getByText('Exact identifier match selected')).toBeVisible();
  await expect(page.getByRole('table').getByText('Exact match · selected')).toBeVisible();
  await expect(row).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText(/Mapping evidence: synmap-v1-01 · prov.mapping.synthetic.v1/)).toBeVisible();
  await expect(inspector.getByRole('heading', { name: 'Catalog identity and mapping evidence' })).toBeVisible();
  await expect(inspector).toContainText('evidence:public:synthetic-identifier-mapping');
  await inspector.getByText('Evidence').first().click();
  await expect(inspector.getByText(/Synthetic fixture · PS-POC-SYNTHETIC-V1/).first()).toBeVisible();
});

test('invalid popstate clears previous results and fails closed', async ({ page }) => {
  await page.goto(base);
  await search(page, 'screws');
  await expect(page.getByText('30 matching configurations')).toBeVisible();
  await page.evaluate(() => {
    const valid = location.href;
    history.pushState({}, '', `${location.pathname}?v=bogus&q=screws`);
    history.pushState({}, '', valid);
    history.back();
  });
  await expect(page.getByRole('alert').getByRole('heading', { name: 'Catalog link could not be restored' })).toBeVisible();
  await expect(page.locator('table')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Choose a screw family' })).toBeVisible();
});

test('broad typed constraints remain explicit and records expose datum, drive, and head form', async ({ page }) => {
  await page.goto(base);
  await search(page, 'M4 screws');
  const constraints = page.getByRole('region', { name: 'Active constraints' });
  await expect(constraints).toBeVisible();
  await expect(constraints).toContainText('Nominal diameter: 4 mm');
  await expect(page.getByRole('columnheader', { name: 'Length datum' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Drive / head form' })).toBeVisible();
  await expect(page.locator('tbody tr').first()).toContainText('Under Head');
  await expect(page.locator('tbody tr').first()).toContainText('Internal Hex / Cylindrical');
});

test('ambiguous, missing, conflict, and empty states fail closed', async ({ page }) => {
  await page.goto(base);
  await search(page, 'PSYN-SCR-COLLIDE');
  await expect(page.getByRole('heading', { name: 'Exact identifier is not unique' })).toBeVisible();
  await expect(page.locator('table')).toHaveCount(0);
  await search(page, 'PSYN-SCR-9999');
  await expect(page.getByRole('heading', { name: 'Exact identifier not found' })).toBeVisible();
  await search(page, 'A2 stainless alloy steel screws');
  await expect(page.getByRole('heading', { name: 'Search terms conflict' })).toBeVisible();
  await expect(page.locator('table')).toHaveCount(0);
  await search(page, 'socket head cap screws');
  await page.getByLabel('Nominal diameter').selectOption('4');
  await page.getByLabel('Nominal length').selectOption('16');
  await expect(page.getByRole('heading', { name: 'No matching configurations' })).toBeVisible();
  await expect(page.locator('table')).toHaveCount(0);
});

test('desktop inspector is complementary and restores focus on browser Back', async ({ page }) => {
  await page.goto(base);
  await search(page, 'socket head cap screws');
  const row = page.getByRole('button', { name: 'Inspect PSYN-SCR-0001' });
  await row.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('complementary', { name: 'PSYN-SCR-0001' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByLabel('Query')).not.toHaveAttribute('inert');
  await page.goBack();
  await expect(page.getByRole('complementary', { name: 'PSYN-SCR-0001' })).toHaveCount(0);
  await expect(row).toBeFocused();
});

test('mobile uses stacked cards without horizontal table scrolling and traps/returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(base);
  await search(page, 'socket head cap screws');
  await expect(page.locator('.table-wrap')).toBeHidden();
  await expect(page.locator('.record-cards')).toBeVisible();
  await expect(page.locator('.record-cards article')).toHaveCount(10);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  const row = page.getByRole('button', { name: 'Inspect PSYN-SCR-0001' });
  await row.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'PSYN-SCR-0001' });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close inspector' })).toBeFocused();
  await expect(page.locator('main')).toHaveAttribute('inert', '');
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(row).toBeFocused();
});
