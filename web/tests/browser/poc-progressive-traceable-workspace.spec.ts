import { expect, test } from '@playwright/test';

async function search(page: import('@playwright/test').Page, query: string) {
  await page.goto('/partsource/');
  await page.getByLabel('Query').fill(query);
  await page.getByRole('button', { name: 'Search' }).click();
}

test('deterministic trace exposes original, recognized, applied, unsupported, conflict, exact state, stop reason, and provenance', async ({ page }) => {
  await search(page, 'M6 titanium socket head screws');
  const trace = page.getByLabel('Deterministic interpretation trace');
  await expect(trace).toBeVisible();
  await trace.focus();
  await expect(trace).toBeFocused();
  await expect(trace).toContainText('Original input');
  await expect(trace).toContainText('M6 titanium socket head screws');
  await expect(trace).toContainText('Recognized');
  await expect(trace).toContainText('Family: Socket-head cap screws');
  await expect(trace).toContainText('Diameter: M6');
  await expect(trace).toContainText('Applied');
  await expect(trace).toContainText('Unsupported');
  await expect(trace).toContainText('titanium');
  await expect(trace).toContainText('Identifier state');
  await expect(trace).toContainText('not_attempted');
  await expect(trace).toContainText('Stop reason');
  await expect(trace).toContainText('query_unsupported');
  await expect(trace).toContainText('Provenance references');
  await expect(trace).toContainText('bundle:PS-POC-SYNTHETIC-V1');
  await expect(page.locator('.poc-results')).toHaveCount(0);

  await search(page, 'M4 M6 screws');
  const conflictTrace = page.getByLabel('Deterministic interpretation trace');
  await expect(conflictTrace).toContainText('Conflicts');
  await expect(conflictTrace).toContainText('Diameter: 4, 6');
  await expect(conflictTrace).toContainText('query_conflict');
  await expect(page.locator('.poc-results')).toHaveCount(0);
});

test('exact-ID states render unique, unknown, and non_unique without preferred or selected fallback', async ({ page }) => {
  await search(page, 'PSYN-SCR-0006');
  await expect(page.getByLabel('Deterministic interpretation trace')).toContainText('unique');
  await expect(page.getByLabel('Deterministic interpretation trace')).toContainText('synmap-v1-06');
  await expect(page.locator('.poc-highlighted')).toContainText('highlighted, not selected');
  await expect(page.getByRole('complementary')).toHaveCount(0);

  await search(page, 'PSYN-SCR-9999');
  await expect(page.getByLabel('Deterministic interpretation trace')).toContainText('unknown');
  await expect(page.getByLabel('Deterministic interpretation trace')).toContainText('exact_not_found');
  await expect(page.locator('.poc-results')).toHaveCount(0);
  await expect(page.locator('.poc-highlighted')).toHaveCount(0);

  await search(page, 'PSYN-SCR-COLLIDE');
  const body = page.locator('body');
  await expect(page.getByLabel('Deterministic interpretation trace')).toContainText('non_unique');
  await expect(page.getByLabel('Deterministic interpretation trace')).toContainText('synrec-v1-shcs-06');
  await expect(page.getByLabel('Deterministic interpretation trace')).toContainText('synrec-v1-bhss-06');
  await expect(page.locator('.poc-results')).toHaveCount(0);
  await expect(body).not.toContainText(/preferred|approved|equivalent|replacement|alternate|selected/i);
});

test('rows and detail expose comparison-ready facts and separated provenance without non-local controls', async ({ page }) => {
  await search(page, 'PSYN-SCR-0006');
  const row = page.locator('[data-record-id="synrec-v1-shcs-06"]');
  await expect(row).toHaveAccessibleName(/Open PSYN-SCR-0006 detail/);
  await expect(row).toHaveAccessibleDescription(/Family: Socket-head cap screws/);
  await expect(row).toHaveAccessibleDescription(/Thread: M6/);
  await expect(row).toHaveAccessibleDescription(/Length: 20 mm/);
  await expect(row).toHaveAccessibleDescription(/Record provenance: Synthetic POC fixture/);
  await expect(row).toHaveAccessibleDescription(/Fact provenance: synthetic fact/);
  await expect(row).toHaveAccessibleDescription(/Mapping provenance: synthetic identifier mapping/);
  await expect(row).toHaveAccessibleDescription(/highlighted, not selected/);
  await expect(row).toContainText('Record provenance: Synthetic POC fixture');
  await expect(row).toContainText('Fact provenance: synthetic fact');
  await expect(row).toContainText('Mapping provenance: synthetic identifier mapping');

  await row.click();
  await expect(row).toHaveAttribute('aria-pressed', 'true');
  await expect(row).toHaveAccessibleDescription(/Exact identifier match/);
  await expect(row).toHaveAccessibleDescription(/Explicitly selected/);
  await expect(row).toContainText('Exact identifier match');
  await expect(row).toContainText('Explicitly selected');
  await page.getByRole('button', { name: 'Close detail' }).click();

  await page.locator('[data-record-id="synrec-v1-shcs-05"]').click();
  await expect(page.locator('[data-record-id="synrec-v1-shcs-05"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-record-id="synrec-v1-shcs-05"]')).toHaveAccessibleDescription(/Explicitly selected/);
  await expect(page.locator('.poc-highlighted')).toContainText('PSYN-SCR-0006');
  const detail = page.getByRole('complementary');
  await expect(detail).toContainText('Record provenance: synthetic_fixture');
  await expect(detail).toContainText('Displayed fact provenance:');
  await expect(detail).toContainText('Identifier mapping provenance: synthetic_identifier');
  await expect(detail).toContainText('Synthetic POC data');

  const controls = page.getByRole('button').or(page.getByRole('link'));
  await expect(controls.filter({ hasText: /compare|shortlist|favorite|cart|export|quote|price/i })).toHaveCount(0);
});

test('320px rows stack facts, modal traps focus, Escape and Close restore focus', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await search(page, 'PSYN-SCR-0006');
  const metrics = await page.evaluate(() => {
    const facts = Array.from(document.querySelector('.poc-row-facts')!.children);
    const lefts = facts.map(element => Math.round(element.getBoundingClientRect().left));
    return {
      noDocumentOverflow: document.documentElement.scrollWidth <= window.innerWidth,
      noBodyOverflow: document.body.scrollWidth <= window.innerWidth,
      factsStacked: new Set(lefts).size === 1,
    };
  });
  expect(metrics).toEqual({ noDocumentOverflow: true, noBodyOverflow: true, factsStacked: true });

  const trigger = page.locator('[data-record-id="synrec-v1-shcs-06"]');
  await trigger.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close detail' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close detail' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Close detail' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await trigger.press('Enter');
  await page.getByRole('button', { name: 'Close detail' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('filter-driven selection invalidation clears detail, selected URL, and pressed state', async ({ page }) => {
  await search(page, 'M6 socket head screws');
  await page.locator('[data-record-id="synrec-v1-shcs-05"]').click();
  await expect(page.getByRole('complementary')).toBeVisible();
  await expect(page.locator('[aria-pressed="true"]')).toHaveCount(1);
  expect(page.url()).toContain('selected=');
  await page.getByLabel('Length').selectOption('40');
  await expect(page.getByRole('complementary')).toHaveCount(0);
  await expect(page.locator('[aria-pressed="true"]')).toHaveCount(0);
  expect(page.url()).not.toContain('selected=');
  await expect(page.getByText('0 matching configurations')).toBeVisible();
  await expect(page.getByLabel('Deterministic interpretation trace')).toContainText('catalog_empty');
});

test('browser adversarial queries reject bare numbers, unsupported units, OR, and negation without records', async ({ page }) => {
  for (const query of ['M6 20 socket head screws', '1/4 inch socket head screws', 'M4 or M6 screws', 'M4 screws not black oxide', 'M4 screws - black oxide']) {
    await search(page, query);
    await expect(page.getByRole('heading', { name: /Unsupported query constraint|Conflicting supported values/ })).toBeVisible();
    await expect(page.locator('.poc-results')).toHaveCount(0);
    await expect(page.locator('.poc-highlighted')).toHaveCount(0);
    await expect(page.getByLabel('Deterministic interpretation trace')).toContainText(/query_unsupported|query_conflict/);
  }
});

test('browser text interpretation normalizes hyphenated supported terms without treating minus syntax as a filter', async ({ page }) => {
  await search(page, 'socket-head screws');
  await expect(page.getByText('Screws / Hex-socket screws / Socket-head cap screws')).toBeVisible();
  await expect(page.locator('.poc-row')).toHaveCount(10);

  await search(page, 'black-oxide socket head screws');
  await expect(page.getByRole('button', { name: /Remove Finish black oxide/i })).toBeVisible();
  await expect(page.locator('.poc-row')).toHaveCount(4);

  await search(page, 'M4 screws - black oxide');
  await expect(page.getByRole('heading', { name: 'Unsupported query constraint' })).toBeVisible();
  await expect(page.locator('.poc-results')).toHaveCount(0);
});
