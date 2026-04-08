'use client';

import { Box } from '../../layout';
import { TextField } from '../../inputs';
import { QueryBuilderOrderBy }
  from './QueryBuilderOrderBy';

/** Props for ORDER BY and LIMIT/OFFSET. */
export interface QueryBuilderSortingProps {
  availableColumns: string[];
  orderByColumn: string;
  onOrderByColumnChange: (col: string) => void;
  orderByDirection: 'ASC' | 'DESC';
  onOrderByDirectionChange: (
    dir: 'ASC' | 'DESC'
  ) => void;
  limit: string;
  onLimitChange: (v: string) => void;
  offset: string;
  onOffsetChange: (v: string) => void;
}

/**
 * ORDER BY, LIMIT, and OFFSET controls for the
 * query builder.
 */
export function QueryBuilderSorting({
  availableColumns, orderByColumn,
  onOrderByColumnChange, orderByDirection,
  onOrderByDirectionChange,
  limit, onLimitChange,
  offset, onOffsetChange,
}: QueryBuilderSortingProps) {
  return (
    <>
      <QueryBuilderOrderBy
        availableColumns={availableColumns}
        orderByColumn={orderByColumn}
        onOrderByColumnChange={
          onOrderByColumnChange}
        orderByDirection={orderByDirection}
        onOrderByDirectionChange={
          onOrderByDirectionChange} />
      <Box sx={{
        display: 'flex', gap: 1, mb: 2,
      }}>
        <TextField sx={{ flex: 1 }}
          label="Limit (optional)"
          type="number" value={limit}
          onChange={(e) =>
            onLimitChange(e.target.value)} />
        <TextField sx={{ flex: 1 }}
          label="Offset (optional)"
          type="number" value={offset}
          onChange={(e) =>
            onOffsetChange(e.target.value)} />
      </Box>
    </>
  );
}

export default QueryBuilderSorting;
