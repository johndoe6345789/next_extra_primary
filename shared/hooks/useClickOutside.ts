/**
 * useClickOutside Hook
 * Detect clicks outside an element
 */

import { useRef, useState, useCallback } from 'react'
import type {
  UseClickOutsideOptions,
  UseClickOutsideReturn,
} from './clickOutsideTypes'
import { useClickOutsideListener } from './clickOutsideListener'

export type {
  UseClickOutsideOptions,
  UseClickOutsideReturn,
} from './clickOutsideTypes'

/**
 * Hook for outside click detection
 * @param options - Configuration options
 */
export function useClickOutside<
  T extends HTMLElement = HTMLDivElement
>(
  options: UseClickOutsideOptions = {}
): UseClickOutsideReturn<T> {
  const {
    onClickOutside,
    excludeRefs = [],
    includeTouch = true,
    delayMs = 0,
  } = options

  const ref = useRef<T>(null)
  const [isOpen, setIsOpen] = useState(false)
  const delayRef = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined)

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  useClickOutsideListener(
    isOpen, ref, excludeRefs, delayMs,
    delayRef, includeTouch, setIsOpen,
    onClickOutside
  )

  return { ref, isOpen, setIsOpen, toggle }
}
