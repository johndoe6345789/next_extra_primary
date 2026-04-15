import { renderHook, waitFor } from
  '@testing-library/react';
import { useStreams } from './useStreams';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useStreams', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads from /api/streams', async () => {
    fm.mockResolvedValue(
      ok({ items: [{ id: 1, slug: 's' }] }),
    );
    const { result } = renderHook(() => useStreams());
    await waitFor(() =>
      expect(result.current.items.length).toBe(1),
    );
    expect(fm.mock.calls[0][0]).toContain(
      '/api/streams',
    );
  });
});
