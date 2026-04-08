'use client'

/**
 * Side effects for usePackages hook:
 * initial load, refetch interval, focus refetch
 */

import { useEffect } from 'react'

interface PackagesEffectsParams {
  fetchInternal: (
    p: number,
    l: number,
    s: string,
    st: string,
    r: boolean
  ) => Promise<void>
  initialLimit: number
  refetchInterval: number | null
  refetchOnFocus: boolean
  refetchPackages: () => Promise<void>
  debounceRef: React.MutableRefObject<
    NodeJS.Timeout | null
  >
  abortRef: React.MutableRefObject<
    AbortController | null
  >
}

/** Attach side effects for packages data */
export function usePackagesEffects(
  params: PackagesEffectsParams
) {
  const {
    fetchInternal,
    initialLimit,
    refetchInterval,
    refetchOnFocus,
    refetchPackages,
    debounceRef,
    abortRef,
  } = params

  useEffect(() => {
    void fetchInternal(
      0,
      initialLimit,
      '',
      'all',
      false
    )
  }, []) // eslint-disable-line

  useEffect(() => {
    if (
      !refetchInterval ||
      refetchInterval <= 0
    ) {
      return
    }
    const id = setInterval(() => {
      void refetchPackages()
    }, refetchInterval)
    return () => clearInterval(id)
  }, [refetchInterval, refetchPackages])

  useEffect(() => {
    if (!refetchOnFocus) return
    const h = () => {
      void refetchPackages()
    }
    window.addEventListener('focus', h)
    return () =>
      window.removeEventListener('focus', h)
  }, [refetchOnFocus, refetchPackages])

  useEffect(
    () => () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      abortRef.current?.abort()
    },
    []
  ) // eslint-disable-line
}
