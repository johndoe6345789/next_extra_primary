'use client';

import React from 'react';
import MuiTooltip from '@mui/material/Tooltip';

/**
 * Props for the Tooltip component.
 */
export interface TooltipProps {
  /** Text displayed inside the tooltip */
  title: string;
  /** Preferred placement of the tooltip */
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end';
  /** The element that triggers the tooltip */
  children: React.ReactElement;
  /** Whether to show the tooltip arrow */
  arrow?: boolean;
  /** data-testid attribute for testing */
  testId?: string;
}

/**
 * A tooltip component wrapping MUI Tooltip.
 * Renders an informational popup on hover or focus.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  title,
  placement = 'top',
  children,
  arrow = true,
  testId = 'tooltip',
}) => {
  return (
    <MuiTooltip
      title={title}
      placement={placement}
      arrow={arrow}
      data-testid={testId}
    >
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
