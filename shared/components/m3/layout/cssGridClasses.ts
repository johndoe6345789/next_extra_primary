/**
 * CSS Grid mode class name builder.
 */

import styles
  from '../../../scss/atoms/grid.module.scss'
import type {
  GridCols, GridGap,
  AutoGridSize, GridAlign,
} from './GridTypes'
import {
  gapClassMap, autoGridClassMap,
  colsClassMap, gridAlignClassMap,
} from './GridClassMaps'

/** CSS Grid mode class parameters. */
export interface CssGridParams {
  cols?: GridCols;
  gap?: GridGap;
  autoGrid?: boolean;
  minWidth?: AutoGridSize;
  span?: number | 'full';
  rowSpan?: number;
  gridAlign?: GridAlign;
  dense?: boolean;
  masonry?: boolean | number;
}

/**
 * Build CSS Grid mode class names.
 * @param p - CSS Grid parameters.
 * @returns Conditional class map.
 */
export function cssGridClasses(
  p: CssGridParams,
): Record<string, unknown> {
  return {
    [styles.grid]:
      !p.autoGrid && !p.masonry,
    [styles.autoGrid]: p.autoGrid,
    [colsClassMap[p.cols as GridCols]]:
      p.cols && !p.autoGrid && !p.masonry,
    [gapClassMap[p.gap as GridGap]]: p.gap,
    [autoGridClassMap[
      p.minWidth as AutoGridSize
    ]]: p.autoGrid && p.minWidth,
    [styles.gridSpan2]: p.span === 2,
    [styles.gridSpan3]: p.span === 3,
    [styles.gridSpanFull]: p.span === 'full',
    [styles.gridRowSpan2]: p.rowSpan === 2,
    [gridAlignClassMap[
      p.gridAlign as GridAlign
    ]]: p.gridAlign,
    [styles.gridDense]: p.dense,
    [styles.masonryGrid]:
      p.masonry === true || p.masonry === 3,
    [styles.masonryGrid2]: p.masonry === 2,
    [styles.masonryGrid4]: p.masonry === 4,
  }
}
