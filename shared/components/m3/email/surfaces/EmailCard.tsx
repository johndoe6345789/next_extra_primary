import React from 'react'
import { Card, CardProps, Typography }
  from '../..'
import { useAccessible }
  from '../../../../hooks/useAccessible'
import {
  formatEmailDate, getIsoDate,
} from './emailCardUtils'
import { EmailCardHeader }
  from './EmailCardHeader'

export interface EmailCardProps
  extends CardProps {
  from: string
  subject: string
  preview: string
  receivedAt: number
  isRead: boolean
  isStarred?: boolean
  selected?: boolean
  onSelect?: () => void
  onToggleRead?: (read: boolean) => void
  onToggleStar?: (starred: boolean) => void
  testId?: string
}

/**
 * Card displaying an email summary in a list.
 */
export const EmailCard = ({
  from, subject, preview, receivedAt,
  isRead, isStarred = false, selected,
  onSelect, onToggleRead, onToggleStar,
  testId: customTestId, ...props
}: EmailCardProps) => {
  const accessible = useAccessible({
    feature: 'email', component: 'card',
    identifier:
      customTestId || subject.substring(0, 20),
  })
  const displayDate =
    formatEmailDate(receivedAt)
  const isoDate = getIsoDate(receivedAt)
  const handleKeyDown = (
    e: React.KeyboardEvent
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.()
    }
  }
  const readClass = isRead
    ? 'email-card--read'
    : 'email-card--unread'
  return (
    <Card role="article"
      aria-label={
        `Email from ${from}: ${subject}`}
      aria-current={
        selected ? 'true' : undefined}
      tabIndex={0}
      className={`email-card ${readClass}`}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      {...accessible} {...props}>
      <EmailCardHeader from={from}
        isRead={isRead} isStarred={isStarred}
        displayDate={displayDate}
        isoDate={isoDate}
        onToggleRead={onToggleRead}
        onToggleStar={onToggleStar} />
      <Typography variant="h6"
        className="email-subject">
        {subject}
      </Typography>
      <Typography variant="body2"
        className="email-preview" noWrap>
        {preview}
      </Typography>
    </Card>
  )
}
