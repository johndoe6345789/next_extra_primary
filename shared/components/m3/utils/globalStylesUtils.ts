import { unitlessProperties }
  from './unitlessProperties'

export { unitlessProperties }

type StyleObject = {
  [key: string]:
    | React.CSSProperties
    | string
    | number
    | StyleObject
}

/**
 * Convert a styles object to CSS string.
 * @param obj - Style object to convert.
 * @param selector - CSS selector prefix.
 * @returns Generated CSS string.
 */
export function objectToCss(
  obj: StyleObject,
  selector: string = ''
): string {
  let css = ''

  for (const [key, value] of Object.entries(
    obj
  )) {
    if (value == null) continue

    if (
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      const newSelector = key.startsWith('@')
        ? key
        : selector
          ? `${selector} ${key}`
          : key

      if (key.startsWith('@')) {
        css += `${key} {\n${objectToCss(
          value as StyleObject, selector
        )}\n}\n`
      } else {
        css += objectToCss(
          value as StyleObject, newSelector
        )
      }
    } else {
      const cssKey = key
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
      const cssValue =
        typeof value === 'number' &&
        !unitlessProperties.has(key)
          ? `${value}px`
          : value

      if (selector) {
        css += `${selector} { ${cssKey}: ${cssValue}; }\n`
      } else {
        css += `${cssKey}: ${cssValue};\n`
      }
    }
  }

  return css
}
