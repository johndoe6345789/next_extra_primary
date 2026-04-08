/**
 * Email Compose Selectors
 * Selectors for compose/draft state
 */

import type { ComposeDraftState } from './composeTypes'

type RootWithCompose = {
  emailCompose: ComposeDraftState
}

/** @brief Select current draft */
export const selectCurrentDraft = (
  state: RootWithCompose
) => state.emailCompose.currentDraft

/** @brief Select all drafts */
export const selectDrafts = (
  state: RootWithCompose
) => state.emailCompose.drafts

/** @brief Select loading state */
export const selectIsLoading = (
  state: RootWithCompose
) => state.emailCompose.isLoading

/** @brief Select saving state */
export const selectIsSaving = (
  state: RootWithCompose
) => state.emailCompose.isSaving

/** @brief Select error message */
export const selectError = (
  state: RootWithCompose
) => state.emailCompose.error

/** @brief Select success message */
export const selectSuccessMessage = (
  state: RootWithCompose
) => state.emailCompose.successMessage

/** @brief Select draft count */
export const selectDraftCount = (
  state: RootWithCompose
) => state.emailCompose.drafts.length
