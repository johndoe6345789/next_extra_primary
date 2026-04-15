import { renderHook, waitFor } from
  '@testing-library/react';
import { usePresence } from './usePresence';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('usePresence', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('skips fetch with empty list', () => {
    const { result } = renderHook(() => usePresence([]));
    expect(fm).not.toHaveBeenCalled();
    expect(result.current.statuses).toEqual({});
  });

  it('POSTs user list and parses statuses',
    async () => {
    fm.mockResolvedValue(
      ok({ statuses: { u1: 'online' } }),
    );
    const { result } =
      renderHook(() => usePresence(['u1']));
    await waitFor(() =>
      expect(result.current.statuses.u1).toBe('online'),
    );
    const init = fm.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe('POST');
    expect(String(init.body)).toContain('"u1"');
  });
});
