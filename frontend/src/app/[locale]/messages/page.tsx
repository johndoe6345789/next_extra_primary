'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { DmThreadList } from '@/components/organisms/DmThreadList';
import { DmMessagePane } from '@/components/organisms/DmMessagePane';

/**
 * DM inbox page: thread list on the left,
 * active message pane on the right.
 * Uses overscroll containment on both panels.
 */
export default function MessagesPage() {
  const t = useTranslations('social');
  const [activeThread, setActiveThread] = useState<
    string | null
  >(null);

  return (
    <Box
      data-testid="messages-page"
      aria-label={t('messages')}
      sx={{
        display: 'flex',
        height: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
      }}
    >
      <DmThreadList
        activeId={activeThread ?? undefined}
        onSelect={setActiveThread}
      />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overscrollBehavior: 'contain',
        }}
      >
        {activeThread ? (
          <DmMessagePane threadId={activeThread} />
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              data-testid="no-thread-selected"
            >
              {t('selectThread')}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
