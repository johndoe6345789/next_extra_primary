'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
} from '@shared/m3';
import { usePollVote } from '@/hooks/usePollVote';
import type { Poll } from '@/types/content';

/** Props for PollWidget. */
export interface PollWidgetProps {
  /** Poll data. */
  poll: Poll;
}

/**
 * Single poll card with options and vote bars.
 *
 * Shows vote percentages when the user has voted.
 *
 * @param props - PollWidget props.
 * @returns Poll card UI.
 */
export function PollWidget({
  poll,
}: PollWidgetProps): React.ReactElement {
  const t = useTranslations('polls');
  const { vote, isVoting } = usePollVote();
  const [voted, setVoted] = useState(poll.voted ?? false);

  const handleVote = async (optionId: string) => {
    await vote(poll.id, optionId);
    setVoted(true);
  };

  return (
    <Card
      data-testid={`poll-widget-${poll.id}`}
      aria-label={poll.question}
      sx={{ mb: 2 }}
    >
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">
          {poll.question}
        </Typography>
        <Box sx={{ mt: 1 }}>
          {poll.options.map((opt) => {
            const pct = poll.totalVotes > 0
              ? Math.round(
                  (opt.votes / poll.totalVotes) * 100,
                )
              : 0;
            return (
              <Box key={opt.id} sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    {opt.label}
                  </Typography>
                  {voted && (
                    <Typography variant="caption">
                      {pct}%
                    </Typography>
                  )}
                </Box>
                {voted
                  ? (
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      aria-label={`${opt.label}: ${pct}%`}
                    />
                  )
                  : (
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={isVoting}
                      onClick={() => handleVote(opt.id)}
                      aria-label={`${t('voteFor')} ${opt.label}`}
                      testId={`poll-vote-${opt.id}`}
                    >
                      {t('vote')}
                    </Button>
                  )}
              </Box>
            );
          })}
        </Box>
        <Typography variant="caption" color="textSecondary">
          {poll.totalVotes} {t('totalVotes')}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default PollWidget;
