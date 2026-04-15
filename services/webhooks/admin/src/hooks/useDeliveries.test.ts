import { renderHook, waitFor } from
  '@testing-library/react';
import { useDeliveries } from './useDeliveries';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useDeliveries', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads without status filter', async () => {
    fm.mockResolvedValue(
      ok({ items: [{ id: 1 }] }),
    );
    const { result } =
      renderHook(() => useDeliveries(''));
    await waitFor(() =>
      expect(result.current.items.length).toBe(1),
    );
    expect(String(fm.mock.calls[0][0])).toBe(
      '/api/webhooks/deliveries',
    );
  });

  it('appends status query param', async () => {
    fm.mockResolvedValue(ok({ items: [] }));
    renderHook(() => useDeliveries('dead'));
    await waitFor(() =>
      expect(fm).toHaveBeenCalled(),
    );
    expect(String(fm.mock.calls[0][0])).toContain(
      '?status=dead',
    );
  });
});
