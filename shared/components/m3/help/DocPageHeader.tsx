import React from 'react';
import { DocPage } from '../../types/documentation';

/** Renders the page title, description, and meta. */
export function DocPageHeader({
  page,
}: {
  page: DocPage;
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h1
        style={{
          fontWeight: 700,
          marginBottom: '4px',
          marginTop: 0,
        }}
      >
        {page.title}
      </h1>
      {page.description && (
        <p
          style={{
            color: '#666',
            marginBottom: '8px',
            margin: 0,
          }}
        >
          {page.description}
        </p>
      )}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginTop: '8px',
        }}
      >
        {page.difficulty && (
          <span
            style={{
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            Difficulty: {page.difficulty}
          </span>
        )}
        {page.estimatedReadTime && (
          <span
            style={{
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            Read time:{' '}
            {page.estimatedReadTime} min
          </span>
        )}
      </div>
    </div>
  );
}

export default DocPageHeader;
