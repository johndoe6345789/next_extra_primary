/**
 * Compose draft callbacks
 */

import { useCallback } from 'react'
import type {
  EmailDraft,
  ComposeState,
} from './composeTypes'

type SetState = React.Dispatch<
  React.SetStateAction<ComposeState>
>

/** Create a new blank draft */
export function createBlankDraft(): EmailDraft {
  return {
    id: `draft_${Date.now()}`,
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    body: '',
    htmlBody: '',
    attachments: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDraft: true,
  }
}

/** Create draft persistence callbacks */
export function useComposeOps(
  state: ComposeState,
  setState: SetState
) {
  const clearDraft = useCallback(() => {
    setState((p) => ({
      ...p,
      draft: null,
      error: null,
    }))
  }, [setState])

  const saveDraft = useCallback(async () => {
    if (!state.draft) return
    setState((p) => ({
      ...p,
      isSaving: true,
      error: null,
    }))
    try {
      await new Promise((r) =>
        setTimeout(r, 500)
      )
      setState((p) => ({
        ...p,
        isSaving: false,
        draft: p.draft
          ? {
              ...p.draft,
              updatedAt: Date.now(),
            }
          : null,
      }))
    } catch (err) {
      const e =
        err instanceof Error
          ? err
          : new Error('Failed to save draft')
      setState((p) => ({
        ...p,
        isSaving: false,
        error: e,
      }))
      throw e
    }
  }, [state.draft, setState])

  return { clearDraft, saveDraft }
}
