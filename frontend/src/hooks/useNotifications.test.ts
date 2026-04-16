import { renderHook, act } from
  '@testing-library/react';
import { useNotifications }
  from './useNotifications';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '@/store/api/notificationApi';

jest.mock('@/store/api/notificationApi');
jest.mock('@/constants/notifications.json', () => ({
  POLL_INTERVAL_MS: 30000,
  PANEL_PREVIEW_COUNT: 5,
  PAGE_SIZE: 20,
}));

const mk = (
  fn: unknown,
) => fn as jest.Mock;

describe('useNotifications', () => {
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mk(useGetNotificationsQuery).mockReturnValue({
      data: {
        data: [{ id: '1', title: 'Test',
          body: '', type: 'system',
          read: false, createdAt: '' }],
        total: 1,
      },
      isLoading: false,
      refetch: mockRefetch,
    });
    mk(useGetUnreadCountQuery).mockReturnValue({
      data: { unread_count: 1 },
      refetch: mockRefetch,
    });
    mk(useMarkAsReadMutation).mockReturnValue(
      [jest.fn()],
    );
    mk(useMarkAllAsReadMutation).mockReturnValue(
      [jest.fn()],
    );
  });

  afterEach(() => jest.useRealTimers());

  it('returns notifications and unread count', () => {
    const { result } = renderHook(
      () => useNotifications(),
    );
    expect(result.current.notifications)
      .toHaveLength(1);
    expect(result.current.unreadCount).toBe(1);
  });

  it('polls on interval', () => {
    renderHook(() => useNotifications());
    act(() => { jest.advanceTimersByTime(30000); });
    expect(mockRefetch).toHaveBeenCalled();
  });
});
