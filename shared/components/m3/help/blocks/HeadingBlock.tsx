import React from 'react';
import { DocContentBlock } from '../../../types/documentation';

/** Renders a heading content block. */
export function HeadingBlock({
  block,
}: {
  block: DocContentBlock;
}) {
  const Tag = (
    `h${block.level}` as keyof React.JSX.IntrinsicElements
  ) || 'h2';
  return React.createElement(
    Tag,
    {
      style: {
        marginTop: '16px',
        marginBottom: '8px',
        fontWeight: 600,
      },
    },
    block.content
  );
}

export default HeadingBlock;
