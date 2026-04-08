/**
 * Email Compose Attachment + Misc Reducers
 * Attachment, selection, and cleanup reducers
 */

import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  EmailDraft,
  ComposeDraftState,
} from './composeTypes'

/** @brief Add attachment to current draft */
export function addAttachment(
  state: ComposeDraftState,
  action: PayloadAction<string>
): void {
  if (!state.currentDraft) return
  if (!state.currentDraft.attachmentIds) {
    state.currentDraft.attachmentIds = []
  }
  if (
    !state.currentDraft.attachmentIds.includes(
      action.payload
    )
  ) {
    state.currentDraft.attachmentIds.push(
      action.payload
    )
    state.currentDraft.updatedAt = Date.now()
  }
}

/** @brief Remove attachment from draft */
export function removeAttachment(
  state: ComposeDraftState,
  action: PayloadAction<string>
): void {
  if (!state.currentDraft) return
  state.currentDraft.attachmentIds = (
    state.currentDraft.attachmentIds || []
  ).filter((id) => id !== action.payload)
  state.currentDraft.updatedAt = Date.now()
}

/** @brief Set current draft directly */
export function setCurrentDraft(
  state: ComposeDraftState,
  action: PayloadAction<EmailDraft | null>
): void {
  state.currentDraft = action.payload
}

/** @brief Clear current draft and messages */
export function clearDraft(
  state: ComposeDraftState
): void {
  state.currentDraft = null
  state.error = null
  state.successMessage = null
}

/** @brief Delete draft by ID */
export function deleteDraft(
  state: ComposeDraftState,
  action: PayloadAction<string>
): void {
  state.drafts = state.drafts.filter(
    (d) => d.id !== action.payload
  )
  if (
    state.currentDraft?.id === action.payload
  ) {
    state.currentDraft = null
  }
}

/** @brief Clear error message */
export function clearError(
  state: ComposeDraftState
): void {
  state.error = null
}

/** @brief Clear success message */
export function clearSuccessMessage(
  state: ComposeDraftState
): void {
  state.successMessage = null
}
