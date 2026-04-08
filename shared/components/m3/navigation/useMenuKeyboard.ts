/**
 * Keyboard navigation hooks for the Menu component.
 */

import React, { useEffect } from 'react'

/** Close menu on Escape key */
export function useEscapeClose(
  open: boolean | undefined,
  onClose: (() => void) | undefined,
): void {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose?.()
      }
    }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])
}

/** Arrow key nav between menu items */
export function useArrowNav(
  open: boolean | undefined,
  menuRef: React.RefObject<HTMLDivElement | null>,
): void {
  useEffect(() => {
    if (!open) return
    const el = menuRef.current
    if (!el) return
    const items = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          '[role="menuitem"]:not([disabled])',
        ),
      )
    items()[0]?.focus()
    const h = (e: KeyboardEvent) => {
      const list = items()
      const idx = list.indexOf(
        document.activeElement as HTMLElement,
      )
      let next: number | null = null
      if (e.key === 'ArrowDown')
        next = (idx + 1) % list.length
      if (e.key === 'ArrowUp')
        next = (idx - 1 + list.length) % list.length
      if (e.key === 'Home') next = 0
      if (e.key === 'End') next = list.length - 1
      if (next !== null) {
        e.preventDefault()
        list[next]?.focus()
      }
    }
    el.addEventListener('keydown', h)
    return () => el.removeEventListener('keydown', h)
  }, [open, menuRef])
}
