import { renderHook, waitFor } from
  '@testing-library/react';
import { useWikiTree } from './useWikiTree';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useWikiTree', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads tree from /api/wiki/tree', async () => {
    fm.mockResolvedValue(
      ok({ tree: [{ id: 1, children: [] }] }),
    );
    const { result } = renderHook(() => useWikiTree());
    await waitFor(() =>
      expect(result.current.tree.length).toBe(1),
    );
    expect(String(fm.mock.calls[0][0])).toContain(
      '/api/wiki/tree',
    );
  });
});
