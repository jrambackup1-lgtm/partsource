import { expect, test, type Page } from '@playwright/test';

const base = '/partsource/';
const storageKey = 'partsource_boms:v1';

const m4SocketResult = {
  id: 'configuration-m4-socket-12',
  family: 'socket',
  type: 'Socket Head Cap Screw',
  reference_number: 'DIN912-M4X12',
  source_sku: '0009FA01257',
  title: 'M4 socket head cap screw, 12 mm length, black-oxide alloy steel',
  thread: 'M4',
  pitch: '0.7 mm',
  length: '12 mm',
  head: 'Socket',
  material: 'Alloy Steel',
  finish: 'Black-Oxide',
  drive: 'Hex',
  strength: 'Class 12.9',
  standard: 'DIN 912 / ISO 4762',
  prototype: true,
  demo: true,
  synthetic: true,
  provenance_kind: 'internal-demo-seed',
  provenance_note: 'Demo configuration facts imported from reviewed PartSource CSV packet.',
  verification: 'demo-only',
};

async function installCatalogSearchMock(page: Page) {
  const requests: Array<{ query: string; filters?: Record<string, string> }> = [];
  await page.route('**/functions/v1/catalog-search', async route => {
    const body = route.request().postDataJSON() as { query: string; filters?: Record<string, string> };
    requests.push(body);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ results: body.query.toLowerCase().includes('m4') ? [m4SocketResult] : [] }),
    });
  });
  return requests;
}

test('McMaster-number input fails closed and keyboard search preserves unsupported result state', async ({ page }) => {
  await page.goto(base);
  const search = page.getByPlaceholder('Enter McMaster part number or specifications...');
  await search.focus();
  await search.fill('91290A115');
  await search.press('Enter');

  await expect(page).toHaveURL(/\/parts\/91290A115$/);
  await expect(page.getByText('Exact McMaster lookup', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'No supported configuration yet' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Search Suppliers' })).toHaveCount(0);
});

test('M4 screws catalog search supports guided selection, supplier handoff, named BOM persistence, and CSV/JSON export', async ({ page }) => {
  const catalogRequests = await installCatalogSearchMock(page);
  await page.goto(base);

  const search = page.getByPlaceholder('Enter McMaster part number or specifications...');
  await search.fill('M4 screws');
  await expect(page.getByText('DIN912-M4X12')).toBeVisible();
  await search.press('ArrowDown');
  await search.press('Enter');

  await expect(page).toHaveURL(/\/parts\/DIN912-M4X12$/);
  expect(catalogRequests.some(request => request.query === 'M4 screws')).toBe(true);
  await expect(page.getByText('Configuration result for')).toBeVisible();
  const supplierPanel = page.getByRole('heading', { name: 'Search Suppliers' }).locator('../..');
  await expect(supplierPanel.getByRole('link', { name: /Search this configuration on/ }).first()).toHaveAttribute('target', '_blank');
  await expect(supplierPanel).not.toContainText(/\$\d|buy now|quote now|in stock|verified equivalent|replacement/i);

  await page.getByPlaceholder('BOM 1').fill('POC Ship BOM');
  await page.getByLabel('Quantity').fill('6');
  await page.getByLabel('User notes for this saved line').fill('Browser POC persistence check');
  await page.getByRole('button', { name: 'Save configuration snapshot to BOM' }).click();
  await expect(page.getByRole('status')).toContainText('Saved frozen snapshot to POC Ship BOM');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.goto(`${base}?tab=bom`);
  await expect(page.getByRole('button', { name: 'POC Ship BOM' })).toBeVisible();
  await expect(page.getByRole('row', { name: /DIN912-M4X12/ })).toBeVisible();

  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).first().click();
  const csv = await csvDownload;
  expect(csv.suggestedFilename()).toBe('POC_Ship_BOM.csv');

  const jsonDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Backup JSON' }).click();
  const json = await jsonDownload;
  expect(json.suggestedFilename()).toBe('partsource_bom_backup.json');

  const stored = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), storageKey);
  expect(stored.boms[0].name).toBe('POC Ship BOM');
  expect(stored.boms[0].items[0].selectionSnapshot.supplierSearchDestinations.length).toBeGreaterThan(0);
});

test('mobile 320px layout keeps core finder and BOM actions reachable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(base);
  await expect(page.getByRole('heading', { name: 'Part Finder' })).toBeVisible();
  await expect(page.getByPlaceholder('Enter McMaster part number or specifications...')).toBeVisible();

  await page.goto(`${base}?tab=bom`);
  await expect(page.getByRole('heading', { name: 'Active BOM Registry' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create BOM' }).first()).toBeVisible();
});
