import { renderHook, waitFor } from
  '@testing-library/react';
import { useFlagged } from './useFlagged';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useFlagged', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('reads data field', async () => {
    fm.mockResolvedValue(
      ok({ data: [{ id: 1 }] }),
    );
    const { result } = renderHook(() => useFlagged());
    await waitFor(() =>
      expect(result.current.flagged.length).toBe(1),
    );
    expect(String(fm.mock.calls[0][0])).toContain(
      '/flagged?limit=100',
    );
  });

  it('falls back to raw array', async () => {
    fm.mockResolvedValue(ok([{ id: 2 }]));
    const { result } = renderHook(() => useFlagged());
    await waitFor(() =>
      expect(result.current.flagged[0].id).toBe(2),
    );
  });

  it('empty on error', async () => {
    fm.mockResolvedValue(
      { ok: false, status: 500 } as Response,
    );
    const { result } = renderHook(() => useFlagged());
    await waitFor(() =>
      expect(result.current.loading).toBe(false),
    );
    expect(result.current.flagged).toEqual([]);
  });
});
