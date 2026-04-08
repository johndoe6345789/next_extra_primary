/**
 * JSON Playwright Test Runner.
 * Executes tests from JSON definitions.
 */

import { test as baseTest } from '@playwright/test'
import type { PlaywrightTestDefinition } from './types'
import {
  discoverTestPackages,
  loadTestDefinition,
} from './discovery'
import { executeStep } from './stepExecutor'

export type {
  PlaywrightTestDefinition, TestCase,
  TestStep, Assertion, SetupStep,
} from './types'
export {
  discoverTestPackages, loadTestDefinition,
} from './discovery'
export { getLocator } from './locator'
export { executeAssertion } from './assertions'
export { executeStep } from './stepExecutor'

/** Register tests from a JSON definition. */
export function registerTestsFromJSON(
  testDef: PlaywrightTestDefinition,
  testFn = baseTest,
) {
  testFn.describe(
    `${testDef.package} Package Tests (from JSON)`,
    () => {
      if (testDef.setup?.beforeAll) {
        testFn.beforeAll(async () => {
          console.log(
            `[Setup] beforeAll for ${testDef.package}`,
          )
        })
      }

      if (testDef.setup?.beforeEach) {
        testFn.beforeEach(async ({ page: _p }) => {
          console.log(
            `[Setup] beforeEach for ${testDef.package}`,
          )
        })
      }

      testDef.tests.forEach((testCase) => {
        let test = testFn
        if (testCase.skip) test = test.skip
        if (testCase.only) test = test.only

        test(testCase.name, async ({ page }) => {
          if (testCase.timeout) {
            test.setTimeout(testCase.timeout)
          }
          console.log(`\n[Test] ${testCase.name}`)
          for (const step of testCase.steps) {
            await executeStep(step, page)
          }
        })
      })
    },
  )
}

/** Load and register all package tests. */
export async function loadAllPackageTests(
  packagesDir: string,
  testFn = baseTest,
) {
  const packages =
    await discoverTestPackages(packagesDir)

  for (const pkg of packages) {
    const def =
      await loadTestDefinition(pkg, packagesDir)
    registerTestsFromJSON(def, testFn)
  }
}
