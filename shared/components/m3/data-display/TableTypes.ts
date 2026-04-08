import React from 'react'

/** Table size variants */
export type TableSize = 'small' | 'medium' | 'large'
/** Table padding variants */
export type TablePadding = 'checkbox' | 'none' | 'normal'
/** Table cell alignment */
export type TableAlign =
  | 'left' | 'center' | 'right' | 'justify'

/** Props for the Table component */
export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode
  /** Size variant */
  size?: TableSize
  /** Enable sticky header */
  stickyHeader?: boolean
  /** Enable striped rows */
  striped?: boolean
  /** Enable bordered variant */
  bordered?: boolean
  /** Compact mode */
  compact?: boolean
  /** Test ID for automated testing */
  testId?: string
}

/** Props for TableHead */
export interface TableHeadProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode
}

/** Props for TableBody */
export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode
}

/** Props for TableFooter */
export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode
}

/** Props for TableRow */
export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  children?: React.ReactNode
  /** Enable hover effect */
  hover?: boolean
  /** Selected state */
  selected?: boolean
  /** Make row clickable */
  onClick?: React.MouseEventHandler<HTMLTableRowElement>
}

/** Props for TableCell */
export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode
  /** Render as th element */
  header?: boolean
  /** Text alignment */
  align?: TableAlign
  /** Cell padding variant */
  padding?: TablePadding
  /** Scope for header cells */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup'
  /** Enable sorting on this cell */
  sortDirection?: 'asc' | 'desc' | false
}

/** Props for TableContainer */
export interface TableContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  /** Max height for scrollable container */
  maxHeight?: number | string
}
