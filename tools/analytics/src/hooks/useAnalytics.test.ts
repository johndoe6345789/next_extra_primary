import { renderHook, waitFor } from
  '@testing-library/react';
import { useAnalytics } from './useAnalytics';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useAnalytics', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads summary with retention and metrics',
    async () => {
    fm.mockResolvedValue(
      ok({
        retentionDays: 30,
        metrics: [{
          key: 'u', label: 'Users', icon: 'x',
          total: 5, missing: false,
        }],
      }),
    );
    const { result } =
      renderHook(() => useAnalytics());
    await waitFor(() =>
      expect(result.current.loading).toBe(false),
    );
    expect(result.current.retention).toBe(30);
    expect(result.current.metrics.length).toBe(1);
    expect(String(fm.mock.calls[0][0])).toContain(
      '/api/analytics/summary',
    );
  });

  it('records error on HTTP failure', async () => {
    fm.mockResolvedValue(
      { ok: false, status: 500 } as Response,
    );
    const { result } =
      renderHook(() => useAnalytics());
    await waitFor(() =>
      expect(result.current.error).toMatch(/500/),
    );
  });
});
