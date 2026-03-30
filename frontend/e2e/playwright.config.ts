import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the main frontend app.
 * Extends shared config patterns; targets port 3000.
 */
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL
    ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './',
  testMatch: '**/*.spec.ts',
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
