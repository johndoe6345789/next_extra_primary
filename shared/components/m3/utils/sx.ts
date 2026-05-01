/**
 * MUI-compatible sx prop utility — converts sx to
 * inline React styles.
 *
 * IMPORTANT — limitation: this util emits a static
 * style object only. It does NOT support MUI's
 * responsive shorthand `{ xs, sm, md, lg, xl }`.
 * Passing such an object silently produces invalid
 * CSS (`[object Object]`) which the browser drops to
 * default. For breakpoint-aware values, use the
 * `useMediaQuery` hook in this folder and pick a
 * concrete value at render time.
 *
 * In development the converter logs a warning when
 * it encounters a value object on a spacing or pixel
 * property, surfacing the silent breakage.
 */

import {
  sxToCssMap,
  spacingProperties,
  pixelProperties,
  colorMap,
} from './sxMaps'
import { warnObjectValue } from './sxWarn'

const SPACING_UNIT = 8

const convertSpacing = (
  value: unknown, key: string,
): string => {
  warnObjectValue(key, value)
  return typeof value === 'number'
    ? `${value * SPACING_UNIT}px`
    : String(value)
}

const convertPixel = (
  value: unknown, key: string,
): string | number => {
  warnObjectValue(key, value)
  return typeof value === 'number'
    ? `${value}px`
    : (value as string | number)
}

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
        return convertSpacing(val, propKey) as string
      if (pixelProperties.has(propKey))
        return convertPixel(val, propKey)
      if (
        typeof val === 'string' &&
        (propKey === 'color' ||
          propKey === 'bgcolor' ||
          propKey === 'backgroundColor')
      )
        return convertColor(val)
      // Surface other silent failures: any plain
      // object on a CSS property is almost certainly a
      // dropped responsive shorthand.
      warnObjectValue(propKey, val)
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
