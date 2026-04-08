'use client'

import { createElement } from 'react'
import { Skeleton } from './Skeleton'
import type { ListSkeletonProps } from './types'

/** List item skeleton. */
export function ListSkeleton({
  count = 8, className,
}: ListSkeletonProps) {
  return createElement('div', {
    className:
      `list-skeleton ${className ?? ''}`,
  },
    Array.from({ length: count }).map((_, i) =>
      createElement('div', {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          padding: '12px',
          borderBottom: '1px solid #f0f0f0',
          gap: '12px',
        },
      },
        createElement(Skeleton, {
          width: '40px', height: '40px',
          borderRadius: '50%',
          style: { flexShrink: 0 },
        }),
        createElement('div', {
          style: { flex: 1 },
        },
          createElement(Skeleton, {
            width: '60%', height: '18px',
            style: { marginBottom: '6px' },
          }),
          createElement(Skeleton, {
            width: '85%', height: '14px',
          }),
        ),
      ),
    ),
  )
}
