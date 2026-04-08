/**
 * Live region announcement hook
 */

import React from 'react'

export { useFocusTrap } from './accessibleFocusTrap'

/**
 * Hook for live region announcements
 *
 * @example
 * const { announce, liveRegionProps, message } =
 *   useLiveRegion('polite')
 * announce('Item deleted successfully')
 * <div {...liveRegionProps}>{message}</div>
 */
export function useLiveRegion(
  politeness:
    | 'polite'
    | 'assertive' = 'polite'
) {
  const [message, setMessage] =
    React.useState('')

  const announce = React.useCallback(
    (text: string) => {
      setMessage(text)
      setTimeout(() => setMessage(''), 1000)
    },
    []
  )

  return {
    announce,
    liveRegionProps: {
      role: 'status' as const,
      'aria-live': politeness,
      'aria-atomic': true as const,
    },
    message,
  }
}
