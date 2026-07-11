import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

const app = read('src/App.tsx');
const sidebar = read('src/components/Sidebar.tsx');
const home = read('src/pages/Home.tsx');
const bom = read('src/hooks/useBOM.ts');
const partDetail = read('src/pages/PartDetail.tsx');
const widget = read('src/pages/WidgetEmbed.tsx');
const decoder = read('src/lib/decoder.ts');
const vite = read('vite.config.ts');
const sitemapGenerator = read('scripts/generate-sitemap.ts');

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

console.log('P0 production-safety checks passed.');
