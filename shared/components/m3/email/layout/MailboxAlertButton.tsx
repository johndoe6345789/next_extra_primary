import React from 'react'
import { Box, IconButton } from '../..'
import { MaterialIcon }
  from '../../../../icons/react/m3'

export interface MailboxAlertButtonProps {
  onAlertsClick?: () => void
  alertCount: number
}

/**
 * Alert/notification button with badge count.
 */
export const MailboxAlertButton = ({
  onAlertsClick, alertCount,
}: MailboxAlertButtonProps) => {
  if (!onAlertsClick) return null
  return (
    <Box className="mailbox-header-alert-wrapper">
      <IconButton
        aria-label="Notifications"
        title="Notifications"
        onClick={onAlertsClick}
        className="mailbox-header-icon-btn"
      >
        <MaterialIcon
          name="notifications" size={20} />
      </IconButton>
      {alertCount > 0 && (
        <span className="mailbox-header-badge">
          {alertCount}
        </span>
      )}
    </Box>
  )
}
