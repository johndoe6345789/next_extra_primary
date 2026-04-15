import { renderHook, act, waitFor } from
  '@testing-library/react';
import { useNotifQueue } from './useNotifQueue';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useNotifQueue', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads queue', async () => {
    fm.mockResolvedValue(
      ok({ items: [{ id: 1 }] }),
    );
    const { result } = renderHook(() =>
      useNotifQueue(),
    );
    await waitFor(() =>
      expect(result.current.items.length).toBe(1),
    );
    expect(fm.mock.calls[0][0]).toBe(
      '/api/notifications/queue',
    );
  });

  it('POSTs retry by id', async () => {
    fm.mockResolvedValue(ok({ items: [] }));
    const { result } = renderHook(() =>
      useNotifQueue(),
    );
    await act(async () => {
      await result.current.retry(9);
    });
    const call = fm.mock.calls.find(
      c => String(c[0]).endsWith('/9/retry'),
    );
    expect(call).toBeDefined();
    expect(
      (call![1] as RequestInit).method,
    ).toBe('POST');
  });
});
