'use client';

import {
  TableCell,
  TableRow,
  Tooltip,
} from '../../data-display';
import { IconButton } from '../../inputs';
import { Edit, Delete } from '../../icons';
import type { DataGridColumn } from './DataGrid';

/** Props for a single DataGrid body row. */
export interface DataGridRowProps {
  row: Record<string, unknown>;
  columns: DataGridColumn[];
  primaryKey: string;
  rowIndex: number;
  onEdit?: (row: Record<string, unknown>) => void;
  onDelete?: (
    row: Record<string, unknown>
  ) => void;
}

/**
 * Renders a single row in the database DataGrid.
 */
export function DataGridRow({
  row,
  columns,
  primaryKey,
  rowIndex,
  onEdit,
  onDelete,
}: DataGridRowProps) {
  const key =
    (row[primaryKey] as string | number) ||
    rowIndex;

  return (
    <TableRow key={key}>
      {columns.map((col) => (
        <TableCell key={col.name}>
          {row[col.name] !== null &&
          row[col.name] !== undefined
            ? String(row[col.name])
            : 'NULL'}
        </TableCell>
      ))}
      {(onEdit || onDelete) && (
        <TableCell>
          {onEdit && (
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(row)}
                aria-label="Edit row"
              >
                <Edit />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(row)}
                aria-label="Delete row"
              >
                <Delete />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      )}
    </TableRow>
  );
}

export default DataGridRow;
