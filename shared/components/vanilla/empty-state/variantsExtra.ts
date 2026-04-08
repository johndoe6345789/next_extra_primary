'use client'

import { createElement } from 'react'
import { EmptyState } from './EmptyState'
import type { EmptyStateProps } from './types'

type VariantProps = Omit<
  EmptyStateProps,
  'title' | 'description' | 'icon'
> & {
  title?: string
  description?: string
  hint?: string
}

/** Empty state for generic errors. */
export function ErrorState(p: VariantProps) {
  return createElement(EmptyState, {
    icon: '\u26A0\uFE0F',
    title: p.title ?? 'Something went wrong',
    description:
      p.description ??
      'An error occurred while loading this content.',
    hint:
      p.hint ??
      'Please try again later or contact support.',
    ...p,
  })
}

/** Empty state for connection failures. */
export function NoConnectionState(p: VariantProps) {
  return createElement(EmptyState, {
    icon: '\uD83D\uDCE1',
    title: p.title ?? 'Connection failed',
    description:
      p.description ??
      'Unable to connect to the server.',
    hint:
      p.hint ??
      'Check your internet connection and try again.',
    ...p,
  })
}

/** Empty state for completed actions. */
export function LoadingCompleteState(p: VariantProps) {
  return createElement(EmptyState, {
    icon: '\u2705',
    title: p.title ?? 'All done!',
    description:
      p.description ??
      'Your request has been processed successfully.',
    hint:
      p.hint ??
      'You can now close this dialog or perform another action.',
    ...p,
  })
}
