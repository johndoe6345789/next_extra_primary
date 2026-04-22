import { test, expect } from '@playwright/test';

/**
 * Protected dashboard route tests for unauthenticated users.
 */
test.describe('Protected routes', () => {
  test('dashboard redirects unauthenticated users to login', async ({
    page,
  }) => {
    const response = await page.goto('/en/dashboard', {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    expect(response?.status()).toBeLessThan(500);
    await expect(page).toHaveURL(/\/en\/login$/);
    await expect(
      page.getByTestId('login-form'),
    ).toBeVisible();
  });

  test('leaderboard redirects unauthenticated users to login', async ({
    page,
  }) => {
    const response = await page.goto('/en/leaderboard', {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    expect(response?.status()).toBeLessThan(500);
    await expect(page).toHaveURL(/\/en\/login$/);
    await expect(
      page.getByTestId('login-form'),
    ).toBeVisible();
  });
});
