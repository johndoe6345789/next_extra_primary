import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/messages/en.json';

const wrap = (ui: React.ReactElement) => render(
  <NextIntlClientProvider
    locale="en" messages={messages}
  >{ui}</NextIntlClientProvider>,
);

jest.mock('@shared/m3', () => ({
  List: (p: {
    children: React.ReactNode;
    'aria-label'?: string;
  }) => <ul aria-label={p['aria-label']}>
    {p.children}
  </ul>,
  ListItemButton: (p: {
    children: React.ReactNode;
    onClick?: () => void;
    'aria-label'?: string;
  }) => (
    <li>
      <button
        onClick={p.onClick}
        aria-label={p['aria-label']}
      >
        {p.children}
      </button>
    </li>
  ),
  ListItemText: (p: {
    primary: React.ReactNode;
    secondary: React.ReactNode;
  }) => (
    <span>
      <span>{p.primary}</span>
      <span>{p.secondary}</span>
    </span>
  ),
  Typography: (p: {
    children: React.ReactNode;
  }) => <span>{p.children}</span>,
}));

import { AlertList } from './AlertList';

const entry = {
  id: 'a', type: 'email' as const,
  title: 'Hi', detail: 'from@x',
  source: 'Email', timestamp: Date.now(),
  isRead: false,
};

describe('AlertList', () => {
  it('renders empty label', () => {
    wrap(
      <AlertList
        alerts={[]}
        onMarkRead={jest.fn()}
      />,
    );
    expect(
      screen.getByLabelText('No alerts'),
    ).toBeInTheDocument();
  });

  it('renders row and fires mark read', async () => {
    const cb = jest.fn();
    wrap(
      <AlertList
        alerts={[entry]}
        onMarkRead={cb}
      />,
    );
    expect(screen.getByText('Hi')).toBeInTheDocument();
    await userEvent.click(
      screen.getByLabelText('Email: Hi'),
    );
    expect(cb).toHaveBeenCalledWith('a');
  });
});
