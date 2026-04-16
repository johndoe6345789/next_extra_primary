import React from 'react';
import { render, screen, waitFor }
  from '@testing-library/react';
import { PasskeySection } from '../PasskeySection';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock('@/hooks/usePasskey', () => ({
  usePasskey: () => ({
    register: jest.fn(),
    busy: false,
    error: null,
  }),
}));

jest.mock('@shared/m3/Button', () => ({
  __esModule: true,
  default: ({
    children,
    'data-testid': tid,
    onClick,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
    onClick?: () => void;
  }) => (
    <button data-testid={tid} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('@shared/m3/Typography', () => ({
  __esModule: true,
  default: ({
    children,
  }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

jest.mock('../PasskeyList', () => ({
  PasskeyList: ({
    credentials,
  }: { credentials: unknown[] }) => (
    <ul data-testid="passkey-list-mock">
      {(credentials as { id: string }[]).map(
        (c) => <li key={c.id}>{c.id}</li>,
      )}
    </ul>
  ),
}));

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () =>
    Promise.resolve([
      { id: 'abc', name: 'iPhone', createdAt: '' },
    ]),
}) as jest.Mock;

describe('PasskeySection', () => {
  it('renders section with testid', async () => {
    render(<PasskeySection />);
    await waitFor(() =>
      expect(
        screen.getByTestId('passkey-section'),
      ).toBeInTheDocument(),
    );
  });

  it('fetches and renders credentials', async () => {
    render(<PasskeySection />);
    await waitFor(() =>
      expect(
        screen.getByTestId('passkey-list-mock'),
      ).toBeInTheDocument(),
    );
  });

  it('shows add button', async () => {
    render(<PasskeySection />);
    await waitFor(() =>
      expect(
        screen.getByTestId('passkey-add-btn'),
      ).toBeInTheDocument(),
    );
  });
});
