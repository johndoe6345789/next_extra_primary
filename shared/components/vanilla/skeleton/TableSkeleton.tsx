'use client'

import { createElement } from 'react'
import { Skeleton } from './Skeleton'
import type { TableSkeletonProps } from './types'

/** Table skeleton with rows and columns. */
export function TableSkeleton({
  rows = 5, columns = 4, className,
}: TableSkeletonProps) {
  return createElement('div', {
    className:
      `table-skeleton ${className ?? ''}`,
  },
    createElement('table', {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
      },
    },
      createElement('thead', null,
        createElement('tr', {
          style: {
            borderBottom: '1px solid #e0e0e0',
          },
        },
          Array.from({ length: columns }).map(
            (_, i) => createElement('th', {
              key: i,
              style: {
                padding: '12px',
                textAlign: 'left',
              },
            },
              createElement(Skeleton, {
                width: '80%', height: '20px',
              }),
            ),
          ),
        ),
      ),
      createElement('tbody', null,
        Array.from({ length: rows }).map(
          (_, r) => createElement('tr', {
            key: r,
            style: {
              borderBottom:
                '1px solid #f0f0f0',
            },
          },
            Array.from({ length: columns }).map(
              (_, c) => createElement('td', {
                key: c,
                style: { padding: '12px' },
              },
                createElement(Skeleton, {
                  width:
                    c === 0 ? '60%' : '90%',
                  height: '20px',
                }),
              ),
            ),
          ),
        ),
      ),
    ),
  )
}
