/**
 * Locator resolution for JSON test steps.
 */

import type { Page } from '@playwright/test'
import type { TestStep } from './types'

/**
 * Get a Playwright locator from a test step.
 *
 * @param step - The test step definition.
 * @param page - Playwright page object.
 * @returns A Playwright locator.
 */
export function getLocator(step: TestStep, page: Page) {
  if (step.selector) {
    return page.locator(step.selector)
  }
  if (step.role) {
    const options: Record<string, unknown> = {}
    if (step.text) {
      options.name = new RegExp(step.text, 'i')
    }
    return page.getByRole(
      step.role as Parameters<Page['getByRole']>[0],
      options,
    )
  }
  if (step.text) {
    return page.getByText(step.text)
  }
  if (step.label) {
    return page.getByLabel(step.label)
  }
  if (step.placeholder) {
    return page.getByPlaceholder(step.placeholder)
  }
  if (step.testId) {
    return page.getByTestId(step.testId)
  }
  throw new Error('No selector specified for step')
}
