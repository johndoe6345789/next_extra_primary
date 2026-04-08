'use client'

/**
 * Skeleton Components for Loading States
 *
 * Animated placeholder content while data loads.
 */

export type {
  SkeletonProps,
  TableSkeletonProps,
  CardSkeletonProps,
  ListSkeletonProps,
  FormSkeletonProps,
  AvatarSkeletonProps,
  TextSkeletonProps,
} from './types'

export { Skeleton } from './Skeleton'
export {
  TableSkeleton,
  CardSkeleton,
  ListSkeleton,
} from './composites'
export {
  FormSkeleton,
  AvatarSkeleton,
  TextSkeleton,
} from './formAndText'

/** CSS keyframes for skeleton animations. */
export const skeletonStyles = `
@keyframes skeleton-pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
.skeleton-animate {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .skeleton-animate {
    animation: none;
  }
}
`
