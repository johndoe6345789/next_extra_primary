import { renderHook, act } from
  '@testing-library/react';
import { useAnalytics } from './useAnalytics';
import { useTrackEventMutation }
  from '@/store/api/analyticsApi';

jest.mock('@/store/api/analyticsApi');

const mk = (fn: unknown) => fn as jest.Mock;

describe('useAnalytics', () => {
  const mockTrack = jest.fn().mockResolvedValue({});

  beforeEach(() => {
    mk(useTrackEventMutation).mockReturnValue(
      [mockTrack],
    );
  });

  it('calls trackEvent with name and props', async () => {
    const { result } = renderHook(
      () => useAnalytics(),
    );

    await act(async () => {
      result.current.track(
        'page_view', { path: '/dashboard' },
      );
    });

    expect(mockTrack).toHaveBeenCalledWith({
      name: 'page_view',
      props: { path: '/dashboard' },
    });
  });

  it('swallows errors silently', async () => {
    mockTrack.mockRejectedValueOnce(
      new Error('net'),
    );
    const { result } = renderHook(
      () => useAnalytics(),
    );
    await expect(
      act(async () => {
        result.current.track('page_view');
      }),
    ).resolves.not.toThrow();
  });
});
