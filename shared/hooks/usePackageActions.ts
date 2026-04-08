'use client'

/**
 * usePackageActions Hook
 *
 * Manages individual package operations
 * (install, uninstall, enable, disable).
 */

import { useState } from 'react'
import type {
  PackageInfo,
  PackageActionsState,
  PackageActionHandlers,
  UsePackageActionsReturn,
  PackageError,
} from '@/lib/types/package-admin-types'
import {
  usePackageExecutor,
} from './packageActionsExecutor'
import {
  usePackageOps,
} from './packageActionsOps'

interface UsePackageActionsOptions {
  baseUrl?: string
  onSuccess?: (
    pkg: PackageInfo,
    op: 'install' | 'uninstall' |
        'enable' | 'disable'
  ) => void
  onError?: (
    error: PackageError,
    packageId: string
  ) => void
}

/** Hook for package operations */
export function usePackageActions(
  options: UsePackageActionsOptions = {}
): UsePackageActionsReturn {
  const {
    baseUrl = '', onSuccess, onError,
  } = options

  const [state, setState] =
    useState<PackageActionsState>({
      isLoading: false,
      operationInProgress: new Set(),
      error: null,
    })

  const executeOp = usePackageExecutor(
    state, setState, onSuccess, onError
  )

  const handlers: PackageActionHandlers =
    usePackageOps(baseUrl, executeOp)

  return {
    state, handlers,
    isOperationInProgress: (pkgId: string) =>
      state.operationInProgress.has(pkgId),
  }
}
