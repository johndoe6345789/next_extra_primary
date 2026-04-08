/**
 * Vanilla React Components
 *
 * Pure React components with no external UI
 * library dependencies. These use only React
 * and inline styles.
 */

// Loading components
export {
  LoadingIndicator,
  InlineLoader,
  AsyncLoading,
  loadingStyles,
  type LoadingIndicatorProps,
  type InlineLoaderProps,
  type AsyncLoadingProps,
} from './loading'

// Error handling components
export {
  ErrorBoundary,
  withErrorBoundary,
  ErrorDisplay,
  type ErrorBoundaryProps,
  type ErrorReporter,
  type ErrorDisplayProps,
} from './error'

// Skeleton components
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
} from './skeleton'

// Access denied component
export {
  AccessDenied,
  accessDeniedStyles,
  type AccessDeniedProps,
} from './access-denied'

// Re-export additional modules
export * from './vanillaExports'
