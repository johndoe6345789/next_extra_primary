'use client'

import { createElement } from 'react'
import type { SkeletonProps } from './types'

/**
 * Single skeleton line/block placeholder.
 *
 * @param props - Component props.
 */
export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  animate = true,
  className,
  style,
}: SkeletonProps) {
  const w = typeof width === 'number'
    ? `${width}px` : width
  const h = typeof height === 'number'
    ? `${height}px` : height
  const r = typeof borderRadius === 'number'
    ? `${borderRadius}px` : borderRadius

  return createElement('div', {
    className:
      `skeleton ${animate ? 'skeleton-animate' : ''} ${className ?? ''}`,
    style: {
      width: w,
      height: h,
      borderRadius: r,
      backgroundColor: '#e0e0e0',
      animation: animate
        ? 'skeleton-pulse 1.5s ease-in-out infinite'
        : undefined,
      ...style,
    },
  })
}
