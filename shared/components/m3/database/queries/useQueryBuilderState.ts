'use client';

import { useState } from 'react';
import type {
  WhereCondition,
  QueryResult,
} from './queryBuilderTypes';

/**
 * Internal state for the QueryBuilder hook.
 * @returns All state values and setters.
 */
export function useQueryBuilderState() {
  const [selectedTable, setSelectedTable] =
    useState('');
  const [selectedColumns, setSelectedColumns] =
    useState<string[]>([]);
  const [availableColumns, setAvailableColumns] =
    useState<string[]>([]);
  const [whereConditions, setWhereConditions] =
    useState<WhereCondition[]>([]);
  const [orderByColumn, setOrderByColumn] =
    useState('');
  const [orderByDirection, setOrderByDirection] =
    useState<'ASC' | 'DESC'>('ASC');
  const [limit, setLimit] = useState('');
  const [offset, setOffset] = useState('');
  const [result, setResult] =
    useState<QueryResult | null>(null);
  const [generatedQuery, setGeneratedQuery] =
    useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return {
    selectedTable,
    setSelectedTable,
    selectedColumns,
    setSelectedColumns,
    availableColumns,
    setAvailableColumns,
    whereConditions,
    setWhereConditions,
    orderByColumn,
    setOrderByColumn,
    orderByDirection,
    setOrderByDirection,
    limit,
    setLimit,
    offset,
    setOffset,
    result,
    setResult,
    generatedQuery,
    setGeneratedQuery,
    loading,
    setLoading,
    error,
    setError,
  };
}
