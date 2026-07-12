import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const webRoot = path.resolve(import.meta.dirname, '..');
const repoRoot = path.resolve(webRoot, '..');
const readWeb = (file: string) => fs.readFileSync(path.join(webRoot, file), 'utf8');
const readRepo = (file: string) => fs.readFileSync(path.join(repoRoot, file), 'utf8');

const home = readWeb('src/pages/Home.tsx');
const bom = readWeb('src/hooks/useBOM.ts');
const header = readWeb('src/components/Header.tsx');
const sidebar = readWeb('src/components/Sidebar.tsx');
const footer = readWeb('src/components/Footer.tsx');
const partDetail = readWeb('src/pages/PartDetail.tsx');
const widget = readWeb('src/pages/WidgetEmbed.tsx');
const reference = readWeb('src/lib/reference.ts');
const decoder = readWeb('src/lib/decoder.ts');
const packageJson = JSON.parse(readWeb('package.json')) as { scripts?: Record<string, string> };

const uiSourceFiles = [
  'src/App.tsx',
  ...['src/components', 'src/hooks', 'src/pages'].flatMap(directory =>
    fs.readdirSync(path.join(webRoot, directory), { recursive: true, encoding: 'utf8' })
      .filter(file => /\.(?:ts|tsx)$/.test(file))
      .map(file => path.join(directory, file))),
];

assert.doesNotMatch(home, /CostSavingsChart|calculateSupplierTotal|Approved Suppliers|Est\. list|Estimated Savings|Simulated Savings|vendor-equivalent cost simulations|compare (?:pricing )?equivalents/i);
assert.doesNotMatch(home, /mcmasterPrice|discount|shipDays/);
assert.match(home, /Entered-cost total:/);
for (const file of uiSourceFiles) {
  assert.doesNotMatch(readWeb(file), /mcmasterPrice/, `${file} must not consume or render decoder price heuristics`);
}
assert.doesNotMatch(bom, /Autofill price if missing|mcmasterPrice\s*\*|Zoro \(Auto\)/i);
assert.match(bom, /supplier:\s*'Unselected'[\s\S]{0,80}unitCost:\s*0/);
assert.doesNotMatch(header, /Bell|Notifications Icon|Profile Mockup|Jay Sourcing|@jay_sourcing/);
assert.doesNotMatch(sidebar, /LogOut|handleLogout|Log out|orders live in this browser/i);
assert.doesNotMatch(footer, /Estimated prices are our own approximations/i);
assert.doesNotMatch(decoder, /\{ name: [^\n]+(?:discount|shipDays):/);

for (const source of [partDetail, widget]) {
  assert.match(source, /Search Suppliers/);
  assert.match(source, /Verify[\s\S]{0,120}(?:price|commercial terms)[\s\S]{0,120}availability[\s\S]{0,120}specifications|Verify[\s\S]{0,120}specifications[\s\S]{0,120}availability[\s\S]{0,120}(?:price|commercial terms)/i);
  assert.doesNotMatch(source, /Pricing (?:Matrix|Grid)|discount badge|stock status|equivalents? pricing|commercial comparison/i);
}

assert.doesNotMatch(reference, /live match|an equivalent is|surfaces that live match/i);

const activeDocs = [
  readRepo('README.md'),
  readWeb('README.md'),
  readRepo('research/prd.md'),
  readRepo('research/details.md'),
  readRepo('research/grill-decisions.md'),
  readRepo('research/pseo-risk-audit.md'),
  readRepo('research/data-sourcing-decision.md'),
];
for (const doc of activeDocs) {
  assert.doesNotMatch(doc, /review estimated catalog pricing|prices are catalog estimates|simulated (?:prices|discount|stock)|pricing simulation|mock discounts?|dynamic mock stock|real-time simulated stock|estimated price grid|availability status|live match/i);
}
assert.doesNotMatch(readRepo('research/prd.md'), /SmartCart Optimization Engine[\s\S]{0,220}cheapest overall cart/i);
assert.match(packageJson.scripts?.build ?? '', /test-product-truth-bundle\.ts/);

console.log('Product Truth Contract checks passed.');
