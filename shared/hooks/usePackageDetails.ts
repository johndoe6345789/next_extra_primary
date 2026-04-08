'use client'

/**
 * usePackageDetails Hook
 *
 * Manages package detail modal state.
 */

import { useCallback, useRef, useState } from 'react'
import type {
  PackageDetailsState,
  PackageDetailsHandlers,
  UsePackageDetailsReturn,
  PackageError,
  PackageInfo,
} from '@/lib/types/package-admin-types'
import {
  usePackageDetailsOpen,
  usePackageDetailsRefresh,
} from './packageDetailsOpen'

interface UsePackageDetailsOptions {
  baseUrl?: string
  onSuccess?: (pkg: PackageInfo) => void
  onError?: (error: PackageError) => void
}

export function usePackageDetails(
  options: UsePackageDetailsOptions = {}
): UsePackageDetailsReturn {
  const {
    baseUrl = '', onSuccess, onError,
  } = options

  const [state, setState] =
    useState<PackageDetailsState>({
      selectedPackage: null,
      isOpen: false,
      isLoading: false,
      error: null,
    })

  const abortRef =
    useRef<AbortController | null>(null)

  const openDetails = usePackageDetailsOpen(
    baseUrl, setState, abortRef,
    onSuccess, onError
  )

  const closeDetails = useCallback(() => {
    abortRef.current?.abort()
    setState((p) => ({
      ...p,
      isOpen: false,
      selectedPackage: null,
      error: null,
    }))
  }, [])

  const refreshDetails = usePackageDetailsRefresh(
    setState, abortRef, state.selectedPackage,
    onSuccess, onError
  )

  const handlers: PackageDetailsHandlers = {
    openDetails,
    closeDetails,
    refreshDetails,
  }

  return { state, handlers }
}
