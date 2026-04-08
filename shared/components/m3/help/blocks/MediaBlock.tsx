import React from 'react';
import { DocContentBlock } from '../../../types/documentation';

/** Renders an image block with caption. */
export function ImageBlock({
  block,
}: {
  block: DocContentBlock;
}) {
  return (
    <div
      style={{
        marginBottom: '16px',
        textAlign: 'center',
      }}
    >
      <img
        src={block.content}
        alt={
          block.title || 'Documentation image'
        }
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '4px',
        }}
      />
      {block.title && (
        <p
          style={{
            display: 'block',
            marginTop: '8px',
            fontSize: '0.875rem',
            color: '#666',
          }}
        >
          {block.title}
        </p>
      )}
    </div>
  );
}

/** Renders a video embed block. */
export function VideoBlock({
  block,
}: {
  block: DocContentBlock;
}) {
  return (
    <div
      style={{
        marginBottom: '16px',
        position: 'relative',
        paddingTop: '56.25%',
        height: 0,
        overflow: 'hidden',
      }}
    >
      <iframe
        src={block.content}
        title={block.title}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '4px',
        }}
        allowFullScreen
      />
    </div>
  );
}
