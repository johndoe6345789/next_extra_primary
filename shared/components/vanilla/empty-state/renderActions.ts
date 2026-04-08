import { createElement } from 'react'
import type { EmptyStateProps, SizeConfig } from './types'

/**
 * Render action buttons for an EmptyState.
 *
 * @param action - Primary action config.
 * @param secondaryAction - Secondary action config.
 * @param current - Size config for the variant.
 * @param size - Size variant name.
 * @returns A React element or null.
 */
export function renderActions(
  action: EmptyStateProps['action'],
  secondaryAction: EmptyStateProps['secondaryAction'],
  current: SizeConfig,
  size: string,
) {
  if (!action && !secondaryAction) return null

  const pad = size === 'compact'
    ? '6px 12px' : '8px 16px'

  return createElement('div', {
    className: 'empty-state-actions',
    style: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '16px',
    },
  },
    action && createElement('button', {
      onClick: action.onClick,
      disabled: action.loading,
      className: 'empty-state-action-btn',
      style: {
        padding: pad,
        backgroundColor:
          action.variant === 'secondary'
            ? '#f1f3f5' : '#228be6',
        color:
          action.variant === 'secondary'
            ? '#495057' : 'white',
        border:
          action.variant === 'secondary'
            ? '1px solid #dee2e6' : 'none',
        borderRadius: '4px',
        cursor: action.loading
          ? 'not-allowed' : 'pointer',
        fontSize: current.descSize,
        fontWeight: 500,
        transition: 'all 0.2s ease',
        opacity: action.loading ? 0.7 : 1,
      },
    }, action.loading
      ? '\u23F3 Loading...' : action.label),
    secondaryAction && createElement('button', {
      onClick: secondaryAction.onClick,
      className: 'empty-state-secondary-btn',
      style: {
        padding: pad,
        backgroundColor: '#f1f3f5',
        color: '#495057',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: current.descSize,
        fontWeight: 500,
        transition: 'all 0.2s ease',
      },
    }, secondaryAction.label),
  )
}
