/**
 * Default mailbox folder data
 */

import type { Folder } from './mailboxesTypes'

/** Default folder structure */
export const DEFAULT_FOLDERS: Folder[] = [
  {
    id: 'inbox',
    name: 'Inbox',
    type: 'inbox',
    unreadCount: 0,
    totalCount: 0,
  },
  {
    id: 'sent',
    name: 'Sent',
    type: 'sent',
    unreadCount: 0,
    totalCount: 0,
  },
  {
    id: 'drafts',
    name: 'Drafts',
    type: 'drafts',
    unreadCount: 0,
    totalCount: 0,
  },
  {
    id: 'trash',
    name: 'Trash',
    type: 'trash',
    unreadCount: 0,
    totalCount: 0,
  },
  {
    id: 'spam',
    name: 'Spam',
    type: 'spam',
    unreadCount: 0,
    totalCount: 0,
  },
]
