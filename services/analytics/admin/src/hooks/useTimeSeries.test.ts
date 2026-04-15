import { renderHook, waitFor } from
  '@testing-library/react';
import { useTimeSeries } from './useTimeSeries';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useTimeSeries', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('skips fetch on empty key', () => {
    renderHook(() => useTimeSeries(''));
    expect(fm).not.toHaveBeenCalled();
  });

  it('loads points with key+days query',
    async () => {
    fm.mockResolvedValue(
      ok({
        key: 'u', label: '', missing: false,
        points: [{ day: '1', count: 2 }],
      }),
    );
    const { result } =
      renderHook(() => useTimeSeries('u', 7));
    await waitFor(() =>
      expect(result.current.points.length).toBe(1),
    );
    const url = String(fm.mock.calls[0][0]);
    expect(url).toContain('key=u');
    expect(url).toContain('days=7');
  });
});
