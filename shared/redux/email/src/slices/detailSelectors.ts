/**
 * Email Detail Selectors
 * State selectors for email detail view
 */

import type {
  EmailDetailState,
} from './detailTypes'

type Root = { emailDetail: EmailDetailState }

/** @brief Select currently viewed email */
export const selectSelectedEmail = (s: Root) =>
  s.emailDetail.selectedEmail

/** @brief Select thread messages */
export const selectThreadMessages = (s: Root) =>
  s.emailDetail.threadMessages

/** @brief Select loading state */
export const selectIsLoading = (s: Root) =>
  s.emailDetail.isLoading

/** @brief Select error state */
export const selectError = (s: Root) =>
  s.emailDetail.error

/** @brief Select conversation thread */
export const selectConversationThread = (
  s: Root
) => s.emailDetail.threadMessages
