import { test, expect } from '@playwright/test';

/**
 * Authentication page tests for the main frontend.
 * Validates login/register forms and validation.
 */
test.describe('Auth - Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/login', {
      waitUntil: 'domcontentloaded',
    });
  });

  test('login page renders', async ({ page }) => {
    const form = page.getByTestId('login-form');
    await expect(form).toBeVisible();
  });

  test('login form has email input', async ({ page }) => {
    const email = page.getByTestId('login-email');
    await expect(email).toBeVisible();
    await expect(email).toBeEditable();
  });

  test('login form has password input', async ({
    page,
  }) => {
    const pw = page.getByTestId('login-password');
    await expect(pw).toBeVisible();
    await expect(pw).toBeEditable();
  });

  test('login form has submit button', async ({
    page,
  }) => {
    const btn = page.getByTestId('login-submit');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('empty form shows validation errors', async ({
    page,
  }) => {
    const btn = page.getByTestId('login-submit');
    await btn.click();
    const emailInvalid = await page
      .getByTestId('login-email')
      .evaluate((el) => !el.checkValidity());
    const passwordInvalid = await page
      .getByTestId('login-password')
      .evaluate((el) => !el.checkValidity());
    expect(emailInvalid).toBe(true);
    expect(passwordInvalid).toBe(true);
  });
});

test.describe('Auth - Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/register', {
      waitUntil: 'domcontentloaded',
    });
  });

  test('register page renders', async ({ page }) => {
    const form = page.getByTestId('register-form');
    await expect(form).toBeVisible();
  });

  test('register form has required fields', async ({
    page,
  }) => {
    const name = page.getByTestId('register-username');
    const email = page.getByTestId('register-email');
    const pw = page.getByTestId('register-password');
    await expect(name).toBeVisible();
    await expect(email).toBeVisible();
    await expect(pw).toBeVisible();
  });

  test('register form has submit button', async ({
    page,
  }) => {
    const btn = page.getByTestId('register-submit');
    await expect(btn).toBeVisible();
  });
});
