/**
 * Additional Vanilla exports: empty states,
 * notifications, and status indicators.
 */

// Empty state components
export {
  EmptyState,
  NoDataFound,
  NoResultsFound,
  NoItemsYet,
  AccessDeniedState,
  ErrorState,
  NoConnectionState,
  LoadingCompleteState,
  emptyStateStyles,
  type EmptyStateProps,
} from './empty-state'

// Notification components
export {
  NotificationContainer,
  NotificationItem,
  useNotificationState,
  notificationStyles,
  type NotificationData,
  type NotificationType,
  type NotificationPosition,
  type NotificationContainerProps,
  type NotificationItemProps,
} from './notifications'

// Status indicator components
export {
  StatusBadge,
  ConnectionStatus,
  BackendStatus,
  statusIndicatorStyles,
  type StatusVariant,
  type BackendStatusType,
  type StatusBadgeProps,
  type ConnectionStatusProps,
  type BackendStatusProps,
} from './status-indicators'
