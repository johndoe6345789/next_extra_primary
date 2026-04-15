import { renderHook, waitFor } from
  '@testing-library/react';
import { useProducts } from './useProducts';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useProducts', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads products', async () => {
    fm.mockResolvedValue(
      ok({ items: [{ id: 1, sku: 'A' }] }),
    );
    const { result } = renderHook(() => useProducts());
    await waitFor(() =>
      expect(result.current.items.length).toBe(1),
    );
    expect(fm.mock.calls[0][0]).toBe(
      '/api/shop/products',
    );
  });
});
