/**
 * Assertion execution for JSON test steps.
 */

import { expect, type Page } from '@playwright/test'
import type { TestStep } from './types'
import { getLocator } from './locator'

/**
 * Execute an assertion from a test step.
 *
 * @param step - Step with assertion config.
 * @param page - Playwright page object.
 */
export async function executeAssertion(
  step: TestStep, page: Page,
): Promise<void> {
  if (!step.assertion) {
    throw new Error('No assertion specified')
  }

  const locator = getLocator(step, page)
  const { matcher, expected, not, timeout } =
    step.assertion

  let assertion = expect(locator)
  if (not) assertion = assertion.not as typeof assertion

  const opts = timeout ? { timeout } : undefined

  switch (matcher) {
    case 'toBeVisible':
      await assertion.toBeVisible(opts); break
    case 'toBeHidden':
      await assertion.toBeHidden(opts); break
    case 'toBeEnabled':
      await assertion.toBeEnabled(opts); break
    case 'toBeDisabled':
      await assertion.toBeDisabled(opts); break
    case 'toBeChecked':
      await assertion.toBeChecked(opts); break
    case 'toBeFocused':
      await assertion.toBeFocused(opts); break
    case 'toBeEmpty':
      await assertion.toBeEmpty(opts); break
    case 'toHaveText':
      await assertion.toHaveText(
        String(expected), opts,
      ); break
    case 'toContainText':
      await assertion.toContainText(
        String(expected), opts,
      ); break
    case 'toHaveValue':
      await assertion.toHaveValue(
        String(expected), opts,
      ); break
    case 'toHaveCount':
      await assertion.toHaveCount(
        Number(expected), opts,
      ); break
    case 'toHaveAttribute':
      if (Array.isArray(expected)
        && expected.length === 2) {
        await assertion.toHaveAttribute(
          expected[0], expected[1], opts,
        )
      }
      break
    case 'toHaveClass':
      await assertion.toHaveClass(
        expected as string, opts,
      ); break
    case 'toHaveCSS':
      if (Array.isArray(expected)
        && expected.length === 2) {
        await assertion.toHaveCSS(
          expected[0], expected[1], opts,
        )
      }
      break
    default:
      throw new Error(`Unknown matcher: ${matcher}`)
  }
}
