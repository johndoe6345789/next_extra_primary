/**
 * Redux Slice for Email List
 * Reducers for message list management
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { listInitialState } from './listTypes'
import { fetchMessages } from './listThunks'

export type { EmailMessage, PaginationState, EmailListState } from './listTypes'
export { fetchMessages } from './listThunks'
export {
  selectMessages, selectSelectedMessageId,
  selectFilter, selectSearchQuery,
  selectPagination, selectIsLoading,
  selectError, selectSelectedMessage,
} from './listSelectors'

export const emailListSlice = createSlice({
  name: 'emailList',
  initialState: listInitialState,
  reducers: {
    setSelectedMessage: (s, a: PayloadAction<string | null>) => {
      s.selectedMessageId = a.payload
    },
    setFilter: (s, a: PayloadAction<'all' | 'unread' | 'starred' | 'spam' | 'custom'>) => {
      s.filter = a.payload
      s.pagination.currentPage = 1
    },
    setSearchQuery: (s, a: PayloadAction<string>) => {
      s.searchQuery = a.payload
      s.pagination.currentPage = 1
    },
    clearSearchQuery: (s) => {
      s.searchQuery = ''
      s.pagination.currentPage = 1
    },
    setCurrentPage: (s, a: PayloadAction<number>) => {
      s.pagination.currentPage = a.payload
    },
    setPageSize: (s, a: PayloadAction<number>) => {
      s.pagination.pageSize = a.payload
      s.pagination.currentPage = 1
    },
    toggleMessageRead: (s, a: PayloadAction<string>) => {
      const msg = s.messages.find((m) => m.id === a.payload)
      if (msg) msg.isRead = !msg.isRead
    },
    toggleMessageStarred: (s, a: PayloadAction<string>) => {
      const msg = s.messages.find((m) => m.id === a.payload)
      if (msg) msg.isStarred = !msg.isStarred
    },
    removeMessage: (s, a: PayloadAction<string>) => {
      s.messages = s.messages.filter((m) => m.id !== a.payload)
      if (s.selectedMessageId === a.payload) s.selectedMessageId = null
    },
    clearMessages: (s) => { s.messages = []; s.selectedMessageId = null },
    clearError: (s) => { s.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (s) => { s.isLoading = true; s.error = null })
      .addCase(fetchMessages.fulfilled, (s, a) => {
        s.isLoading = false; s.messages = a.payload.messages
        s.pagination.totalMessages = a.payload.total
      })
      .addCase(fetchMessages.rejected, (s, a) => {
        s.isLoading = false; s.error = a.payload || 'Failed to fetch messages'; s.messages = []
      })
  },
})

export const {
  setSelectedMessage, setFilter, setSearchQuery,
  clearSearchQuery, setCurrentPage, setPageSize,
  toggleMessageRead, toggleMessageStarred,
  removeMessage, clearMessages, clearError,
} = emailListSlice.actions

export default emailListSlice.reducer
