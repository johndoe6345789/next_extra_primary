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

/** Empty state for no data found. */
export function NoDataFound(p: VariantProps) {
  return createElement(EmptyState, {
    icon: '\uD83D\uDD0D',
    title: p.title ?? 'No data found',
    description:
      p.description ?? 'There is no data to display.',
    hint:
      p.hint ??
      'Try adjusting your filters or search criteria.',
    ...p,
  })
}

/** Empty state for no search results. */
export function NoResultsFound(p: VariantProps) {
  return createElement(EmptyState, {
    icon: '\u274C',
    title: p.title ?? 'No results found',
    description:
      p.description ??
      'Your search did not return any results.',
    hint:
      p.hint ??
      'Try using different keywords or check your spelling.',
    ...p,
  })
}

/** Empty state for empty collections. */
export function NoItemsYet(p: VariantProps) {
  return createElement(EmptyState, {
    icon: '\u2728',
    title: p.title ?? 'No items yet',
    description:
      p.description ??
      'Get started by creating your first item.',
    hint:
      p.hint ?? 'Click the button below to create one.',
    ...p,
  })
}

/** Empty state for access denied. */
export function AccessDeniedState(p: VariantProps) {
  return createElement(EmptyState, {
    icon: '\uD83D\uDD12',
    title: p.title ?? 'Access denied',
    description:
      p.description ??
      'You do not have permission to view this content.',
    hint:
      p.hint ??
      'Contact your administrator for access.',
    ...p,
  })
}
