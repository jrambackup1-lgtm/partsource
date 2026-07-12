import { defineConfig, devices } from '@playwright/test';

const productionBaseURL = process.env.PRODUCTION_BASE_URL;

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: productionBaseURL ?? 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: productionBaseURL ? undefined : {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000/partsource/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
