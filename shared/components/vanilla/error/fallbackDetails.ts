import { createElement } from 'react'

/**
 * Render error details section (dev only).
 * @param error - The Error object.
 * @returns Details element or null.
 */
export function renderErrorDetails(
  error: Error | null,
) {
  if (
    process.env.NODE_ENV !== 'development'
    || error === null
  ) {
    return null
  }
  return createElement('details', {
    style: {
      marginTop: '12px',
      marginBottom: '12px',
    },
  },
    createElement('summary', {
      style: {
        cursor: 'pointer',
        color: '#868e96',
        fontSize: '12px',
        fontWeight: 500,
        userSelect: 'none',
        padding: '4px 0',
      },
    }, 'Error details'),
    createElement('pre', {
      style: {
        marginTop: '8px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        overflow: 'auto',
        fontSize: '12px',
        lineHeight: '1.4',
        maxHeight: '200px',
        color: '#666',
      },
    }, `${error.message}${error.stack ? `\n\n${error.stack}` : ''}`),
  )
}
