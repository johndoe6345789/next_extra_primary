import React from 'react';

/** Default circular spinner indicator. */
export const DefaultSpinner: React.FC = () => (
  <span className="m3-loading-button-spinner">
    <svg
      className="m3-loading-button-spinner-svg"
      viewBox="22 22 44 44"
    >
      <circle
        className="m3-loading-button-spinner-circle"
        cx="44"
        cy="44"
        r="20.2"
        fill="none"
        strokeWidth="3.6"
      />
    </svg>
  </span>
);

interface LoadingButtonContentProps {
  children?: React.ReactNode;
  loading: boolean;
  loadingPosition: 'start' | 'end' | 'center';
  indicator: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

/**
 * Renders the inner content of a
 * LoadingButton based on loading state.
 */
export function LoadingButtonContent({
  children,
  loading,
  loadingPosition,
  indicator,
  startIcon,
  endIcon,
}: LoadingButtonContentProps) {
  if (loading && loadingPosition === 'center') {
    return (
      <>
        <span className="m3-loading-button-label-hidden">
          {children}
        </span>
        <span className="m3-loading-button-loading-indicator">
          {indicator}
        </span>
      </>
    );
  }

  return (
    <>
      {loading && loadingPosition === 'start' ? (
        <span className="m3-loading-button-loading-indicator-start">
          {indicator}
        </span>
      ) : (
        startIcon && (
          <span className="m3-loading-button-start-icon">
            {startIcon}
          </span>
        )
      )}
      {children}
      {loading && loadingPosition === 'end' ? (
        <span className="m3-loading-button-loading-indicator-end">
          {indicator}
        </span>
      ) : (
        endIcon && (
          <span className="m3-loading-button-end-icon">
            {endIcon}
          </span>
        )
      )}
    </>
  );
}

export default LoadingButtonContent;
