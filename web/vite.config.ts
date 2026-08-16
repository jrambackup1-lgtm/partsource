
import fs from 'node:fs';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

/**
 * u1: serves dev-only catalog release artifacts from web/catalog-releases.
 * Gated to the development server only — preview and build never expose the
 * real dataset (publication stays behind the register's external gates).
 */
function catalogReleasesDevPlugin(enabled: boolean) {
  return {
    name: 'catalog-releases-dev-only',
    apply: 'serve' as const,
    configureServer(server: {middlewares: {use: (handler: (req: unknown, res: import('node:http').ServerResponse, next: () => void) => void) => void}}) {
      if (!enabled) return;
      server.middlewares.use((req: {url?: string}, res, next) => {
        const match = /^\/catalog\/([a-z0-9-]+\.json)$/.exec(req.url ?? '');
        if (!match) return next();
        const file = path.resolve(__dirname, 'catalog-releases', match[1]);
        if (!fs.existsSync(file)) {
          res.statusCode = 404;
          res.end('catalog release not found (run npm run catalog:build-real)');
          return;
        }
        res.setHeader('content-type', 'application/json');
        res.end(fs.readFileSync(file));
      });
    },
  };
}

export default defineConfig(({command, isPreview}) => {
  // Canonical production URL: https://jrambackup1-lgtm.github.io/partsource/
  return {
    // GitHub Pages serves the site under /partsource/; local dev stays at /.
    // `vite preview` runs with command === 'serve', so check isPreview too.
    base: command === 'build' || isPreview ? '/partsource/' : '/',
    plugins: [react(), catalogReleasesDevPlugin(command === 'serve' && !isPreview)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
