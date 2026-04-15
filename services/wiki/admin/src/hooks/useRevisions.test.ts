import { renderHook, act, waitFor } from
  '@testing-library/react';
import { useRevisions } from './useRevisions';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useRevisions', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('no-ops when pageId is null', async () => {
    const { result } =
      renderHook(() => useRevisions(null));
    expect(result.current.revisions).toEqual([]);
    expect(fm).not.toHaveBeenCalled();
  });

  it('loads revisions then diff', async () => {
    fm.mockResolvedValue(
      ok({
        revisions: [{ rev: 1 }, { rev: 2 }],
        diff: [{ op: '+', line: 'x' }],
      }),
    );
    const { result } =
      renderHook(() => useRevisions(3));
    await waitFor(() =>
      expect(result.current.revisions.length).toBe(2),
    );
    await act(async () => {
      await result.current.loadDiff(1, 2);
    });
    expect(String(fm.mock.calls[1][0])).toContain(
      '/pages/3/diff?from=1&to=2',
    );
  });
});
