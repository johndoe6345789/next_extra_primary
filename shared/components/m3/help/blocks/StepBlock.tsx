import React from 'react';
import { DocContentBlock } from '../../../types/documentation';

/** Renders a step block with icon. */
export function StepBlock({
  block,
}: {
  block: DocContentBlock;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: '#f9f9f9',
        borderLeft: '3px solid #2196f3',
        borderRadius: '4px',
      }}
    >
      <div
        style={{
          minWidth: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
        }}
      >
        {block.icon}
      </div>
      <p style={{ lineHeight: 1.6, margin: 0 }}>
        {block.content}
      </p>
    </div>
  );
}

/** Renders an example block. */
export function ExampleBlock({
  block,
}: {
  block: DocContentBlock;
}) {
  return (
    <div
      style={{
        marginBottom: '16px',
        padding: '16px',
        backgroundColor: '#fafafa',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
      }}
    >
      {block.title && (
        <h3
          style={{
            fontWeight: 600,
            marginBottom: '8px',
            marginTop: 0,
          }}
        >
          Example: {block.title}
        </h3>
      )}
      <p style={{ margin: 0 }}>
        {block.content}
      </p>
    </div>
  );
}
