import { renderHook, waitFor } from
  '@testing-library/react';
import { useDms } from './useDms';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useDms', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads threads only when no thread selected',
    async () => {
    fm.mockResolvedValue(
      ok({ threads: [{ id: 1 }] }),
    );
    const { result } = renderHook(() => useDms(null));
    await waitFor(() =>
      expect(result.current.threads.length).toBe(1),
    );
    expect(fm.mock.calls[0][0]).toContain(
      '/threads',
    );
    expect(fm).toHaveBeenCalledTimes(1);
  });

  it('also loads messages when id is passed',
    async () => {
    fm
      .mockResolvedValueOnce(ok({ threads: [] }))
      .mockResolvedValueOnce(
        ok({ messages: [{ id: 5 }] }),
      );
    const { result } = renderHook(() => useDms(7));
    await waitFor(() =>
      expect(result.current.messages.length).toBe(1),
    );
    expect(fm.mock.calls[1][0]).toContain(
      '/threads/7/messages',
    );
  });
});
