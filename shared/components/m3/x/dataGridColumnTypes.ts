/**
 * Column-related type definitions for
 * the DataGrid component.
 */

import React from 'react';

/** Column definition for the data grid. */
export interface GridColDef {
  field: string;
  headerName: string;
  width?: number;
  flex?: number;
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (
    params: GridRenderCellParams
  ) => React.ReactNode;
  valueGetter?: (
    params: GridValueGetterParams
  ) => unknown;
  valueFormatter?: (
    params: GridValueFormatterParams
  ) => string;
  editable?: boolean;
  type?:
    | 'string'
    | 'number'
    | 'date'
    | 'boolean'
    | 'actions';
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
}

/** Params passed to renderCell. */
export interface GridRenderCellParams {
  value: unknown;
  row: Record<string, unknown>;
  field: string;
  id: string | number;
}

/** Params passed to valueGetter. */
export interface GridValueGetterParams {
  row: Record<string, unknown>;
  field: string;
  id: string | number;
}

/** Params passed to valueFormatter. */
export interface GridValueFormatterParams {
  value: unknown;
  field: string;
  id: string | number;
}
