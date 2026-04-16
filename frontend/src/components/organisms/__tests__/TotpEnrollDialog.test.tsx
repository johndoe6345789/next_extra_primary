import React from 'react';
import { render, screen, waitFor }
  from '@testing-library/react';
import { TotpEnrollDialog }
  from '../TotpEnrollDialog';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock('@shared/m3/Dialog', () => ({
  Dialog: ({ open, children, testId }: {
    open: boolean;
    children: React.ReactNode;
    testId?: string;
  }) => open
    ? <div data-testid={testId}>{children}</div>
    : null,
}));

jest.mock('@shared/m3/Typography', () => ({
  __esModule: true,
  default: ({ children, id }: {
    children: React.ReactNode; id?: string;
  }) => <span id={id}>{children}</span>,
}));

jest.mock('../TotpQrStep', () => ({
  TotpQrStep: () => (
    <div data-testid="qr-step" />
  ),
}));

jest.mock('../TotpVerifyStep', () => ({
  TotpVerifyStep: () => (
    <div data-testid="verify-step" />
  ),
}));

jest.mock('@/hooks/useTotpEnroll', () => ({
  useTotpEnroll: () => ({
    status: 'enrolling',
    enrollData: {
      otpauth_url: 'otpauth://totp/test',
      recovery_codes: [],
    },
    recoveryCodes: [],
    error: null,
    enroll: jest.fn().mockResolvedValue(undefined),
    verify: jest.fn(),
    disable: jest.fn(),
  }),
}));

describe('TotpEnrollDialog', () => {
  it('renders when open', async () => {
    render(<TotpEnrollDialog open onClose={jest.fn()} />);
    await waitFor(() =>
      expect(
        screen.getByTestId('totp-enroll-dialog'),
      ).toBeInTheDocument(),
    );
  });

  it('shows QR step when enrollData present', async () => {
    render(<TotpEnrollDialog open onClose={jest.fn()} />);
    await waitFor(() =>
      expect(screen.getByTestId('qr-step'))
        .toBeInTheDocument(),
    );
  });

  it('does not render when closed', () => {
    render(
      <TotpEnrollDialog open={false} onClose={jest.fn()} />,
    );
    expect(
      screen.queryByTestId('totp-enroll-dialog'),
    ).not.toBeInTheDocument();
  });
});
