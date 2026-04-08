/**
 * Status Indicator Components
 *
 * Generic components for displaying connection
 * and backend status.
 */

export type {
  StatusVariant,
  BackendStatusType,
  StatusBadgeProps,
  ConnectionStatusProps,
  BackendStatusProps,
} from './types'

export { StatusBadge } from './StatusBadge'
export { ConnectionStatus } from './ConnectionStatus'
export { BackendStatus } from './BackendStatus'

/** CSS keyframes for status animations. */
export const statusIndicatorStyles = `
@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes status-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  [data-testid="status-badge"] span {
    animation: none;
  }
}
`

export default StatusBadge
