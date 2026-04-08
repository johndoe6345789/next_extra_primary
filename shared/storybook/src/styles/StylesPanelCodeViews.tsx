/**
 * Code view sub-components for the Styles Panel.
 */

import React from 'react';
import { SchemaSummary } from './SchemaSummary';

/** Pre-formatted code block styles. */
const PRE_STYLE: React.CSSProperties = {
  background: '#1e1e1e',
  color: '#d4d4d4',
  padding: '1rem',
  borderRadius: '4px',
  overflow: 'auto',
  maxHeight: '600px',
};

/** CSS output view. */
export const CSSView: React.FC<{
  css: string;
}> = ({ css }) => (
  <div>
    <div style={{
      marginBottom: '0.5rem',
      fontSize: '11px',
      color: '#666',
    }}>
      {css.split('\n').length} lines
      &middot; {css.length} bytes
    </div>
    <pre style={PRE_STYLE}>
      {css || '/* No CSS generated */'}
    </pre>
  </div>
);

/** Schema JSON view. */
export const SchemaView: React.FC<{
  schema: Record<string, unknown> | null;
  isV2: boolean;
}> = ({ schema, isV2 }) => (
  <div>
    <div style={{
      marginBottom: '0.5rem',
      fontSize: '11px',
      color: '#666',
    }}>
      {isV2
        ? 'Abstract Styling System'
        : 'Legacy CSS Format'}
    </div>
    {isV2 && schema && (
      <div style={{ marginBottom: '1rem' }}>
        <SchemaSummary schema={schema} />
      </div>
    )}
    <pre style={PRE_STYLE}>
      {JSON.stringify(schema, null, 2)}
    </pre>
  </div>
);
