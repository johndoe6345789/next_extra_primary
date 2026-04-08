/**
 * Redux Slice for Email Detail/Thread
 * Reducers for selected email and thread
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { EmailDetail, ThreadMessage } from './detailTypes'
import { detailInitialState } from './detailTypes'
import { fetchEmailDetail, fetchConversationThread } from './detailThunks'

export type { EmailDetail, ThreadMessage, EmailDetailState } from './detailTypes'
export { fetchEmailDetail, fetchConversationThread } from './detailThunks'
export {
  selectSelectedEmail, selectThreadMessages,
  selectIsLoading, selectError,
  selectConversationThread,
} from './detailSelectors'

export const emailDetailSlice = createSlice({
  name: 'emailDetail',
  initialState: detailInitialState,
  reducers: {
    setSelectedEmail: (s, a: PayloadAction<EmailDetail | null>) => { s.selectedEmail = a.payload },
    addToThread: (s, a: PayloadAction<ThreadMessage>) => { s.threadMessages.push(a.payload) },
    clearThread: (s) => { s.threadMessages = [] },
    setEmailRead: (s, a: PayloadAction<boolean>) => {
      if (s.selectedEmail) s.selectedEmail.isRead = a.payload
    },
    setEmailStarred: (s, a: PayloadAction<boolean>) => {
      if (s.selectedEmail) s.selectedEmail.isStarred = a.payload
    },
    clearEmailDetail: (s) => { s.selectedEmail = null; s.threadMessages = [] },
    clearError: (s) => { s.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmailDetail.pending, (s) => { s.isLoading = true; s.error = null })
      .addCase(fetchEmailDetail.fulfilled, (s, a) => { s.isLoading = false; s.selectedEmail = a.payload })
      .addCase(fetchEmailDetail.rejected, (s, a) => {
        s.isLoading = false; s.error = a.payload || 'Failed to fetch email details'; s.selectedEmail = null
      })
      .addCase(fetchConversationThread.pending, (s) => { s.isLoading = true; s.error = null })
      .addCase(fetchConversationThread.fulfilled, (s, a) => { s.isLoading = false; s.threadMessages = a.payload })
      .addCase(fetchConversationThread.rejected, (s, a) => {
        s.isLoading = false; s.error = a.payload || 'Failed to fetch conversation thread'; s.threadMessages = []
      })
  },
})

export const {
  setSelectedEmail, addToThread, clearThread,
  setEmailRead, setEmailStarred,
  clearEmailDetail, clearError,
} = emailDetailSlice.actions

export default emailDetailSlice.reducer
