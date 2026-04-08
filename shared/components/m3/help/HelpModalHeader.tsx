import React from 'react';
import { testId } from '../../utils/accessibility';

interface HelpModalHeaderProps {
  onClose: () => void;
}

/**
 * HelpModalHeader - Title bar with close button
 * for the help modal.
 */
export function HelpModalHeader({
  onClose,
}: HelpModalHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px',
        borderBottom:
          '1px solid var(--color-border)',
      }}
    >
      <h2
        id="help-modal-title"
        style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 600,
        }}
      >
        Help & Documentation
      </h2>
      <button
        onClick={onClose}
        aria-label="Close help modal"
        data-testid={testId.button(
          'close-help'
        )}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          color:
            'var(--color-text-secondary)',
        }}
      >
        &#10005;
      </button>
    </div>
  );
}

export default HelpModalHeader;
