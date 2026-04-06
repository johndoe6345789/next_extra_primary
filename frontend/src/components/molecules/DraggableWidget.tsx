'use client';

import type { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import Typography from '@shared/m3/Typography';
import IconButton from '@shared/m3/IconButton';
import Box from '@shared/m3/Box';
import { DragIndicator as DragIndicatorIcon }
  from '@shared/icons/DragIndicator';
import CloseIcon from '@shared/icons/Close';

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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2, pt: 1.5,
          gap: 1,
        }}
      >
        <IconButton
          {...attributes}
          {...listeners}
          size="small"
          aria-label="Drag to reorder"
          data-testid={`${testId}-drag`}
          sx={{ cursor: 'grab' }}
        >
          <DragIndicatorIcon size={18} />
        </IconButton>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ flexGrow: 1 }}
        >
          {title}
        </Typography>
        <IconButton
          size="small"
          onClick={onRemove}
          aria-label={`Remove ${title}`}
          data-testid={`${testId}-remove`}
        >
          <CloseIcon size={18} />
        </IconButton>
      </Box>
      <CardContent sx={{ pt: 0.5 }}>
        {children}
      </CardContent>
    </Card>
  );
}
