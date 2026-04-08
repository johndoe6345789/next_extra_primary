import type React from 'react'

/** Props for the base Skeleton component. */
export interface SkeletonProps {
  /** Width (percentage or fixed value) */
  width?: string | number
  /** Height (percentage or fixed value) */
  height?: string | number
  /** Border radius for rounded corners */
  borderRadius?: string | number
  /** Whether to show animation */
  animate?: boolean
  /** CSS class name for custom styling */
  className?: string
  /** Custom style overrides */
  style?: React.CSSProperties
}

/** Props for TableSkeleton. */
export interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

/** Props for CardSkeleton. */
export interface CardSkeletonProps {
  count?: number
  className?: string
}

/** Props for ListSkeleton. */
export interface ListSkeletonProps {
  count?: number
  className?: string
}

/** Props for FormSkeleton. */
export interface FormSkeletonProps {
  fields?: number
  className?: string
}

/** Props for AvatarSkeleton. */
export interface AvatarSkeletonProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

/** Props for TextSkeleton. */
export interface TextSkeletonProps {
  lines?: number
  lastLineWidth?: string
  className?: string
}
