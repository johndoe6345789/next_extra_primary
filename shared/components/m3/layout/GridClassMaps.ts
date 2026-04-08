/**
 * CSS module class maps for the Grid component.
 */

import styles from '../../../scss/atoms/grid.module.scss'
import type { GridGap, AutoGridSize, GridCols, GridAlign, FlexCol } from './GridTypes'

export const gapClassMap: Record<GridGap, string> = {
  xs: styles.gridGapXs, sm: styles.gridGapSm, md: styles.gridGapMd, lg: styles.gridGapLg, xl: styles.gridGapXl,
}

export const autoGridClassMap: Record<AutoGridSize, string> = {
  xs: styles.autoGridXs, sm: styles.autoGridSm, md: styles.autoGridMd, lg: styles.autoGridLg, xl: styles.autoGridXl,
}

export const colsClassMap: Record<GridCols, string> = {
  1: styles.gridCols1, 2: styles.gridCols2, 3: styles.gridCols3, 4: styles.gridCols4, 5: styles.gridCols5, 6: styles.gridCols6,
}

export const colClassMap: Record<number, string> = {
  1: styles.col1, 2: styles.col2, 3: styles.col3, 4: styles.col4, 5: styles.col5, 6: styles.col6,
  7: styles.col7, 8: styles.col8, 9: styles.col9, 10: styles.col10, 11: styles.col11, 12: styles.col12,
}

export const colSmClassMap: Record<number, string> = {
  1: styles.colSm1, 2: styles.colSm2, 3: styles.colSm3, 4: styles.colSm4, 5: styles.colSm5, 6: styles.colSm6,
  7: styles.colSm7, 8: styles.colSm8, 9: styles.colSm9, 10: styles.colSm10, 11: styles.colSm11, 12: styles.colSm12,
}

export const colMdClassMap: Record<number, string> = {
  1: styles.colMd1, 2: styles.colMd2, 3: styles.colMd3, 4: styles.colMd4, 5: styles.colMd5, 6: styles.colMd6,
  7: styles.colMd7, 8: styles.colMd8, 9: styles.colMd9, 10: styles.colMd10, 11: styles.colMd11, 12: styles.colMd12,
}

export const colLgClassMap: Record<number, string> = {
  3: styles.colLg3, 4: styles.colLg4, 6: styles.colLg6, 12: styles.colLg12,
}

export const flexGapClassMap: Record<number, string> = {
  1: styles.gap1, 2: styles.gap2, 3: styles.gap3, 4: styles.gap4, 5: styles.gap5, 6: styles.gap6,
}

export const gridAlignClassMap: Record<GridAlign, string> = {
  start: styles.gridItemsStart, center: styles.gridItemsCenter, end: styles.gridItemsEnd, stretch: styles.gridItemsStretch,
}

/** Resolve a column class from a breakpoint map */
export const getColClass = (
  value: FlexCol | undefined,
  map: Record<number, string>,
): string | undefined => {
  if (value === undefined) return undefined
  if (value === true) return map[12]
  if (typeof value === 'number' && map[value]) return map[value]
  return undefined
}
