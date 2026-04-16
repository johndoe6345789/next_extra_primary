import React from 'react';
import { render, screen } from '@testing-library/react';
import { MentionsBell } from '../MentionsBell';

jest.mock('next-intl', () => ({
  useTranslations: () => (
    key: string,
    p?: Record<string, unknown>,
  ) =>
    p
      ? `${key}:${JSON.stringify(p)}`
      : key,
}));

jest.mock('@/hooks/useMentions', () => ({
  useMentions: () => ({
    unreadCount: 3,
    mentions: [],
    isLoading: false,
    refetch: jest.fn(),
    markRead: jest.fn(),
  }),
}));

jest.mock('../../atoms', () => ({
  IconButton: ({
    ariaLabel,
    testId,
  }: {
    ariaLabel: string;
    testId?: string;
  }) => (
    <button aria-label={ariaLabel} data-testid={testId}>
      bell
    </button>
  ),
}));

jest.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href,
    'data-testid': testId,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode;
    href: string;
    'data-testid'?: string;
    'aria-label'?: string;
  }) => (
    <a href={href} data-testid={testId} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

jest.mock('@shared/icons/Notifications', () => ({
  __esModule: true,
  default: () => <svg data-testid="bell-icon" />,
}));

describe('MentionsBell', () => {
  it('renders with testId', () => {
    render(<MentionsBell />);
    expect(
      screen.getByTestId('mentions-bell'),
    ).toBeInTheDocument();
  });

  it('links to /mentions', () => {
    render(<MentionsBell />);
    const link = screen.getByTestId('mentions-bell');
    expect(link).toHaveAttribute('href', '/mentions');
  });

  it('shows unread badge when count > 0', () => {
    render(<MentionsBell />);
    expect(
      screen.getByTestId('mentions-bell-badge'),
    ).toBeInTheDocument();
  });
});
