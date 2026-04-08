/**
 * Keyboard navigation and focus hooks
 */

import React from 'react'

/**
 * Hook for keyboard navigation handling
 */
export function useKeyboardNavigation(
  handlers: {
    onEnter?: () => void
    onEscape?: () => void
    onArrowUp?: () => void
    onArrowDown?: () => void
    onArrowLeft?: () => void
    onArrowRight?: () => void
    onTab?: () => void
  }
) {
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (
        e.key === 'Enter' ||
        e.key === ' '
      ) {
        e.preventDefault()
        handlers.onEnter?.()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handlers.onEscape?.()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        handlers.onArrowUp?.()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        handlers.onArrowDown?.()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlers.onArrowLeft?.()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handlers.onArrowRight?.()
      } else if (e.key === 'Tab') {
        handlers.onTab?.()
      }
    },
    [handlers]
  )

  return { onKeyDown: handleKeyDown }
}

/**
 * Hook for managing focus
 */
export function useFocusManagement() {
  const ref = React.useRef<HTMLElement>(null)
  const focus = React.useCallback(() => {
    ref.current?.focus()
  }, [])
  const blur = React.useCallback(() => {
    ref.current?.blur()
  }, [])
  return { focusRef: ref, focus, blur }
}
