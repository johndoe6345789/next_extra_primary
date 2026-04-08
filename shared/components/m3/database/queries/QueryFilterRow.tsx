'use client';

import { Box } from '../../layout';
import {
  TextField, Select,
  FormControl, InputLabel,
  IconButton,
} from '../../inputs';
import { Delete } from '../../icons';
import type {
  WhereCondition, QueryOperator,
} from './queryBuilderTypes';

/** Props for a single filter condition row. */
export interface QueryFilterRowProps {
  condition: WhereCondition;
  index: number;
  availableColumns: string[];
  operators: QueryOperator[];
  onChange: (
    index: number,
    field: keyof WhereCondition,
    value: string
  ) => void;
  onRemove: (index: number) => void;
}

/**
 * A single WHERE condition row with column,
 * operator, value fields and remove button.
 */
export function QueryFilterRow({
  condition, index,
  availableColumns, operators,
  onChange, onRemove,
}: QueryFilterRowProps) {
  return (
    <Box sx={{
      display: 'flex', gap: 1,
      mb: 1, alignItems: 'center',
    }}>
      <FormControl sx={{ flex: 1 }}>
        <InputLabel>Column</InputLabel>
        <Select value={condition.column}
          onChange={(e) =>
            onChange(index, 'column',
              e.target.value as string)}>
          {availableColumns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ flex: 1 }}>
        <InputLabel>Operator</InputLabel>
        <Select value={condition.operator}
          onChange={(e) =>
            onChange(index, 'operator',
              e.target.value as string)}>
          {operators.map((op) => (
            <option key={op.value}
              value={op.value}>
              {op.label}
            </option>
          ))}
        </Select>
      </FormControl>
      {condition.operator !== 'IS NULL' &&
        condition.operator !== 'IS NOT NULL' && (
        <TextField sx={{ flex: 1 }}
          label="Value"
          value={condition.value}
          onChange={(e) =>
            onChange(index, 'value',
              e.target.value)} />
      )}
      <IconButton color="error"
        onClick={() => onRemove(index)}
        aria-label="Remove condition">
        <Delete />
      </IconButton>
    </Box>
  );
}

export default QueryFilterRow;
