/**
 * useConfirmDialog Hook
 * Promise-based confirmation dialog
 */

import { useState, useCallback } from 'react'
import type {
  ConfirmDialogOptions,
  ConfirmDialogState,
  UseConfirmDialogReturn,
} from './confirmDialogTypes'

export type {
  ConfirmDialogOptions,
  ConfirmDialogState,
  UseConfirmDialogReturn,
} from './confirmDialogTypes'

/**
 * Hook for promise-based confirm dialogs
 */
export function useConfirmDialog():
  UseConfirmDialogReturn {
  const [state, setState] =
    useState<ConfirmDialogState>({
      isOpen: false,
      options: null,
      resolve: null,
    })

  const confirm = useCallback(
    (
      options: ConfirmDialogOptions
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          isOpen: true,
          options,
          resolve,
        })
      })
    },
    []
  )

  const handleConfirm = useCallback(() => {
    state.resolve?.(true)
    setState({
      isOpen: false,
      options: null,
      resolve: null,
    })
  }, [state.resolve])

  const handleCancel = useCallback(() => {
    state.resolve?.(false)
    setState({
      isOpen: false,
      options: null,
      resolve: null,
    })
  }, [state.resolve])

  return {
    isOpen: state.isOpen,
    options: state.options,
    confirm,
    handleConfirm,
    handleCancel,
  }
}
