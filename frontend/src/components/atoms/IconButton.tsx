'use client';

import React from 'react';
import MuiIconButton from '@metabuilder/m3/IconButton';
import MuiTooltip from '@metabuilder/m3/Tooltip';

/**
 * Props for the IconButton component.
 */
export interface IconButtonProps {
  /** The icon element to render */
  icon: React.ReactNode;
  /** Required accessible label for the button */
  ariaLabel: string;
  /** MUI icon button color */
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | 'default'
    | 'inherit';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Optional tooltip text shown on hover */
  tooltip?: string;
  /** data-testid attribute for testing */
  testId?: string;
}

/**
 * An icon-only button wrapping MUI IconButton.
 * Optionally wraps with a Tooltip when the tooltip
 * prop is provided.
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  ariaLabel,
  color = 'default',
  size = 'medium',
  onClick,
  disabled = false,
  tooltip,
  testId = 'icon-button',
}) => {
  const button = (
    <MuiIconButton
      aria-label={ariaLabel}
      color={color}
      size={size}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      {icon}
    </MuiIconButton>
  );

  if (tooltip) {
    return (
      <MuiTooltip title={tooltip} arrow>
        {disabled ? <span>{button}</span> : button}
      </MuiTooltip>
    );
  }

  return button;
};

export default IconButton;
