import { renderHook, act } from '@testing-library/react';
import { useFollow } from './useFollow';

const mockFollowUser = jest.fn().mockReturnValue({
  unwrap: jest.fn().mockResolvedValue(undefined),
});
const mockUnfollowUser = jest.fn().mockReturnValue({
  unwrap: jest.fn().mockResolvedValue(undefined),
});

jest.mock('@/store/api/socialFollowsApi', () => ({
  useFollowUserMutation: () => [
    mockFollowUser,
    { isLoading: false },
  ],
  useUnfollowUserMutation: () => [
    mockUnfollowUser,
    { isLoading: false },
  ],
  useGetFollowersQuery: () => ({
    data: { count: 5, isFollowing: false },
  }),
}));

describe('useFollow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns isFollowing=false by default', () => {
    const { result } = renderHook(() =>
      useFollow('user-1'),
    );
    expect(result.current.isFollowing).toBe(false);
  });

  it('calls followUser on toggle when not following', async () => {
    const { result } = renderHook(() =>
      useFollow('user-1'),
    );
    await act(async () => {
      await result.current.toggle();
    });
    expect(mockFollowUser).toHaveBeenCalledWith('user-1');
  });

  it('calls unfollowUser when already following', async () => {
    const { result } = renderHook(() =>
      useFollow('user-1', true),
    );
    await act(async () => {
      await result.current.toggle();
    });
    expect(mockUnfollowUser).toHaveBeenCalledWith('user-1');
  });

  it('exposes follower count', () => {
    const { result } = renderHook(() =>
      useFollow('user-1'),
    );
    expect(result.current.followerCount).toBe(5);
  });
});
