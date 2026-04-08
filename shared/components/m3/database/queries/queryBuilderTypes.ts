/**
 * Type definitions for the QueryBuilder components.
 */

/** Operator option for WHERE clauses. */
export type QueryOperator = {
  value: string;
  label: string;
};

/** A single WHERE condition. */
export type WhereCondition = {
  column: string;
  operator: string;
  value: string;
};

/** Props for the QueryBuilderTab component. */
export type QueryBuilderTabProps = {
  tables: Array<{ table_name: string }>;
  onExecuteQuery: (
    params: QueryBuilderParams
  ) => Promise<QueryResult>;
  onFetchColumns: (
    tableName: string
  ) => Promise<string[]>;
  operators?: QueryOperator[];
  testId?: string;
};

/** Parameters sent to the query executor. */
export type QueryBuilderParams = {
  table: string;
  columns?: string[];
  where?: Array<{
    column: string;
    operator: string;
    value?: string;
  }>;
  orderBy?: {
    column: string;
    direction: 'ASC' | 'DESC';
  };
  limit?: number;
  offset?: number;
};

/** Result returned from query execution. */
export type QueryResult = {
  rows: Record<string, unknown>[];
  rowCount: number;
  query?: string;
};

/** Default SQL operators for WHERE conditions. */
export const DEFAULT_OPERATORS: QueryOperator[] = [
  { value: '=', label: 'Equals (=)' },
  { value: '!=', label: 'Not Equals (!=)' },
  { value: '>', label: 'Greater Than (>)' },
  { value: '<', label: 'Less Than (<)' },
  { value: '>=', label: 'Greater or Equal (>=)' },
  { value: '<=', label: 'Less or Equal (<=)' },
  { value: 'LIKE', label: 'Like (LIKE)' },
  { value: 'ILIKE', label: 'Like (Case Insensitive)' },
  { value: 'IN', label: 'In (IN)' },
  { value: 'IS NULL', label: 'Is Null' },
  { value: 'IS NOT NULL', label: 'Is Not Null' },
];
