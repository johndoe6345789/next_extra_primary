/**
 * Type definitions for the Grid layout system.
 */
import type React from 'react'

/** CSS Grid gap sizes */
export type GridGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** Auto-grid min-width sizes */
export type AutoGridSize =
  | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** Grid column counts (1-6) */
export type GridCols = 1 | 2 | 3 | 4 | 5 | 6

/** Flexbox column sizes (1-12) */
export type FlexCol =
  | 1 | 2 | 3 | 4 | 5 | 6
  | 7 | 8 | 9 | 10 | 11 | 12
  | boolean

/** Grid item span options */
export type GridSpan = 2 | 3 | 'full'

/** Grid alignment options */
export type GridAlign =
  | 'start' | 'center' | 'end' | 'stretch'

/** Props for the Grid component */
export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  cssGrid?: boolean
  container?: boolean
  item?: boolean
  xs?: FlexCol
  sm?: FlexCol
  md?: FlexCol
  lg?: FlexCol
  xl?: FlexCol
  spacing?: 1 | 2 | 3 | 4 | 5 | 6 | string | number
  direction?: 'row' | 'column'
  alignItems?:
    | 'start' | 'center' | 'end' | 'stretch'
  justifyContent?:
    | 'start' | 'center' | 'end'
    | 'between' | 'around' | 'evenly'
  cols?: GridCols
  gap?: GridGap
  autoGrid?: boolean
  minWidth?: AutoGridSize
  span?: GridSpan
  rowSpan?: 2
  gridAlign?: GridAlign
  dense?: boolean
  masonry?: boolean | 2 | 3 | 4
  sx?: Record<string, unknown>
  testId?: string
}

/** Props for a GridItem convenience component */
export interface GridItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  masonry?: boolean
  sx?: Record<string, unknown>
}
