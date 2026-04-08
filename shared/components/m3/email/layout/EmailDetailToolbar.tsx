import React from 'react'
import { Box, IconButton } from '../..'
import { MaterialIcon }
  from '../../../../icons/react/m3'
import { EmailDetailActions }
  from './EmailDetailActions'

/** Props for EmailDetailToolbar. */
export interface EmailDetailToolbarProps {
  onClose?: () => void
  onArchive?: () => void
  onDelete?: () => void
  onReply?: () => void
  onForward?: () => void
}

/**
 * Toolbar with action buttons for email
 * detail view (back, archive, delete, etc).
 */
export const EmailDetailToolbar = ({
  onClose, onArchive, onDelete,
  onReply, onForward,
}: EmailDetailToolbarProps) => (
  <Box id="email-detail-toolbar"
    className="email-detail-toolbar">
    {onClose && (
      <IconButton
        aria-label="Back to list"
        data-testid="email-back"
        onClick={onClose}>
        <MaterialIcon name="arrow_back"
          size={20} />
      </IconButton>
    )}
    <Box className="email-detail-actions">
      <EmailDetailActions
        onArchive={onArchive}
        onDelete={onDelete}
        onReply={onReply}
        onForward={onForward} />
    </Box>
  </Box>
)
