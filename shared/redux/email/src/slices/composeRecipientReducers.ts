/**
 * Email Compose Recipient Reducers
 * Add/remove recipient reducers for drafts
 */

import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  ComposeDraftState,
} from './composeTypes'

/** @brief Add recipient to draft */
export function addRecipient(
  state: ComposeDraftState,
  action: PayloadAction<{
    type: 'to' | 'cc' | 'bcc'
    email: string
  }>
): void {
  if (!state.currentDraft) return
  const { type, email } = action.payload
  if (
    !state.currentDraft[type].includes(email)
  ) {
    state.currentDraft[type].push(email)
    state.currentDraft.updatedAt = Date.now()
  }
}

/** @brief Remove recipient from draft */
export function removeRecipient(
  state: ComposeDraftState,
  action: PayloadAction<{
    type: 'to' | 'cc' | 'bcc'
    email: string
  }>
): void {
  if (!state.currentDraft) return
  const { type, email } = action.payload
  state.currentDraft[type] =
    state.currentDraft[type].filter(
      (e) => e !== email
    )
  state.currentDraft.updatedAt = Date.now()
}
