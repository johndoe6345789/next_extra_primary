/**
 * Type definitions for Pagination components.
 */
import type React from 'react'

/** Parameters passed to renderItem callback */
export interface PaginationRenderItemParams {
  type:
    | 'page'
    | 'first'
    | 'last'
    | 'next'
    | 'previous'
    | 'ellipsis'
  page: number | null
  selected?: boolean
  disabled: boolean
}

/** Props for the Pagination container */
export interface PaginationProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    'color' | 'onChange'
  > {
  count?: number
  page?: number
  onChange?: (page: number) => void
  size?: 'small' | 'medium' | 'large'
  color?: 'standard' | 'primary' | 'secondary'
  variant?: 'text' | 'outlined' | 'contained'
  shape?: 'circular' | 'rounded'
  boundaryCount?: number
  siblingCount?: number
  showFirstButton?: boolean
  showLastButton?: boolean
  hidePrevButton?: boolean
  hideNextButton?: boolean
  disabled?: boolean
  renderItem?: (
    item: PaginationRenderItemParams,
  ) => React.ReactNode
  getItemAriaLabel?: (
    type: string,
    page: number,
    selected: boolean,
  ) => string
  sx?: Record<string, unknown>
  /** Test ID for automated testing */
  testId?: string
}

/** Props for an individual PaginationItem */
export interface PaginationItemProps
  extends Omit<
    React.ButtonHTMLAttributes<
      HTMLButtonElement | HTMLSpanElement
    >,
    'color' | 'type'
  > {
  type?:
    | 'page'
    | 'first'
    | 'last'
    | 'next'
    | 'previous'
    | 'ellipsis'
  page?: number | null
  selected?: boolean
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  color?: 'standard' | 'primary' | 'secondary'
  variant?: 'text' | 'outlined' | 'contained'
  shape?: 'circular' | 'rounded'
  onClick?: () => void
}
