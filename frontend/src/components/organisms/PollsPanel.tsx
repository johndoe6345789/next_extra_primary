'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography } from '@shared/m3';
import { usePolls } from '@/hooks/usePolls';
import { PollWidget } from './PollWidget';

/** Props for PollsPanel. */
export interface PollsPanelProps {}

/**
 * Panel listing all active polls.
 *
 * Suitable for embedding in a homepage sidebar.
 *
 * @returns Active polls list UI.
 */
export function PollsPanel(
  _props: PollsPanelProps,
): React.ReactElement {
  const t = useTranslations('polls');
  const { polls, isLoading, error } = usePolls();

  return (
    <Box
      aria-label={t('title')}
      data-testid="polls-panel"
    >
      <Typography variant="h6" gutterBottom>
        {t('title')}
      </Typography>
      {isLoading && (
        <Typography data-testid="polls-loading">
          {t('loading')}
        </Typography>
      )}
      {error && (
        <Typography color="error" data-testid="polls-error">
          {error}
        </Typography>
      )}
      {polls.map((poll) => (
        <PollWidget key={poll.id} poll={poll} />
      ))}
      {!isLoading && polls.length === 0 && (
        <Typography color="textSecondary">
          {t('noPolls')}
        </Typography>
      )}
    </Box>
  );
}

export default PollsPanel;
