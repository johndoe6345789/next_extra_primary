import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the email client tool.
 * Uses basePath /emailclient, frontend on port 3005.
 */
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL
    ?? 'http://localhost:3005/emailclient';

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
