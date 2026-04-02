'use client';

import React from 'react';
import MuiButton from '@shared/m3/Button';

/**
 * Props for the Button component.
 */
export interface ButtonProps {
  /** Button label text. */
  children: React.ReactNode;
  /** MUI button variant. */
  variant?: 'contained' | 'outlined' | 'text';
  /** MUI button color. */
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | 'inherit';
  /** Button size. */
  size?: 'small' | 'medium' | 'large';
  /** Whether the button is disabled. */
  disabled?: boolean;
  /** Click handler. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** HTML button type attribute. */
  type?: 'button' | 'submit' | 'reset';
  /** Whether the button spans full width. */
  fullWidth?: boolean;
  /** Optional start icon element. */
  startIcon?: React.ReactNode;
  /** Optional end icon element. */
  endIcon?: React.ReactNode;
  /** Accessible label. */
  ariaLabel?: string;
  /** Optional link href (renders as anchor). */
  href?: string;
  /** Additional CSS class names. */
  className?: string;
  /** data-testid attribute for testing. */
  testId?: string;
}

/**
 * A button component wrapping MUI Button.
 * Supports all common button patterns.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  startIcon,
  endIcon,
  ariaLabel,
  href,
  className,
  testId = 'button',
}) => (
  <MuiButton
    variant={variant}
    color={color}
    size={size}
    disabled={disabled}
    onClick={onClick}
    type={type}
    fullWidth={fullWidth}
    startIcon={startIcon}
    endIcon={endIcon}
    aria-label={ariaLabel}
    href={href}
    className={className}
    data-testid={testId}
  >
    {children}
  </MuiButton>
);

export default Button;
