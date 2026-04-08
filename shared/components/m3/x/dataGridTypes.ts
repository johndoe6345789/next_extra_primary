/**
 * DataGrid component props and model types.
 */

import React from 'react';
import { GridColDef } from './dataGridColumnTypes';

export type {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
  GridValueFormatterParams,
} from './dataGridColumnTypes';

/** Row click event params. */
export interface GridRowParams {
  row: Record<string, unknown>;
  id: string | number;
}

/** Sort model entry. */
export interface GridSortModel {
  field: string;
  sort: 'asc' | 'desc' | null;
}

/** Filter model for the data grid. */
export interface GridFilterModel {
  items: GridFilterItem[];
}

/** Single filter item. */
export interface GridFilterItem {
  field: string;
  operator: string;
  value: unknown;
}

/** Props for the DataGrid component. */
export interface DataGridProps {
  rows: Record<string, unknown>[];
  columns: GridColDef[];
  pageSize?: number;
  rowsPerPageOptions?: number[];
  checkboxSelection?: boolean;
  disableSelectionOnClick?: boolean;
  onRowClick?: (
    params: GridRowParams
  ) => void;
  onSelectionModelChange?: (
    ids: (string | number)[]
  ) => void;
  loading?: boolean;
  autoHeight?: boolean;
  density?:
    | 'compact'
    | 'standard'
    | 'comfortable';
  sortModel?: GridSortModel[];
  onSortModelChange?: (
    model: GridSortModel[]
  ) => void;
  filterModel?: GridFilterModel;
  onFilterModelChange?: (
    model: GridFilterModel
  ) => void;
  getRowId?: (
    row: Record<string, unknown>
  ) => string | number;
  className?: string;
  sx?: React.CSSProperties;
  testId?: string;
}
