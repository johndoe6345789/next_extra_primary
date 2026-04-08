/**
 * Auto-fix selector analyzer.
 * Analyzes a Playwright page to find
 * alternative selectors for broken ones.
 */

import type { SelectorFix } from './auto-fix-types'
export type { SelectorFix } from './auto-fix-types'

/**
 * Analyze a page to find alternatives
 * for a broken selector.
 *
 * @param page - Playwright page.
 * @param originalSelector - Broken selector.
 */
export async function analyzePageForSelector(
  page: unknown,
  originalSelector: string,
): Promise<SelectorFix> {
  const p = page as Record<string, CallableFunction>
  const suggestions: string[] = []

  const hasText =
    originalSelector.match(/has-text\(['"](.+?)['"]\)/)
  const textMatch =
    originalSelector.match(/text=(.+?)($|,)/)

  if (hasText || textMatch) {
    const searchText = hasText
      ? hasText[1] : textMatch![1]
    const textEls = await p.evaluate(
      (text: string) => {
        const els = document.querySelectorAll('*')
        const m: { selector: string; text: string }[] = []
        els.forEach((el: Element) => {
          const c = el.textContent?.toLowerCase() || ''
          if (c.includes(text.toLowerCase())) {
            const s = el.tagName.toLowerCase()
              + (el.id ? `#${el.id}` : '')
              + (el.className
                ? `.${el.className.split(' ')[0]}`
                : '')
            const vis =
              window.getComputedStyle(el).display
                !== 'none'
            if (vis) {
              m.push({
                selector: s,
                text: el.textContent
                  ?.trim().substring(0, 50) || '',
              })
            }
          }
        })
        return m.slice(0, 5)
      },
      searchText,
    )
    for (const el of textEls) {
      suggestions.push(el.selector)
      suggestions.push(`text=${el.text}`)
    }
  }

  const testIds = await p.evaluate(() => {
    const els =
      document.querySelectorAll('[data-testid]')
    return Array.from(els).slice(0, 5).map(
      (el: Element) =>
        `[data-testid="${el.getAttribute('data-testid')}"]`,
    )
  })

  suggestions.push(...testIds)

  const unique = [...new Set(suggestions)]

  return {
    originalSelector,
    suggestedSelectors: unique.slice(0, 10),
    confidence: unique.length > 0 ? 'high' : 'low',
    reason:
      `Found ${unique.length} alternative selectors`,
  }
}
