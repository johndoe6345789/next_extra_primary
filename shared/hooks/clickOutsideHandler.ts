/**
 * Click-outside event handler logic
 */

import type React from 'react'

/**
 * Create click-outside detection handler
 * @param ref - Element ref to check against
 * @param excludeRefs - Refs to exclude
 * @param delayMs - Delay before closing
 * @param delayRef - Timeout ref for cleanup
 * @param setIsOpen - State setter
 * @param onClickOutside - Optional callback
 */
export function createOutsideHandler(
  ref: React.RefObject<HTMLElement | null>,
  excludeRefs: React.RefObject<
    HTMLElement | null
  >[],
  delayMs: number,
  delayRef: React.RefObject<
    ReturnType<typeof setTimeout> | undefined
  >,
  setIsOpen: (v: boolean) => void,
  onClickOutside?: () => void
) {
  return (
    event: MouseEvent | TouchEvent
  ) => {
    if (
      ref.current?.contains(
        event.target as Node
      )
    ) {
      return
    }
    const excluded = excludeRefs.some((r) =>
      r.current?.contains(
        event.target as Node
      )
    )
    if (excluded) return

    if (delayMs > 0) {
      if (delayRef.current) {
        clearTimeout(delayRef.current)
      }
      delayRef.current = setTimeout(() => {
        setIsOpen(false)
        onClickOutside?.()
      }, delayMs)
    } else {
      setIsOpen(false)
      onClickOutside?.()
    }
  }
}
