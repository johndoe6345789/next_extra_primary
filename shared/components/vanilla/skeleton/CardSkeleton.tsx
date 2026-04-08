'use client'

import { createElement } from 'react'
import { Skeleton } from './Skeleton'
import type { CardSkeletonProps } from './types'

/** Card skeleton layout. */
export function CardSkeleton({
  count = 3, className,
}: CardSkeletonProps) {
  return createElement('div', {
    className:
      `card-skeleton-grid ${className ?? ''}`,
    style: {
      display: 'grid',
      gridTemplateColumns:
        'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px',
    },
  },
    Array.from({ length: count }).map((_, i) =>
      createElement('div', {
        key: i,
        style: {
          padding: '16px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
        },
      },
        createElement(Skeleton, {
          width: '40%', height: '24px',
          style: { marginBottom: '12px' },
        }),
        createElement(Skeleton, {
          width: '100%', height: '16px',
          style: { marginBottom: '8px' },
        }),
        createElement(Skeleton, {
          width: '85%', height: '16px',
          style: { marginBottom: '16px' },
        }),
        createElement(Skeleton, {
          width: '60%', height: '36px',
          borderRadius: '4px',
        }),
      ),
    ),
  )
}
