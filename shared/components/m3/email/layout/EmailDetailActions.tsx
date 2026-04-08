import React from 'react'
import { IconButton } from '../..'
import { MaterialIcon }
  from '../../../../icons/react/m3'

/** Props for EmailDetailActions. */
export interface EmailDetailActionsProps {
  onArchive?: () => void
  onDelete?: () => void
  onReply?: () => void
  onForward?: () => void
}

/** Action buttons for email detail view. */
export const EmailDetailActions = ({
  onArchive, onDelete, onReply, onForward,
}: EmailDetailActionsProps) => (
  <>
    {onArchive && (
      <IconButton aria-label="Archive"
        title="Archive"
        data-testid="email-archive"
        onClick={onArchive}>
        <MaterialIcon name="archive"
          size={20} />
      </IconButton>
    )}
    {onDelete && (
      <IconButton aria-label="Delete"
        title="Delete"
        data-testid="email-delete"
        onClick={onDelete}>
        <MaterialIcon name="delete"
          size={20} />
      </IconButton>
    )}
    {onReply && (
      <IconButton aria-label="Reply"
        title="Reply"
        data-testid="email-reply"
        onClick={onReply}>
        <MaterialIcon name="reply"
          size={20} />
      </IconButton>
    )}
    {onForward && (
      <IconButton aria-label="Forward"
        title="Forward"
        data-testid="email-forward"
        onClick={onForward}>
        <MaterialIcon name="forward"
          size={20} />
      </IconButton>
    )}
  </>
)
