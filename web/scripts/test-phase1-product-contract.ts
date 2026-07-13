import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const contractPath = path.join(repoRoot, 'research', 'product-contract.md');

assert.ok(
  fs.existsSync(contractPath),
  'research/product-contract.md must exist as the authoritative current product contract',
);

const contract = fs.readFileSync(contractPath, 'utf8');

assert.match(contract, /Status:\*\* Authoritative — sole current source of truth/);
assert.match(contract, /When current product or research documents conflict, this contract wins\./);

for (const topic of [
  'Scraping',
  'Commercial pricing and offers',
  'Pins',
  'Imperial coverage',
  'Currency',
  'Accounts and authentication',
  'Company and team features',
  'Enterprise features',
  'Quote validation',
  'Brokerage and commerce',
  'pSEO indexing',
  'Styling and runtime stack',
]) {
  assert.match(contract, new RegExp(`\\| \\*\\*${topic}\\*\\* \\|[^\\n]+\\|[^\\n]*(?:Current|Rejected|Phase|MP-)`), `${topic} must have a resolved decision and owner`);
}

assert.match(contract, /Vite \+ React SPA/);
assert.match(contract, /Tailwind CSS 4/);
assert.match(contract, /GitHub Pages/);
assert.match(contract, /https:\/\/jrambackup1-lgtm\.github\.io\/partsource\//);

assert.ok(
  /\| Candidate match \| A supplier-site URL is only a search handoff; a result may become a candidate match only after inspection and still requires verification\. \|/.test(contract),
  'a supplier search handoff must remain distinct from an inspected candidate result',
);

const truthSemantics: Record<string, RegExp[]> = {
  'Configuration': [/standards-defined/i, /not necessarily manufactured or stocked/i],
  'Manufacturer part': [/real product/i, /manufacturer part number/i],
  'Supplier listing': [/supplier-specific/i, /SKU/i, /manufacturer part/i],
  'Offer': [/observed price or availability/i, /currency/i, /unit basis/i, /pack/i, /source/i, /timestamp/i, /expiry/i],
  'Candidate match': [/possibly relevant result/i, /requiring verification/i],
  'Cross-reference': [/relationship/i, /explicitly supported by evidence/i],
  'Exact equivalent': [/fit, form, function/i, /material/i, /grade/i, /standard/i, /certifications/i],
  'Approved alternate': [/organization approved/i, /defined use/i],
};
const truthSection = contract.match(/## Product Truth Contract\n([\s\S]+?)\nNon-negotiable boundaries:/)?.[1];
assert.ok(truthSection, 'Product Truth Contract must have a definitions table');
const truthDefinitions: string[] = [];
for (const [term, requiredFragments] of Object.entries(truthSemantics)) {
  const row = truthSection.match(new RegExp(`^\\| ${term} \\| (.+) \\|$`, 'm'));
  assert.ok(row, `${term} must have a Product Truth definition`);
  const definition = row[1].trim();
  assert.ok(definition, `${term} definition must not be empty`);
  for (const fragment of requiredFragments) {
    assert.match(definition, fragment, `${term} definition must preserve ${fragment}`);
  }
  truthDefinitions.push(definition);
}
assert.equal(new Set(truthDefinitions).size, Object.keys(truthSemantics).length, 'Product Truth definitions must be distinct');

for (const boundary of [
  'Never describe a configuration as stocked.',
  'Never describe a search URL as an offer.',
  'Never describe a candidate as an equivalent.',
  'Never describe an equivalent as approved without organizational approval.',
  'Never display live price, inventory, certification, or lead time without a sanctioned source and timestamp.',
  'Never silently substitute thread pitch, measurement system, standard, material, or strength class.',
]) {
  assert.ok(contract.includes(boundary), `missing Product Truth boundary: ${boundary}`);
}

assert.match(contract, /## Phase ownership register/);
const ownershipSection = contract.match(/## Phase ownership register\n([\s\S]+?)\n## Change rule/)?.[1];
assert.ok(ownershipSection, 'Phase ownership register must have content');
for (let phase = 0; phase <= 12; phase += 1) {
  const row = ownershipSection.match(new RegExp(`^\\| Phase ${phase} \\| (.+) \\|$`, 'm'));
  assert.ok(row, `Phase ${phase} must have an ownership row`);
  assert.ok(row[1].trim(), `Phase ${phase} must own at least one promise`);
}
for (const rejectedPromise of [
  'CAD/STEP downloads',
  'torque calculators as product tools',
  'material-substitution tools',
  'embedded commerce widgets',
  'admin portals',
  'localization',
  'automatic split-order optimization',
]) {
  assert.ok(ownershipSection.includes(rejectedPromise), `${rejectedPromise} must remain explicitly rejected`);
}
assert.match(ownershipSection, /are rejected from the current roadmap/);

console.log('Phase 1 product-contract checks passed.');
