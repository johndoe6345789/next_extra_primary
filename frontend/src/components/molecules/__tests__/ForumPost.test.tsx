/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import type {
  ForumPost as ForumPostType,
} from '@/types/content';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock('@shared/m3', () => ({
  Box: ({
    children, ...rest
  }: React.PropsWithChildren<{ [k: string]: unknown }>) =>
    <div {...rest}>{children}</div>,
  Typography: ({
    children, ...rest
  }: React.PropsWithChildren<{ [k: string]: unknown }>) =>
    <span {...rest}>{children}</span>,
  Avatar: ({
    children, ...rest
  }: React.PropsWithChildren<{ [k: string]: unknown }>) =>
    <span {...rest}>{children}</span>,
}));

// eslint-disable-next-line import/first
import { ForumPost } from '../ForumPost';

const POST: ForumPostType = {
  id: 'p1',
  threadId: 't1',
  author: 'uuid-of-alice',
  authorName: 'Alice Example',
  body: 'Hello world',
  createdAt: '2024-01-01T00:00:00Z',
};

describe('ForumPost', () => {
  it('renders post body via markdown', () => {
    render(<ForumPost post={POST} />);
    expect(
      screen.getByText('Hello world'),
    ).toBeInTheDocument();
  });

  it('shows the joined author display name '
    + '(not the raw UUID)', () => {
    render(<ForumPost post={POST} />);
    expect(
      screen.getAllByText('Alice Example').length,
    ).toBeGreaterThan(0);
    expect(
      screen.queryByText('uuid-of-alice'),
    ).toBeNull();
  });

  it('exposes data-testid keyed by post id', () => {
    render(<ForumPost post={POST} />);
    expect(
      screen.getByTestId('forum-post-p1'),
    ).toBeInTheDocument();
  });

  it('falls back to "unknownAuthor" when neither '
    + 'author nor authorName is set', () => {
    render(
      <ForumPost
        post={{
          ...POST,
          author: undefined,
          authorName: undefined,
        }}
      />,
    );
    expect(
      screen.getAllByText('unknownAuthor').length,
    ).toBeGreaterThan(0);
  });
});
