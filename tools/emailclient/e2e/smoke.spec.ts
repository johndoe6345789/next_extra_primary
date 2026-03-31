import { test, expect } from '@playwright/test';

/**
 * Smoke tests for the email client tool.
 * Validates app load, mailbox sidebar, compose.
 */
test.describe('Email Client Smoke Tests', () => {
  test('app loads successfully', async ({ page }) => {
    const response = await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    expect(response?.status()).toBeLessThan(500);
    await expect(
      page.locator('body'),
    ).not.toBeEmpty();
  });

  test('page has valid title', async ({ page }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    });
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('mailbox sidebar renders', async ({
    page,
  }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    });
    const sidebar = page.getByTestId(
      'mailbox-sidebar',
    );
    await expect(sidebar).toBeVisible();
  });

  test('sidebar has inbox folder', async ({
    page,
  }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    });
    const inbox = page.getByTestId('folder-inbox');
    await expect(inbox).toBeVisible();
  });

  test('sidebar has sent folder', async ({
    page,
  }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    });
    const sent = page.getByTestId('folder-sent');
    await expect(sent).toBeVisible();
  });

  test('compose button exists', async ({ page }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    });
    const btn = page.getByTestId('compose-button');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('email list container renders', async ({
    page,
  }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    });
    const list = page.getByTestId('email-list');
    await expect(list).toBeVisible();
  });

  test('app header renders', async ({ page }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    });
    const header = page.getByTestId('app-header');
    await expect(header).toBeVisible();
  });
});
