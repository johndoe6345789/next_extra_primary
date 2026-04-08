'use client';

import type { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import DraggableWidgetHeader from
  './DraggableWidgetHeader';

/** Props for the DraggableWidget wrapper. */
export interface DraggableWidgetProps {
  /** Unique widget ID for sorting. */
  id: string;
  /** Translated widget title. */
  title: string;
  /** Callback when widget is removed. */
  onRemove: () => void;
  /** Widget content. */
  children: ReactNode;
  /** data-testid for testing. */
  testId?: string;
}

/**
 * Draggable card wrapper for dashboard widgets.
 * Provides a drag handle and a remove button.
 */
export default function DraggableWidget({
  id, title, onRemove, children,
  testId = 'draggable-widget',
}: DraggableWidgetProps) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      data-testid={testId}
      aria-label={title}
      sx={{ height: '100%' }}
    >
      <DraggableWidgetHeader
        title={title}
        attributes={attributes}
        listeners={listeners}
        onRemove={onRemove}
        testId={testId}
      />
      <CardContent sx={{ pt: 0.5 }}>
        {children}
      </CardContent>
    </Card>
  );
}
