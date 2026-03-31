import { test, expect } from '@playwright/test';

/**
 * Dashboard tests for the main frontend.
 * Validates dashboard, stats, and leaderboard.
 */
test.describe('Dashboard', () => {
  test('dashboard page loads', async ({ page }) => {
    const response = await page.goto('/en/dashboard', {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    expect(response?.status()).toBeLessThan(500);
    await expect(
      page.locator('body'),
    ).not.toBeEmpty();
  });

  test('dashboard displays stats section', async ({
    page,
  }) => {
    await page.goto('/en/dashboard', {
      waitUntil: 'domcontentloaded',
    });
    const stats = page.getByTestId('dashboard-stats');
    await expect(stats).toBeVisible();
  });

  test('dashboard displays user greeting', async ({
    page,
  }) => {
    await page.goto('/en/dashboard', {
      waitUntil: 'domcontentloaded',
    });
    const greeting = page.getByTestId(
      'dashboard-greeting',
    );
    await expect(greeting).toBeVisible();
  });

  test('dashboard has navigation sidebar', async ({
    page,
  }) => {
    await page.goto('/en/dashboard', {
      waitUntil: 'domcontentloaded',
    });
    const sidebar = page.getByTestId(
      'dashboard-sidebar',
    );
    await expect(sidebar).toBeVisible();
  });
});

test.describe('Leaderboard', () => {
  test('leaderboard page loads', async ({ page }) => {
    const response = await page.goto(
      '/en/leaderboard',
      {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      },
    );
    expect(response?.status()).toBeLessThan(500);
  });

  test('leaderboard table renders', async ({
    page,
  }) => {
    await page.goto('/en/leaderboard', {
      waitUntil: 'domcontentloaded',
    });
    const table = page.getByTestId('leaderboard-table');
    await expect(table).toBeVisible();
  });

  test('leaderboard has rank column', async ({
    page,
  }) => {
    await page.goto('/en/leaderboard', {
      waitUntil: 'domcontentloaded',
    });
    const header = page.getByTestId(
      'leaderboard-rank-header',
    );
    await expect(header).toBeVisible();
  });
});
