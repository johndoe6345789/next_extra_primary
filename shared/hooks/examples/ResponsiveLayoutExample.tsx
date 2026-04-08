/**
 * Example 4: Window Resize Listener with Performance
 *
 * Features:
 * - Track window size
 * - Passive listener for performance
 * - Debounced updates
 * - Responsive breakpoints
 */

import { useEffect, useRef, useState } from 'react'
import { useEventListener } from '../useEventListener'

/** Responsive layout with resize listener */
export function ResponsiveLayoutExample() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined'
      ? window.innerWidth : 0,
    height: typeof window !== 'undefined'
      ? window.innerHeight : 0,
  })

  const debounceRef =
    useRef<ReturnType<typeof setTimeout>>()
  const { add } = useEventListener()

  useEffect(() => {
    return add(
      window,
      'resize',
      (e: UIEvent) => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current)
        }
        debounceRef.current = setTimeout(() => {
          const target = e.target as Window
          setWindowSize({
            width: target.innerWidth,
            height: target.innerHeight,
          })
        }, 100)
      },
      { passive: true }
    )
  }, [add])

  const isMobile = windowSize.width < 640
  const isTablet =
    windowSize.width >= 640 && windowSize.width < 1024
  const isDesktop = windowSize.width >= 1024

  return (
    <div>
      <h2>Responsive Layout</h2>
      <p>
        Size: {windowSize.width}x{windowSize.height}
      </p>
      {isMobile && <p>Mobile view</p>}
      {isTablet && <p>Tablet view</p>}
      {isDesktop && <p>Desktop view</p>}
    </div>
  )
}
