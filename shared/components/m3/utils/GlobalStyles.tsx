'use client'

import React, { useEffect, useId } from 'react'
import { objectToCss } from './globalStylesUtils'

type StyleObject = {
  [key: string]:
    | React.CSSProperties
    | string
    | number
    | StyleObject
}
type StyleFunction = (
  theme: Record<string, unknown>
) => string | StyleObject

export interface GlobalStylesProps {
  styles?: string | StyleObject | StyleFunction
}

/**
 * GlobalStyles - Inject global CSS styles.
 * Similar to MUI's GlobalStyles component.
 */
export function GlobalStyles({
  styles,
}: GlobalStylesProps) {
  const id = useId()

  useEffect(() => {
    if (!styles) return

    let cssText = ''

    if (typeof styles === 'string') {
      cssText = styles
    } else if (typeof styles === 'object') {
      cssText = objectToCss(styles)
    } else if (typeof styles === 'function') {
      const result = styles({})
      cssText =
        typeof result === 'string'
          ? result
          : objectToCss(result)
    }

    const styleElement =
      document.createElement('style')
    styleElement.id = `m3-global-styles-${id}`
    styleElement.textContent = cssText
    document.head.appendChild(styleElement)

    return () => {
      const el = document.getElementById(
        `m3-global-styles-${id}`
      )
      if (el) el.remove()
    }
  }, [styles, id])

  return null
}

export default GlobalStyles
