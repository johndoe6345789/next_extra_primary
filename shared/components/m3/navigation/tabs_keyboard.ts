/**
 * Keyboard navigation helper for the Tabs container.
 * Extracted from Tabs.tsx to keep that file under 100 LOC.
 */

import type React from 'react'

/** Arrow/Home/End key handler for a role="tablist" container. */
export const handleTabsKeyDown = (
  e: React.KeyboardEvent,
): void => {
  const tabs = Array.from(
    (
      e.currentTarget as HTMLElement
    ).querySelectorAll<HTMLElement>(
      '[role="tab"]:not([disabled])',
    ),
  )
  const idx = tabs.indexOf(e.target as HTMLElement)
  if (idx === -1) return
  let next: number | null = null
  switch (e.key) {
    case 'ArrowRight':
      next = (idx + 1) % tabs.length
      break
    case 'ArrowLeft':
      next = (idx - 1 + tabs.length) % tabs.length
      break
    case 'Home':
      next = 0
      break
    case 'End':
      next = tabs.length - 1
      break
  }
  if (next !== null) {
    e.preventDefault()
    tabs[next]?.focus()
    tabs[next]?.click()
  }
}
