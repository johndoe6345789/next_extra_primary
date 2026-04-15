'use client'

/**
 * Folder page — displays emails for a
 * specific folder (inbox, starred, etc).
 */

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ThreadList } from '@shared/m3/email'
import { Box, Typography } from '@shared/m3'
import {
  useEmailCtx,
} from '../../../hooks/EmailContext'

export default function FolderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { state, actions } = useEmailCtx()

  // Sync folder state with URL
  useEffect(() => {
    actions.handleNavigateFolder(id)
  }, [id, actions])

  const handleSelect = (emailId: string) => {
    router.push(`/mail/${emailId}`)
  }

  const label = id
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())

  return (
    <Box className="mailbox-thread-panel">
      <Box className="mailbox-thread-toolbar">
        <Typography
          variant="body2"
          className={
            'mailbox-thread-folder-label'
          }
        >
          {label}
          {state.filteredEmails.length > 0 &&
            ` (${state.filteredEmails.length})`}
        </Typography>
        <Typography
          variant="caption"
          className={
            'mailbox-thread-unread-label'
          }
        >
          {state.unreadCount} unread
        </Typography>
      </Box>
      {state.filteredEmails.length === 0 ? (
        <Box className="mailbox-empty-state">
          <span className={
            'material-symbols-outlined ' +
            'mailbox-empty-icon'
          }>
            {id === 'inbox'
              ? 'inbox' : 'folder_open'}
          </span>
          <Typography variant="body2">
            No messages in {label}
          </Typography>
        </Box>
      ) : (
        <ThreadList
          emails={state.filteredEmails}
          onSelectEmail={handleSelect}
          onToggleRead={
            actions.handleToggleRead
          }
          onToggleStar={
            actions.handleToggleStar
          }
        />
      )}
    </Box>
  )
}
