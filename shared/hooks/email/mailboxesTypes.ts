/**
 * Types for useMailboxes hook
 */

/** Email folder/mailbox structure */
export interface Folder {
  id: string
  name: string
  type:
    | 'inbox'
    | 'sent'
    | 'drafts'
    | 'trash'
    | 'spam'
    | 'archive'
    | 'custom'
  unreadCount: number
  totalCount: number
  children?: Folder[]
}

/** Return type of useMailboxes */
export interface UseMailboxesResult {
  /** Folder hierarchy */
  folders: Folder[]
  /** Whether folders are loading */
  loading: boolean
  /** Error loading folders */
  error: Error | null
  /** Refresh folder list */
  refresh: () => Promise<void>
  /** Update unread count */
  updateUnreadCount: (
    folderId: string,
    count: number
  ) => void
}

/** Internal state */
export interface MailboxState {
  folders: Folder[]
  loading: boolean
  error: Error | null
}
