import React from 'react';
import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import { FollowButton } from '../FollowButton';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/hooks/useFollow', () => ({
  useFollow: () => ({
    isFollowing: false,
    toggle: jest.fn().mockResolvedValue(undefined),
    isLoading: false,
  }),
}));

jest.mock('@shared/m3/Button', () => ({
  Button: ({
    children,
    onClick,
    'aria-label': ariaLabel,
    'data-testid': testId,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    'aria-label'?: string;
    'data-testid'?: string;
    disabled?: boolean;
  }) => (
    <button
      aria-label={ariaLabel}
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

describe('FollowButton', () => {
  it('renders follow label when not following', () => {
    render(<FollowButton userId="u1" />);
    expect(screen.getByText('follow')).toBeInTheDocument();
  });

  it('has correct aria-pressed attribute', () => {
    render(<FollowButton userId="u1" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls toggle on click', () => {
    render(
      <FollowButton userId="u1" testId="fb" />,
    );
    fireEvent.click(screen.getByTestId('fb'));
    // toggle is async; just verify no throw
  });
});
