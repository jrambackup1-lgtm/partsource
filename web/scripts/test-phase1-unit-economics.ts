import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const documentPath = path.join(repoRoot, 'research', 'unit-economics.md');

assert.ok(
  fs.existsSync(documentPath),
  'research/unit-economics.md must exist as the MP-1.4 monetization decision model',
);

const document = fs.readFileSync(documentPath, 'utf8');

assert.match(document, /subordinate to `research\/product-contract\.md`/i);
for (const label of ['Observed', 'External benchmark', 'Hypothesis']) {
  assert.match(document, new RegExp(`\\*\\*${label}\\*\\*`), `missing ${label} input label`);
}

for (const definition of [
  'CAC',
  'ARPA',
  'contribution gross margin',
  'contribution profit',
  'LTV',
  'payback',
  'LTV:CAC',
]) {
  assert.match(document, new RegExp(`\\| ${definition.replace(':', '\\:')} \\|`, 'i'), `missing ${definition} definition`);
}
for (const formula of [
  'Active users = reachable qualified users x activation',
  'Monetized users = active users x monetized conversion',
  'Revenue SOM = monetized users x annual revenue per monetized user',
  'Contribution profit = revenue x contribution gross margin',
  'LTV = ARPA x contribution gross margin / annual logo churn',
  'Payback months = CAC / monthly contribution profit per account',
  'LTV:CAC = LTV / CAC',
]) {
  assert.ok(document.includes(formula), `missing formula: ${formula}`);
}

type Scenario = {
  path: string;
  scenario: string;
  reachable: number;
  activation: number;
  conversion: number;
  revenuePerUser: number;
  active: number;
  monetized: number;
  revenue: number;
  margin: number;
  contribution: number;
};

type UnitEconomics = {
  path: string;
  scenario?: string;
  cac: number;
  arpa: number;
  margin: number;
  churn: number;
  ltv: number;
  monthlyContribution: number;
  payback: number;
  ltvCac: number;
};

function parseNumber(value: string): number {
  return Number(value.replace(/,/g, '').replace(/[^\d.-]/g, ''));
}

function assertApprox(actual: number, expected: number, message: string): void {
  assert.ok(Math.abs(actual - expected) < 0.000_001, `${message}: expected ${expected}, got ${actual}`);
}

function assertRounded(actual: number, expected: number, message: string): void {
  assert.ok(Math.abs(actual - expected) <= 0.011, `${message}: expected ${expected}, got ${actual}`);
}

function parseScenarios(markdown: string): Scenario[] {
  const section = markdown.match(/## Bottom-up SOM scenarios\r?\n([\s\S]+?)\r?\n### Base-case unit-economics screen/)?.[1];
  assert.ok(section, 'Bottom-up SOM scenarios section must be parseable');

  return section
    .split(/\r?\n/)
    .filter((line) => /^\| (Affiliate\/referral|Quote-lead|SaaS|Brokerage) \|/.test(line))
    .map((line) => {
      const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
      assert.equal(cells.length, 11, `scenario row must have 11 cells: ${line}`);
      return {
        path: cells[0],
        scenario: cells[1],
        reachable: parseNumber(cells[2]),
        activation: parseNumber(cells[3]) / 100,
        conversion: parseNumber(cells[4]) / 100,
        revenuePerUser: parseNumber(cells[5]),
        active: parseNumber(cells[6]),
        monetized: parseNumber(cells[7]),
        revenue: parseNumber(cells[8]),
        margin: parseNumber(cells[9]) / 100,
        contribution: parseNumber(cells[10]),
      };
    });
}

const paths = ['Affiliate/referral', 'Quote-lead', 'SaaS', 'Brokerage'];
const scenarios = ['Conservative', 'Base', 'Upside'];
const rows = parseScenarios(document);
assert.equal(rows.length, paths.length * scenarios.length, 'all four paths need three scenarios');
for (const pathName of paths) {
  for (const scenario of scenarios) {
    const row = rows.find((candidate) => candidate.path === pathName && candidate.scenario === scenario);
    assert.ok(row, `${pathName} needs a ${scenario} scenario`);
    assertApprox(row.active, row.reachable * row.activation, `${pathName} ${scenario} active-user arithmetic`);
    assertApprox(row.monetized, row.active * row.conversion, `${pathName} ${scenario} monetized-user arithmetic`);
    assertApprox(row.revenue, row.monetized * row.revenuePerUser, `${pathName} ${scenario} revenue arithmetic`);
    assertApprox(row.contribution, row.revenue * row.margin, `${pathName} ${scenario} contribution arithmetic`);
  }
}

function parseUnitEconomics(markdown: string, withScenario: boolean): UnitEconomics[] {
  const pattern = withScenario
    ? /### Conservative\/base\/upside unit-economics scenarios\r?\n([\s\S]+?)(?=\r?\n## Sensitivity)/
    : /### Base-case unit-economics screen\r?\n([\s\S]+?)\r?\nWorked checks:/;
  const section = markdown.match(pattern)?.[1];
  assert.ok(section, `${withScenario ? 'scenario' : 'base'} unit-economics table must be parseable`);

  return section
    .split(/\r?\n/)
    .filter((line) => /^\| (Affiliate\/referral|Quote-lead|SaaS|Brokerage) \|/.test(line))
    .map((line) => {
      const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
      const offset = withScenario ? 1 : 0;
      assert.equal(cells.length, 9 + offset, `unit-economics row has wrong shape: ${line}`);
      return {
        path: cells[0],
        scenario: withScenario ? cells[1] : undefined,
        cac: parseNumber(cells[1 + offset]),
        arpa: parseNumber(cells[2 + offset]),
        margin: parseNumber(cells[3 + offset]) / 100,
        churn: parseNumber(cells[4 + offset]) / 100,
        ltv: parseNumber(cells[5 + offset]),
        monthlyContribution: parseNumber(cells[6 + offset]),
        payback: parseNumber(cells[7 + offset]),
        ltvCac: parseNumber(cells[8 + offset]),
      };
    });
}

function validateUnitEconomics(rowsToValidate: UnitEconomics[], expectedCount: number): void {
  assert.equal(rowsToValidate.length, expectedCount, `expected ${expectedCount} unit-economics rows`);
  for (const row of rowsToValidate) {
    const label = `${row.path}${row.scenario ? ` ${row.scenario}` : ''}`;
    assert.ok(row.churn > 0 && row.churn <= 1, `${label} churn must be in (0, 100%]`);
    const expectedLtv = (row.arpa * row.margin) / row.churn;
    const expectedMonthlyContribution = (row.arpa * row.margin) / 12;
    assertRounded(row.ltv, expectedLtv, `${label} LTV arithmetic`);
    assertRounded(row.monthlyContribution, expectedMonthlyContribution, `${label} monthly contribution arithmetic`);
    assertRounded(row.payback, row.cac / expectedMonthlyContribution, `${label} payback arithmetic`);
    assertRounded(row.ltvCac, expectedLtv / row.cac, `${label} LTV:CAC arithmetic`);
  }
}

const baseEconomics = parseUnitEconomics(document, false);
validateUnitEconomics(baseEconomics, paths.length);
for (const pathName of paths) {
  assert.equal(baseEconomics.filter((row) => row.path === pathName).length, 1, `${pathName} needs one base-economics row`);
}

const corruptedBaseFixture = document.replace(
  '| SaaS | $240 | $480 | 80% | 30% | $1,280 |',
  '| SaaS | $240 | $480 | 80% | 30% | $1,281 |',
);
assert.notEqual(corruptedBaseFixture, document, 'corruption fixture must alter SaaS LTV');
assert.throws(
  () => validateUnitEconomics(parseUnitEconomics(corruptedBaseFixture, false), paths.length),
  /SaaS LTV arithmetic/,
  'a corrupted base LTV must fail recomputation',
);

const scenarioEconomics = parseUnitEconomics(document, true);
validateUnitEconomics(scenarioEconomics, paths.length * scenarios.length);
for (const pathName of paths) {
  for (const scenario of scenarios) {
    assert.ok(
      scenarioEconomics.some((row) => row.path === pathName && row.scenario === scenario),
      `${pathName} needs ${scenario} CAC, margin, churn, LTV, payback, and LTV:CAC`,
    );
  }
}

const sensitivitySection = document.match(/## Sensitivity to the two largest drivers\r?\n([\s\S]+?)\r?\n## /)?.[1];
assert.ok(sensitivitySection, 'two-driver sensitivity section must exist');
for (const driver of ['Reachable qualified users', 'Monetized conversion']) {
  assert.match(sensitivitySection, new RegExp(`\\| ${driver} \\|`), `missing sensitivity for ${driver}`);
}
for (const pathName of paths) {
  assert.match(sensitivitySection, new RegExp(pathName.replace('/', '\\/')), `${pathName} needs sensitivity output`);
}
assert.match(sensitivitySection, /\| Reachable qualified users \| -30% \|/);
assert.match(sensitivitySection, /\| Reachable qualified users \| \+50% \|/);
assert.match(sensitivitySection, /\| Monetized conversion \| -50% \|/);
assert.match(sensitivitySection, /\| Monetized conversion \| \+100% \|/);

const sensitivityRows = sensitivitySection
  .split(/\r?\n/)
  .filter((line) => /^\| (Reachable qualified users|Monetized conversion) \|/.test(line))
  .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()));
assert.equal(sensitivityRows.length, 6, 'each sensitivity driver needs downside, base, and upside');
const baseRevenue = [1_800, 11_250, 7_200, 12_000];
for (const cells of sensitivityRows) {
  const factors: Record<string, number> = {
    'Reachable qualified users|-30%': 0.7,
    'Reachable qualified users|Base': 1,
    'Reachable qualified users|+50%': 1.5,
    'Monetized conversion|-50%': 0.5,
    'Monetized conversion|Base': 1,
    'Monetized conversion|+100%': 2,
  };
  const factor = factors[`${cells[0]}|${cells[1]}`];
  assert.ok(factor, `unexpected sensitivity row: ${cells[0]} ${cells[1]}`);
  cells.slice(2).forEach((value, index) => {
    assertApprox(parseNumber(value), baseRevenue[index] * factor, `${cells[0]} ${cells[1]} sensitivity arithmetic`);
  });
}

for (const [pathName, phase] of [
  ['Affiliate/referral', 'Phase 7'],
  ['Quote-lead', 'Phase 7'],
  ['SaaS', 'Phase 8'],
  ['Brokerage', 'Phase 11'],
]) {
  const section = document.match(new RegExp(`### ${pathName.replace('/', '\\/')}\\r?\\n([\\s\\S]+?)(?=\\r?\\n### |\\r?\\n## )`))?.[1];
  assert.ok(section, `${pathName} decision section must exist`);
  assert.match(section, new RegExp(`Earliest eligible phase:\\*\\* ${phase}`));
  assert.match(section, /\*\*Current evidence:\*\*/);
  assert.match(section, /\*\*Missing evidence:\*\*/);
  assert.match(section, /\*\*Operational prerequisites:\*\*/);
  for (const threshold of ['Pass', 'Iterate', 'Kill']) {
    assert.match(section, new RegExp(`\\*\\*${threshold}:\\*\\*[^\\r\\n]*\\d`), `${pathName} needs numeric ${threshold} threshold`);
  }
}

const saasSection = document.match(/### SaaS\r?\n([\s\S]+?)(?=\r?\n### Brokerage)/)?.[1];
assert.ok(saasSection, 'SaaS decision section must be parseable');
assert.match(document, /Annualized churn = 1 - \(observed 90-day logo retention\)\^4/);
const saasPass = saasSection.match(/\*\*Pass:\*\*([^\r\n]+)/)?.[1];
assert.ok(saasPass, 'SaaS pass gate must exist');
assert.match(saasPass, /observed 12-month annual logo churn|Annualized churn/);
assert.match(saasPass, /observed 90-day logo retention/);
assert.match(saasPass, /LTV:CAC >=3\.0/);

assert.match(document, /Sanctioned supplier data remains Phase 9 only\./);
assert.match(document, /SaaS and company features remain Phase 8 only\./);
assert.match(document, /Brokerage remains Phase 11 only\./);

for (const legacyClaim of [
  'public affiliate availability and rates',
  '$19-49/month pricing',
  '10-20% brokerage commission',
  '5-search/day paywall',
  'savings and optimizer claims',
]) {
  assert.match(document, new RegExp(`\\| ${legacyClaim.replace('$', '\\$')} \\|[^\\r\\n]+\\|`, 'i'), `missing legacy disposition: ${legacyClaim}`);
}

assert.match(document, /Primary validation now:\*\* quote-lead demand/i);
assert.match(document, /Primary user evidence is still required\./);
assert.match(document, /This model does not validate monetization\./);
assert.match(document, /Retrieved: 2026-07-13/);
assert.doesNotMatch(document, /https?:\/\/(?:www\.)?google\.[^\s)]+\/search/i);

const crlfFixture = document.replace(/\r?\n/g, '\r\n');
assert.equal(parseScenarios(crlfFixture).length, rows.length, 'scenario parsing must be LF/CRLF safe');
assert.equal(parseUnitEconomics(crlfFixture, false).length, baseEconomics.length, 'base economics parsing must be LF/CRLF safe');
assert.equal(parseUnitEconomics(crlfFixture, true).length, scenarioEconomics.length, 'scenario economics parsing must be LF/CRLF safe');

console.log('Phase 1 unit-economics checks passed.');
