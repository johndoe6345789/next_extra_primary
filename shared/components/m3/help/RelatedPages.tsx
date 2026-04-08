import React from 'react';
import { testId } from '../../utils/accessibility';

interface RelatedPagesProps {
  ids: string[];
  onPageSelect?: (id: string) => void;
}

/** Renders a list of related topic links. */
export function RelatedPages({
  ids,
  onPageSelect,
}: RelatedPagesProps) {
  return (
    <div
      style={{
        marginTop: '32px',
        paddingTop: '16px',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <h2
        style={{
          marginBottom: '16px',
          fontWeight: 600,
        }}
      >
        Related Topics
      </h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {ids.map((id) => (
          <button
            key={id}
            onClick={() =>
              onPageSelect?.(id)
            }
            style={{
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              color: '#2196f3',
              textAlign: 'left',
              padding: 0,
              fontSize: 'inherit',
            }}
            data-testid={testId.link(
              `related-${id}`
            )}
          >
            View related topic &rarr;
          </button>
        ))}
      </div>
    </div>
  );
}

export default RelatedPages;
