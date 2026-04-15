import { renderHook, waitFor } from
  '@testing-library/react';
import { useGroups } from './useGroups';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useGroups', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads groups', async () => {
    fm.mockResolvedValue(
      ok({ groups: [{ id: 1, slug: 's' }] }),
    );
    const { result } = renderHook(() => useGroups());
    await waitFor(() =>
      expect(result.current.groups.length).toBe(1),
    );
  });

  it('records HTTP error', async () => {
    fm.mockResolvedValue(
      { ok: false, status: 500 } as Response,
    );
    const { result } = renderHook(() => useGroups());
    await waitFor(() =>
      expect(result.current.error).toMatch(/500/),
    );
  });
});
