'use client';

import { Typography } from '../../data-display';
import { useQueryBuilder }
  from './useQueryBuilder';
import { QueryBuilderForm }
  from './QueryBuilderForm';
import { QueryBuilderResults }
  from './QueryBuilderResults';
import { DEFAULT_OPERATORS }
  from './queryBuilderTypes';
import type { QueryBuilderTabProps }
  from './queryBuilderTypes';

export type {
  QueryBuilderTabProps, QueryBuilderParams,
  QueryResult, QueryOperator, WhereCondition,
} from './queryBuilderTypes';

/**
 * QueryBuilderTab - Visual SQL query builder.
 * Builds SELECT queries with table/column
 * selection, filters, and sorting.
 */
export function QueryBuilderTab({
  tables, onExecuteQuery, onFetchColumns,
  operators = DEFAULT_OPERATORS, testId,
}: QueryBuilderTabProps) {
  const qb = useQueryBuilder(
    onExecuteQuery, onFetchColumns);
  return (
    <div data-testid={testId}>
      <Typography variant="h5" gutterBottom>
        Query Builder
      </Typography>
      <Typography variant="body2"
        color="text.secondary" gutterBottom>
        Build SELECT queries visually
      </Typography>
      <QueryBuilderForm tables={tables}
        qb={qb} operators={operators} />
      <QueryBuilderResults
        error={qb.error}
        generatedQuery={qb.generatedQuery}
        result={qb.result} />
    </div>
  );
}

export default QueryBuilderTab;
