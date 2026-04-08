import type React from 'react'

/** Visual variant for status badges. */
export type StatusVariant =
  | 'success' | 'error' | 'warning' | 'info' | 'neutral'

/** Backend connection state. */
export type BackendStatusType =
  | 'connected' | 'disconnected' | 'connecting' | 'error'

/** Props for the StatusBadge component. */
export interface StatusBadgeProps {
  /** Visual variant */
  variant: StatusVariant
  /** Label text */
  label: string
  /** Optional icon (renders before label) */
  icon?: React.ReactNode
  /** Show pulsing dot indicator */
  showDot?: boolean
  /** Additional className */
  className?: string
  /** Tooltip text */
  tooltip?: string
}

/** Props for the ConnectionStatus component. */
export interface ConnectionStatusProps {
  /** Whether connected */
  isConnected: boolean
  /** Label for connected state */
  connectedLabel?: string
  /** Label for disconnected state */
  disconnectedLabel?: string
  /** Show icon */
  showIcon?: boolean
  /** Additional className */
  className?: string
}

/** Props for the BackendStatus component. */
export interface BackendStatusProps {
  /** Current status */
  status: BackendStatusType
  /** Backend name/label */
  label?: string
  /** Show pulsing activity dot */
  showDot?: boolean
  /** Tooltip for connected state */
  connectedTooltip?: string
  /** Tooltip for disconnected state */
  disconnectedTooltip?: string
  /** Additional className */
  className?: string
}
