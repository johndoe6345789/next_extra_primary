import React from 'react';
import { DocContentBlock } from '../../../types/documentation';

/** Renders a code snippet block. */
export function CodeBlock({
  block,
}: {
  block: DocContentBlock;
}) {
  return (
    <pre
      style={{
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: '#f5f5f5',
        overflowX: 'auto',
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
      }}
    >
      <code>{block.content}</code>
    </pre>
  );
}

export default CodeBlock;
