/**
 * Barrel re-exports for all Table
 * sub-components and types.
 */

export {
  TableHead, TableBody,
  TableFooter, TableRow,
} from './TableParts'
export type {
  TableHeadProps, TableBodyProps,
  TableFooterProps, TableRowProps,
} from './TableParts'

export {
  TableCell, TableContainer,
} from './TableCellContainer'
export type {
  TableCellProps, TableContainerProps,
} from './TableCellContainer'

export { TablePagination }
  from './TablePagination'
export type {
  TablePaginationProps,
  TablePaginationLabelDisplayedRowsArgs,
} from './TablePagination'

export { TableSortLabel }
  from './TableSort'
export type { TableSortLabelProps }
  from './TableSort'
