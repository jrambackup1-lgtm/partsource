import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { db, type Part } from '../src/lib/decoder';
import { REF_PAGES } from '../src/lib/reference';

const BASE_URL = 'https://jrambackup1-lgtm.github.io/partsource';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export function renderPartPage(template: string, part: Part): string {
  const canonical = `${BASE_URL}/parts/${encodeURIComponent(part.partNumber)}`;
  const title = `${part.partNumber} ${part.type} | PartSource`;
  const details = [`${part.thread} ${part.type}`, part.length, part.material, part.standard]
    .filter(value => value && value !== 'N/A' && value !== 'Unknown')
    .join(', ');
  const description = `${part.partNumber}: ${details}. ${part.appNote}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${part.partNumber} ${part.type}`,
    description,
    sku: part.partNumber,
    category: part.category,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Thread', value: part.thread },
      { '@type': 'PropertyValue', name: 'Pitch', value: part.pitch },
      { '@type': 'PropertyValue', name: 'Length', value: part.length },
      { '@type': 'PropertyValue', name: 'Material', value: part.material },
      { '@type': 'PropertyValue', name: 'Finish', value: part.finish },
      { '@type': 'PropertyValue', name: 'Standard', value: part.standard },
    ].filter(property => property.value !== 'N/A' && property.value !== 'Unknown'),
  };
  const metadata = [
    `    <title>${escapeHtml(title)}</title>`,
    `    <meta name="description" content="${escapeHtml(description)}" />`,
    `    <meta name="robots" content="noindex,follow" />`,
    `    <link rel="canonical" href="${canonical}" />`,
    `    <script id="json-ld-product" type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`,
  ].join('\n');

  return template
    .replace(/\s*<title>.*?<\/title>/s, '')
    .replace(/\s*<meta name="description"[^>]*>/s, '')
    .replace(/\s*<meta name="robots"[^>]*>/s, '')
    .replace(/\s*<link rel="canonical"[^>]*>/s, '')
    .replace('</head>', `${metadata}\n  </head>`);
}

function renderRouteShell(template: string, title: string, canonical: string, noIndex = false): string {
  const metadata = [
    `    <title>${escapeHtml(title)}</title>`,
    noIndex ? '    <meta name="robots" content="noindex,follow" />' : '',
    `    <link rel="canonical" href="${canonical}" />`,
  ].filter(Boolean).join('\n');

  return template
    .replace(/\s*<title>.*?<\/title>/s, '')
    .replace(/\s*<meta name="robots"[^>]*>/s, '')
    .replace(/\s*<link rel="canonical"[^>]*>/s, '')
    .replace('</head>', `${metadata}\n  </head>`);
}

function writeRouteShell(distDir: string, route: string[], html: string): void {
  const outputDir = path.join(distDir, ...route.map(encodeURIComponent));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), html);
}

export function generateStaticPartPages(distDir: string): number {
  const indexPath = path.join(distDir, 'index.html');
  const template = fs.readFileSync(indexPath, 'utf8');
  const parts = db.filter(part => part.thread !== 'Unknown' && part.standard !== 'Unknown');
  const fallback = template
    .replace(/\s*<link rel="canonical"[^>]*>/s, '')
    .replace(/\s*<meta name="robots"[^>]*>/s, '')
    .replace('</head>', '    <meta name="robots" content="noindex,follow" />\n  </head>');
  fs.writeFileSync(path.join(distDir, '404.html'), fallback);

  writeRouteShell(
    distDir,
    ['reference'],
    renderRouteShell(template, 'Engineering Reference | PartSource', `${BASE_URL}/reference`),
  );

  for (const reference of REF_PAGES) {
    writeRouteShell(
      distDir,
      ['reference', reference.slug],
      renderRouteShell(template, `${reference.title} | PartSource`, `${BASE_URL}/reference/${reference.slug}`),
    );
  }

  for (const part of parts) {
    writeRouteShell(distDir, ['parts', part.partNumber], renderPartPage(template, part));
    writeRouteShell(
      distDir,
      ['embed', part.partNumber],
      renderRouteShell(
        template,
        `${part.partNumber} Supplier Search | PartSource`,
        `${BASE_URL}/embed/${encodeURIComponent(part.partNumber)}`,
        true,
      ),
    );
  }

  return parts.length;
}

const entryPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (import.meta.url === entryPath) {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const count = generateStaticPartPages(path.resolve(scriptDir, '../dist'));
  console.log(`Generated static metadata for ${count} part pages.`);
}
