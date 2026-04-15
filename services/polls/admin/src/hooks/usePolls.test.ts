import { renderHook, act, waitFor } from
  '@testing-library/react';
import { usePolls } from './usePolls';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('usePolls', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads polls list', async () => {
    fm.mockResolvedValue(
      ok({ items: [{ id: 1 }] }),
    );
    const { result } = renderHook(() => usePolls());
    await waitFor(() =>
      expect(result.current.items.length).toBe(1),
    );
    expect(fm.mock.calls[0][0]).toBe('/api/polls');
  });

  it('loadTally sets selected and tally', async () => {
    fm.mockResolvedValueOnce(ok({ items: [] }))
      .mockResolvedValueOnce(
        ok({ poll_id: 7, items: [] }),
      );
    const { result } = renderHook(() => usePolls());
    await act(async () => {
      await result.current.loadTally(7);
    });
    expect(result.current.selected).toBe(7);
    expect(result.current.tally?.poll_id).toBe(7);
    expect(String(fm.mock.calls[1][0])).toContain(
      '/7/results',
    );
  });
});
