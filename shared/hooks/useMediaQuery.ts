/**
 * useMediaQuery Hook
 * Track CSS media query state
 */

import { useSingleMediaQuery } from './mediaQuerySingle'
import { useMultiMediaQuery } from './mediaQueryMulti'

export type UseMediaQueryInput =
  | string
  | Record<string, string>

export type UseMediaQueryReturn<
  T extends UseMediaQueryInput
> = T extends string
  ? boolean
  : Record<string, boolean>

/**
 * Track single or multiple media queries
 * @param query - CSS query or named map
 */
export function useMediaQuery<
  T extends UseMediaQueryInput
>(query: T): UseMediaQueryReturn<T> {
  if (typeof query === 'string') {
    return useSingleMediaQuery(
      query
    ) as UseMediaQueryReturn<T>
  }
  return useMultiMediaQuery(
    query as Record<string, string>
  ) as UseMediaQueryReturn<T>
}
