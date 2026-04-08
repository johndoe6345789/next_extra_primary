import type React from 'react'

/**
 * Props for the LoadingIndicator component.
 */
export interface LoadingIndicatorProps {
  /** Whether to show the loading indicator */
  show?: boolean
  /** Loading message to display */
  message?: string
  /** Variant style */
  variant?: 'spinner' | 'bar' | 'dots' | 'pulse'
  /** Size of the indicator */
  size?: 'small' | 'medium' | 'large'
  /** Whether to show full page overlay */
  fullPage?: boolean
  /** CSS class name for custom styling */
  className?: string
  /** Custom style overrides */
  style?: React.CSSProperties
}

/**
 * Props for the InlineLoader component.
 */
export interface InlineLoaderProps {
  /** Whether the loader is active */
  loading?: boolean
  /** Size variant */
  size?: 'small' | 'medium'
  /** Custom style overrides */
  style?: React.CSSProperties
}

/**
 * Props for the AsyncLoading component.
 */
export interface AsyncLoadingProps {
  /** Whether data is loading */
  isLoading: boolean
  /** Error that occurred, if any */
  error?: Error | string | null
  /** Content to render when loaded */
  children: React.ReactNode
  /** Custom skeleton to show while loading */
  skeletonComponent?: React.ReactNode
  /** Custom error component */
  errorComponent?: React.ReactNode
  /** Message to show while loading */
  loadingMessage?: string
}
