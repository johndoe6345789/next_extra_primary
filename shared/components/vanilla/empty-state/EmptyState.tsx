'use client'

import React, { createElement } from 'react'
import type { EmptyStateProps } from './types'
import { SIZE_MAP } from './types'
import { renderIcon } from './renderIcon'
import { renderActions } from './renderActions'

/**
 * Main EmptyState component with Material Design
 * styling for empty lists, tables, or collections.
 */
export function EmptyState({
  icon = '\uD83D\uDCED',
  title,
  description,
  hint,
  action,
  secondaryAction,
  className,
  style,
  size = 'normal',
  animated = true,
}: EmptyStateProps) {
  const current = SIZE_MAP[size]
  const anim = animated ? 'empty-state-animated' : ''

  return createElement('div', {
    className: `empty-state ${anim} ${className ?? ''}`,
    style: {
      textAlign: 'center',
      padding: current.padding,
      color: '#868e96',
      ...style,
    },
  },
    renderIcon(icon, current, size),
    createElement('h2', {
      className: 'empty-state-title',
      style: {
        fontSize: current.titleSize,
        fontWeight: 600,
        marginBottom: '8px',
        color: '#495057',
      },
    }, title),
    createElement('p', {
      className: 'empty-state-message',
      style: {
        fontSize: current.descSize,
        marginBottom: hint ? '12px' : '24px',
        maxWidth: '400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        lineHeight: 1.5,
      },
    }, description),
    hint && createElement('p', {
      className: 'empty-state-hint',
      style: {
        fontSize: current.descSize,
        marginBottom: '24px',
        maxWidth: '400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        color: '#868e96',
        fontStyle: 'italic',
        lineHeight: 1.4,
      },
    }, hint),
    renderActions(action, secondaryAction, current, size),
  )
}
