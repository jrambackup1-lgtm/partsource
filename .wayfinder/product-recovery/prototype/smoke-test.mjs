import { strict as assert } from 'node:assert';
import { chromium } from '../../../web/node_modules/playwright/index.mjs';

const baseURL = process.env.PROTOTYPE_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const checks = [];
const pass = (name) => checks.push({ name, status: 'PASS' });

async function search(page, query) {
  await page.locator('#query').fill(query);
  await page.locator('#search-form').evaluate(form => form.requestSubmit());
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  desktop.on('pageerror', error => errors.push(error.message));
  await desktop.goto(baseURL, { waitUntil: 'networkidle' });
  await desktop.getByRole('heading', { name: 'Move from a clue to a comparable family.' }).waitFor();
  assert.equal(await desktop.locator('.family-card').count(), 3);
  assert.match(await desktop.locator('.synthetic-banner').innerText(), /30 invented configurations/);
  pass('Home/start, persistent search, three family cards, and synthetic notice render');

  await search(desktop, 'screws');
  assert.equal(await desktop.locator('main h1').innerText(), 'Screws');
  assert.equal(await desktop.locator('.family-card').count(), 3);
  assert.match(await desktop.locator('.broad-table-note').innerText(), /30 configurations/);
  pass('Broad query preserves visible family step and all 30 configurations');

  await search(desktop, 'M6 20 mm socket head cap screws');
  assert.equal(await desktop.locator('tbody tr').count(), 1);
  assert.equal(await desktop.locator('.selected-row').count(), 0);
  assert.deepEqual(await desktop.locator('.status-panel .chip').allInnerTexts(), ['Socket-head cap screws', 'Thread: M6', 'Length: 20 mm']);
  pass('Family/dimensional query applies typed AND constraints without auto-selection');

  await search(desktop, 'socket head cap screws');
  await desktop.locator('[data-field="diameter"][value="4"]').check();
  assert.equal(await desktop.locator('tbody tr').count(), 2);
  await desktop.locator('[data-field="length"][value="25"]').check();
  await desktop.getByRole('heading', { name: 'No configuration has every active value' }).waitFor();
  assert.equal(await desktop.locator('.selected-row').count(), 0);
  pass('Family facets update deterministically and expose a fail-closed empty state');

  await search(desktop, 'PSYN-SCR-0006');
  const exactRow = desktop.locator('[data-record-id="synrec-v1-shcs-06"]');
  await exactRow.scrollIntoViewIfNeeded();
  assert.equal(await exactRow.evaluate(row => row.classList.contains('exact-row')), true);
  assert.equal(await exactRow.evaluate(row => row.classList.contains('selected-row')), false);
  assert.match(await desktop.locator('#exact-status').innerText(), /Highlighted, not selected/);
  await exactRow.press('Enter');
  assert.equal(await exactRow.evaluate(row => row.classList.contains('exact-row') && row.classList.contains('selected-row')), true);
  assert.match(await desktop.locator('.inspector').innerText(), /EXPLICITLY SELECTED/);
  assert.match(await desktop.locator('.inspector-notice').innerText(), /SYNTHETIC DETAIL/);
  pass('Exact ID highlights amber in family context; Enter adds distinct explicit selection and inspector');

  await desktop.locator('[data-evidence-field="pitch"]').click();
  const dialog = desktop.getByRole('dialog');
  await dialog.waitFor();
  assert.match(await dialog.innerText(), /Field-level evidence/i);
  assert.match(await dialog.innerText(), /Does not prove:/);
  assert.equal(await desktop.locator('.evidence-sheet [data-action="close-modal"]').evaluate(button => button === document.activeElement), true);
  await desktop.keyboard.press('Escape');
  pass('Progressive field evidence opens as a focused modal and states evidence limits');

  for (const scenario of [
    ['PSYN-SCR-9999', 'Identifier not found in this release'],
    ['PSYN-SCR-COLLIDE', 'Identifier mapping is not unique'],
    ['M4 M5 screws', 'Requirements conflict'],
    ['brass screws', 'Some terms are outside this synthetic scope'],
    ['stainless screws', 'Some terms are outside this synthetic scope']
  ]) {
    await search(desktop, scenario[0]);
    assert.equal(await desktop.locator('main h1').innerText(), scenario[1]);
    assert.equal(await desktop.locator('.selected-row, .exact-row').count(), 0);
  }
  pass('Unknown, collision, conflict, and unsupported states all highlight/select nothing');
  assert.deepEqual(errors, []);
  pass('Desktop run emitted no uncaught JavaScript errors');
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const mobileErrors = [];
  mobile.on('pageerror', error => mobileErrors.push(error.message));
  await mobile.goto(baseURL, { waitUntil: 'networkidle' });
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  assert.equal(await mobile.locator('.synthetic-banner').isVisible(), true);
  await search(mobile, 'PSYN-SCR-0006');
  assert.equal(await mobile.locator('.mobile-filter-button').isVisible(), true);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await mobile.locator('.mobile-filter-button').click();
  assert.equal(await mobile.locator('.facets.mobile-open').isVisible(), true);
  await mobile.getByRole('button', { name: 'Done' }).click();
  await mobile.locator('[data-record-id="synrec-v1-shcs-06"]').press('Enter');
  const inspectorBox = await mobile.locator('.inspector').boundingBox();
  assert(inspectorBox && inspectorBox.width >= 374 && inspectorBox.x === 0);
  assert.match(await mobile.locator('.inspector').innerText(), /EXPLICITLY SELECTED/);
  const closeBox = await mobile.locator('.inspector .close-button').boundingBox();
  assert(closeBox && closeBox.width >= 44 && closeBox.height >= 44);
  assert.deepEqual(mobileErrors, []);
  pass('375 px mobile reflows without page overflow; filters sheet and full-screen detail preserve semantics');
  await mobile.screenshot({ path: 'mobile-evidence.png', fullPage: false });
  await mobile.close();

  console.log(JSON.stringify({ status: 'PASS', baseURL, checks }, null, 2));
} finally {
  await browser.close();
}
