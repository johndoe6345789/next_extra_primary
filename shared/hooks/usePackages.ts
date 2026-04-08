'use client'

/**
 * usePackages Hook
 *
 * Manages package list state with pagination,
 * search, and filtering.
 */

import type {
  PackageListHandlers,
  UsePackagesReturn,
} from '@/lib/types/package-admin-types'
import {
  resolveOptions,
  usePackagesInit,
} from './usePackagesState'
import type { UsePackagesOptions } from './usePackagesState'
import { usePackagesFetch } from './packagesFetch'
import { usePackagesEffects } from './packagesEffects'
import { usePackagesHandlers } from './packagesHandlers'
import { usePackagesPageHandlers } from './packagesPageHandlers'

/** @see UsePackagesOptions for config */
export function usePackages(
  options: UsePackagesOptions = {}
): UsePackagesReturn {
  const opts = resolveOptions(options)
  const { state, setState, abortRef } =
    usePackagesInit(opts.initialLimit)

  const fetchInternal = usePackagesFetch(
    opts.baseUrl, state, setState, abortRef,
    opts.onSuccess as never, opts.onError
  )

  const {
    fetchPackages, refetchPackages,
    searchPackages, filterByStatus,
    debounceRef,
  } = usePackagesHandlers({
    state, fetchInternal,
    debounceMs: opts.debounceMs,
  })
  const { changePage, changeLimit } =
    usePackagesPageHandlers(state, fetchInternal)

  usePackagesEffects({
    fetchInternal,
    initialLimit: opts.initialLimit,
    refetchInterval: opts.refetchInterval,
    refetchOnFocus: opts.refetchOnFocus,
    refetchPackages,
    debounceRef,
    abortRef,
  })

  const handlers: PackageListHandlers = {
    fetchPackages, refetchPackages,
    searchPackages, filterByStatus,
    changePage, changeLimit,
  }

  return {
    state, handlers,
    pagination: {
      page: state.page,
      limit: state.limit,
      total: state.total,
      pageCount: Math.ceil(
        state.total / state.limit
      ),
    },
  }
}
