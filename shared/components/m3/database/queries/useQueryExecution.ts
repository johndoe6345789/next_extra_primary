'use client';

import type {
  QueryBuilderParams, QueryResult,
} from './queryBuilderTypes';
import { buildQueryParams }
  from './buildQueryParams';
import type { useQueryBuilderState }
  from './useQueryBuilderState';

type State = ReturnType<
  typeof useQueryBuilderState
>;

/**
 * Query execution handler factory.
 * @param s - Builder state.
 * @param onExecuteQuery - API executor.
 * @returns Execute and table change handlers.
 */
export function useQueryExecution(
  s: State,
  onExecuteQuery: (
    params: QueryBuilderParams
  ) => Promise<QueryResult>,
  onFetchColumns: (
    name: string
  ) => Promise<string[]>
) {
  const handleTableChange = async (
    tableName: string
  ) => {
    s.setSelectedTable(tableName);
    s.setSelectedColumns([]);
    s.setWhereConditions([]);
    s.setOrderByColumn('');
    s.setResult(null);
    s.setGeneratedQuery('');
    if (!tableName) {
      s.setAvailableColumns([]);
      return;
    }
    try {
      const cols =
        await onFetchColumns(tableName);
      s.setAvailableColumns(cols);
    } catch (err) {
      console.error(
        'Failed to fetch columns:', err);
    }
  };

  const handleExecuteQuery = async () => {
    if (!s.selectedTable) {
      s.setError('Please select a table');
      return;
    }
    s.setLoading(true);
    s.setError('');
    try {
      const params = buildQueryParams(
        s.selectedTable, s.selectedColumns,
        s.whereConditions, s.orderByColumn,
        s.orderByDirection,
        s.limit, s.offset);
      const data =
        await onExecuteQuery(params);
      s.setResult(data);
      s.setGeneratedQuery(data.query || '');
    } catch (err: unknown) {
      const msg = err instanceof Error
        ? err.message
        : 'Query execution failed';
      s.setError(msg);
    } finally { s.setLoading(false); }
  };

  return { handleTableChange, handleExecuteQuery };
}
