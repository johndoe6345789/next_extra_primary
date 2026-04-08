import React from 'react';
import { testId } from '../../utils/accessibility';

interface HelpModalFooterProps {
  canGoBack: boolean;
  onBack: () => void;
  onClose: () => void;
}

/**
 * HelpModalFooter - Back and Close buttons
 * at the bottom of the help modal.
 */
export function HelpModalFooter({
  canGoBack,
  onBack,
  onClose,
}: HelpModalFooterProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderTop:
          '1px solid var(--color-border)',
      }}
    >
      <button
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Go back to previous page"
        data-testid={testId.button(
          'help-back'
        )}
        style={{
          padding: '8px 16px',
          backgroundColor: !canGoBack
            ? 'var(--color-surface-hover)'
            : 'transparent',
          border:
            '1px solid var(--color-border)',
          borderRadius: '4px',
          cursor: !canGoBack
            ? 'not-allowed'
            : 'pointer',
          opacity: !canGoBack ? 0.5 : 1,
        }}
      >
        &larr; Back
      </button>
      <button
        onClick={onClose}
        data-testid={testId.button(
          'close-help-footer'
        )}
        style={{
          padding: '8px 16px',
          backgroundColor:
            'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        Close
      </button>
    </div>
  );
}

export default HelpModalFooter;
