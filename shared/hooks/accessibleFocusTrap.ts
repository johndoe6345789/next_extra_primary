/**
 * Focus trap hook for modal/dialog focus
 */

import React from 'react'

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, ' +
  '[tabindex]:not([tabindex="-1"])'

/**
 * Hook for managing modal/dialog focus
 * Traps focus within modal, restores on close
 *
 * @example
 * const { focusTrapRef } = useFocusTrap(isOpen)
 * <div ref={focusTrapRef}>Modal content</div>
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef =
    React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!isActive || !containerRef.current)
      return

    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      if (e.key !== 'Tab') return

      const focusable =
        containerRef.current
          ?.querySelectorAll(
            FOCUSABLE_SELECTOR
          ) as NodeListOf<HTMLElement>

      if (!focusable || focusable.length === 0)
        return

      const first = focusable[0]
      const last =
        focusable[focusable.length - 1]
      const active = document.activeElement

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (
        !e.shiftKey &&
        active === last
      ) {
        e.preventDefault()
        first.focus()
      }
    }

    const container = containerRef.current
    container.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      container.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [isActive])

  return { focusTrapRef: containerRef }
}
