/**
 * Media query listener setup and cleanup
 */

import type { Dispatch, SetStateAction } from 'react'

type SetMatches = Dispatch<
  SetStateAction<Record<string, boolean>>
>

/**
 * Attach change listeners to media query lists
 * @param queries - Name-to-query map
 * @param setMatches - State setter
 * @returns Cleanup function or undefined
 */
export function attachMediaListeners(
  queries: Record<string, string>,
  setMatches: SetMatches
): (() => void) | undefined {
  if (typeof window === 'undefined') return

  const mqls: Array<{
    key: string
    mql: MediaQueryList
  }> = []

  try {
    Object.entries(queries).forEach(
      ([key, q]) => {
        const mql = window.matchMedia(q)
        mqls.push({ key, mql })
        setMatches((prev) => ({
          ...prev,
          [key]: mql.matches,
        }))
      }
    )
  } catch {
    return undefined
  }

  const makeHandler =
    (key: string) =>
    (e: MediaQueryListEvent | Event) => {
      if (e instanceof MediaQueryListEvent) {
        setMatches((prev) => ({
          ...prev,
          [key]: e.matches,
        }))
      } else if ('matches' in e.target!) {
        setMatches((prev) => ({
          ...prev,
          [key]: (
            e.target as MediaQueryList
          ).matches,
        }))
      }
    }

  mqls.forEach(({ key, mql }) => {
    mql.addEventListener(
      'change',
      makeHandler(key)
    )
  })

  return () => {
    mqls.forEach(({ mql, key }) => {
      mql.removeEventListener(
        'change',
        makeHandler(key)
      )
    })
  }
}
