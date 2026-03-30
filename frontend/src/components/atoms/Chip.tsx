'use client';

import React from 'react';
import MuiChip from '@metabuilder/m3/Chip';

/**
 * Props for the Chip component.
 */
export interface ChipProps {
  /** Text displayed inside the chip */
  label: string;
  /** MUI chip color */
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | 'default';
  /** Display variant */
  variant?: 'filled' | 'outlined';
  /** Optional leading icon element */
  icon?: React.ReactElement;
  /** Delete handler; shows delete icon when set */
  onDelete?: () => void;
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /** Chip size */
  size?: 'small' | 'medium';
  /** data-testid attribute for testing */
  testId?: string;
}

/**
 * A chip / tag component wrapping MUI Chip.
 * Supports click, delete, and icon capabilities.
 */
export const Chip: React.FC<ChipProps> = ({
  label,
  color = 'default',
  variant = 'filled',
  icon,
  onDelete,
  onClick,
  size = 'medium',
  testId = 'chip',
}) => {
  return (
    <MuiChip
      label={label}
      color={color}
      variant={variant}
      icon={icon}
      onDelete={onDelete}
      onClick={onClick}
      size={size}
      aria-label={label}
      data-testid={testId}
    />
  );
};

export default Chip;
