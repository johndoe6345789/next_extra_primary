const useGroups = jest.fn();
jest.mock('@/hooks/useGroups', () => ({
  useGroups: () => useGroups(),
}));

import { render, screen } from
  '@testing-library/react';
import { GroupsTab } from './GroupsTab';

describe('GroupsTab', () => {
  it('shows loading state', () => {
    useGroups.mockReturnValue({
      groups: [], loading: true, error: null,
    });
    render(<GroupsTab />);
    expect(
      screen.getByText('Loading groups…'),
    ).toBeTruthy();
  });

  it('shows empty state', () => {
    useGroups.mockReturnValue({
      groups: [], loading: false, error: null,
    });
    render(<GroupsTab />);
    expect(
      screen.getByText('No groups defined.'),
    ).toBeTruthy();
  });

  it('renders group rows', () => {
    useGroups.mockReturnValue({
      groups: [{
        id: 1, slug: 'devs', name: 'Devs',
        description: 'Engineers', created_at: '',
      }],
      loading: false,
      error: null,
    });
    render(<GroupsTab />);
    expect(screen.getByText('Devs')).toBeTruthy();
  });
});
