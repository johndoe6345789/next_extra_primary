/**
 * Email List Selectors
 * State selectors for email list
 */

import type { EmailListState } from './listTypes'

type Root = { emailList: EmailListState }

/** @brief Select all messages */
export const selectMessages = (s: Root) =>
  s.emailList.messages

/** @brief Select selected message ID */
export const selectSelectedMessageId = (
  s: Root
) => s.emailList.selectedMessageId

/** @brief Select current filter */
export const selectFilter = (s: Root) =>
  s.emailList.filter

/** @brief Select search query */
export const selectSearchQuery = (s: Root) =>
  s.emailList.searchQuery

/** @brief Select pagination state */
export const selectPagination = (s: Root) =>
  s.emailList.pagination

/** @brief Select loading state */
export const selectIsLoading = (s: Root) =>
  s.emailList.isLoading

/** @brief Select error message */
export const selectError = (s: Root) =>
  s.emailList.error

/** @brief Select the full selected message */
export const selectSelectedMessage = (
  s: Root
) => {
  if (!s.emailList.selectedMessageId) return null
  return (
    s.emailList.messages.find(
      (m) =>
        m.id === s.emailList.selectedMessageId
    ) || null
  )
}
