import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/decoder';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://partsource.io';

function generateSitemap() {
  const validParts = db.filter(part => part.thread !== 'Unknown' && part.standard !== 'Unknown');

  const urls = validParts.map(part => {
    return `
  <url>
    <loc>${BASE_URL}/parts/${encodeURIComponent(part.partNumber)}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${urls}
</urlset>`;

  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log(`Sitemap generated successfully at public/sitemap.xml with ${validParts.length + 1} URLs.`);
}

generateSitemap();
