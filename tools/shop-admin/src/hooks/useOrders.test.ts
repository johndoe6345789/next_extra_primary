import { renderHook, waitFor } from
  '@testing-library/react';
import { useOrders } from './useOrders';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useOrders', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads orders from admin route', async () => {
    fm.mockResolvedValue(
      ok({ items: [{ id: 10, lines: [] }] }),
    );
    const { result } = renderHook(() => useOrders());
    await waitFor(() =>
      expect(result.current.items.length).toBe(1),
    );
    expect(fm.mock.calls[0][0]).toBe(
      '/api/shop/admin/orders',
    );
  });

  it('tolerates fetch failure', async () => {
    fm.mockRejectedValue(new Error('nope'));
    const { result } = renderHook(() => useOrders());
    expect(result.current.items).toEqual([]);
  });
});
