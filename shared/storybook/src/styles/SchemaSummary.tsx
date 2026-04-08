/**
 * Schema summary grid for the Styles Panel.
 */

import React from 'react';

/** Props for the SchemaSummary component. */
interface SchemaSummaryProps {
  /** V2 style schema data. */
  schema: Record<string, unknown>;
}

/** Displays a grid of schema section counts. */
export const SchemaSummary: React.FC<
  SchemaSummaryProps
> = ({ schema }) => {
  const counts = {
    tokens: Object.keys(
      (schema.tokens as Record<string, unknown>)
        ?.colors || {},
    ).length,
    selectors:
      (schema.selectors as unknown[])?.length || 0,
    effects:
      (schema.effects as unknown[])?.length || 0,
    appearance:
      (schema.appearance as unknown[])?.length || 0,
    layouts:
      (schema.layouts as unknown[])?.length || 0,
    transitions:
      (schema.transitions as unknown[])?.length || 0,
    rules:
      (schema.rules as unknown[])?.length || 0,
    environments:
      (schema.environments as unknown[])?.length
      || 0,
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns:
        'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '0.5rem',
    }}>
      {Object.entries(counts).map(
        ([key, count]) => (
          <div
            key={key}
            style={{
              padding: '0.5rem',
              background: count > 0
                ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${
                count > 0 ? '#86efac' : '#fecaca'
              }`,
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: count > 0
                ? '#16a34a' : '#dc2626',
            }}>
              {count}
            </div>
            <div style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              color: '#666',
            }}>
              {key}
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export default SchemaSummary;
