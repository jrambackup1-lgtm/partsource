import { expect, test } from '@playwright/test';

const base = '/partsource/';

async function search(page: import('@playwright/test').Page, query: string) {
  await page.getByLabel('Search the catalog').fill(query);
  await page.getByRole('button', { name: 'Search' }).click();
}

test('topbar stays pinned while scrolling results (sticky not defeated by overflow)', async ({ page }) => {
  await page.goto(base);
  await search(page, 'socket head cap screws');
  await expect(page.getByText('10 matching parts')).toBeVisible();
  await page.locator('tbody').last().scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 800);
  const top = await page.locator('.topbar').evaluate(element => element.getBoundingClientRect().top);
  expect(top).toBe(0);
  // The global search remains visible and usable while scrolled.
  await expect(page.getByLabel('Search the catalog')).toBeVisible();
});

test('search outcome is announced: focus moves to the result summary', async ({ page }) => {
  await page.goto(base);
  await search(page, 'socket head cap screws');
  await expect(page.locator('#catalog-results-summary')).toBeFocused();
  // Failures are assertive and receive focus as well.
  await search(page, 'PSYN-SCR-9999');
  const failure = page.getByRole('alert').filter({ hasText: 'Exact identifier not found' });
  await expect(failure).toBeVisible();
  await expect(failure.getByRole('heading')).toBeFocused();
});

test('result table semantics: scoped headers, no invalid aria-selected, consistent action state', async ({ page }) => {
  await page.goto(base);
  await search(page, 'psyn-scr-0001');
  await expect(page.getByText('10 matching parts')).toBeVisible();
  expect(await page.locator('thead th:not([scope="col"])').count()).toBe(0);
  expect(await page.locator('tbody tr[aria-selected]').count()).toBe(0);
  const row = page.locator('tbody tr').first();
  await expect(row.getByRole('button', { name: 'Inspect PSYN-SCR-0001' })).toHaveAttribute('aria-pressed', 'false');
  await expect(row.getByRole('button', { name: 'Open details for PSYN-SCR-0001' })).toHaveAttribute('aria-pressed', 'false');
  await row.getByRole('button', { name: 'Inspect PSYN-SCR-0001' }).click();
  await expect(row.getByRole('button', { name: 'Inspect PSYN-SCR-0001' })).toHaveAttribute('aria-pressed', 'true');
  await expect(row.getByRole('button', { name: 'Open details for PSYN-SCR-0001' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Close inspector' }).click();
});

test('search input is named by its visible programmatic label, not an overriding aria-label', async ({ page }) => {
  await page.goto(base);
  const input = page.locator('#catalog-query');
  await expect(input).toHaveAccessibleName('Search the catalog');
  await expect(input).not.toHaveAttribute('aria-label');
});

test('mobile browse rail: every family chip is reachable and the page does not clip', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto(base);
  await search(page, 'screws');
  await expect(page.getByText('3 matching families')).toBeVisible();
  const rail = page.locator('.browse-panel');
  const withinViewport = await rail.evaluate(element => element.getBoundingClientRect().right <= window.innerWidth + 0.5);
  expect(withinViewport).toBe(true);
  const nav = page.locator('.browse-panel nav');
  // The rail scrolls internally; the last chip can be brought fully into view.
  const lastReachable = await nav.evaluate(element => {
    const chips = element.querySelectorAll('button');
    const last = chips[chips.length - 1] as HTMLElement;
    last.scrollIntoView({ block: 'nearest', inline: 'end' });
    const rect = last.getBoundingClientRect();
    return rect.right <= window.innerWidth + 0.5 && rect.left >= -0.5;
  });
  expect(lastReachable).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('mobile inspector locks background scroll while open', async ({ page }) => {
  // This test re-renders the full result list at a changed viewport plus two
  // computed-style polls; measured ≈23 s under full-suite load against the
  // 30 s default (load-sensitive flake, f5) — allow headroom rather than
  // weakening the assertions.
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto(base);
  await search(page, 'socket head cap screws');
  await page.getByRole('button', { name: 'Inspect PSYN-SCR-0001' }).click();
  const dialog = page.getByRole('dialog', { name: 'PSYN-SCR-0001' });
  await expect(dialog).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('overflow-y', 'hidden');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('body')).toHaveCSS('overflow-y', 'visible');
});

test('match label and table headers are legible at default size', async ({ page }) => {
  await page.goto(base);
  await search(page, 'psyn-scr-0001');
  const label = page.locator('.match-label').first();
  await expect(label).toBeVisible();
  const labelSize = await label.evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize));
  expect(labelSize).toBeGreaterThanOrEqual(11);
  const headerSize = await page.locator('thead th').first().evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize));
  expect(headerSize).toBeGreaterThanOrEqual(11);
});
