'use client';

import { Box } from '../../layout';
import { TextField, Select } from '../../inputs';
import { ColumnRowCheckboxes }
  from './ColumnRowCheckboxes';
import type { TableColumn }
  from './createTableTypes';

/** Props for a single column row. */
export interface CreateTableColumnRowProps {
  col: TableColumn;
  index: number;
  dataTypes: string[];
  canRemove: boolean;
  onUpdate: (
    index: number,
    field: keyof TableColumn,
    value: string | number | boolean
  ) => void;
  onRemove: (index: number) => void;
}

/**
 * A single column definition row for the
 * CreateTableDialog.
 */
export function CreateTableColumnRow({
  col, index, dataTypes,
  canRemove, onUpdate, onRemove,
}: CreateTableColumnRowProps) {
  return (
    <Box sx={{
      mb: 2, p: 2,
      border: '1px solid #ddd',
      borderRadius: 1,
    }}>
      <TextField label="Column Name"
        value={col.name}
        onChange={(e) =>
          onUpdate(index, 'name',
            e.target.value)}
        sx={{ mr: 1, mb: 1 }} />
      <Select value={col.type}
        onChange={(e) =>
          onUpdate(index, 'type',
            e.target.value as string)}
        sx={{ mr: 1, mb: 1, minWidth: 120 }}>
        {dataTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>
      {col.type === 'VARCHAR' && (
        <TextField label="Length"
          type="number"
          value={col.length || 255}
          onChange={(e) =>
            onUpdate(index, 'length',
              e.target.value)}
          sx={{
            mr: 1, mb: 1, width: 100,
          }} />
      )}
      <ColumnRowCheckboxes
        col={col} index={index}
        canRemove={canRemove}
        onUpdate={onUpdate}
        onRemove={onRemove} />
    </Box>
  );
}

export default CreateTableColumnRow;
