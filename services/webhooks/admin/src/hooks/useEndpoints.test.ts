import { renderHook, waitFor } from
  '@testing-library/react';
import { useEndpoints } from './useEndpoints';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useEndpoints', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads endpoints and event types',
    async () => {
    fm
      .mockResolvedValueOnce(
        ok({ items: [{ id: 1 }] }),
      )
      .mockResolvedValueOnce(
        ok({
          items: [{ event_type: 'user.created' }],
        }),
      );
    const { result } = renderHook(() => useEndpoints());
    await waitFor(() => {
      expect(result.current.items.length).toBe(1);
      expect(result.current.events.length).toBe(1);
    });
    expect(String(fm.mock.calls[0][0])).toContain(
      '/endpoints',
    );
    expect(String(fm.mock.calls[1][0])).toContain(
      '/events',
    );
  });
});
