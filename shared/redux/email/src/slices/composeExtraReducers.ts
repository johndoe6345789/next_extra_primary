/**
 * Email Compose Extra Reducers
 * Async thunk state handlers for compose slice
 */

import type {
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit'
import type {
  ComposeDraftState,
} from './composeTypes'
import {
  saveDraftAsync,
  fetchDrafts,
} from './composeThunks'
import {
  buildSendExtraReducers,
} from './composeSendExtraReducers'

/** @brief Build extra reducers for thunks */
export function buildComposeExtraReducers(
  builder: ActionReducerMapBuilder<
    ComposeDraftState
  >
): void {
  builder
    .addCase(
      saveDraftAsync.pending,
      (state) => {
        state.isSaving = true
        state.error = null
      }
    )
    .addCase(
      saveDraftAsync.fulfilled,
      (state, action) => {
        state.isSaving = false
        state.currentDraft = action.payload
        state.drafts = state.drafts.map((d) =>
          d.id === action.payload.id
            ? action.payload
            : d
        )
        state.successMessage =
          'Draft saved successfully'
      }
    )
    .addCase(
      saveDraftAsync.rejected,
      (state, action) => {
        state.isSaving = false
        state.error =
          action.payload ||
          'Failed to save draft'
      }
    )
    .addCase(
      fetchDrafts.pending,
      (state) => {
        state.isLoading = true
        state.error = null
      }
    )
    .addCase(
      fetchDrafts.fulfilled,
      (state, action) => {
        state.isLoading = false
        state.drafts = action.payload
      }
    )
    .addCase(
      fetchDrafts.rejected,
      (state, action) => {
        state.isLoading = false
        state.error =
          action.payload ||
          'Failed to fetch drafts'
        state.drafts = []
      }
    )
  buildSendExtraReducers(builder)
}
