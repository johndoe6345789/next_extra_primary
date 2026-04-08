'use client';

import { Paper } from '../../surfaces';
import { QueryBuilderTableSelect }
  from './QueryBuilderTableSelect';
import { QueryBuilderFilters }
  from './QueryBuilderFilters';
import { QueryBuilderSorting }
  from './QueryBuilderSorting';
import { QueryBuilderActions }
  from './QueryBuilderActions';
import type { QueryOperator }
  from './queryBuilderTypes';

/** Props for the QueryBuilderForm. */
export interface QueryBuilderFormProps {
  tables: Array<{ table_name: string }>;
  qb: Record<string, unknown>;
  operators: QueryOperator[];
}

/**
 * Form section of the query builder with
 * table select, filters, sorting, actions.
 */
export function QueryBuilderForm({
  tables, qb, operators,
}: QueryBuilderFormProps) {
  const q = qb as Record<string, never>;
  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <QueryBuilderTableSelect tables={tables}
        selectedTable={q.selectedTable}
        onTableChange={q.handleTableChange}
        selectedColumns={q.selectedColumns}
        onColumnsChange={q.setSelectedColumns}
        availableColumns={
          q.availableColumns} />
      {q.selectedTable && (
        <>
          <QueryBuilderFilters
            conditions={q.whereConditions}
            availableColumns={
              q.availableColumns}
            operators={operators}
            onAdd={q.handleAddCondition}
            onRemove={q.handleRemoveCondition}
            onChange={
              q.handleConditionChange} />
          <QueryBuilderSorting
            availableColumns={
              q.availableColumns}
            orderByColumn={q.orderByColumn}
            onOrderByColumnChange={
              q.setOrderByColumn}
            orderByDirection={
              q.orderByDirection}
            onOrderByDirectionChange={
              q.setOrderByDirection}
            limit={q.limit}
            onLimitChange={q.setLimit}
            offset={q.offset}
            onOffsetChange={q.setOffset} />
          <QueryBuilderActions
            onExecute={q.handleExecuteQuery}
            onReset={() => {}}
            loading={q.loading} />
        </>
      )}
    </Paper>
  );
}

export default QueryBuilderForm;
