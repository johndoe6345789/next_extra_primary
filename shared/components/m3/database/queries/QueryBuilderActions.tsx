'use client';

import { Box } from '../../layout';
import { Button } from '../../inputs';
import { Play } from '../../icons';

/** Props for QueryBuilderActions. */
export interface QueryBuilderActionsProps {
  onExecute: () => void;
  onReset: () => void;
  loading: boolean;
}

/**
 * Execute and Reset buttons for the query
 * builder form.
 */
export function QueryBuilderActions({
  onExecute, onReset, loading,
}: QueryBuilderActionsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        variant="contained"
        onClick={onExecute}
        disabled={loading}
      >
        <Play /> Execute Query
      </Button>
      <Button
        variant="outlined"
        onClick={onReset}
      >
        Reset
      </Button>
    </Box>
  );
}

export default QueryBuilderActions;
