'use client';

import { Typography } from '../../data-display';
import { Button } from '../../inputs';
import { CreateTableColumnRow }
  from './CreateTableColumnRow';
import type { TableColumn }
  from './createTableTypes';

/** Props for the column list section. */
export interface CreateTableColumnListProps {
  columns: TableColumn[];
  dataTypes: string[];
  onUpdate: (
    index: number,
    field: keyof TableColumn,
    value: string | number | boolean
  ) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

/**
 * Renders the list of column definition rows
 * with an add button.
 */
export function CreateTableColumnList({
  columns, dataTypes,
  onUpdate, onRemove, onAdd,
}: CreateTableColumnListProps) {
  return (
    <>
      <Typography variant="subtitle1"
        gutterBottom>
        Columns:
      </Typography>
      {columns.map((col, index) => (
        <CreateTableColumnRow key={index}
          col={col} index={index}
          dataTypes={dataTypes}
          canRemove={columns.length > 1}
          onUpdate={onUpdate}
          onRemove={onRemove} />
      ))}
      <Button variant="outlined"
        onClick={onAdd}>
        Add Column
      </Button>
    </>
  );
}
