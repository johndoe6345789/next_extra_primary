/**
 * Click outside event listener setup
 */

import { useEffect } from 'react'
import { createOutsideHandler } from './clickOutsideHandler'

/**
 * Sets up mousedown/touchstart listeners
 * for outside click detection.
 * @param isOpen - Whether the element is open
 * @param ref - Element ref to detect outside
 * @param excludeRefs - Refs to exclude
 * @param delayMs - Delay before closing
 * @param delayRef - Timeout ref for delay
 * @param includeTouch - Whether to listen touch
 * @param setIsOpen - State setter
 * @param onClickOutside - Optional callback
 */
export function useClickOutsideListener<
  T extends HTMLElement,
>(
  isOpen: boolean,
  ref: React.RefObject<T | null>,
  excludeRefs: React.RefObject<
    HTMLElement | null
  >[],
  delayMs: number,
  delayRef: React.MutableRefObject<
    ReturnType<typeof setTimeout> | undefined
  >,
  includeTouch: boolean,
  setIsOpen: (v: boolean) => void,
  onClickOutside?: () => void
) {
  useEffect(() => {
    if (!isOpen) return

    const handler = createOutsideHandler(
      ref,
      excludeRefs,
      delayMs,
      delayRef,
      setIsOpen,
      onClickOutside
    )

    document.addEventListener(
      'mousedown',
      handler
    )
    if (includeTouch) {
      document.addEventListener(
        'touchstart',
        handler
      )
    }

    return () => {
      document.removeEventListener(
        'mousedown',
        handler
      )
      if (includeTouch) {
        document.removeEventListener(
          'touchstart',
          handler
        )
      }
      if (delayRef.current) {
        clearTimeout(delayRef.current)
      }
    }
  }, [
    isOpen,
    ref,
    excludeRefs,
    delayMs,
    includeTouch,
    onClickOutside,
    delayRef,
    setIsOpen,
  ])
}
