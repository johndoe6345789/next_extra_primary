'use client';

import {
  useVotePollMutation,
} from '@/store/api/pollsApi';

/** Result of usePollVote. */
export interface UsePollVoteReturn {
  vote: (
    pollId: string, optionId: string,
  ) => Promise<void>;
  isVoting: boolean;
}

/**
 * Cast a vote on a poll.
 *
 * @returns Vote helper and in-flight flag.
 */
export function usePollVote(): UsePollVoteReturn {
  const [votePoll, { isLoading }] =
    useVotePollMutation();
  return {
    vote: async (pollId, optionId) => {
      await votePoll({ pollId, optionId }).unwrap();
    },
    isVoting: isLoading,
  };
}

export default usePollVote;
