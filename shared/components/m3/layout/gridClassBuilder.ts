import { classNames }
  from '../utils/classNames'
import styles
  from '../../../scss/atoms/grid.module.scss'
import {
  colClassMap, colSmClassMap,
  colMdClassMap, colLgClassMap,
  flexGapClassMap, getColClass,
} from './GridClassMaps'
import { cssGridClasses }
  from './cssGridClasses'
import type { FlexCol } from './GridTypes'

/** Build Flexbox mode class names. */
function flexClasses(p: {
  container?: boolean; item?: boolean;
  xs?: FlexCol; sm?: FlexCol;
  md?: FlexCol; lg?: FlexCol;
  spacing?: number;
}): Record<string, unknown> {
  return {
    [styles.gridContainer]: p.container,
    [styles.gridItem]: p.item,
    [flexGapClassMap[Number(p.spacing)]]:
      !p.container
      && typeof p.spacing === 'number'
      && flexGapClassMap[p.spacing],
    [getColClass(p.xs, colClassMap) || '']:
      p.xs !== undefined,
    [getColClass(p.sm, colSmClassMap) || '']:
      p.sm !== undefined,
    [getColClass(p.md, colMdClassMap) || '']:
      p.md !== undefined,
    [getColClass(p.lg, colLgClassMap) || '']:
      p.lg !== undefined,
  }
}

/**
 * Build full Grid class string.
 * @param isCss - Whether CSS Grid mode.
 * @param p - Grid props subset.
 * @param className - Extra class name.
 * @returns Combined class name string.
 */
export function buildGridClass(
  isCss: boolean,
  p: Record<string, unknown>,
  className?: string,
): string {
  return classNames(
    isCss && cssGridClasses(p),
    !isCss && flexClasses(p),
    className)
}
