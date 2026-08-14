'use strict';
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const baseUrl = process.env.PROTOTYPE_URL || 'http://127.0.0.1:8765/index.html';
const checks = [];
const failures = [];

function check(condition, message) {
  if (!condition) throw new Error(message);
  checks.push(message);
}

async function state(page) {
  return JSON.parse(await page.locator('#stateJson').textContent());
}

async function openCase(page, key) {
  await page.goto(`${baseUrl}?case=${encodeURIComponent(key)}`);
  await page.waitForSelector('#stateKind');
  return state(page);
}

async function run(name, fn) {
  try {
    await fn();
    process.stdout.write(`PASS  ${name}\n`);
  } catch (error) {
    failures.push({ name, error: error.message });
    process.stdout.write(`FAIL  ${name}: ${error.message}\n`);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const externalRequests = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('request', request => {
    const url = new URL(request.url());
    if (!['127.0.0.1', 'localhost'].includes(url.hostname)) externalRequests.push(request.url());
  });

  await run('broad intent routes to family candidates and preserves M4', async () => {
    const s = await openCase(page, 'broad');
    check(s.route === 'text_discovery', 'broad route is text discovery');
    check(s.resolution === 'family_candidates', 'broad resolution is family candidates');
    check((await page.locator('[data-family]').count()) === 3, 'broad state shows three bounded family interpretations');
    check((await page.locator('#rawClue').textContent()) === 'M4 screw', 'broad original clue is preserved');
    check((await page.locator('.facts').textContent()).includes('M4'), 'broad deterministic ledger carries M4');
    check((await page.locator('input[name="candidate"]:checked').count()) === 0, 'broad state has no selected candidate');
    const familyButton = page.locator('[data-family="socket"]');
    await familyButton.focus();
    await page.keyboard.press('Enter');
    const after = await state(page);
    check(after.acceptedFamily === 'socket', 'user family choice is explicit');
    check((await page.locator('input[name="candidate"]').count()) === 4, 'family choice filters to four M4 synthetic records');
    check((await page.locator('.candidate-row').allTextContents()).every(text => text.includes('M4')), 'M4 constraint carries into every candidate');
    check((await page.locator('input[name="candidate"]:checked').count()) === 0, 'family choice does not auto-select a candidate');
  });

  await run('constrained intent keeps proposal separate and carries constraints', async () => {
    const s = await openCase(page, 'constrained');
    check(s.resolution === 'clarification_required', 'constrained family remains proposed before user acceptance');
    check((await page.locator('.facts').textContent()).includes('agent proposal'), 'family is labeled agent proposal');
    check((await page.locator('.facts').textContent()).includes('Not supplied'), 'missing fields remain visible');
    await page.locator('[data-family="socket"]').click();
    const rows = await page.locator('.candidate-row').allTextContents();
    check(rows.length === 4, 'accepted constrained family produces four bounded candidates');
    check(rows.every(text => text.includes('M4')), 'constrained M4 survives family acceptance');
  });

  await run('exact ID one is mapped but never auto-selected', async () => {
    const s = await openCase(page, 'exact-one');
    check(s.route === 'exact_identifier', 'exact-one uses exact identifier route');
    check(s.identityCardinality === 'one', 'exact-one identity cardinality is one');
    check((await page.locator('input[name="candidate"]').count()) === 1, 'exact-one shows one mapped record');
    check((await page.locator('input[name="candidate"]:checked').count()) === 0, 'one mapping is not automatic selection');
    await page.locator('input[name="candidate"]').check();
    check((await page.locator('#snapshot').count()) === 0, 'candidate choice does not silently create snapshot');
    await page.locator('#createSnapshot').click();
    check((await page.locator('#snapshot').count()) === 1, 'explicit action creates discovery snapshot');
    check((await page.locator('#snapshot').textContent()).includes('not approval'), 'snapshot denies approval');
  });

  await run('exact ID zero fails closed without substitution', async () => {
    const s = await openCase(page, 'exact-zero');
    check(s.identityCardinality === 'zero', 'exact-zero cardinality is zero only with loaded fixture');
    check(s.fixtureStatus === 'ready', 'exact-zero distinguishes loaded fixture from failure');
    check((await page.locator('input[name="candidate"]').count()) === 0, 'exact-zero shows no candidate');
    check((await page.locator('#stateSummary').textContent()).includes('No nearby identifier was substituted'), 'exact-zero denies nearby substitution');
  });

  await run('exact ID many exposes collision and blocks selection', async () => {
    const s = await openCase(page, 'exact-many');
    check(s.identityCardinality === 'many', 'exact-many cardinality is many');
    check((await page.locator('input[name="candidate"]').count()) === 2, 'exact-many exposes both targets');
    check((await page.locator('input[name="candidate"]:enabled').count()) === 0, 'collision disables candidate selection');
    check((await page.locator('#stateSummary').textContent()).includes('did not choose the first'), 'collision explicitly denies first-row choice');
  });

  await run('ambiguous input remains interpretation, not fact', async () => {
    const s = await openCase(page, 'ambiguous');
    check(s.resolution === 'clarification_required', 'ambiguous input asks for clarification');
    check((await page.locator('[data-family]').count()) === 2, 'ambiguous input shows bounded alternatives');
    check((await page.locator('.agent-row').count()) === 3, 'three bounded agent roles are visible');
    check((await page.locator('.agent-row').allTextContents()).every(text => text.includes('input span')), 'all agent outputs cite input spans');
  });

  await run('missing data never defaults technical values', async () => {
    const s = await openCase(page, 'missing');
    check(s.resolution === 'clarification_required', 'missing data requires clarification');
    const text = await page.locator('.facts').textContent();
    check(text.includes('Thread designation') && text.includes('Not supplied'), 'missing thread is explicit');
    check((await page.locator('input[name="candidate"]').count()) === 0, 'missing data cannot produce candidates');
  });

  await run('conflicts preserve every occurrence and choose no winner', async () => {
    const s = await openCase(page, 'conflict');
    check(s.resolution === 'conflict', 'conflict truth state is explicit');
    const text = await page.locator('.facts').textContent();
    for (const token of ['M4','M5','8 mm','12 mm']) check(text.includes(token), `conflict preserves ${token}`);
    check((await page.locator('input[name="candidate"]').count()) === 0, 'conflict blocks candidate search');
    check((await page.locator('#stateSummary').textContent()).includes('no winner'), 'conflict declares no winner');
  });

  await run('plausible absent and unsupported scope stay distinct', async () => {
    let s = await openCase(page, 'plausible-absent');
    check(s.candidateCardinality === 'zero', 'plausible absent is candidate zero');
    check((await page.locator('#stateSummary').textContent()).includes('not a claim'), 'plausible absent avoids invalidity claim');
    s = await openCase(page, 'unsupported');
    check(s.resolution === 'unsupported_scope', 'unsupported clue has unsupported scope state');
    check(s.identityCardinality === 'not_evaluated', 'unsupported scope does not fake zero identity');
    check((await page.locator('#rawClue').textContent()).includes('6204 bearing'), 'unsupported clue remains unchanged');
    check((await page.locator('input[name="candidate"]').count()) === 0, 'unsupported clue has no nearby candidates');
  });

  await run('model failure retains deterministic facts but creates no proposal', async () => {
    const s = await openCase(page, 'model-offline');
    check(s.modelStatus === 'unavailable', 'model state is unavailable');
    check((await page.locator('.facts').textContent()).includes('M4'), 'model failure retains deterministic M4');
    check((await page.locator('.agent-offline').count()) === 1, 'agent area explicitly fails closed');
    check((await page.locator('input[name="candidate"]').count()) === 0, 'model failure shows no stale candidates');
  });

  await run('fixture failure clears prior selection and snapshot', async () => {
    await openCase(page, 'exact-one');
    await page.locator('input[name="candidate"]').check();
    await page.locator('#createSnapshot').click();
    check((await page.locator('#snapshot').count()) === 1, 'precondition snapshot exists');
    await page.locator('[data-case="fixture-offline"]').click();
    const s = await state(page);
    check(s.fixtureStatus === 'unavailable', 'fixture failure state is unavailable');
    check(s.identityCardinality === 'not_evaluated', 'fixture failure is not identity zero');
    check(s.selectedId === null && s.snapshot === null, 'fixture failure clears stale selection and snapshot');
    check((await page.locator('input[name="candidate"]').count()) === 0, 'fixture failure shows no candidate controls');
  });

  await run('custom input routes deterministically and escapes hostile text', async () => {
    await openCase(page, 'broad');
    await page.locator('#clue').fill('PS-DEMO:MANY-002');
    await page.locator('#resolver button').click();
    check((await state(page)).identityCardinality === 'many', 'custom exact ID routes to many state');
    await page.locator('#clue').fill('<script>window.pwned=1</script> M4 screw');
    await page.locator('#resolver button').click();
    check((await page.locator('#rawClue').textContent()).includes('<script>'), 'hostile-looking clue renders as text');
    check(await page.evaluate(() => window.pwned === undefined), 'hostile-looking clue does not execute');
  });

  await run('blank clue remains blank and abstains without fixture defaults', async () => {
    await openCase(page, 'broad');
    await page.locator('#clue').fill('');
    await page.locator('#resolver button').click();
    let s = await state(page);
    check(s.raw === '', 'blank raw clue is preserved exactly');
    check(s.resolution === 'clarification_required', 'blank clue abstains for clarification');
    check((await page.locator('#rawClue').textContent()) === 'Blank input', 'blank clue has an explicit empty-state label');
    check((await page.locator('input[name="candidate"]').count()) === 0, 'blank clue produces no candidate');
    check((await page.locator('.agent-row').count()) === 0, 'blank clue creates no agent proposal');
    check(s.constraints[0].truthState === 'missing' && s.constraints[0].origin === 'No user text', 'blank clue is not labeled supplied');
    check((await page.locator('.next p').textContent()) === 'Describe the component clue', 'blank clue asks for one initial clue');
    check(new URL(page.url()).searchParams.has('q'), 'blank clue is explicit in URL state');
    await page.reload();
    s = await state(page);
    check(s.raw === '', 'blank clue survives reload without fixture substitution');
  });

  await run('generic clues never receive canned agent spans', async () => {
    await openCase(page, 'broad');
    await page.locator('#clue').fill('bolt');
    await page.locator('#resolver button').click();
    let s = await state(page);
    check(s.case === 'missing', 'generic bolt routes to missing-data state');
    check((await page.locator('.agent-row').count()) === 0, 'generic bolt creates no canned proposal');
    check((await page.locator('#workspace').textContent()).includes('socket head') === false, 'generic bolt does not invent socket-head language');
    await page.locator('#clue').fill('widgetish');
    await page.locator('#resolver button').click();
    s = await state(page);
    check(s.case === 'ambiguous', 'unknown generic clue routes to ambiguity');
    check((await page.locator('.agent-row').count()) === 0, 'unknown generic clue creates no canned proposal');
    check((await page.locator('[data-family]').count()) === 0, 'unknown generic clue creates no unanchored family options');
    check((await page.locator('#workspace').textContent()).includes('low profile') === false, 'unknown generic clue does not invent low-profile language');
  });

  await run('multiple supplied identifiers conflict instead of choosing first', async () => {
    await openCase(page, 'broad');
    await page.locator('#clue').fill('PS-DEMO:ONE-001 PS-DEMO:MANY-002');
    await page.locator('#resolver button').click();
    const s = await state(page);
    check(s.resolution === 'conflict', 'multiple identifiers route to conflict');
    check(s.identityCardinality === 'not_evaluated', 'multiple identifiers do not fake one identity');
    check((await page.locator('.facts').textContent()).includes('PS-DEMO:ONE-001 ↔ PS-DEMO:MANY-002'), 'all identifier occurrences remain visible');
    check((await page.locator('input[name="candidate"]').count()) === 0, 'identifier conflict blocks candidate mapping');
    check((await page.locator('#stateSummary').textContent()).includes('no first-ID winner'), 'identifier conflict denies first-ID selection');
  });

  await run('every abstention state names one available next action', async () => {
    await openCase(page, 'model-offline');
    let action = await page.locator('.next p').textContent();
    check(action === 'Retry interpretation; M4 remains preserved', 'model failure has one precise retry action');
    await openCase(page, 'plausible-absent');
    action = await page.locator('.next p').textContent();
    check(action === 'Revise the 99 mm constraint', 'absent fixture record has one available revision action');
    await openCase(page, 'constrained');
    action = await page.locator('.next p').textContent();
    check(action === 'Use the family interpretation to continue', 'constrained intent names the available family action');
    await openCase(page, 'ambiguous');
    action = await page.locator('.next p').textContent();
    check(action === 'Choose one family interpretation', 'ambiguous intent names the available family action');
  });

  await run('every rendered agent span exists in the preserved clue', async () => {
    for (const key of ['broad','constrained','ambiguous','missing','plausible-absent']) {
      await openCase(page, key);
      const raw = (await page.locator('#rawClue').textContent()).toLowerCase();
      const spans = await page.locator('.quote').allTextContents();
      check(spans.length > 0, `${key} fixture renders bounded agents`);
      for (const line of spans) {
        const span = line.replace(/^input span:\s*[“"]/, '').replace(/[”"]$/, '').toLowerCase();
        check(raw.includes(span), `${key} agent span is an actual clue substring: ${span}`);
      }
    }
  });

  await run('URL fixture state round-trips through reload and browser history', async () => {
    await openCase(page, 'broad');
    await page.locator('[data-case="constrained"]').click();
    check(new URL(page.url()).searchParams.get('case') === 'constrained', 'case action updates URL');
    await page.reload();
    check((await state(page)).case === 'constrained', 'reload preserves case');
    await page.goBack();
    check((await state(page)).case === 'broad', 'browser back restores prior case');
    await page.goForward();
    check((await state(page)).case === 'constrained', 'browser forward restores next case');
    check((await page.locator('input[name="candidate"]:checked').count()) === 0, 'history round-trip remains unselected');
  });

  await run('incompatible URL case and clue fail closed through deterministic rerouting', async () => {
    await page.goto(`${baseUrl}?case=exact-one&q=`);
    let s = await state(page);
    check(s.case === 'missing' && s.raw === '', 'blank q overrides incompatible exact-one case');
    check(s.identityCardinality === 'not_evaluated', 'blank URL clue cannot manufacture identity one');
    check((await page.locator('input[name="candidate"]').count()) === 0, 'blank URL clue cannot expose mapped candidate');
    check(s.constraints.some(item => item.field === 'Namespace') === false, 'blank URL clue cannot manufacture namespace fact');

    await page.goto(`${baseUrl}?case=exact-one&q=widgetish`);
    s = await state(page);
    check(s.case === 'ambiguous' && s.raw === 'widgetish', 'generic q overrides incompatible exact-one case');
    check(s.identityCardinality === 'not_evaluated', 'generic URL clue cannot manufacture identity one');
    check((await page.locator('input[name="candidate"]').count()) === 0, 'generic URL clue cannot expose mapped candidate');

    const panClue = 'M4 pan head screw';
    await page.goto(`${baseUrl}?case=constrained&q=${encodeURIComponent(panClue)}`);
    s = await state(page);
    check(s.case === 'broad', 'pan-head q overrides incompatible constrained case');
    check(s.constraints.some(item => item.truthState === 'agent proposal' && item.span === 'socket head') === false, 'incompatible URL cannot insert socket-head fact proposal');
    const spans = await page.locator('.quote').allTextContents();
    check(spans.every(line => panClue.toLowerCase().includes(line.replace(/^input span:\s*[“"]/, '').replace(/[”"]$/, '').toLowerCase())), 'rerouted URL agents remain span-anchored');

    await page.goto(`${baseUrl}?case=broad`);
    await page.evaluate(() => history.pushState({}, '', '?case=exact-one&q=widgetish'));
    await page.goBack();
    await page.goForward();
    s = await state(page);
    check(s.case === 'ambiguous' && s.identityCardinality === 'not_evaluated', 'popstate also reroutes incompatible case and q');
    check((await page.locator('input[name="candidate"]').count()) === 0, 'popstate cannot restore a stale incompatible mapping');
  });

  await run('320 CSS px composition has no page overflow and keeps origins visible', async () => {
    await page.setViewportSize({ width: 320, height: 800 });
    await openCase(page, 'conflict');
    const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }));
    check(dimensions.scrollWidth <= dimensions.innerWidth, `320px has no horizontal page overflow (${dimensions.scrollWidth}/${dimensions.innerWidth})`);
    check(await page.locator('.facts td:last-child').first().isVisible(), 'truth origin stays visible at 320px');
    check((await page.locator('#rawClue').boundingBox()).width <= 296, 'long clue fits narrow content column');
  });

  await run('keyboard focus and product-boundary controls are clean', async () => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openCase(page, 'broad');
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('Tab');
    check(await page.evaluate(() => document.activeElement?.id === 'clue'), 'first keyboard focus reaches resolver input');
    const outline = await page.locator('#clue').evaluate(element => getComputedStyle(element).outlineWidth);
    check(outline !== '0px', 'keyboard focus has a visible outline');
    const controls = (await page.locator('button, a').allTextContents()).join(' ').toLowerCase();
    for (const forbidden of ['add to bom','supplier','buy','export','deploy','checkout']) check(!controls.includes(forbidden), `no ${forbidden} control exists`);
  });

  await run('browser console and network stay clean', async () => {
    check(consoleErrors.length === 0, `no console errors (${consoleErrors.join(' | ')})`);
    check(pageErrors.length === 0, `no uncaught page errors (${pageErrors.join(' | ')})`);
    check(externalRequests.length === 0, `no external requests (${externalRequests.join(' | ')})`);
  });

  const screenshotDir = path.join(__dirname, 'screenshots');
  fs.mkdirSync(screenshotDir, { recursive: true });
  await page.setViewportSize({ width: 1280, height: 900 });
  await openCase(page, 'constrained');
  await page.screenshot({ path: path.join(screenshotDir, 'desktop-constrained.png'), fullPage: true });
  await page.setViewportSize({ width: 320, height: 800 });
  await openCase(page, 'exact-many');
  await page.screenshot({ path: path.join(screenshotDir, 'mobile-exact-many.png'), fullPage: true });

  await browser.close();
  process.stdout.write(`\nChecks: ${checks.length}\nFailures: ${failures.length}\n`);
  if (failures.length) {
    for (const failure of failures) process.stdout.write(`- ${failure.name}: ${failure.error}\n`);
    process.exitCode = 1;
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
