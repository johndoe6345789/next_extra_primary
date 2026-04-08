/**
 * Page-level analysis for auto-fix tests.
 */

import { analyzePageForSelector }
  from './auto-fix-analyzer'

/** Analyze a page for broken selectors. */
export async function analyzePage(
  page: {
    goto: (url: string) => Promise<unknown>
    waitForLoadState: (
      state: string,
    ) => Promise<unknown>
    locator: (
      sel: string,
    ) => { count: () => Promise<number> }
  },
  url: string,
  selectors: string[],
) {
  console.log(`\nAnalyzing ${url}...`)
  await page.goto(url)
  await page.waitForLoadState('domcontentloaded')

  for (const selector of selectors) {
    console.log(`\nAnalyzing: ${selector}`)
    try {
      const count =
        await page.locator(selector).count()
      if (count === 0) {
        console.log(
          'Element not found, '
          + 'finding alternatives...',
        )
        const fix = await analyzePageForSelector(
          page, selector,
        )
        console.log(
          `Suggested fixes (${fix.confidence}):`,
        )
        fix.suggestedSelectors.forEach(
          (s: string, i: number) =>
            console.log(`  ${i + 1}. ${s}`),
        )
      } else {
        console.log(`Found (${count} matches)`)
      }
    } catch (error) {
      console.log('Error analyzing:', error)
    }
  }
}
