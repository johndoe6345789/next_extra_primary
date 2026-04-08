'use client'

/**
 * Side effects for useAsyncData:
 * auto-fetch, interval, focus refetch
 */

import { useEffect } from 'react'

/**
 * Attach auto-refetch effects
 * @param fetchData - Fetch callback
 * @param deps - Dependency array
 * @param refetchInterval - Interval ms
 * @param refetchOnFocus - Refetch on window focus
 * @param abortRef - AbortController ref
 */
export function useAsyncDataEffects(
  fetchData: (isRetry?: boolean) => Promise<void>,
  deps: readonly unknown[],
  refetchInterval: number | null,
  refetchOnFocus: boolean,
  abortRef: React.MutableRefObject<
    AbortController | null
  >
) {
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchData()
  }, deps)

  useEffect(() => {
    if (
      !refetchInterval ||
      refetchInterval <= 0
    ) {
      return
    }
    const id = setInterval(() => {
      void fetchData(true)
    }, refetchInterval)
    return () => clearInterval(id)
  }, [refetchInterval, fetchData])

  useEffect(() => {
    if (!refetchOnFocus) return
    const h = () => {
      void fetchData(true)
    }
    window.addEventListener('focus', h)
    return () =>
      window.removeEventListener('focus', h)
  }, [refetchOnFocus, fetchData])

  useEffect(
    () => () => {
      abortRef.current?.abort()
    },
    []
  )
  /* eslint-enable react-hooks/exhaustive-deps */
}
