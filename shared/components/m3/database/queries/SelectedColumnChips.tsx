'use client';

import { Box } from '../../layout';
import { Chip } from '../../data-display';

/** Props for SelectedColumnChips. */
export interface SelectedColumnChipsProps {
  selectedColumns: string[];
}

/**
 * Displays selected columns as small chips
 * below the column selector.
 */
export function SelectedColumnChips({
  selectedColumns,
}: SelectedColumnChipsProps) {
  if (selectedColumns.length === 0) return null;
  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 0.5,
      mt: 1,
    }}>
      {selectedColumns.map((value) => (
        <Chip
          key={value}
          label={value}
          size="small"
        />
      ))}
    </Box>
  );
}

export default SelectedColumnChips;
