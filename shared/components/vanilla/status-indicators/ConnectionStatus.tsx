import React from 'react'
import type { ConnectionStatusProps } from './types'
import { StatusBadge } from './StatusBadge'
import { CloudIcon, CloudOffIcon } from './statusIcons'

/**
 * Simple connected/disconnected status indicator.
 */
export const ConnectionStatus: React.FC<
  ConnectionStatusProps
> = ({
  isConnected,
  connectedLabel = 'Connected',
  disconnectedLabel = 'Disconnected',
  showIcon = true,
  className,
}) => {
  const icon = showIcon
    ? (isConnected ? <CloudIcon /> : <CloudOffIcon />)
    : undefined

  return (
    <StatusBadge
      variant={isConnected ? 'success' : 'neutral'}
      label={
        isConnected ? connectedLabel : disconnectedLabel
      }
      icon={icon}
      showDot={isConnected}
      className={className}
    />
  )
}
