'use client';

import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

/**
 * Props for the ProgressBar component.
 */
export interface ProgressBarProps {
  /** Current progress value (0-100) */
  value: number;
  /** Accessible label for the progress bar */
  label?: string;
  /** Whether to display the percentage text */
  showPercentage?: boolean;
  /** MUI progress bar color */
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | 'inherit';
  /** data-testid attribute for testing */
  testId?: string;
}

/**
 * A linear progress bar wrapping MUI LinearProgress.
 * Includes full ARIA attributes and an optional
 * percentage label.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label = 'Progress',
  showPercentage = false,
  color = 'primary',
  testId = 'progress-bar',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center' }}
      data-testid={testId}
    >
      <Box sx={{ flexGrow: 1, mr: showPercentage ? 1 : 0 }}>
        <LinearProgress
          variant="determinate"
          value={clamped}
          color={color}
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </Box>
      {showPercentage && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ minWidth: 40 }}
        >
          {`${Math.round(clamped)}%`}
        </Typography>
      )}
    </Box>
  );
};

export default ProgressBar;
