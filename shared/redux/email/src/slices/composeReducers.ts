/**
 * Email Compose Reducers
 * Synchronous draft manipulation reducers
 */

import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  EmailDraft,
  ComposeDraftState,
} from './composeTypes'
export {
  addRecipient,
  removeRecipient,
} from './composeRecipientReducers'

/** @brief Create a new blank draft */
export function createDraft(
  state: ComposeDraftState
): void {
  const d: EmailDraft = {
    id: `draft_${Date.now()}`,
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    textBody: '',
    isDraft: true,
    isSending: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  state.currentDraft = d
  state.drafts.push(d)
}

/** @brief Update a single draft field */
export function updateDraft(
  state: ComposeDraftState,
  action: PayloadAction<{
    field: keyof EmailDraft
    value: unknown
  }>
): void {
  if (!state.currentDraft) return
  const { field, value } = action.payload
  ;(state.currentDraft as Record<
    string,
    unknown
  >)[field] = value
  state.currentDraft.updatedAt = Date.now()
}

/** @brief Update multiple draft fields */
export function updateDraftMultiple(
  state: ComposeDraftState,
  action: PayloadAction<Partial<EmailDraft>>
): void {
  if (!state.currentDraft) return
  Object.assign(
    state.currentDraft,
    action.payload
  )
  state.currentDraft.updatedAt = Date.now()
}
