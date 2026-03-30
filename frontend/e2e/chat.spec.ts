import { test, expect } from '@playwright/test';

/**
 * AI chat panel tests for the main frontend.
 * Validates chat UI, input, and message display.
 */
test.describe('Chat Panel', () => {
  test('chat page loads', async ({ page }) => {
    const response = await page.goto('/en/chat', {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    expect(response?.status()).toBeLessThan(500);
    await expect(
      page.locator('body'),
    ).not.toBeEmpty();
  });

  test('chat panel container is visible', async ({
    page,
  }) => {
    await page.goto('/en/chat', {
      waitUntil: 'domcontentloaded',
    });
    const panel = page.getByTestId('chat-panel');
    await expect(panel).toBeVisible();
  });

  test('chat message input renders', async ({
    page,
  }) => {
    await page.goto('/en/chat', {
      waitUntil: 'domcontentloaded',
    });
    const input = page.getByTestId(
      'chat-message-input',
    );
    await expect(input).toBeVisible();
    await expect(input).toBeEditable();
  });

  test('chat send button exists', async ({ page }) => {
    await page.goto('/en/chat', {
      waitUntil: 'domcontentloaded',
    });
    const btn = page.getByTestId('chat-send-button');
    await expect(btn).toBeVisible();
  });

  test('chat input accepts text', async ({ page }) => {
    await page.goto('/en/chat', {
      waitUntil: 'domcontentloaded',
    });
    const input = page.getByTestId(
      'chat-message-input',
    );
    await input.fill('Hello, AI!');
    await expect(input).toHaveValue('Hello, AI!');
  });

  test('chat message list renders', async ({
    page,
  }) => {
    await page.goto('/en/chat', {
      waitUntil: 'domcontentloaded',
    });
    const list = page.getByTestId(
      'chat-message-list',
    );
    await expect(list).toBeVisible();
  });

  test('empty chat shows placeholder', async ({
    page,
  }) => {
    await page.goto('/en/chat', {
      waitUntil: 'domcontentloaded',
    });
    const placeholder = page.getByTestId(
      'chat-empty-state',
    );
    await expect(placeholder).toBeVisible();
  });
});
