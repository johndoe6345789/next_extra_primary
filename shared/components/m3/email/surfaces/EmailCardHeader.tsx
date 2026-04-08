import React from 'react'
import { Box, Typography } from '../..'
import { MarkAsReadCheckbox, StarButton }
  from '../atoms'

export interface EmailCardHeaderProps {
  from: string
  isRead: boolean
  isStarred: boolean
  displayDate: string
  isoDate: string
  onToggleRead?: (read: boolean) => void
  onToggleStar?: (starred: boolean) => void
}

/**
 * Header row of an email card showing read
 * status, sender, star, and date.
 */
export const EmailCardHeader = ({
  from, isRead, isStarred,
  displayDate, isoDate,
  onToggleRead, onToggleStar,
}: EmailCardHeaderProps) => (
  <Box className="email-card-header">
    <MarkAsReadCheckbox isRead={isRead}
      onToggleRead={onToggleRead}
      onClick={(e) => e.stopPropagation()} />
    <Typography variant="subtitle2"
      className="email-from">
      {from}
    </Typography>
    <div className="email-card-actions">
      <StarButton isStarred={isStarred}
        onToggleStar={onToggleStar}
        onClick={(e) =>
          e.stopPropagation()} />
      <time dateTime={isoDate}>
        <Typography variant="caption"
          className="email-date">
          {displayDate}
        </Typography>
      </time>
    </div>
  </Box>
)
