'use client'

/**
 * Email detail page — displays a single
 * email message at /mail/[id].
 */

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { EmailDetail } from '@shared/m3/email'
import {
  Box, Typography,
} from '@shared/m3'
import {
  useEmailCtx,
} from '../../../hooks/EmailContext'

export default function EmailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { state, actions } = useEmailCtx()

  const email = state.emails.find(
    e => e.id === id,
  )

  if (!email) {
    return (
      <Box className="mailbox-empty-state">
        <span className={
          'material-symbols-outlined ' +
          'mailbox-empty-icon'
        }>
          email
        </span>
        <Typography variant="body2">
          Message not found
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="mailbox-detail-page">
      <EmailDetail
        email={email}
        onClose={() => router.back()}
        onArchive={() => {}}
        onDelete={() => {}}
        onReply={() =>
          actions.setShowCompose(true)
        }
        onForward={() =>
          actions.setShowCompose(true)
        }
        onToggleStar={(starred) =>
          actions.handleToggleStar(
            email.id, starred,
          )
        }
      />
    </Box>
  )
}
