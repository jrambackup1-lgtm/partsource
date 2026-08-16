import { expect, test } from '@playwright/test';

const base = '/partsource/';

async function search(page: import('@playwright/test').Page, query: string) {
  await page.getByLabel('Search the catalog').fill(query);
  await page.getByRole('button', { name: 'Search' }).click();
}

test('supports home examples, broad browse, current hierarchy, and family facets', async ({ page }) => {
  await page.goto(base);
  await expect(page).toHaveTitle('PartSource | Structured Component Catalog');
  await expect(page.locator('.notice .release')).toContainText(/Catalog: partsource\.synthetic\.screws\.v1 · sha256:[a-f0-9]{12}/);
  await expect(page.getByRole('button', { name: 'M4 screws' })).toBeVisible();
  // Broad browse lands on the explicit family step, never a flattened mixed table.
  await page.getByRole('button', { name: 'Browse all screws' }).click();
  await expect(page.getByText('3 matching families')).toBeVisible();
  await expect(page.locator('.family-chooser .chooser-family')).toHaveCount(3);
  await expect(page.locator('table')).toHaveCount(0);
  await expect(page.getByLabel('Search the catalog')).toHaveValue('screws');
  await page.locator('.family-chooser').getByRole('button', { name: /Socket-head cap screws 10/ }).click();
  await expect(page.getByRole('heading', { name: 'Socket-head cap screws' })).toBeVisible();
  await expect(page.getByText('10 matching parts')).toBeVisible();
  await page.getByRole('checkbox', { name: 'Material: A2 Stainless (6)' }).check();
  await expect(page.getByText('6 matching parts')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Active constraints' })).toContainText('Material: A2 Stainless');
});

test('broad M4 query shows constraint-aware family choices and preserves M4 into the family', async ({ page }) => {
  await page.goto(base);
  await search(page, 'M4 screws');
  const chooser = page.locator('.family-chooser');
  await expect(chooser).toBeVisible();
  await expect(page.getByText('3 matching families')).toBeVisible();
  for (const family of ['Socket-head cap screws', 'Button-head socket screws', 'Countersunk socket screws']) {
    await expect(chooser.getByRole('button', { name: new RegExp(`${family} 2 parts`) })).toBeVisible();
  }
  const constraints = page.getByRole('region', { name: 'Active constraints' });
  await expect(constraints).toContainText('Nominal diameter: 4 mm');
  // Choosing a family keeps the query-derived constraint as a removable chip.
  await chooser.getByRole('button', { name: /Button-head socket screws 2/ }).click();
  await expect(page.getByRole('heading', { name: 'Button-head socket screws' })).toBeVisible();
  await expect(page.getByText('2 matching parts')).toBeVisible();
  await expect(constraints).toContainText('Nominal diameter: 4 mm');
  await expect(page.getByLabel('Search the catalog')).toHaveValue('M4 screws');
  await constraints.getByRole('button', { name: 'Remove constraint Nominal diameter: 4 mm' }).click();
  await expect(page.getByText('10 matching parts')).toBeVisible();
});

test('partially recognized queries apply known terms and keep unknown terms as visible text', async ({ page }) => {
  await page.goto(base);
  await search(page, 'stainless screws');
  await expect(page.getByText('3 matching families')).toBeVisible();
  await expect(page.locator('.uninterpreted')).toContainText('stainless');
  await expect(page.locator('.uninterpreted')).toContainText('no fact was inferred');
  await search(page, 'button head screws');
  await expect(page.getByText('3 matching families')).toBeVisible();
  await expect(page.locator('.uninterpreted')).toContainText('button');
  // Nothing recognized at all still fails closed.
  await search(page, 'titanium bolts');
  await expect(page.getByRole('heading', { name: 'Search terms not recognized' })).toBeVisible();
  await expect(page.locator('table')).toHaveCount(0);
  // Negation never applies the adjacent constraint.
  await search(page, 'M4 screws not black oxide');
  await expect(page.getByRole('heading', { name: 'Search terms not recognized' })).toBeVisible();
  await expect(page.locator('.family-chooser')).toHaveCount(0);
  // The spec-published family alias (B02) routes context; it adds no typed fact.
  await search(page, 'socket head screws');
  await expect(page.getByRole('heading', { name: 'Socket-head cap screws' })).toBeVisible();
  await expect(page.getByText('10 matching parts')).toBeVisible();
  await search(page, 'A2 stainless socket head cap screws');
  await expect(page.getByText('6 matching parts')).toBeVisible();
});

test('exact match banner stays honest across select-other-row and filter-exclusion paths', async ({ page }) => {
  await page.goto(base);
  await search(page, 'psyn-scr-0001');
  const banner = page.locator('.exact-banner');
  await expect(banner).toContainText('Part psyn-scr-0001 matches — highlighted below');
  await expect(page.locator('.catalog-content')).not.toContainText('synmap-');
  await expect(page.locator('.catalog-content')).not.toContainText('prov.');
  await expect(page.getByRole('table').getByText('Exact match · not selected')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  // Selecting a DIFFERENT row never flips the banner to "selected".
  await page.getByRole('button', { name: 'Inspect PSYN-SCR-0002' }).click();
  const otherInspector = page.getByRole('complementary', { name: 'PSYN-SCR-0002' });
  await expect(otherInspector).toBeVisible();
  await expect(banner).toContainText('highlighted below');
  await otherInspector.getByRole('button', { name: 'Close inspector' }).click();
  // Selecting the mapped row does.
  const row = page.getByRole('button', { name: 'Inspect PSYN-SCR-0001' });
  await row.click();
  const inspector = page.getByRole('complementary', { name: 'PSYN-SCR-0001' });
  await expect(inspector).toBeVisible();
  await expect(banner).toContainText('matches — selected');
  await expect(page.getByRole('table').getByText('Exact match · selected')).toBeVisible();
  await expect(row).toHaveAttribute('aria-pressed', 'true');
  // Mapping and provenance identifiers live in the inspector diagnostics, not above results.
  await expect(inspector.getByRole('heading', { name: 'Diagnostics: identity and mapping evidence' })).toBeVisible();
  await expect(inspector).toContainText('evidence:public:synthetic-identifier-mapping');
  await inspector.getByText('Evidence', { exact: true }).first().click();
  await expect(inspector.getByText(/Synthetic fixture · PS-POC-SYNTHETIC-V1/).first()).toBeVisible();
  await inspector.getByRole('button', { name: 'Close inspector' }).click();
  // A filter that excludes the exact match states it plainly; mapping unchanged.
  await page.getByRole('checkbox', { name: 'Nominal diameter: 6 (3)' }).check();
  await expect(banner).toContainText('matches — filtered out');
  await expect(banner).toContainText('Your active filters exclude this exact match');
});

test('invalid popstate clears previous results and fails closed', async ({ page }) => {
  await page.goto(base);
  await search(page, 'screws');
  await expect(page.getByText('3 matching families')).toBeVisible();
  await page.evaluate(() => {
    const valid = location.href;
    history.pushState({}, '', `${location.pathname}?v=bogus&q=screws`);
    history.pushState({}, '', valid);
    history.back();
  });
  await expect(page.getByRole('alert').getByRole('heading', { name: 'Catalog link could not be restored' })).toBeVisible();
  await expect(page.locator('.family-chooser')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Choose a screw family' })).toBeVisible();
});

test('schema-driven family columns and multi-select facets in family context', async ({ page }) => {
  await page.goto(base);
  await search(page, 'socket head cap screws');
  await expect(page.getByText('10 matching parts')).toBeVisible();
  // Columns are the facts that vary in this family; constant attributes
  // (thread system, length datum, drive, head profile) become family chips.
  for (const header of ['Nominal diameter', 'Pitch', 'Nominal length', 'Material', 'Finish']) {
    await expect(page.getByRole('columnheader', { name: header, exact: true })).toBeVisible();
  }
  await expect(page.getByRole('columnheader', { name: 'Length datum' })).toHaveCount(0);
  const constants = page.locator('.family-constants');
  await expect(constants).toContainText('Under Head');
  await expect(constants).toContainText('Internal Hex');
  await page.getByRole('checkbox', { name: 'Nominal diameter: 4 (2)' }).check();
  await expect(page.getByText('2 matching parts')).toBeVisible();
  // OR within a fact: adding M6 keeps M4 live instead of replacing it.
  await page.getByRole('checkbox', { name: 'Nominal diameter: 6 (3)' }).check();
  await expect(page.getByText('5 matching parts')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Active constraints' })).toContainText('4 mm or 6 mm');
  await page.getByRole('checkbox', { name: 'Nominal diameter: 4 (2)' }).uncheck();
  await expect(page.getByText('3 matching parts')).toBeVisible();
  // Numeric sort via the schema-driven toolbar.
  await page.getByLabel('Sort by').selectOption('length_mm');
  const firstLength = await page.locator('tbody tr').first().textContent();
  expect(firstLength).toContain('16');
});

test('ambiguous, missing, conflict, and empty states fail closed', async ({ page }) => {
  await page.goto(base);
  await search(page, 'PSYN-SCR-COLLIDE');
  await expect(page.getByRole('heading', { name: 'Exact identifier is not unique' })).toBeVisible();
  await expect(page.locator('table')).toHaveCount(0);
  await search(page, 'PSYN-SCR-9999');
  const notFound = page.getByRole('alert').filter({ hasText: 'Exact identifier not found' });
  await expect(notFound).toBeVisible();
  await expect(notFound).toContainText('"PSYN-SCR-9999"');
  await search(page, 'A2 stainless alloy steel screws');
  await expect(page.getByRole('heading', { name: 'Search terms conflict' })).toBeVisible();
  await expect(page.locator('table')).toHaveCount(0);
  await search(page, 'M4 40 mm socket head cap screws');
  await expect(page.getByRole('heading', { name: 'No matching parts' })).toBeVisible();
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
  await expect(page.getByLabel('Search the catalog')).not.toHaveAttribute('inert');
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
