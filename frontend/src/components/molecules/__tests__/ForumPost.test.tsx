import React from 'react';
import { render, screen } from '@testing-library/react';
import { ForumPost } from '../ForumPost';
import type { ForumPost as ForumPostType } from '@/types/content';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock('@shared/m3', () => ({
  Box: ({ children }: React.PropsWithChildren) =>
    <div>{children}</div>,
  Typography: ({ children }: React.PropsWithChildren) =>
    <span>{children}</span>,
  Avatar: ({ children }: React.PropsWithChildren) =>
    <span>{children}</span>,
}));

const POST: ForumPostType = {
  id: 'p1',
  threadId: 't1',
  author: 'alice',
  body: 'Hello world',
  createdAt: '2024-01-01T00:00:00Z',
};

describe('ForumPost', () => {
  it('renders post body', () => {
    render(<ForumPost post={POST} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders author name', () => {
    render(<ForumPost post={POST} />);
    expect(screen.getAllByText('alice').length).toBeGreaterThan(0);
  });

  it('has accessible testid', () => {
    render(<ForumPost post={POST} />);
    expect(screen.getByTestId('forum-post-p1')).toBeInTheDocument();
  });

  it('shows unknown author fallback', () => {
    render(
      <ForumPost post={{ ...POST, author: undefined }} />,
    );
    expect(
      screen.getAllByText('unknownAuthor').length,
    ).toBeGreaterThan(0);
  });
});
