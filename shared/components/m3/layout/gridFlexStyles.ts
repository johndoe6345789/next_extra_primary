import type React from 'react'

const ALIGN_MAP: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
}

const JUSTIFY_MAP: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

/**
 * Build flexbox inline styles.
 * @param direction - Flex direction.
 * @param alignItems - Align items value.
 * @param justifyContent - Justify value.
 * @returns CSSProperties for flexbox layout.
 */
export function flexStyles(
  direction?: string,
  alignItems?: string,
  justifyContent?: string,
): React.CSSProperties {
  const s: React.CSSProperties = {}
  if (direction)
    s.flexDirection = direction as
      React.CSSProperties['flexDirection']
  if (alignItems)
    s.alignItems =
      ALIGN_MAP[alignItems] || alignItems
  if (justifyContent)
    s.justifyContent =
      JUSTIFY_MAP[justifyContent]
      || justifyContent
  return s
}
