/**
 * Vanilla component re-exports.
 * Pure React components with no external UI deps.
 */

export {
  LoadingIndicator,
  InlineLoader,
  AsyncLoading,
  loadingStyles,
  type LoadingIndicatorProps,
  type InlineLoaderProps,
  type AsyncLoadingProps,
} from './vanilla/loading'

export {
  ErrorBoundary,
  withErrorBoundary,
  ErrorDisplay,
  type ErrorBoundaryProps,
  type ErrorReporter,
  type ErrorDisplayProps,
} from './vanilla/error'

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
} from './vanilla/empty-state'

export {
  Skeleton,
  TableSkeleton,
  CardSkeleton,
  ListSkeleton,
  FormSkeleton,
  AvatarSkeleton,
  TextSkeleton,
  skeletonStyles,
  type SkeletonProps,
  type TableSkeletonProps,
  type CardSkeletonProps,
  type ListSkeletonProps,
  type FormSkeletonProps,
  type AvatarSkeletonProps,
  type TextSkeletonProps,
} from './vanilla/skeleton'

export {
  AccessDenied,
  accessDeniedStyles,
  type AccessDeniedProps,
} from './vanilla/access-denied'

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
} from './vanilla/notifications'

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
} from './vanilla/status-indicators'
