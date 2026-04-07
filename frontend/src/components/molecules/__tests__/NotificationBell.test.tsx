import React from 'react';
import { render, screen } from '@testing-library/react';
import { NotificationBell } from '../NotificationBell';

jest.mock('@/hooks', () => ({
  useNotifications: () => ({ unreadCount: 0 }),
}));

jest.mock('../../atoms', () => ({
  IconButton: ({
    icon,
    ariaLabel,
    testId,
  }: {
    icon: React.ReactNode;
    ariaLabel: string;
    testId?: string;
  }) => (
    <button
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {icon}
    </button>
  ),
  Badge: ({ children }: { children: React.ReactNode }) =>
    <span>{children}</span>,
}));

jest.mock('@shared/icons/Notifications', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => (
    <svg data-testid="bell-svg" {...props} />
  ),
}));

describe('NotificationBell', () => {
  it('passes bold strokeWidth to icon', () => {
    render(<NotificationBell />);
    const svg = screen.getByTestId('bell-svg');
    expect(
      Number(svg.getAttribute('stroke-width')),
    ).toBeGreaterThanOrEqual(10);
  });

  it('sets white color on icon for dark navbar', () => {
    render(<NotificationBell />);
    const svg = screen.getByTestId('bell-svg');
    expect(svg.style.color).toBe(
      'rgb(255, 255, 255)',
    );
  });

  it('renders accessible label', () => {
    render(<NotificationBell />);
    expect(
      screen.getByLabelText(
        'No unread notifications',
      ),
    ).toBeInTheDocument();
  });
});
