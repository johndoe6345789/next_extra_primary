import type React from 'react'

/**
 * Map pagination type to display content.
 * @param type - Button type.
 * @param page - Page number.
 * @returns Content to display.
 */
export function getPageContent(
  type: string,
  page?: number | null,
): React.ReactNode {
  switch (type) {
    case 'first': return '\u27E8\u27E8'
    case 'previous': return '\u2039'
    case 'next': return '\u203A'
    case 'last': return '\u27E9\u27E9'
    case 'ellipsis': return '\u2026'
    default: return page
  }
}

/**
 * Map pagination type to aria-label.
 * @param type - Button type.
 * @param page - Page number.
 * @returns Aria label string.
 */
export function getPageAriaLabel(
  type: string,
  page?: number | null,
): string | undefined {
  switch (type) {
    case 'first':
      return 'Go to first page'
    case 'previous':
      return 'Go to previous page'
    case 'next':
      return 'Go to next page'
    case 'last':
      return 'Go to last page'
    case 'page':
      return `Go to page ${page}`
    default: return undefined
  }
}
