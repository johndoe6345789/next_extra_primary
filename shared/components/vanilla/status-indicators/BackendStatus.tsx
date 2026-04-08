import React from 'react'
import type { BackendStatusProps } from './types'
import { StatusBadge } from './StatusBadge'
import { statusToVariant } from './statusStyles'
import {
  CloudIcon, CloudOffIcon,
  DatabaseIcon, SpinnerIcon,
} from './statusIcons'

/**
 * Backend status indicator with multiple states.
 */
export const BackendStatus: React.FC<
  BackendStatusProps
> = ({
  status,
  label,
  showDot = true,
  connectedTooltip = 'Connected to backend',
  disconnectedTooltip = 'Using local storage',
  className,
}) => {
  const variant = statusToVariant[status]

  const iconMap = {
    connected: <CloudIcon />,
    disconnected: <DatabaseIcon />,
    connecting: <SpinnerIcon />,
    error: <CloudOffIcon />,
  }

  const labelMap = {
    connected: 'Connected',
    disconnected: 'Local',
    connecting: 'Connecting...',
    error: 'Error',
  }

  const tooltipMap = {
    connected: connectedTooltip,
    disconnected: disconnectedTooltip,
    connecting: 'Establishing connection...',
    error: 'Connection failed',
  }

  return (
    <StatusBadge
      variant={variant}
      label={label ?? labelMap[status]}
      icon={iconMap[status]}
      showDot={showDot && status === 'connected'}
      tooltip={tooltipMap[status]}
      className={className}
    />
  )
}
