const load = jest.fn();
const toggle = jest.fn();
jest.mock('@/hooks/usePrefs', () => ({
  usePrefs: () => ({
    items: [{ channel: 'email', enabled: true }],
    load,
    toggle,
  }),
}));

import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrefsTab } from './PrefsTab';

describe('PrefsTab', () => {
  beforeEach(() => {
    load.mockClear();
    toggle.mockClear();
  });

  it('loads prefs on click', async () => {
    render(<PrefsTab />);
    await userEvent.type(
      screen.getByLabelText('User UUID'),
      'u1',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Load' }),
    );
    expect(load).toHaveBeenCalledWith('u1');
  });

  it('renders channel switches', () => {
    render(<PrefsTab />);
    expect(
      screen.getByLabelText('email channel'),
    ).toBeInTheDocument();
  });
});
