import React from 'react';
import { DocContentBlock } from '../../../types/documentation';
import { HeadingBlock } from './HeadingBlock';
import { TextBlock } from './TextBlock';
import { CodeBlock } from './CodeBlock';
import { ListBlock } from './ListBlock';
import { TableBlock } from './TableBlock';
import { CalloutBlock } from './CalloutBlock';
import { StepBlock, ExampleBlock } from './StepBlock';
import { ImageBlock, VideoBlock } from './MediaBlock';

/**
 * ContentBlock - Dispatches rendering to the
 * appropriate block component by type.
 */
export const ContentBlock: React.FC<{
  block: DocContentBlock;
}> = ({ block }) => {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock block={block} />;
    case 'text':
      return <TextBlock block={block} />;
    case 'code':
      return <CodeBlock block={block} />;
    case 'list':
      return <ListBlock block={block} />;
    case 'table':
      return <TableBlock block={block} />;
    case 'callout':
      return <CalloutBlock block={block} />;
    case 'step':
      return <StepBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'video':
      return <VideoBlock block={block} />;
    case 'example':
      return <ExampleBlock block={block} />;
    default:
      return null;
  }
};

export default ContentBlock;
