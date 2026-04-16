'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Box, Typography, Button, LinearProgress,
} from '@shared/m3';
import type { PollOption as PollOptionType } from '@/types/content';

/** Props for PollOptionRow. */
export interface PollOptionRowProps {
  /** Option data. */
  option: PollOptionType;
  /** Whether the user has already voted. */
  voted: boolean;
  /** Total votes across all options. */
  totalVotes: number;
  /** Whether a vote submission is in progress. */
  isVoting: boolean;
  /** Called when the user clicks Vote. */
  onVote: (optionId: string) => void;
}

/**
 * Single poll option row with vote bar or button.
 *
 * @param props - PollOptionRow props.
 * @returns Poll option row UI.
 */
export function PollOptionRow({
  option, voted, totalVotes, isVoting, onVote,
}: PollOptionRowProps): React.ReactElement {
  const t = useTranslations('polls');
  const pct = totalVotes > 0
    ? Math.round((option.votes / totalVotes) * 100)
    : 0;

  return (
    <Box sx={{ mb: 1 }}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography variant="body2">{option.label}</Typography>
        {voted && (
          <Typography variant="caption">{pct}%</Typography>
        )}
      </Box>
      {voted ? (
        <LinearProgress
          variant="determinate" value={pct}
          aria-label={`${option.label}: ${pct}%`}
        />
      ) : (
        <Button
          size="small" variant="outlined"
          disabled={isVoting}
          onClick={() => onVote(option.id)}
          aria-label={`${t('voteFor')} ${option.label}`}
          testId={`poll-vote-${option.id}`}
        >
          {t('vote')}
        </Button>
      )}
    </Box>
  );
}

export default PollOptionRow;
