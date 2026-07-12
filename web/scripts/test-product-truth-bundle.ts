import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const webRoot = path.resolve(import.meta.dirname, '..');
const bundleDir = path.join(webRoot, 'dist', 'assets');
assert.ok(fs.existsSync(bundleDir), 'production bundle missing; run npm run build first');

const bundle = fs.readdirSync(bundleDir)
  .filter(file => file.endsWith('.js'))
  .map(file => fs.readFileSync(path.join(bundleDir, file), 'utf8'))
  .join('\n');

assert.doesNotMatch(bundle, /Consolidated Cost Simulation|Approved Suppliers|Est\. list|Estimated Savings|Simulated Savings|Zoro \(Auto\)|Jay Sourcing|live match|Tool-estimated total/i);

console.log('Product Truth production-bundle checks passed.');
