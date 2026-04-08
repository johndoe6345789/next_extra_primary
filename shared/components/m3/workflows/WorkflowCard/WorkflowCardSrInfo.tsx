import React from 'react';

interface WorkflowCardSrInfoProps {
  id: string;
  nodeCount: number;
  connectionCount: number;
  isSelected: boolean;
  isDragging: boolean;
}

/**
 * Screen-reader-only description of workflow
 * card state and available interactions.
 */
export function WorkflowCardSrInfo({
  id,
  nodeCount,
  connectionCount,
  isSelected,
  isDragging,
}: WorkflowCardSrInfoProps) {
  return (
    <div
      id={`workflow-${id}-info`}
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {nodeCount} nodes, {connectionCount}{' '}
      connections.{' '}
      {isSelected
        ? 'Currently selected.'
        : ''}{' '}
      {isDragging ? 'Currently dragging.' : ''}
      Use arrow keys to move, drag to
      reposition, or resize handles to resize.
    </div>
  );
}

export default WorkflowCardSrInfo;
