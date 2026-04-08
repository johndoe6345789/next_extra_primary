'use client';
/**
 * WorkflowCard - Draggable and resizable
 * workflow card on the canvas.
 */

import React, { useCallback } from 'react';
import { WorkflowCardProps } from './workflowCardTypes';
import { WorkflowCardHeader } from './WorkflowCardHeader';
import { WorkflowCardPreview } from './WorkflowCardPreview';
import { WorkflowCardFooter } from './WorkflowCardFooter';
import { WorkflowCardActions } from './WorkflowCardActions';
import { WorkflowCardSrInfo } from './WorkflowCardSrInfo';
import { useDragResize } from './useDragResize';
import { testId } from '../../../../hooks/useAccessible';

export const WorkflowCard: React.FC<WorkflowCardProps> = ({
  item, workflow, isSelected,
  onSelect, onUpdatePosition, onUpdateSize,
  onDelete, onOpen, zoom, snapToGrid,
}) => {
  const { cardRef, isDragging, handleDragStart, handleResizeStart } =
    useDragResize({ item, zoom, snapToGrid, onUpdatePosition, onUpdateSize });

  const handleSelect = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(item.id, e.ctrlKey || e.metaKey || e.shiftKey);
  }, [item.id, onSelect]);

  const nodeCount = workflow?.nodes?.length || 0;
  const connCount = workflow?.connections?.length || 0;

  return (
    <div
      ref={cardRef} data-selected={isSelected} data-dragging={isDragging}
      style={{
        left: `${item.position.x}px`, top: `${item.position.y}px`,
        width: `${item.size.width}px`, height: `${item.size.height}px`,
        borderColor: item.color || 'var(--color-primary)',
        zIndex: item.zIndex, position: 'absolute',
        border: '2px solid', borderRadius: '4px',
        backgroundColor: 'var(--color-surface)',
        boxShadow: isSelected ? 'var(--shadow-lg)' : 'var(--shadow-md)',
        opacity: isDragging ? 0.8 : 1,
        transition: 'box-shadow 200ms ease-in-out, opacity 200ms ease-in-out',
      }}
      onMouseDown={handleSelect} onMouseMove={handleDragStart}
      data-testid={testId.workflowCard(item.id)}
      role="article" aria-label={`Workflow card: ${workflow?.name}`}
      aria-selected={isSelected} aria-grabbed={isDragging}
      tabIndex={0} aria-describedby={`workflow-${item.id}-info`}
    >
      <WorkflowCardHeader
        workflowName={workflow?.name ?? ''} workflowId={workflow?.id ?? ''}
        onOpen={onOpen} onDelete={onDelete} itemId={item.id}
      />
      <WorkflowCardPreview nodeCount={nodeCount} isMinimized={item.minimized ?? false} />
      <WorkflowCardFooter nodeCount={nodeCount} connectionCount={connCount} />
      <WorkflowCardActions onResizeStart={handleResizeStart} />
      <WorkflowCardSrInfo
        id={item.id} nodeCount={nodeCount}
        connectionCount={connCount}
        isSelected={isSelected} isDragging={isDragging}
      />
    </div>
  );
};

export default React.memo(WorkflowCard, (prev, next) => (
  prev.item.id === next.item.id &&
  prev.item.position.x === next.item.position.x &&
  prev.item.position.y === next.item.position.y &&
  prev.item.size.width === next.item.size.width &&
  prev.item.size.height === next.item.size.height &&
  prev.isSelected === next.isSelected &&
  prev.item.zIndex === next.item.zIndex
));
