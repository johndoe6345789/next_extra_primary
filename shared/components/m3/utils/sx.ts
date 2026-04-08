/**
 * MUI-compatible sx prop utility.
 * Converts sx prop to inline styles.
 */

import {
  sxToCssMap,
  spacingProperties,
  pixelProperties,
  colorMap,
} from './sxMaps'

const SPACING_UNIT = 8

const convertSpacing = (value: unknown): string =>
  typeof value === 'number'
    ? `${value * SPACING_UNIT}px`
    : String(value)

const convertPixel = (
  value: unknown
): string | number =>
  typeof value === 'number'
    ? `${value}px`
    : (value as string | number)

const convertColor = (value: string): string =>
  colorMap[value] || value

/**
 * Convert sx prop object to React inline style.
 */
export const sxToStyle = (
  sx?: Record<string, unknown>
): React.CSSProperties | undefined => {
  if (!sx) return undefined

  const style: Record<string, string | number> =
    {}

  for (const [key, value] of Object.entries(sx)) {
    if (value === undefined || value === null)
      continue
    if (key.startsWith('&') || key.startsWith('.'))
      continue

    const cssProperty = sxToCssMap[key] || key

    const convertValue = (
      val: unknown,
      propKey: string
    ): string | number => {
      if (spacingProperties.has(propKey))
        return convertSpacing(val) as string
      if (pixelProperties.has(propKey))
        return convertPixel(val) as string | number
      if (
        typeof val === 'string' &&
        (propKey === 'color' ||
          propKey === 'bgcolor' ||
          propKey === 'backgroundColor')
      )
        return convertColor(val)
      return val as string | number
    }

    if (Array.isArray(cssProperty)) {
      for (const prop of cssProperty) {
        style[prop] = convertValue(value, key)
      }
    } else {
      style[cssProperty] = convertValue(
        value,
        key
      )
    }
  }

  return style as React.CSSProperties
}

export default sxToStyle
