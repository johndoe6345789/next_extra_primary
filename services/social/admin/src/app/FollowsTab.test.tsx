const useFollows = jest.fn();
jest.mock('@/hooks/useFollows', () => ({
  useFollows: (...a: unknown[]) => useFollows(...a),
}));

import { render, screen } from
  '@testing-library/react';
import { FollowsTab } from './FollowsTab';

describe('FollowsTab', () => {
  it('renders following + follower counts', () => {
    useFollows.mockReturnValue({
      following: [{ user_id: 'a', at: '' }],
      followers: [
        { user_id: 'b', at: '' },
        { user_id: 'c', at: '' },
      ],
      error: null,
    });
    render(<FollowsTab />);
    expect(
      screen.getByText(/Following \(1\)/),
    ).toBeTruthy();
    expect(
      screen.getByText(/Followers \(2\)/),
    ).toBeTruthy();
  });
});
