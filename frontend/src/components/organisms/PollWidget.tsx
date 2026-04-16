'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box, Card, CardContent, Typography,
} from '@shared/m3';
import { usePollVote } from '@/hooks/usePollVote';
import type { Poll } from '@/types/content';
import { PollOptionRow } from './PollOption';

/** Props for PollWidget. */
export interface PollWidgetProps {
  /** Poll data. */
  poll: Poll;
}

/**
 * Single poll card with options and vote bars.
 *
 * Shows percentages when the user has voted.
 *
 * @param props - PollWidget props.
 * @returns Poll card UI.
 */
export function PollWidget({
  poll,
}: PollWidgetProps): React.ReactElement {
  const t = useTranslations('polls');
  const { vote, isVoting } = usePollVote();
  const [voted, setVoted] = useState(
    poll.voted ?? false,
  );

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
          {poll.options.map((opt) => (
            <PollOptionRow
              key={opt.id}
              option={opt}
              voted={voted}
              totalVotes={poll.totalVotes}
              isVoting={isVoting}
              onVote={handleVote}
            />
          ))}
        </Box>
        <Typography variant="caption" color="textSecondary">
          {poll.totalVotes} {t('totalVotes')}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default PollWidget;
