'use client';

/**
 * @file ModerationActions.tsx
 * @brief Moderator action buttons for a
 *        flagged comment. M3 only.
 */

import {
  Button,
  ButtonGroup,
} from '@shared/m3';

import { useModerate }
  from '@/hooks/useModerate';

export interface ModerationActionsProps {
  commentId: number;
  onDone: () => void;
}

/**
 * @brief Three-button action bar: hide,
 *        unhide, clear flags.
 */
export function ModerationActions({
  commentId, onDone,
}: ModerationActionsProps) {
  const { hide, unhide, clearFlags, busy } =
    useModerate();

  const run = async (
    fn: (id: number) => Promise<void>,
  ) => {
    await fn(commentId);
    onDone();
  };

  return (
    <ButtonGroup
      aria-label="Moderation actions"
      data-testid="moderation-actions"
    >
      <Button
        disabled={busy}
        onClick={() => run(hide)}
        data-testid="mod-hide"
      >
        Hide
      </Button>
      <Button
        disabled={busy}
        onClick={() => run(unhide)}
        data-testid="mod-unhide"
      >
        Unhide
      </Button>
      <Button
        disabled={busy}
        onClick={() => run(clearFlags)}
        data-testid="mod-clear"
      >
        Clear flags
      </Button>
    </ButtonGroup>
  );
}
