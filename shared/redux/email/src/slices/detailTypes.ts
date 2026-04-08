/**
 * Email Detail Types
 * Types for email detail and thread view
 */

/** @brief Full email detail */
export interface EmailDetail {
  id: string
  from: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  textBody?: string
  htmlBody?: string
  receivedAt: number
  isRead: boolean
  isStarred: boolean
  attachments?: Array<{
    id: string
    filename: string
    mimeType: string
    size: number
    downloadUrl?: string
  }>
  conversationId?: string
  replyTo?: string
}

/** @brief Thread message extends detail */
export interface ThreadMessage
  extends EmailDetail {
  isReply: boolean
}

/** @brief Email detail Redux state */
export interface EmailDetailState {
  selectedEmail: EmailDetail | null
  threadMessages: ThreadMessage[]
  isLoading: boolean
  error: string | null
}

/** @brief Initial detail state */
export const detailInitialState: EmailDetailState = {
  selectedEmail: null,
  threadMessages: [],
  isLoading: false,
  error: null,
}
