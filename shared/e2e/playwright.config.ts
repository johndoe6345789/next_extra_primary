import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 *
 * baseURL resolution:
 *   Docker stack: http://localhost:8889 (nginx portal)
 *
 * Override via PLAYWRIGHT_BASE_URL env var, e.g.:
 *   PLAYWRIGHT_BASE_URL=http://localhost:8889 npx playwright test
 */
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:8889';

export default defineConfig({
  testDir: './',
  testMatch: [
    '*.spec.ts',
    'packages/*/playwright/*.spec.ts',
  ],
  globalSetup: './global.setup.ts',
  globalTeardown: './global.teardown.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
