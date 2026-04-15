import { renderHook, waitFor } from
  '@testing-library/react';
import { useFollows } from './useFollows';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useFollows', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('skips fetch when userId empty', () => {
    renderHook(() => useFollows(''));
    expect(fm).not.toHaveBeenCalled();
  });

  it('loads following and followers', async () => {
    fm
      .mockResolvedValueOnce(
        ok({ items: [{ user_id: 'a' }] }),
      )
      .mockResolvedValueOnce(
        ok({ items: [{ user_id: 'b' }] }),
      );
    const { result } =
      renderHook(() => useFollows('u1'));
    await waitFor(() =>
      expect(result.current.following.length).toBe(1),
    );
    expect(result.current.followers[0].user_id)
      .toBe('b');
    expect(fm.mock.calls[0][0]).toContain(
      '/u1/following',
    );
    expect(fm.mock.calls[1][0]).toContain(
      '/u1/followers',
    );
  });
});
