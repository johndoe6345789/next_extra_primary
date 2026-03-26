'use client';

import React, { useState } from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

/** Props for PeriodFilter. */
export interface PeriodFilterProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Weekly / Monthly / All Time toggle filter.
 */
export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  testId = 'period-filter',
}) => {
  const [per, setPer] = useState('all-time');
  return (
    <ToggleButtonGroup
      value={per}
      exclusive
      onChange={(_, v) => v && setPer(v)}
      size="small"
      aria-label="Period"
      data-testid={testId}
      sx={{ mb: 2 }}
    >
      <ToggleButton value="weekly">Weekly</ToggleButton>
      <ToggleButton value="monthly">Monthly</ToggleButton>
      <ToggleButton value="all-time">All Time</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default PeriodFilter;
