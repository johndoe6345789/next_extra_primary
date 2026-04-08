/**
 * Email Compose Send Extra Reducers
 * Async thunk handlers for sendEmailAsync
 */

import type {
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit'
import type {
  ComposeDraftState,
} from './composeTypes'
import { sendEmailAsync } from './composeThunks'

/**
 * @brief Build send-email extra reducers
 * @param builder - RTK builder instance
 */
export function buildSendExtraReducers(
  builder: ActionReducerMapBuilder<
    ComposeDraftState
  >
): void {
  builder
    .addCase(
      sendEmailAsync.pending,
      (state) => {
        state.isLoading = true
        state.error = null
        if (state.currentDraft) {
          state.currentDraft.isSending = true
        }
      }
    )
    .addCase(
      sendEmailAsync.fulfilled,
      (state) => {
        state.isLoading = false
        state.currentDraft = null
        state.successMessage =
          'Email sent successfully'
      }
    )
    .addCase(
      sendEmailAsync.rejected,
      (state, action) => {
        state.isLoading = false
        state.error =
          action.payload ||
          'Failed to send email'
        if (state.currentDraft) {
          state.currentDraft.isSending = false
        }
      }
    )
}
