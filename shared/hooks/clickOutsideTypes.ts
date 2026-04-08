/**
 * Type definitions for useClickOutside hook
 */

import React from 'react'

/** Options for useClickOutside */
export interface UseClickOutsideOptions {
  /** Callback on outside click */
  onClickOutside?: () => void
  /** Additional refs to exclude */
  excludeRefs?: React.RefObject<HTMLElement>[]
  /** Include touch events */
  includeTouch?: boolean
  /** Delay before detecting (ms) */
  delayMs?: number
}

/** Return type of useClickOutside */
export interface UseClickOutsideReturn<
  T extends HTMLElement = HTMLDivElement
> {
  /** Ref to attach to target element */
  ref: React.RefObject<T | null>
  /** Whether element is open/visible */
  isOpen: boolean
  /** Set the open state */
  setIsOpen: (open: boolean) => void
  /** Toggle the open state */
  toggle: () => void
}
