import { renderHook, act, waitFor } from
  '@testing-library/react';

jest.mock('./pollEmailAlerts', () => ({
  pollEmail: jest.fn(),
}));

import { pollEmail } from './pollEmailAlerts';
import { useAlerts } from './useAlerts';

const pe = pollEmail as jest.Mock;

describe('useAlerts', () => {
  beforeEach(() => pe.mockReset());

  it('loads alerts and counts unread', async () => {
    pe.mockResolvedValue([
      {
        id: 'a', type: 'email', title: 't',
        detail: 'd', source: 'Email',
        timestamp: 0, isRead: false,
      },
      {
        id: 'b', type: 'email', title: 't',
        detail: 'd', source: 'Email',
        timestamp: 0, isRead: true,
      },
    ]);
    const { result } = renderHook(() => useAlerts());
    await waitFor(() =>
      expect(result.current.loading).toBe(false),
    );
    expect(result.current.alerts).toHaveLength(2);
    expect(result.current.unreadCount).toBe(1);
  });

  it('records poll error', async () => {
    pe.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useAlerts());
    await waitFor(() =>
      expect(result.current.error).toBe('boom'),
    );
    expect(result.current.loading).toBe(false);
  });

  it('markRead flips the flag', async () => {
    pe.mockResolvedValue([
      {
        id: 'x', type: 'email', title: 't',
        detail: 'd', source: 'Email',
        timestamp: 0, isRead: false,
      },
    ]);
    const { result } = renderHook(() => useAlerts());
    await waitFor(() =>
      expect(result.current.unreadCount).toBe(1),
    );
    act(() => result.current.markRead('x'));
    expect(result.current.unreadCount).toBe(0);
  });
});
