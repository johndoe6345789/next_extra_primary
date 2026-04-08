import { createElement } from 'react'
import { renderButtons } from './fallbackButtons'
import { renderErrorDetails }
  from './fallbackDetails'

/**
 * Render the default error fallback UI.
 * @param message - User-facing error message.
 * @param error - The actual Error object.
 * @param errorCount - Times error occurred.
 * @param onRetry - Retry callback.
 * @param onReload - Reload callback.
 */
export function renderFallbackUI(
  message: string,
  error: Error | null,
  errorCount: number,
  onRetry: () => void,
  onReload: () => void,
) {
  return createElement('div', {
    style: {
      padding: '24px', margin: '16px',
      border: '1px solid #ff6b6b',
      borderRadius: '8px',
      backgroundColor: '#fff5f5',
      boxShadow:
        '0 2px 4px rgba(255,107,107,0.1)',
    },
  },
    createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      },
    },
      createElement('div', {
        style: {
          fontSize: '24px', flexShrink: 0,
          marginTop: '4px',
        },
      }, '\u26A0\uFE0F'),
      createElement('div',
        { style: { flex: 1 } },
        createElement('h2', {
          style: {
            color: '#c92a2a',
            margin: '0 0 8px 0',
            fontSize: '18px',
          },
        }, 'Something went wrong'),
        createElement('p', {
          style: {
            color: '#495057',
            margin: '0 0 12px 0',
            fontSize: '14px',
            lineHeight: '1.5',
          },
        }, message),
        renderErrorDetails(error),
        errorCount > 1
          && createElement('p', {
            style: {
              color: '#ff6b6b',
              fontSize: '12px',
              margin: '8px 0',
            },
          }, `Error occurred ${errorCount} times.`),
        renderButtons(onRetry, onReload),
      ),
    ),
  )
}
