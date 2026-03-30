import { test, expect } from '@playwright/test';

/**
 * Smoke tests for the main frontend application.
 * Validates homepage, navigation, and theme toggle.
 */
test.describe('Frontend Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('navigation bar renders', async ({ page }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    });
    const nav = page.getByTestId('navbar');
    await expect(nav).toBeVisible();
  });

  test('navigation contains expected links', async ({
    page,
  }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    });
    const nav = page.getByTestId('navbar');
    await expect(nav).toBeVisible();
    const links = nav.getByRole('link');
    await expect(links).not.toHaveCount(0);
  });

  test('theme toggle switches color mode', async ({
    page,
  }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    });
    const toggle = page.getByTestId('theme-toggle');
    await expect(toggle).toBeVisible();
    const htmlBefore = await page
      .locator('html')
      .getAttribute('class');
    await toggle.click();
    const htmlAfter = await page
      .locator('html')
      .getAttribute('class');
    expect(htmlBefore).not.toBe(htmlAfter);
  });

  test('page has a valid title', async ({ page }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    });
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('footer renders', async ({ page }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    });
    const footer = page.getByTestId('footer');
    await expect(footer).toBeVisible();
  });
});
