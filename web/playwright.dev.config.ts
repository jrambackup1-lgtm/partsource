import { defineConfig, devices } from '@playwright/test';

/**
 * Real-catalog user-path configuration (f5). The dev release is served only
 * by the Vite dev server (publication gates — decisions D5/D6), so the
 * preview/production suite cannot reach it. Requires the artifact from
 * `npm run catalog:build-real`. Each navigation loads and verifies the
 * ~110 MB release, so workers are serialized and timeouts are generous.
 */
export default defineConfig({
  testDir: './tests/browser',
  testMatch: /catalog-real-.*\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Dedicated port: the CI runner's preview server from the previous step
    // can leave an orphan on 3000, and HMR-free strict binding makes any
    // collision a loud failure instead of a wrong-server test.
    command: 'npx vite --port 5173 --host 127.0.0.1 --strictPort',
    url: 'http://127.0.0.1:5173/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
