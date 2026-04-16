'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@shared/m3';
import { Fab } from '@shared/m3/inputs/Fab';
import { useTranslations } from 'next-intl';
import { DmThreadList }
  from '@/components/organisms/DmThreadList';
import { DmMessagePane }
  from '@/components/organisms/DmMessagePane';
import NewDmDialog
  from '@/components/organisms/NewDmDialog';

/**
 * DM inbox page: thread list on the left,
 * active message pane on the right, FAB to
 * open a new-message dialog.
 */
export default function MessagesPage() {
  const t = useTranslations('social');
  const [activeThread, setActiveThread] = useState<
    string | null
  >(null);
  const [dmOpen, setDmOpen] = useState(false);

  return (
    <Box
      data-testid="messages-page"
      aria-label={t('messages')}
      sx={{
        display: 'flex',
        height: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
        position: 'relative',
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
      <Fab
        primary
        aria-label={t('newDm.fab')}
        data-testid="new-dm-fab"
        onClick={() => setDmOpen(true)}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
        }}
      >
        +
      </Fab>
      <NewDmDialog
        open={dmOpen}
        onClose={() => setDmOpen(false)}
        onCreated={(id) => {
          setActiveThread(id);
          setDmOpen(false);
        }}
      />
    </Box>
  );
}
