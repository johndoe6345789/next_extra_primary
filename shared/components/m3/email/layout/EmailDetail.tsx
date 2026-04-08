import React from 'react'
import { Box, BoxProps } from '../..'
import { useAccessible } from '../../../../hooks/useAccessible'
import { EmailHeader } from '../data-display'
import { EmailDetailToolbar } from './EmailDetailToolbar'
import { EmailDetailReplyBar } from './EmailDetailReplyBar'

export interface EmailDetailEmail {
  id: string
  from: string
  to: string[]
  cc?: string[]
  subject: string
  body: string
  receivedAt: number
  isStarred: boolean
}

export interface EmailDetailProps
  extends BoxProps {
  email: EmailDetailEmail
  onClose?: () => void
  onArchive?: () => void
  onDelete?: () => void
  onReply?: () => void
  onForward?: () => void
  onToggleStar?: (starred: boolean) => void
  testId?: string
}

/**
 * Full email detail view with toolbar, header,
 * body, and reply bar.
 */
export const EmailDetail = ({
  email,
  onClose,
  onArchive,
  onDelete,
  onReply,
  onForward,
  onToggleStar,
  testId: customTestId,
  ...props
}: EmailDetailProps) => {
  const accessible = useAccessible({
    feature: 'email',
    component: 'email-detail',
    identifier: customTestId || 'detail',
  })

  return (
    <Box
      role="article"
      aria-label={email.subject}
      className="email-detail"
      {...accessible}
      {...props}
    >
      <EmailDetailToolbar
        onClose={onClose}
        onArchive={onArchive}
        onDelete={onDelete}
        onReply={onReply}
        onForward={onForward}
      />
      <EmailHeader
        from={email.from}
        to={email.to}
        cc={email.cc}
        subject={email.subject}
        receivedAt={email.receivedAt}
        isStarred={email.isStarred}
        onToggleStar={onToggleStar}
      />
      <Box
        id="email-detail-body"
        className="email-detail-body"
      >
        {email.body}
      </Box>
      <EmailDetailReplyBar
        onReply={onReply}
        onForward={onForward}
      />
    </Box>
  )
}
