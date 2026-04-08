import React from 'react';
import { DocContentBlock } from '../../../types/documentation';

/** Renders a text paragraph block. */
export function TextBlock({
  block,
}: {
  block: DocContentBlock;
}) {
  return (
    <p style={{ lineHeight: 1.6 }}>
      {block.content}
    </p>
  );
}

export default TextBlock;
