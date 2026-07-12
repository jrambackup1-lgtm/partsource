import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const repoRoot = path.resolve(root, '..');
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');
const readIfPresent = (file: string) => fs.existsSync(path.join(root, file)) ? read(file) : '';

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
const packageJson = JSON.parse(read('package.json')) as { scripts: Record<string, string> };
for (const [name, command] of Object.entries(packageJson.scripts)) {
  if (/scraper|resolver|resolve-zoro|legacy.ingestion/i.test(`${name} ${command}`)) {
    isolationViolations.push(`npm script activates legacy ingestion: ${name}`);
  }
}

for (const file of ['render.yaml', 'web/scripts/fly.toml']) {
  if (fs.existsSync(path.join(repoRoot, file))) {
    isolationViolations.push(`automatic legacy deploy config remains active: ${file}`);
  }
}

for (const file of ['README.md', 'web/README.md', 'web/.env.example']) {
  const content = fs.readFileSync(path.join(repoRoot, file), 'utf8');
  if (/npm run scraper|VITE_SCRAPER_URL|SCRAPER_PORT|onrender\.com|fly\.dev/i.test(content)) {
    isolationViolations.push(`normal documentation activates legacy ingestion: ${file}`);
  }
}

for (const file of ['.github/workflows/ci.yml', '.github/workflows/deploy.yml']) {
  const content = fs.readFileSync(path.join(repoRoot, file), 'utf8');
  if (/scraper_server|run-scraper|resolve-zoro|VITE_SCRAPER_URL|PARTSOURCE_ENABLE_LEGACY_INGESTION/i.test(content)) {
    isolationViolations.push(`production workflow references legacy ingestion: ${file}`);
  }
}

const productionSource = fs.readdirSync(path.join(root, 'src'), { recursive: true })
  .filter((entry) => entry.toString().match(/\.(ts|tsx)$/))
  .map((entry) => fs.readFileSync(path.join(root, 'src', entry.toString()), 'utf8'))
  .join('\n');
if (/scraper_server|run-scraper|resolve-zoro|VITE_SCRAPER_URL|\/api\/scrape|PARTSOURCE_ENABLE_LEGACY_INGESTION/i.test(productionSource)) {
  isolationViolations.push('production source imports or calls legacy ingestion');
}

for (const file of ['archive/legacy-ingestion/render.yaml', 'archive/legacy-ingestion/fly.toml']) {
  const content = fs.readFileSync(path.join(repoRoot, file), 'utf8');
  if (/autoDeploy:\s*true|auto_start_machines\s*=\s*true/i.test(content)) {
    isolationViolations.push(`archived deploy config can start automatically: ${file}`);
  }
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

for (const [command, args] of [
  [process.execPath, ['scripts/legacy-ingestion/run-scraper.mjs']],
  [process.execPath, ['--import', 'tsx', 'scripts/legacy-ingestion/resolve-zoro-links.ts']],
] as const) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, PARTSOURCE_ENABLE_LEGACY_INGESTION: '' },
    timeout: 10_000,
  });
  assert.notEqual(result.status, 0, `${args.at(-1)} must fail closed without opt-in`);
  assert.match(`${result.stdout}${result.stderr}`, /non-production.*sanctioned.source/is);
}

const pythonCandidates: ReadonlyArray<readonly [string, readonly string[]]> = process.platform === 'win32'
  ? [['py', ['-3']], ['python', []], ['python3', []]]
  : [['python3', []], ['python', []]];
const python = pythonCandidates.find(([command, args]) =>
  spawnSync(command, [...args, '--version'], { encoding: 'utf8' }).status === 0
);
assert.ok(python, 'Python is required to verify the retained scraper fails closed');
const [pythonCommand, pythonArgs] = python;
const scraperResult = spawnSync(
  pythonCommand,
  [...pythonArgs, 'scripts/legacy-ingestion/scraper_server.py'],
  {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, PARTSOURCE_ENABLE_LEGACY_INGESTION: '' },
    timeout: 10_000,
  },
);
assert.notEqual(scraperResult.status, 0, 'scraper_server.py must fail closed without opt-in');
assert.match(`${scraperResult.stdout}${scraperResult.stderr}`, /non-production.*sanctioned.source/is);

console.log('P0 production-safety checks passed.');
