'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useDmThread } from '@/hooks/useDmThread';
import { DmComposer } from './DmComposer';
import { useAuth } from '@/hooks';

/** Props for DmMessagePane. */
export interface DmMessagePaneProps {
  /** Active thread ID to load. */
  threadId: string;
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Right panel of the DM inbox.
 * Displays messages for the active thread and the
 * composer at the bottom. Scrolls to latest message.
 *
 * @param props - Component props.
 */
export const DmMessagePane: React.FC<DmMessagePaneProps> = ({
  threadId,
  testId = 'dm-message-pane',
}) => {
  const t = useTranslations('social');
  const { user } = useAuth();
  const { messages, isLoading, send, isSending } =
    useDmThread(threadId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      { behavior: 'smooth' },
    );
  }, [messages]);

  return (
    <Box
      data-testid={testId}
      aria-label={t('conversation')}
      sx={{ flex: 1, display: 'flex',
        flexDirection: 'column', minHeight: 0,
        overscrollBehavior: 'contain' }}
    >
      <Box
        sx={{ flex: 1, overflow: 'auto', p: 2 }}
        aria-live="polite"
        aria-label={t('messages')}
      >
        {isLoading && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {t('loading')}
          </Typography>
        )}
        {messages.map((msg) => {
          const mine = msg.senderId === user?.id;
          return (
            <Box
              key={msg.id}
              sx={{ display: 'flex', mb: 1,
                justifyContent: mine
                  ? 'flex-end' : 'flex-start' }}
            >
              <Box sx={{
                maxWidth: '70%',
                background: mine
                  ? 'var(--m3-primary-container)'
                  : 'var(--m3-surface-variant)',
                borderRadius: 2,
                px: 1.5, py: 0.75,
              }}>
                <Typography variant="body2">
                  {msg.content}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={bottomRef} />
      </Box>
      <DmComposer
        onSend={send}
        isSending={isSending}
        testId={`${testId}-composer`}
      />
    </Box>
  );
};

export default DmMessagePane;
