'use client';

import type { SyntheticListenerMap }
  from '@dnd-kit/core/dist/hooks/utilities';
import type { DraggableAttributes }
  from '@dnd-kit/core';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import IconButton from '@shared/m3/IconButton';
import { DragIndicator as DragIndicatorIcon }
  from '@shared/icons/DragIndicator';
import CloseIcon from '@shared/icons/Close';

/** Props for the widget header bar. */
export interface DraggableWidgetHeaderProps {
  /** Translated widget title. */
  title: string;
  /** DnD attributes. */
  attributes: DraggableAttributes;
  /** DnD listeners. */
  listeners: SyntheticListenerMap | undefined;
  /** Remove callback. */
  onRemove: () => void;
  /** Test ID prefix. */
  testId: string;
}

/**
 * Header bar for a draggable widget with drag
 * handle and remove button.
 */
export default function DraggableWidgetHeader({
  title, attributes, listeners,
  onRemove, testId,
}: DraggableWidgetHeaderProps) {
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center',
      px: 2, pt: 1.5, gap: 1,
    }}>
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
  );
}
