'use client';

import React from 'react';
import { Box, Typography } from '@shared/m3';
import { Avatar } from '../atoms';
import NotificationBadge from './NotificationBadge';
import type { DmThread } from '@/types/social';

/** Props for DmThreadListItem. */
export interface DmThreadListItemProps {
  /** Thread data to display. */
  thread: DmThread;
  /** Whether this thread is currently active. */
  active?: boolean;
  /** Click handler. */
  onClick: (id: string) => void;
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Renders a single DM thread row with avatar,
 * participant name, last message preview and
 * unread badge.
 *
 * @param props - Component props.
 */
export const DmThreadListItem: React.FC<
  DmThreadListItemProps
> = ({ thread, active = false, onClick, testId }) => {
  const tid = testId ?? `dm-thread-${thread.id}`;

  return (
    <Box
      component="li"
      data-testid={tid}
      aria-label={`Conversation with ${thread.participantName}`}
      aria-current={active ? 'page' : undefined}
      onClick={() => onClick(thread.id)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        cursor: 'pointer',
        borderRadius: 2,
        background: active
          ? 'var(--m3-surface-variant)'
          : 'transparent',
        '&:hover': {
          background: 'var(--m3-surface-variant)',
        },
        position: 'relative',
      }}
    >
      <Avatar
        src={thread.participantAvatar}
        alt={thread.participantName}
        size="sm"
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          noWrap
          fontWeight={thread.unreadCount > 0 ? 700 : 400}
        >
          {thread.participantName}
        </Typography>
        {thread.lastMessage && (
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
          >
            {thread.lastMessage}
          </Typography>
        )}
      </Box>
      {thread.unreadCount > 0 && (
        <NotificationBadge
          count={thread.unreadCount}
          testId={tid}
        />
      )}
    </Box>
  );
};

export default DmThreadListItem;
