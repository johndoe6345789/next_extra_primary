'use client';

/**
 * @file ThreadView.tsx
 * @brief Detail view for a single flagged
 *        comment with moderation controls.
 */

import {
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@shared/m3';

import { ModerationActions }
  from './ModerationActions';

export interface ThreadViewProps {
  commentId: number;
  onChange: () => void;
}

/**
 * @brief Shows the target comment and any
 *        moderation buttons.
 */
export function ThreadView({
  commentId, onChange,
}: ThreadViewProps) {
  return (
    <Card
      data-testid={`thread-${commentId}`}
      aria-label="Flagged comment detail"
    >
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">
            Comment #{commentId}
          </Typography>
          <Divider />
          <Typography variant="body2">
            Review the flagged content and
            choose a moderation action below.
          </Typography>
          <ModerationActions
            commentId={commentId}
            onDone={onChange}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
