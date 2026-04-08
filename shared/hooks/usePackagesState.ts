'use client'

/**
 * Packages hook state initialization and types
 */

import { useRef, useState } from 'react'
import type {
  PackageListState,
  PackageError,
} from '@/lib/types/package-admin-types'

/** Options for usePackages hook */
export interface UsePackagesOptions {
  baseUrl?: string
  initialLimit?: number
  debounceMs?: number
  onSuccess?: (data: never[]) => void
  onError?: (error: PackageError) => void
  refetchInterval?: number | null
  refetchOnFocus?: boolean
}

/** Default option values */
export function resolveOptions(
  options: UsePackagesOptions
) {
  return {
    baseUrl: options.baseUrl ?? '',
    initialLimit: options.initialLimit ?? 10,
    debounceMs: options.debounceMs ?? 300,
    onSuccess: options.onSuccess,
    onError: options.onError,
    refetchInterval:
      options.refetchInterval ?? null,
    refetchOnFocus:
      options.refetchOnFocus ?? true,
  }
}

/** Initialize package list state */
export function usePackagesInit(
  initialLimit: number
) {
  const [state, setState] =
    useState<PackageListState>({
      packages: [],
      total: 0,
      page: 0,
      limit: initialLimit,
      search: '',
      statusFilter: 'all',
      isLoading: false,
      isRefetching: false,
      error: null,
    })

  const abortRef =
    useRef<AbortController | null>(null)

  return { state, setState, abortRef }
}
