/**
 * Types for useMessages hook
 */

/** Email message */
export interface Message {
  id: string
  messageId: string
  from: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  replyTo?: string
  subject: string
  textBody?: string
  htmlBody?: string
  headers?: Record<string, string>
  receivedAt: number
  isRead: boolean
  isStarred: boolean
  isSpam: boolean
  isDraft: boolean
  isSent: boolean
  isDeleted: boolean
  attachmentCount: number
  conversationId?: string
  labels?: string[]
  size?: number
  createdAt: number
  updatedAt: number
}

/** Return type of useMessages */
export interface UseMessagesResult {
  /** List of messages */
  messages: Message[]
  /** Whether messages are being loaded */
  loading: boolean
  /** Error loading messages */
  error: Error | null
  /** Mark message as read/unread */
  markRead: (
    id: string,
    isRead: boolean
  ) => Promise<void>
  /** Mark message as spam */
  markSpam: (
    id: string,
    isSpam: boolean
  ) => Promise<void>
  /** Delete message (soft delete) */
  delete: (id: string) => Promise<void>
  /** Star/unstar message */
  toggleStar: (
    id: string,
    isStarred: boolean
  ) => Promise<void>
  /** Refresh message list */
  refresh: (folderId?: string) => Promise<void>
}

/** Internal state shape */
export interface MessageState {
  messages: Message[]
  loading: boolean
  error: Error | null
}
