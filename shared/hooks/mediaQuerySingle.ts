/**
 * Single media query hook implementation
 */

import { useState, useEffect } from 'react'

/**
 * Track a single CSS media query
 * @param query - CSS media query string
 * @returns Whether the query matches
 */
export function useSingleMediaQuery(
  query: string
): boolean {
  const [matches, setMatches] =
    useState<boolean>(() => {
      if (typeof window === 'undefined') {
        return false
      }
      try {
        return window.matchMedia(query).matches
      } catch {
        return false
      }
    })

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const mql = window.matchMedia(query)
      setMatches(mql.matches)

      const handleChange = (
        e: MediaQueryListEvent | Event
      ) => {
        if (e instanceof MediaQueryListEvent) {
          setMatches(e.matches)
        } else if ('matches' in e.target!) {
          setMatches(
            (e.target as MediaQueryList).matches
          )
        }
      }

      mql.addEventListener(
        'change',
        handleChange
      )
      return () => {
        mql.removeEventListener(
          'change',
          handleChange
        )
      }
    } catch {
      return undefined
    }
  }, [query])

  return matches
}
