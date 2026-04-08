'use client';

import { Box } from '../../layout';
import { Typography } from '../../data-display';
import { Button } from '../../inputs';
import { Add } from '../../icons';
import { QueryFilterRow }
  from './QueryFilterRow';
import type {
  WhereCondition, QueryOperator,
} from './queryBuilderTypes';

/** Props for WHERE condition filters. */
export interface QueryBuilderFiltersProps {
  conditions: WhereCondition[];
  availableColumns: string[];
  operators: QueryOperator[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (
    index: number,
    field: keyof WhereCondition,
    value: string
  ) => void;
}

/**
 * WHERE condition filter rows for the
 * query builder.
 */
export function QueryBuilderFilters({
  conditions, availableColumns,
  operators, onAdd, onRemove, onChange,
}: QueryBuilderFiltersProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', mb: 1,
      }}>
        <Typography variant="subtitle1">
          WHERE Conditions
        </Typography>
        <Button size="small" onClick={onAdd}>
          <Add /> Add Condition
        </Button>
      </Box>
      {conditions.map((condition, index) => (
        <QueryFilterRow key={index}
          condition={condition} index={index}
          availableColumns={availableColumns}
          operators={operators}
          onChange={onChange}
          onRemove={onRemove} />
      ))}
    </Box>
  );
}

export default QueryBuilderFilters;
