'use client';

import React from 'react';
import { Box, Typography } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useMentions } from '@/hooks/useMentions';

/**
 * Mentions page: lists all mentions of the current
 * user. Clicking a mention marks it as read.
 */
export default function MentionsPage() {
  const t = useTranslations('social');
  const { mentions, isLoading, markRead } = useMentions();

  return (
    <Box
      data-testid="mentions-page"
      aria-label={t('mentions')}
      sx={{ maxWidth: 720, mx: 'auto', px: 2, py: 3 }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
      >
        {t('mentions')}
      </Typography>
      {isLoading && (
        <Typography variant="body2" color="text.secondary">
          {t('loading')}
        </Typography>
      )}
      {!isLoading && mentions.length === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          data-testid="no-mentions"
        >
          {t('noMentions')}
        </Typography>
      )}
      <Box
        component="ul"
        sx={{ listStyle: 'none', m: 0, p: 0 }}
        aria-label={t('mentionsList')}
      >
        {mentions.map((m) => (
          <Box
            key={m.id}
            component="li"
            onClick={() => markRead(m.id)}
            data-testid={`mention-${m.id}`}
            aria-label={t('mentionFrom', {
              author: m.authorHandle,
            })}
            sx={{
              px: 2,
              py: 1.5,
              mb: 1,
              borderRadius: 2,
              cursor: 'pointer',
              background: m.read
                ? 'var(--m3-surface)'
                : 'var(--m3-primary-container)',
              '&:hover': {
                background: 'var(--m3-surface-variant)',
              },
            }}
          >
            <Typography
              variant="body2"
              fontWeight={m.read ? 400 : 700}
            >
              @{m.authorHandle}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {m.excerpt}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
