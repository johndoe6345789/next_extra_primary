import { renderHook, waitFor } from
  '@testing-library/react';
import { useArticles } from './useArticles';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useArticles', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads from /api/blog/articles', async () => {
    fm.mockResolvedValue(
      ok({ items: [{ id: 1, title: 't' }] }),
    );
    const { result } = renderHook(() => useArticles());
    await waitFor(() =>
      expect(result.current.items.length).toBe(1),
    );
    expect(fm.mock.calls[0][0]).toBe(
      '/api/blog/articles',
    );
  });

  it('tolerates non-ok response', async () => {
    fm.mockResolvedValue(
      { ok: false, status: 500 } as Response,
    );
    const { result } = renderHook(() => useArticles());
    await waitFor(() =>
      expect(fm).toHaveBeenCalled(),
    );
    expect(result.current.items).toEqual([]);
  });
});
