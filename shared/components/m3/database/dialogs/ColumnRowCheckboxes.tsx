'use client';

import {
  Checkbox, FormControlLabel, IconButton,
} from '../../inputs';
import { Delete } from '../../icons';
import type { TableColumn }
  from './createTableTypes';

/** Props for column row checkboxes. */
export interface ColumnRowCheckboxesProps {
  col: TableColumn;
  index: number;
  canRemove: boolean;
  onUpdate: (
    index: number,
    field: keyof TableColumn,
    value: string | number | boolean
  ) => void;
  onRemove: (index: number) => void;
}

/**
 * Nullable, Primary Key checkboxes and
 * remove button for a column row.
 */
export function ColumnRowCheckboxes({
  col, index, canRemove,
  onUpdate, onRemove,
}: ColumnRowCheckboxesProps) {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox checked={col.nullable}
            onChange={(e) =>
              onUpdate(index, 'nullable',
                e.target.checked)} />
        }
        label="Nullable" sx={{ mr: 1 }} />
      <FormControlLabel
        control={
          <Checkbox checked={col.primaryKey}
            onChange={(e) =>
              onUpdate(index, 'primaryKey',
                e.target.checked)} />
        }
        label="Primary Key" sx={{ mr: 1 }} />
      {canRemove && (
        <IconButton
          onClick={() => onRemove(index)}
          color="error" size="small"
          aria-label="Remove column">
          <Delete />
        </IconButton>
      )}
    </>
  );
}

export default ColumnRowCheckboxes;
