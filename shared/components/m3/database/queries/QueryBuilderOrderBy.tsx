'use client';

import { Box } from '../../layout';
import {
  Select, FormControl, InputLabel,
} from '../../inputs';

/** Props for ORDER BY controls. */
export interface QueryBuilderOrderByProps {
  availableColumns: string[];
  orderByColumn: string;
  onOrderByColumnChange: (col: string) => void;
  orderByDirection: 'ASC' | 'DESC';
  onOrderByDirectionChange: (
    dir: 'ASC' | 'DESC'
  ) => void;
}

/**
 * ORDER BY column and direction selectors.
 */
export function QueryBuilderOrderBy({
  availableColumns, orderByColumn,
  onOrderByColumnChange,
  orderByDirection,
  onOrderByDirectionChange,
}: QueryBuilderOrderByProps) {
  return (
    <Box sx={{
      display: 'flex', gap: 1, mb: 2,
    }}>
      <FormControl sx={{ flex: 1 }}>
        <InputLabel>
          Order By (optional)
        </InputLabel>
        <Select value={orderByColumn}
          onChange={(e) =>
            onOrderByColumnChange(
              e.target.value as string)}>
          <option value="">None</option>
          {availableColumns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </Select>
      </FormControl>
      {orderByColumn && (
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Direction</InputLabel>
          <Select value={orderByDirection}
            onChange={(e) =>
              onOrderByDirectionChange(
                e.target.value as
                  'ASC' | 'DESC')}>
            <option value="ASC">
              Ascending
            </option>
            <option value="DESC">
              Descending
            </option>
          </Select>
        </FormControl>
      )}
    </Box>
  );
}

export default QueryBuilderOrderBy;
