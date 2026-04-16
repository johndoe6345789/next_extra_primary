/**
 * Polls domain types.
 * @module types/polls
 */

/** A single poll option. */
export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

/** An active poll. */
export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  voted?: boolean;
}
