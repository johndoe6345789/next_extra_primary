'use client';
import React, { forwardRef } from 'react';
import { classNames } from '../utils/classNames';
import {
  DefaultSpinner,
  LoadingButtonContent,
} from './LoadingButtonContent';

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<
    HTMLButtonElement
  > {
  children?: React.ReactNode;
  loading?: boolean;
  loadingIndicator?: React.ReactNode;
  loadingPosition?: 'start' | 'end' | 'center';
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * LoadingButton - A button with loading state.
 */
export const LoadingButton = forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(function LoadingButton(
  {
    children, loading = false, loadingIndicator,
    loadingPosition = 'center', disabled,
    startIcon, endIcon, variant = 'contained',
    color = 'primary', size = 'medium',
    fullWidth = false, className, testId,
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;
  const indicator = loadingIndicator || <DefaultSpinner />;

  return (
    <button
      ref={ref}
      className={classNames(
        'm3-loading-button',
        `m3-loading-button-${variant}`,
        `m3-loading-button-${color}`,
        `m3-loading-button-${size}`,
        className,
        {
          'm3-loading-button-loading': loading,
          'm3-loading-button-disabled': isDisabled,
          'm3-loading-button-fullwidth': fullWidth,
        }
      )}
      disabled={isDisabled}
      aria-busy={loading}
      data-testid={testId}
      {...props}
    >
      <LoadingButtonContent
        loading={loading}
        loadingPosition={loadingPosition}
        indicator={indicator}
        startIcon={startIcon}
        endIcon={endIcon}
      >
        {children}
      </LoadingButtonContent>
    </button>
  );
});

export default LoadingButton;
