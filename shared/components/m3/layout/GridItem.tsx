/**
 * GridItem - convenience wrapper for masonry
 * and standard grid items.
 */

import React from 'react'
import { classNames } from '../utils/classNames'
import { sxToStyle } from '../utils/sx'
import styles from '../../../scss/atoms/grid.module.scss'
import type { GridItemProps } from './GridTypes'

/** Grid item with optional masonry styling. */
export const GridItem: React.FC<GridItemProps> = ({
  children,
  masonry,
  className,
  sx,
  style,
  ...props
}) => {
  const cls = classNames(
    {
      [styles.masonryGridItem]: masonry,
      [styles.gridItem]: !masonry,
    },
    className,
  )

  return (
    <div
      className={cls}
      style={{ ...sxToStyle(sx), ...style }}
      {...props}
    >
      {children}
    </div>
  )
}
