/**
 * Redux Slice for Email Compose/Draft
 * Assembles reducers from sub-modules
 */

import { createSlice } from '@reduxjs/toolkit'
import { composeInitialState } from './composeTypes'
import * as core from './composeReducers'
import * as attach from './composeAttachments'
import { buildComposeExtraReducers } from './composeExtraReducers'

export type {
  EmailDraft,
  ComposeDraftState,
} from './composeTypes'
export {
  saveDraftAsync,
  sendEmailAsync,
  fetchDrafts,
} from './composeThunks'
export {
  selectCurrentDraft,
  selectDrafts,
  selectIsLoading,
  selectIsSaving,
  selectError,
  selectSuccessMessage,
  selectDraftCount,
} from './composeSelectors'

export const emailComposeSlice = createSlice({
  name: 'emailCompose',
  initialState: composeInitialState,
  reducers: {
    createDraft: core.createDraft,
    updateDraft: core.updateDraft,
    updateDraftMultiple: core.updateDraftMultiple,
    addRecipient: core.addRecipient,
    removeRecipient: core.removeRecipient,
    addAttachment: attach.addAttachment,
    removeAttachment: attach.removeAttachment,
    setCurrentDraft: attach.setCurrentDraft,
    clearDraft: attach.clearDraft,
    deleteDraft: attach.deleteDraft,
    clearError: attach.clearError,
    clearSuccessMessage: attach.clearSuccessMessage,
  },
  extraReducers: buildComposeExtraReducers,
})

export const {
  createDraft,
  updateDraft,
  updateDraftMultiple,
  addRecipient,
  removeRecipient,
  addAttachment,
  removeAttachment,
  setCurrentDraft,
  clearDraft,
  deleteDraft,
  clearError,
  clearSuccessMessage,
} = emailComposeSlice.actions

export default emailComposeSlice.reducer
