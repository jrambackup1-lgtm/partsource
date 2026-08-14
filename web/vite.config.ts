
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({command, isPreview}) => {
  // Canonical production URL: https://jrambackup1-lgtm.github.io/partsource/
  return {
    // GitHub Pages serves the site under /partsource/; local dev stays at /.
    // `vite preview` runs with command === 'serve', so check isPreview too.
    base: command === 'build' || isPreview ? '/partsource/' : '/',
    plugins: [react()],
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
