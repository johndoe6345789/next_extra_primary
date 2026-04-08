/**
 * Email List Types
 * Types for message list state management
 */

/** @brief Single email message in list */
export interface EmailMessage {
  id: string
  from: string
  subject: string
  preview: string
  receivedAt: number
  isRead: boolean
  isStarred: boolean
  attachmentCount: number
}

/** @brief Pagination state */
export interface PaginationState {
  currentPage: number
  pageSize: number
  totalMessages: number
}

/** @brief Email list Redux state */
export interface EmailListState {
  messages: EmailMessage[]
  selectedMessageId: string | null
  filter:
    | 'all'
    | 'unread'
    | 'starred'
    | 'spam'
    | 'custom'
  searchQuery: string
  pagination: PaginationState
  isLoading: boolean
  error: string | null
}

/** @brief Initial email list state */
export const listInitialState: EmailListState = {
  messages: [],
  selectedMessageId: null,
  filter: 'all',
  searchQuery: '',
  pagination: {
    currentPage: 1,
    pageSize: 20,
    totalMessages: 0,
  },
  isLoading: false,
  error: null,
}
