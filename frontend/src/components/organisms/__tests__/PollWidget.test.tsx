import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PollWidget } from '../PollWidget';
import type { Poll } from '@/types/content';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock('@/hooks/usePollVote', () => ({
  usePollVote: () => ({
    vote: jest.fn(),
    isVoting: false,
  }),
}));

jest.mock('@shared/m3', () => ({
  Box: ({ children, ...p }: React.PropsWithChildren<Record<string,unknown>>) =>
    <div {...p}>{children}</div>,
  Card: ({ children, ...p }: React.PropsWithChildren<Record<string,unknown>>) =>
    <div {...p}>{children}</div>,
  CardContent: ({ children }: React.PropsWithChildren) =>
    <div>{children}</div>,
  Typography: ({ children }: React.PropsWithChildren) =>
    <span>{children}</span>,
  Button: ({ children, onClick, disabled, 'aria-label': a }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    'aria-label'?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} aria-label={a}>
      {children}
    </button>
  ),
  LinearProgress: ({ value, 'aria-label': a }: {
    value: number; 'aria-label'?: string;
  }) => (
    <progress value={value} aria-label={a} />
  ),
}));

const POLL: Poll = {
  id: 'p1',
  question: 'Best colour?',
  options: [
    { id: 'o1', label: 'Red', votes: 3 },
    { id: 'o2', label: 'Blue', votes: 7 },
  ],
  totalVotes: 10,
  voted: false,
};

describe('PollWidget', () => {
  it('renders poll question', () => {
    render(<PollWidget poll={POLL} />);
    expect(screen.getByText('Best colour?')).toBeInTheDocument();
  });

  it('renders vote buttons when not voted', () => {
    render(<PollWidget poll={POLL} />);
    expect(screen.getAllByText('vote')).toHaveLength(2);
  });

  it('shows percentages when already voted', () => {
    render(<PollWidget poll={{ ...POLL, voted: true }} />);
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('vote button is accessible', () => {
    render(<PollWidget poll={POLL} />);
    expect(
      screen.getByLabelText('voteFor Red'),
    ).toBeInTheDocument();
  });
});
