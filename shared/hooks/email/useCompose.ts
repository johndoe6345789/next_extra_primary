import { useState, useCallback } from 'react'
import type {
  EmailDraft,
  ComposeState,
  UseComposeResult,
} from './composeTypes'
import {
  createBlankDraft,
  useComposeOps,
} from './composeOperations'

export type {
  EmailDraft,
  UseComposeResult,
} from './composeTypes'

/**
 * Hook for email composition
 */
export function useCompose(): UseComposeResult {
  const [state, setState] =
    useState<ComposeState>({
      draft: null,
      isSaving: false,
      error: null,
    })

  const ops = useComposeOps(state, setState)

  const ensureDraft =
    useCallback((): EmailDraft => {
      if (state.draft) return state.draft
      const d = createBlankDraft()
      setState((p) => ({ ...p, draft: d }))
      return d
    }, [state.draft])

  const updateDraft = useCallback(
    (
      updates: Partial<
        Omit<
          EmailDraft,
          'id' | 'createdAt' | 'updatedAt'
        >
      >
    ) => {
      const draft = ensureDraft()
      setState((p) => ({
        ...p,
        draft: {
          ...draft,
          ...updates,
          updatedAt: Date.now(),
        },
      }))
    },
    [ensureDraft]
  )

  return {
    draft: state.draft,
    updateDraft,
    clearDraft: ops.clearDraft,
    saveDraft: ops.saveDraft,
    isSaving: state.isSaving,
    error: state.error,
  }
}
