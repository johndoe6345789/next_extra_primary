'use client';

import type {
  QueryBuilderParams, QueryResult,
} from './queryBuilderTypes';
import { useQueryBuilderState }
  from './useQueryBuilderState';
import { useQueryConditions }
  from './useQueryConditions';
import { useQueryExecution }
  from './useQueryExecution';

/**
 * Hook encapsulating all QueryBuilder state
 * and logic.
 */
export function useQueryBuilder(
  onExecuteQuery: (
    params: QueryBuilderParams
  ) => Promise<QueryResult>,
  onFetchColumns: (
    tableName: string
  ) => Promise<string[]>
) {
  const s = useQueryBuilderState();
  const conds = useQueryConditions(
    s.whereConditions, s.setWhereConditions
  );
  const exec = useQueryExecution(
    s, onExecuteQuery, onFetchColumns
  );

  return {
    ...s,
    ...conds,
    ...exec,
  };
}
