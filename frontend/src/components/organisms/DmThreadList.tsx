'use client';

import React from 'react';
import { Box, Typography } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useDmThreads } from '@/hooks/useDmThreads';
import { DmThreadListItem } from '../molecules/DmThreadListItem';

/** Props for DmThreadList. */
export interface DmThreadListProps {
  /** Currently active thread ID. */
  activeId?: string;
  /** Called when a thread is selected. */
  onSelect: (id: string) => void;
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Left-panel thread list for the DM inbox.
 * Renders all DM threads with unread badges.
 *
 * @param props - Component props.
 */
export const DmThreadList: React.FC<DmThreadListProps> = ({
  activeId,
  onSelect,
  testId = 'dm-thread-list',
}) => {
  const t = useTranslations('social');
  const { threads, isLoading } = useDmThreads();

  return (
    <Box
      data-testid={testId}
      aria-label={t('dmInbox')}
      sx={{
        width: 280,
        flexShrink: 0,
        borderRight: '1px solid var(--m3-outline-variant)',
        overflow: 'auto',
        overscrollBehavior: 'contain',
      }}
    >
      <Typography
        variant="h6"
        sx={{ px: 2, py: 1.5 }}
      >
        {t('messages')}
      </Typography>
      {isLoading && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ px: 2 }}
        >
          {t('loading')}
        </Typography>
      )}
      <Box
        component="ul"
        sx={{ listStyle: 'none', m: 0, p: 0 }}
        aria-label={t('dmThreads')}
      >
        {threads.map((thread) => (
          <DmThreadListItem
            key={thread.id}
            thread={thread}
            active={thread.id === activeId}
            onClick={onSelect}
          />
        ))}
        {!isLoading && threads.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ px: 2, py: 2 }}
          >
            {t('noMessages')}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DmThreadList;
