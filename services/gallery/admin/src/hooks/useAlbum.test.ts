import { renderHook, waitFor } from
  '@testing-library/react';
import { useAlbum } from './useAlbum';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useAlbum', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('fetches items for gallery id', async () => {
    fm.mockResolvedValue(
      ok({ items: [{ asset_id: 1 }] }),
    );
    const { result } = renderHook(() => useAlbum(7));
    await waitFor(() =>
      expect(result.current.items.length).toBe(1),
    );
    expect(String(fm.mock.calls[0][0])).toContain(
      '/gallery/7/items',
    );
  });

  it('records error', async () => {
    fm.mockResolvedValue(
      { ok: false, status: 404 } as Response,
    );
    const { result } = renderHook(() => useAlbum(3));
    await waitFor(() =>
      expect(result.current.error).toMatch(/404/),
    );
  });
});
