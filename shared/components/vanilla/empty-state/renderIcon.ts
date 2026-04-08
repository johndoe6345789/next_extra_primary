import React, { createElement } from 'react'
import type { SizeConfig } from './types'

/**
 * Render the icon portion of an EmptyState.
 *
 * @param icon - Emoji string or React node.
 * @param current - Size config for the variant.
 * @param size - Size variant name.
 * @returns A React element or null.
 */
export function renderIcon(
  icon: React.ReactNode | string | undefined,
  current: SizeConfig,
  size: string,
): React.ReactElement | null {
  if (!icon) return null

  const mb = size === 'compact' ? '8px' : '16px'

  if (typeof icon === 'string') {
    return createElement('div', {
      className: 'empty-state-icon',
      style: { fontSize: current.iconSize, marginBottom: mb },
      role: 'img',
      'aria-hidden': 'true',
    }, icon)
  }

  if (React.isValidElement(icon)) {
    return createElement('div', {
      className: 'empty-state-icon',
      style: { marginBottom: mb },
    }, icon)
  }

  return null
}
