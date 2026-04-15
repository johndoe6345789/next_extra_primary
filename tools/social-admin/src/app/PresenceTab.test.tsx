const usePresence = jest.fn();
jest.mock('@/hooks/usePresence', () => ({
  usePresence: (...a: unknown[]) => usePresence(...a),
}));

import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PresenceTab } from './PresenceTab';

describe('PresenceTab', () => {
  beforeEach(() => {
    usePresence.mockReturnValue({
      statuses: { u1: 'online' },
      error: null,
    });
  });

  it('renders statuses for entered users',
    async () => {
    render(<PresenceTab />);
    await userEvent.type(
      screen.getByLabelText(
        'Presence lookup user ids',
      ),
      'u1,u2',
    );
    expect(usePresence).toHaveBeenLastCalledWith(
      ['u1', 'u2'],
    );
  });
});
