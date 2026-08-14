import assert from 'node:assert/strict';
import { createReadStream } from 'node:fs';
import { access, readFile } from 'node:fs/promises';
import http from 'node:http';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const instrumentRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(instrumentRoot, '..', '..', '..');
const requireFromWeb = createRequire(path.join(repoRoot, 'web', 'package.json'));
const { chromium } = requireFromWeb('@playwright/test');

const MIME = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
});

function startServer() {
  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1');
      if (!url.pathname.startsWith('/ticket25/')) {
        response.writeHead(404, { 'content-type': 'text/plain' });
        response.end('not found');
        return;
      }

      const relative = decodeURIComponent(url.pathname.slice('/ticket25/'.length)) || 'index.html';
      const resolved = path.resolve(instrumentRoot, relative);
      if (resolved !== instrumentRoot && !resolved.startsWith(`${instrumentRoot}${path.sep}`)) {
        response.writeHead(403, { 'content-type': 'text/plain' });
        response.end('forbidden');
        return;
      }

      await access(resolved);
      response.writeHead(200, {
        'cache-control': 'no-store',
        'content-type': MIME[path.extname(resolved)] ?? 'application/octet-stream',
      });
      createReadStream(resolved).pipe(response);
    } catch {
      response.writeHead(404, { 'content-type': 'text/plain' });
      response.end('not found');
    }
  });

  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, port: address.port });
    });
  });
}

function closeServer(server) {
  return new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}

const unsafeSelector = [
  '[data-action-kind="bom"]',
  '[data-action-kind="copy"]',
  '[data-action-kind="export"]',
  '[data-action-kind="supplier"]',
  'a[href^="http://"]',
  'a[href^="https://"]',
  'a[href^="mailto:"]',
  '[download]',
  'form[action]',
  'button[data-copy]',
  'button[data-export]',
].join(',');

const blockedFixtures = Object.freeze({
  broad: 'missing_profile_fact',
  partial: 'missing_profile_fact',
  conflict: 'invalid_clue',
  'external-hex': 'excluded_profile',
  'pan-head': 'excluded_profile',
  'wrong-unit': 'thread_semantics_conflict',
  'wrong-thread': 'thread_semantics_conflict',
  'identifier-zero': 'identifier_not_found',
  'identifier-many': 'identifier_ambiguous',
  unavailable: 'lifecycle_blocked',
  'no-manifest': 'no_manifest',
  'unknown-lifecycle': 'unknown_lifecycle',
  corrected: 'lifecycle_blocked',
  superseded: 'lifecycle_blocked',
  withdrawn: 'withdrawn',
  'private-field': 'invalid_catalog_schema',
});

const { server, port } = await startServer();
const origin = `http://127.0.0.1:${port}`;
const baseUrl = `${origin}/ticket25/`;
let browser;

try {
  const readyResponse = await fetch(`${baseUrl}ready.json`, { cache: 'no-store' });
  assert.equal(readyResponse.status, 200);
  const ready = await readyResponse.json();
  assert.deepEqual(ready, {
    artifactId: 'partsource-ticket25-proxy-poc',
    buildId: 'ticket25-proxy-poc-2026-08-10-v1',
    basePath: '/ticket25/',
    compilerVersion: 'ticket25/result-v1',
  });

  const wrongBase = await fetch(`${origin}/`, { cache: 'no-store' });
  assert.equal(wrongBase.status, 404);

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const consoleErrors = [];
  const consoleWarnings = [];
  const pageErrors = [];
  const failedRequests = [];
  const requests = [];
  const downloads = [];
  let popupCount = 0;

  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
    if (message.type() === 'warning') consoleWarnings.push(message.text());
  });
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  page.on('requestfailed', request => failedRequests.push(request.url()));
  page.on('download', download => downloads.push(download.suggestedFilename()));
  page.on('popup', () => { popupCount += 1; });

  const response = await page.goto(baseUrl, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  assert.equal(new URL(page.url()).pathname, '/ticket25/');

  const identity = await page.locator('[data-ticket25-root]').evaluate(node => ({
    count: document.querySelectorAll('[data-ticket25-root]').length,
    artifactId: node.dataset.artifactId,
    buildId: node.dataset.buildId,
    basePath: node.dataset.basePath,
    compilerVersion: node.dataset.compilerVersion,
  }));
  assert.deepEqual(identity, {
    count: 1,
    artifactId: ready.artifactId,
    buildId: ready.buildId,
    basePath: ready.basePath,
    compilerVersion: ready.compilerVersion,
  });

  await page.locator('[data-current-state][data-phase="candidate"]').waitFor();
  assert.equal(await page.locator('[data-candidate-state]').count(), 1);
  assert.equal(await page.locator(unsafeSelector).count(), 0);
  assert.equal(await page.locator('[data-candidate-state]').getAttribute('data-selection-state'), 'candidate_review');
  assert.equal(await page.locator('[data-candidate-state]').getAttribute('data-handoff-state'), 'prohibited');

  async function chooseFixture(name) {
    const immediate = await page.locator('[data-fixture-select]').evaluate((select, value) => {
      select.value = value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return {
        phase: document.querySelector('[data-current-state]').dataset.phase,
        candidateCount: document.querySelectorAll('[data-candidate-state]').length,
        blockedCount: document.querySelectorAll('[data-blocked-state]').length,
        unsafeCount: document.querySelectorAll([
          '[data-action-kind="bom"]', '[data-action-kind="copy"]',
          '[data-action-kind="export"]', '[data-action-kind="supplier"]',
          '[download]', 'form[action]', 'button[data-copy]', 'button[data-export]',
        ].join(',')).length,
      };
    }, name);
    assert.deepEqual(immediate, { phase: 'loading', candidateCount: 0, blockedCount: 0, unsafeCount: 0 });
    await page.locator('[data-current-state]:not([data-phase="loading"])').waitFor();
  }

  for (const [fixture, code] of Object.entries(blockedFixtures)) {
    await chooseFixture(fixture);
    const blocked = page.locator('[data-blocked-state]');
    assert.equal(await blocked.count(), 1, fixture);
    assert.equal(await blocked.getAttribute('data-block-code'), code, fixture);
    assert.equal(await page.locator('[data-next-review-action]').count(), 1, fixture);
    assert.ok((await page.locator('[data-next-review-action]').textContent()).trim().split(' ').length >= 5, fixture);
    assert.equal(await page.locator('[data-candidate-state]').count(), 0, fixture);
    assert.equal(await page.locator(unsafeSelector).count(), 0, fixture);
  }

  await chooseFixture('private-field');
  assert.doesNotMatch(await page.locator('body').innerText(), /PRIVATE-BROWSER-SENTINEL-9371|sourceSku/);
  assert.doesNotMatch(await page.content(), /PRIVATE-BROWSER-SENTINEL-9371|sourceSku/);

  await chooseFixture('rollback');
  assert.equal(await page.locator('[data-candidate-state]').count(), 1);
  assert.equal(await page.locator(unsafeSelector).count(), 0);

  await chooseFixture('candidate');
  const staleImmediate = await page.locator('[data-fixture-select]').evaluate(select => {
    select.value = 'partial';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return {
      phase: document.querySelector('[data-current-state]').dataset.phase,
      candidateCount: document.querySelectorAll('[data-candidate-state]').length,
      text: document.querySelector('[data-result]').textContent,
    };
  });
  assert.equal(staleImmediate.phase, 'loading');
  assert.equal(staleImmediate.candidateCount, 0);
  assert.doesNotMatch(staleImmediate.text, /Synthetic observation for review/);

  await page.locator('[data-fixture-select]').evaluate(select => {
    select.value = 'candidate';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('[data-current-state][data-phase="candidate"]').waitFor();
  await page.waitForTimeout(150);
  assert.equal(await page.locator('[data-current-state]').getAttribute('data-phase'), 'candidate');
  assert.equal(await page.locator('[data-candidate-state]').count(), 1);

  const malicious = '<img src=x onerror="window.__ticket25Injected=true">; https://supplier.invalid/secret';
  await page.locator('[data-clue-input]').evaluate((textarea, value) => {
    textarea.value = value;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }, malicious);
  await page.locator('[data-current-state][data-phase="blocked"]').waitFor();
  assert.equal(await page.locator('[data-preserved-input]').textContent(), malicious);
  assert.equal(await page.locator('[data-result] img').count(), 0);
  assert.equal(await page.locator('[data-result] a').count(), 0);
  assert.equal(await page.evaluate(() => window.__ticket25Injected === true), false);

  await page.setViewportSize({ width: 320, height: 720 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 0, `horizontal overflow: ${overflow}px`);

  await page.locator('[data-fixture-select]').focus();
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('[data-clue-input]').evaluate(node => document.activeElement === node), true);

  const storage = await page.evaluate(async () => ({
    local: localStorage.length,
    session: sessionStorage.length,
    indexedDb: typeof indexedDB.databases === 'function' ? (await indexedDB.databases()).length : 0,
    caches: typeof caches === 'object' ? (await caches.keys()).length : 0,
    serviceWorker: 'serviceWorker' in navigator ? (await navigator.serviceWorker.getRegistrations()).length : 0,
  }));
  assert.deepEqual(storage, { local: 0, session: 0, indexedDb: 0, caches: 0, serviceWorker: 0 });

  assert.deepEqual(consoleErrors, []);
  assert.deepEqual(consoleWarnings, []);
  assert.deepEqual(pageErrors, []);
  assert.deepEqual(failedRequests, []);
  assert.equal(popupCount, 0);
  assert.deepEqual(downloads, []);
  assert.equal(requests.every(requestUrl => new URL(requestUrl).origin === origin), true);

  const source = await readFile(path.join(instrumentRoot, 'ui.mjs'), 'utf8');
  assert.doesNotMatch(source, /\.innerHTML\s*=|insertAdjacentHTML|window\.open|navigator\.clipboard|localStorage|sessionStorage/);

  console.log(JSON.stringify({
    result: 'PASS',
    blockedFixtures: Object.keys(blockedFixtures).length,
    candidateFixtures: 2,
    staleTransitions: 2,
    viewport: '320x720',
    consoleErrors: 0,
    externalRequests: 0,
    unsafeControls: 0,
    privateLeaks: 0,
  }));

  await context.close();
} finally {
  if (browser) await browser.close();
  await closeServer(server);
}
