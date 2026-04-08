import React from 'react';
import { DocContentBlock } from '../../../types/documentation';
import { testId } from '../../../utils/accessibility';

const BG: Record<string, string> = {
  error: '#ffebee',
  warning: '#fff3e0',
};
const BORDER: Record<string, string> = {
  error: '#f44336',
  warning: '#ff9800',
};

/** Renders a callout/alert block. */
export function CalloutBlock({
  block,
}: {
  block: DocContentBlock;
}) {
  const v = block.variant || 'info';
  return (
    <div
      style={{
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: BG[v] || '#e3f2fd',
        borderLeft: `4px solid ${BORDER[v] || '#2196f3'}`,
        borderRadius: '4px',
      }}
      data-testid={testId.alert(
        `callout-${v}`
      )}
    >
      <p style={{ margin: '0 0 8px 0' }}>
        {block.content}
      </p>
      {block.subtext && (
        <p
          style={{
            margin: '0',
            fontSize: '0.875rem',
          }}
        >
          {block.subtext}
        </p>
      )}
    </div>
  );
}

export default CalloutBlock;
