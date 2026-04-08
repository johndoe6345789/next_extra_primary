/**
 * Grid - dual-mode layout using CSS Grid
 * or Flexbox (Bootstrap-style 12-column).
 */

import React from 'react'
import { sxToStyle } from '../utils/sx'
import type { GridProps } from './GridTypes'
import { buildGridClass }
  from './gridClassBuilder'
import { flexStyles } from './gridFlexStyles'

export type { GridProps, GridItemProps }
  from './GridTypes'
export { GridItem } from './GridItem'

/** Responsive grid container. */
export const Grid: React.FC<GridProps> = ({
  children, cssGrid = false,
  container, item, xs, sm, md, lg,
  spacing, direction,
  alignItems, justifyContent,
  cols, gap, autoGrid, minWidth,
  span, rowSpan, gridAlign,
  dense, masonry,
  className, sx, style, testId, ...props
}) => {
  const isCss = !!(cssGrid
    || cols !== undefined
    || autoGrid || masonry)
  const cls = buildGridClass(isCss, {
    cols, gap, autoGrid, minWidth, span,
    rowSpan, gridAlign, dense, masonry,
    container, item, xs, sm, md, lg,
    spacing,
  }, className)
  const inlineStyles: React.CSSProperties = {
    ...sxToStyle(sx), ...style,
    ...(!isCss ? flexStyles(
      direction, alignItems,
      justifyContent) : {}),
  }
  return (
    <div className={cls}
      style={inlineStyles}
      data-testid={testId} {...props}>
      {children}
    </div>
  )
}

export default Grid
