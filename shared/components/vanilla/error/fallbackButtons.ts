import { createElement } from 'react'

/**
 * Render retry and reload buttons.
 * @param onRetry - Retry callback.
 * @param onReload - Reload callback.
 * @returns React element with buttons.
 */
export function renderButtons(
  onRetry: () => void,
  onReload: () => void,
) {
  return createElement('div', {
    style: {
      display: 'flex', gap: '8px',
      flexWrap: 'wrap', marginTop: '12px',
    },
  },
    createElement('button', {
      onClick: onRetry,
      style: {
        padding: '8px 16px',
        backgroundColor: '#228be6',
        color: 'white', border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px', fontWeight: 500,
      },
    }, 'Try again'),
    createElement('button', {
      onClick: onReload,
      style: {
        padding: '8px 16px',
        backgroundColor: '#f1f3f5',
        color: '#495057',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px', fontWeight: 500,
      },
    }, 'Reload page'),
  )
}
