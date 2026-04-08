import React from 'react'
import { Box, Button } from '../..'
import { MaterialIcon } from '../../../../icons/react/m3'

export interface EmailDetailReplyBarProps {
  onReply?: () => void
  onForward?: () => void
}

/**
 * Reply/forward action bar at the bottom of
 * the email detail view.
 */
export const EmailDetailReplyBar = ({
  onReply,
  onForward,
}: EmailDetailReplyBarProps) => (
  <Box
    id="email-detail-reply-bar"
    className="email-detail-reply-bar"
  >
    {onReply && (
      <Button
        variant="outlined"
        data-testid="email-reply-btn"
        onClick={onReply}
      >
        <MaterialIcon name="reply" size={16} />
        Reply
      </Button>
    )}
    {onForward && (
      <Button
        variant="outlined"
        data-testid="email-forward-btn"
        onClick={onForward}
      >
        <MaterialIcon
          name="forward"
          size={16}
        />
        Forward
      </Button>
    )}
  </Box>
)
