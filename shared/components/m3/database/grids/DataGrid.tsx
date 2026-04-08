'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '../../data-display';
import { Paper } from '../../surfaces';
import { DataGridRow } from './DataGridRow';

export type DataGridColumn = {
  name: string;
  label?: string;
};

export type DataGridProps = {
  columns: DataGridColumn[];
  rows: Record<string, unknown>[];
  onEdit?: (
    row: Record<string, unknown>
  ) => void;
  onDelete?: (
    row: Record<string, unknown>
  ) => void;
  primaryKey?: string;
  testId?: string;
};

/**
 * DataGrid - Generic data grid for tabular data
 * with optional edit and delete actions.
 */
export function DataGrid({
  columns,
  rows,
  onEdit,
  onDelete,
  primaryKey = 'id',
  testId,
}: DataGridProps) {
  return (
    <Paper data-testid={testId}>
      <TableContainer>
        <Table size="small" role="grid">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.name}>
                  <strong>
                    {col.label || col.name}
                  </strong>
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <DataGridRow
                key={
                  (row[primaryKey] as
                    | string
                    | number) || idx
                }
                row={row}
                columns={columns}
                primaryKey={primaryKey}
                rowIndex={idx}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default DataGrid;
