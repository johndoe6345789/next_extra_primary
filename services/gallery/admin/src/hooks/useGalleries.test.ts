import { renderHook, waitFor } from
  '@testing-library/react';
import { useGalleries } from './useGalleries';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useGalleries', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads galleries', async () => {
    fm.mockResolvedValue(
      ok({ galleries: [{ id: 1 }] }),
    );
    const { result } = renderHook(() => useGalleries());
    await waitFor(() =>
      expect(result.current.galleries.length).toBe(1),
    );
    expect(fm.mock.calls[0][0]).toBe(
      '/gallery/api/gallery',
    );
  });

  it('records error', async () => {
    fm.mockResolvedValue(
      { ok: false, status: 500 } as Response,
    );
    const { result } = renderHook(() => useGalleries());
    await waitFor(() =>
      expect(result.current.error).toMatch(/500/),
    );
  });
});
