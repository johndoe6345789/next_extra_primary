'use client';

import { Box } from '../../layout';
import { Paper } from '../../surfaces';
import { Typography } from '../../data-display';
import { DataGrid } from '../grids';
import type { QueryResult } from './queryBuilderTypes';

/** Props for the query results panel. */
export interface QueryBuilderResultsProps {
  error: string;
  generatedQuery: string;
  result: QueryResult | null;
}

/**
 * Displays error, generated SQL, and query
 * results for the query builder.
 */
export function QueryBuilderResults({
  error,
  generatedQuery,
  result,
}: QueryBuilderResultsProps) {
  return (
    <>
      {error && (
        <Paper
          sx={{ p: 2, mt: 2, bgcolor: 'error.light' }}
        >
          <Typography color="error">
            {error}
          </Typography>
        </Paper>
      )}

      {generatedQuery && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography
            variant="subtitle2"
            gutterBottom
          >
            Generated SQL:
          </Typography>
          <Box
            component="pre"
            sx={{
              p: 1,
              bgcolor: 'grey.100',
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.875rem',
            }}
          >
            {generatedQuery}
          </Box>
        </Paper>
      )}

      {result && result.rows && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Results ({result.rowCount} rows)
          </Typography>
          {result.rows.length > 0 && (
            <DataGrid
              columns={Object.keys(
                result.rows[0]
              ).map((key) => ({
                name: key,
              }))}
              rows={result.rows}
            />
          )}
          {result.rows.length === 0 && (
            <Typography color="text.secondary">
              No results found
            </Typography>
          )}
        </Paper>
      )}
    </>
  );
}

export default QueryBuilderResults;
