import { test, expect } from '@playwright/test';

/**
 * Protected chat route tests for unauthenticated users.
 */
test.describe('Chat route', () => {
  test('chat redirects unauthenticated users to login', async ({
    page,
  }) => {
    const response = await page.goto('/en/chat', {
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
