import { defineConfig, devices } from '@playwright/test';

const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:8889';

export default defineConfig({
  testDir: './',
  testMatch: ['tests.spec.ts'],
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  globalSetup: './frontend-ui.setup.ts',
  globalTeardown: './frontend-ui.teardown.ts',
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
