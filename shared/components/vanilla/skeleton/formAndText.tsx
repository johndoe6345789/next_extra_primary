'use client'

import { createElement } from 'react'
import { Skeleton } from './Skeleton'
import type {
  FormSkeletonProps,
  AvatarSkeletonProps,
  TextSkeletonProps,
} from './types'

/** Form skeleton for loading form states. */
export function FormSkeleton({
  fields = 4, className,
}: FormSkeletonProps) {
  return createElement('div', {
    className: `form-skeleton ${className ?? ''}`,
  },
    Array.from({ length: fields }).map((_, i) =>
      createElement('div', {
        key: i,
        style: { marginBottom: '20px' },
      },
        createElement(Skeleton, {
          width: '30%', height: '14px',
          style: { marginBottom: '8px' },
        }),
        createElement(Skeleton, {
          width: '100%', height: '40px',
          borderRadius: '4px',
        }),
      ),
    ),
    createElement('div', {
      style: {
        display: 'flex', gap: '12px',
        marginTop: '24px',
      },
    },
      createElement(Skeleton, {
        width: '100px', height: '40px',
        borderRadius: '4px',
      }),
      createElement(Skeleton, {
        width: '80px', height: '40px',
        borderRadius: '4px',
      }),
    ),
  )
}

/** Avatar skeleton. */
export function AvatarSkeleton({
  size = 'medium', className,
}: AvatarSkeletonProps) {
  const sizeMap = {
    small: '32px', medium: '48px', large: '80px',
  }

  return createElement(Skeleton, {
    width: sizeMap[size],
    height: sizeMap[size],
    borderRadius: '50%',
    className,
  })
}

/** Text skeleton with multiple lines. */
export function TextSkeleton({
  lines = 3,
  lastLineWidth = '60%',
  className,
}: TextSkeletonProps) {
  return createElement('div', {
    className: `text-skeleton ${className ?? ''}`,
  },
    Array.from({ length: lines }).map((_, i) =>
      createElement(Skeleton, {
        key: i,
        width: i === lines - 1
          ? lastLineWidth : '100%',
        height: '16px',
        style: {
          marginBottom:
            i < lines - 1 ? '8px' : undefined,
        },
      }),
    ),
  )
}
