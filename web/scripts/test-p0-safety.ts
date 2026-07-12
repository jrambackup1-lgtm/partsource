import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const repoRoot = path.resolve(root, '..');
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');
const readIfPresent = (file: string) => fs.existsSync(path.join(root, file)) ? read(file) : '';

const legacyActivationPattern = /VITE_SCRAPER_URL|SCRAPER_PORT|npm\s+run\s+(?:scraper|dev:all)|\brun-scraper\.mjs\b|\bscraper_server\.py\b|\bresolve-zoro-links\.ts\b|\/api\/scrape|partsource-scraper\.(?:onrender\.com|fly\.dev)|PARTSOURCE_ENABLE_LEGACY_INGESTION\s*(?:=|:)\s*["']?1\b/i;
const excludedScanPrefixes = [
  '.git/',
  '.superpowers/',
  'archive/',
  'research/archive/',
  'web/dist/',
  'web/node_modules/',
  'web/scripts/legacy-ingestion/',
];
const excludedScanFiles = new Set(['web/scripts/test-p0-safety.ts']);
const textExtensions = new Set([
  '', '.cjs', '.env', '.example', '.js', '.json', '.md', '.mjs', '.ps1', '.py',
  '.sh', '.toml', '.ts', '.tsx', '.txt', '.yaml', '.yml',
]);

function recursivelyListFiles(scanRoot: string, current = scanRoot): string[] {
  return fs.readdirSync(current, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist') return [];
      return recursivelyListFiles(scanRoot, absolute);
    }
    return [path.relative(scanRoot, absolute).replaceAll('\\', '/')];
  });
}

function trackedOrFixtureFiles(scanRoot: string): string[] {
  const tracked = spawnSync('git', ['-C', scanRoot, 'ls-files', '-z'], { encoding: 'utf8' });
  if (tracked.status === 0 && tracked.stdout) return tracked.stdout.split('\0').filter(Boolean);
  return recursivelyListFiles(scanRoot);
}

function findActiveLegacyActivationViolations(scanRoot: string): string[] {
  const violations: string[] = [];
  for (const relativeFile of trackedOrFixtureFiles(scanRoot)) {
    const normalized = relativeFile.replaceAll('\\', '/');
    if (excludedScanFiles.has(normalized) || excludedScanPrefixes.some((prefix) => normalized.startsWith(prefix))) continue;
    if (!textExtensions.has(path.extname(normalized).toLowerCase()) && path.basename(normalized) !== 'Dockerfile') continue;

    const absoluteFile = path.join(scanRoot, relativeFile);
    if (!fs.statSync(absoluteFile).isFile()) continue;

    const activeLines = fs.readFileSync(absoluteFile, 'utf8')
      .split(/\r?\n/)
      .filter((line) => !(normalized === 'research/aistudio_checklist.md' && /^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line)));
    if (activeLines.some((line) => legacyActivationPattern.test(line))) violations.push(normalized);
  }
  return violations.sort();
}

const app = read('src/App.tsx');
const sidebar = read('src/components/Sidebar.tsx');
const home = read('src/pages/Home.tsx');
const bom = read('src/hooks/useBOM.ts');
const partDetail = read('src/pages/PartDetail.tsx');
const widget = read('src/pages/WidgetEmbed.tsx');
const decoder = read('src/lib/decoder.ts');
const vite = read('vite.config.ts');
const sitemapGenerator = read('scripts/generate-sitemap.ts');
const sitemap = read('public/sitemap.xml');
const robots = readIfPresent('public/robots.txt');

assert.doesNotMatch(app, /AdminDashboard|path="\/admin"/);
assert.doesNotMatch(sidebar, /Admin Portal|tab=orders|Sourcing Orders/);
assert.doesNotMatch(home, /BrokerageModal|OrderCard|placeOrder|trackingNumber|Track shipments|Place Order|Execute Fulfillment/i);
assert.doesNotMatch(bom, /partsource_orders|placeOrder|trackingNumber|interface Order/);
assert.doesNotMatch(partDetail, /VITE_SCRAPER_URL|\/api\/scrape|filterDfars|filterIso|filterUsa|DFARS|ISO 9001|Domestic Origin|LOCKED/);
assert.doesNotMatch(decoder, /isDfars|isIso|isUsa/);
assert.doesNotMatch(widget, /Verified Match/);
assert.match(widget, /import\.meta\.env\.BASE_URL/);
assert.match(vite, /https:\/\/jrambackup1-lgtm\.github\.io\/partsource\//);
assert.match(sitemapGenerator, /https:\/\/jrambackup1-lgtm\.github\.io\/partsource/);
assert.match(app, /path="\*"/);
assert.match(app, /Not Found/);
assert.match(app, /rel="canonical"/);
assert.match(app, /noindex,follow/);
assert.doesNotMatch(partDetail, /AggregateOffer|"offers"|lowPrice|highPrice|offerCount/);
assert.doesNotMatch(partDetail, /Supplier Pricing Matrix|Related Parts & Equivalents|mcmasterPrice \*|Equivalent Sourcing|Compare prices/);
assert.doesNotMatch(widget, /Equivalents Pricing Grid|mcmasterPrice \*|Est\. price/);
assert.match(partDetail, /return \(\) => document\.querySelector\('#json-ld-product'\)\?\.remove\(\)/);
assert.equal((sitemap.match(/<loc>/g) ?? []).length, 1);
assert.match(sitemap, /<loc>https:\/\/jrambackup1-lgtm\.github\.io\/partsource\/<\/loc>/);
assert.doesNotMatch(sitemap, /\/parts\//);
assert.match(robots, /User-agent: \*/);
assert.match(robots, /Allow: \//);
assert.match(robots, /Sitemap: https:\/\/jrambackup1-lgtm\.github\.io\/partsource\/sitemap\.xml/);

// MP-0.7: legacy ingestion is retained only as a fail-closed historical tool.
const isolationViolations: string[] = [];
const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'partsource-legacy-activation-'));
try {
  const activeFixtures = {
    '.github/workflows/legacy.yml': 'run: node web/scripts/legacy-ingestion/run-scraper.mjs\n',
    'README.md': 'Set VITE_SCRAPER_URL=https://partsource-scraper.onrender.com\n',
    'build.ps1': '$env:PARTSOURCE_ENABLE_LEGACY_INGESTION = 1\n',
    'docker-compose.yml': 'command: python web/scripts/legacy-ingestion/scraper_server.py\n',
    'fly.toml': 'cmd = "npx tsx web/scripts/legacy-ingestion/resolve-zoro-links.ts"\n',
    'setup.sh': 'npm run scraper\n',
  };
  for (const [file, content] of Object.entries(activeFixtures)) {
    fs.mkdirSync(path.dirname(path.join(fixtureRoot, file)), { recursive: true });
    fs.writeFileSync(path.join(fixtureRoot, file), content);
  }
  assert.deepEqual(
    findActiveLegacyActivationViolations(fixtureRoot),
    Object.keys(activeFixtures).sort(),
    'repo-wide scanner must catch synthetic workflow, deploy, setup, build, and docs paths',
  );
} finally {
  fs.rmSync(fixtureRoot, { recursive: true, force: true });
}
const packageJson = JSON.parse(read('package.json')) as { scripts: Record<string, string> };
for (const [name, command] of Object.entries(packageJson.scripts)) {
  if (/scraper|resolver|resolve-zoro|legacy.ingestion/i.test(`${name} ${command}`)) {
    isolationViolations.push(`npm script activates legacy ingestion: ${name}`);
  }
}

for (const file of findActiveLegacyActivationViolations(repoRoot)) {
  isolationViolations.push(`active path references legacy ingestion: ${file}`);
}

for (const file of ['archive/legacy-ingestion/render.yaml', 'archive/legacy-ingestion/fly.toml']) {
  const content = fs.readFileSync(path.join(repoRoot, file), 'utf8');
  if (/autoDeploy:\s*true|auto_start_machines\s*=\s*true/i.test(content)) {
    isolationViolations.push(`archived deploy config can start automatically: ${file}`);
  }
}

for (const file of ['archive/legacy-ingestion/setup.ps1', 'archive/legacy-ingestion/setup.sh']) {
  const content = fs.readFileSync(path.join(repoRoot, file), 'utf8');
  const stopIndex = content.indexOf('HISTORICAL_ONLY');
  assert.notEqual(stopIndex, -1, `${file} must be explicitly non-runnable`);
  assert.ok(stopIndex < content.indexOf('npm install'), `${file} must stop before executing setup`);
}

const legacyExecutables = [
  'web/scripts/legacy-ingestion/scraper_server.py',
  'web/scripts/legacy-ingestion/run-scraper.mjs',
  'web/scripts/legacy-ingestion/resolve-zoro-links.ts',
].filter((file) => fs.existsSync(path.join(repoRoot, file)));
for (const file of legacyExecutables) {
  const content = fs.readFileSync(path.join(repoRoot, file), 'utf8');
  if (!content.includes('PARTSOURCE_ENABLE_LEGACY_INGESTION')) {
    isolationViolations.push(`legacy executable lacks opt-in guard: ${file}`);
  }
  if (!/non-production/i.test(content) || !/sanctioned.source/i.test(content)) {
    isolationViolations.push(`legacy executable lacks safety warning: ${file}`);
  }
}

if (fs.existsSync(path.join(repoRoot, 'research/scrapling-setup-plan.md'))) {
  isolationViolations.push('conflicting McMaster scrape plan remains current');
}
const sourcingDecision = fs.readFileSync(path.join(repoRoot, 'research/data-sourcing-decision.md'), 'utf8');
if (/Zoro JSON-LD \(deploy \+ harden\)[^\n]*âœ…/i.test(sourcingDecision)) {
  isolationViolations.push('current sourcing decision still approves Zoro scraper deployment');
}

assert.deepEqual(isolationViolations, [], isolationViolations.join('\n'));

const rejectedOptIns = ['', 'true', 'yes', '01'];
for (const optIn of rejectedOptIns) {
  for (const [command, args] of [
    [process.execPath, ['scripts/legacy-ingestion/run-scraper.mjs']],
    [process.execPath, ['--import', 'tsx', 'scripts/legacy-ingestion/resolve-zoro-links.ts']],
  ] as const) {
    const result = spawnSync(command, args, {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, PARTSOURCE_ENABLE_LEGACY_INGESTION: optIn },
      timeout: 10_000,
    });
    assert.notEqual(result.status, 0, `${args.at(-1)} must reject opt-in ${JSON.stringify(optIn)}`);
    assert.match(`${result.stdout}${result.stderr}`, /non-production.*sanctioned.source/is);
  }
}

const pythonCandidates: ReadonlyArray<readonly [string, readonly string[]]> = process.platform === 'win32'
  ? [['py', ['-3']], ['python', []], ['python3', []]]
  : [['python3', []], ['python', []]];
const python = pythonCandidates.find(([command, args]) =>
  spawnSync(command, [...args, '--version'], { encoding: 'utf8' }).status === 0
);
assert.ok(python, 'Python is required to verify the retained scraper fails closed');
const [pythonCommand, pythonArgs] = python;
for (const optIn of rejectedOptIns) {
  const scraperResult = spawnSync(
    pythonCommand,
    [...pythonArgs, 'scripts/legacy-ingestion/scraper_server.py'],
    {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, PARTSOURCE_ENABLE_LEGACY_INGESTION: optIn },
      timeout: 10_000,
    },
  );
  assert.notEqual(scraperResult.status, 0, `scraper_server.py must reject opt-in ${JSON.stringify(optIn)}`);
  assert.match(`${scraperResult.stdout}${scraperResult.stderr}`, /non-production.*sanctioned.source/is);
}

console.log('P0 production-safety checks passed.');
