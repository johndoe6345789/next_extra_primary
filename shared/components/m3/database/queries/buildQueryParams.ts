import type {
  WhereCondition,
  QueryBuilderParams,
} from './queryBuilderTypes';

/**
 * Build query params from current state.
 * @param table - Selected table name.
 * @param columns - Selected columns.
 * @param conditions - WHERE conditions.
 * @param orderByCol - ORDER BY column.
 * @param orderByDir - ORDER BY direction.
 * @param limit - LIMIT value.
 * @param offset - OFFSET value.
 * @returns Structured query parameters.
 */
export function buildQueryParams(
  table: string,
  columns: string[],
  conditions: WhereCondition[],
  orderByCol: string,
  orderByDir: 'ASC' | 'DESC',
  limit: string,
  offset: string
): QueryBuilderParams {
  const params: QueryBuilderParams = { table };
  if (columns.length > 0) {
    params.columns = columns;
  }
  if (conditions.length > 0) {
    params.where = conditions
      .filter((c) => c.column && c.operator)
      .map((c) => ({
        column: c.column,
        operator: c.operator,
        value:
          c.operator === 'IS NULL' ||
          c.operator === 'IS NOT NULL'
            ? undefined
            : c.value,
      }));
  }
  if (orderByCol) {
    params.orderBy = {
      column: orderByCol,
      direction: orderByDir,
    };
  }
  if (limit) {
    params.limit = Number.parseInt(limit, 10);
  }
  if (offset) {
    params.offset = Number.parseInt(offset, 10);
  }
  return params;
}
