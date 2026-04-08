/**
 * Test step executor for JSON-driven tests.
 */

import type { Page } from '@playwright/test'
import type { TestStep } from './types'
import { getLocator } from './locator'
import { executeAssertion } from './assertions'

/**
 * Execute a single test step.
 *
 * @param step - Step definition.
 * @param page - Playwright page object.
 */
export async function executeStep(
  step: TestStep, page: Page,
): Promise<void> {
  if (step.description) {
    console.log(`  -> ${step.description}`)
  }

  switch (step.action) {
    case 'navigate':
      await page.goto(step.url!); break
    case 'click':
      await getLocator(step, page).click(); break
    case 'dblclick':
      await getLocator(step, page).dblclick(); break
    case 'fill':
      await getLocator(step, page).fill(
        String(step.value),
      ); break
    case 'type':
      await getLocator(step, page).pressSequentially(
        String(step.value),
      ); break
    case 'select':
      await getLocator(step, page).selectOption(
        String(step.value),
      ); break
    case 'check':
      await getLocator(step, page).check(); break
    case 'uncheck':
      await getLocator(step, page).uncheck(); break
    case 'hover':
      await getLocator(step, page).hover(); break
    case 'focus':
      await getLocator(step, page).focus(); break
    case 'press':
      await page.keyboard.press(step.key!); break
    case 'wait':
      await page.waitForTimeout(
        step.timeout || 1000,
      ); break
    case 'waitForSelector':
      await page.waitForSelector(
        step.selector!,
        step.timeout
          ? { timeout: step.timeout } : undefined,
      ); break
    case 'waitForNavigation':
      await page.waitForLoadState('networkidle')
      break
    case 'waitForLoadState':
      await page.waitForLoadState(
        (step.state || 'load') as
          'load' | 'domcontentloaded' | 'networkidle',
      ); break
    case 'screenshot':
      await page.screenshot({
        path: step.path,
        fullPage: step.fullPage,
      }); break
    case 'evaluate':
      await page.evaluate(step.script!); break
    case 'expect':
      await executeAssertion(step, page); break
    default:
      throw new Error(
        `Unknown action: ${step.action}`,
      )
  }
}
