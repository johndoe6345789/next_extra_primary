'use client';

import React from 'react';
import { classNames } from '../utils/classNames';
import { DataGridProps } from './dataGridTypes';
import { useDataGrid } from './useDataGrid';
import { useDataGridSelection } from './useDataGridSelection';
import { DataGridHeader } from './DataGridHeader';
import { DataGridBody } from './DataGridBody';
import { DataGridFooter } from './DataGridFooter';

const DENSITY: Record<string, string> = {
  compact: 'm3-datagrid--compact',
  standard: '',
  comfortable: 'm3-datagrid--comfortable',
};

/**
 * DataGrid - Data table with sorting,
 * pagination, and row selection.
 */
export function DataGrid({
  rows, columns, pageSize = 25,
  checkboxSelection = false,
  disableSelectionOnClick = false,
  onRowClick, onSelectionModelChange,
  loading = false, autoHeight = false,
  density = 'standard', sortModel,
  onSortModelChange,
  getRowId = (r) => r.id as string | number,
  className, sx, testId,
}: DataGridProps) {
  const grid = useDataGrid(
    rows, pageSize, sortModel,
    onSortModelChange, getRowId
  );
  const sel = useDataGridSelection(
    rows, grid.selectedIds, grid.setSelectedIds,
    getRowId, checkboxSelection,
    disableSelectionOnClick,
    onRowClick, onSelectionModelChange
  );

  return (
    <div
      className={classNames('m3-datagrid', DENSITY[density], className)}
      style={{ ...sx, height: autoHeight ? 'auto' : '400px' }}
      data-testid={testId} role="grid"
    >
      {loading && (
        <div className="m3-datagrid-loading">
          <div className="m3-datagrid-loading-spinner" />
        </div>
      )}
      <div className="m3-datagrid-container">
        <table className="m3-datagrid-table">
          <DataGridHeader
            columns={columns}
            currentSort={grid.currentSort}
            checkboxSelection={checkboxSelection}
            allSelected={grid.selectedIds.size === rows.length && rows.length > 0}
            onSort={grid.handleSort}
            onSelectAll={sel.handleSelectAll}
          />
          <DataGridBody
            rows={grid.paginatedRows}
            columns={columns}
            checkboxSelection={checkboxSelection}
            selectedIds={grid.selectedIds}
            getRowId={getRowId}
            onRowClick={sel.handleRowClick}
          />
        </table>
      </div>
      <DataGridFooter
        page={grid.page} pageSize={pageSize}
        totalRows={rows.length}
        totalPages={grid.totalPages}
        onPageChange={grid.setPage}
      />
    </div>
  );
}

/** Alias for compatibility. */
export const DataGridPro = DataGrid;
/** Alias for compatibility. */
export const DataGridPremium = DataGrid;
