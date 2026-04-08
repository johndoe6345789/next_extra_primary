/**
 * Multiple media query hook implementation
 */

import { useState, useEffect } from 'react'
import {
  attachMediaListeners,
} from './mediaQueryMultiEffect'

/**
 * Track multiple CSS media queries
 * @param queries - Map of name to query string
 * @returns Map of name to match state
 */
export function useMultiMediaQuery(
  queries: Record<string, string>
): Record<string, boolean> {
  const [matches, setMatches] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {}
    if (typeof window === 'undefined') {
      Object.keys(queries).forEach((k) => {
        initial[k] = false
      })
      return initial
    }
    try {
      Object.entries(queries).forEach(
        ([k, q]) => {
          initial[k] =
            window.matchMedia(q).matches
        }
      )
    } catch {
      Object.keys(queries).forEach((k) => {
        initial[k] = false
      })
    }
    return initial
  })

  useEffect(() => {
    return attachMediaListeners(
      queries,
      setMatches
    )
  }, [queries])

  return matches
}
