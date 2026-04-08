#!/usr/bin/env tsx
/**
 * Auto-fix test selectors by analyzing pages.
 *
 * Usage: npx tsx auto-fix-tests.ts
 */

import { chromium } from '@playwright/test'
import { analyzePage }
  from './auto-fix-page-analyzer'

async function main() {
  const browser = await chromium.launch({
    headless: false,
  })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  })
  const page = await context.newPage()

  console.log('Auto-Fix Test Analyzer')
  console.log('========================\n')

  await analyzePage(
    page,
    'http://localhost:3000/',
    [
      '.react-flow__viewport',
      "button:has-text('Core')",
      "select, button:has-text('Status')",
      "[class*='plugin-card']",
    ],
  )

  await analyzePage(
    page,
    'http://localhost:3000/workflows',
    [
      "input[placeholder*='Search workflows']",
      "button:has-text('Favorites')",
      "select, button:has-text('Status')",
    ],
  )

  await page.screenshot({
    path: 'test-results/auto-fix-workflows.png',
    fullPage: true,
  })

  console.log('\nScreenshots saved')
  console.log('Auto-fix analysis complete!')

  await browser.close()
}

main().catch(console.error)
