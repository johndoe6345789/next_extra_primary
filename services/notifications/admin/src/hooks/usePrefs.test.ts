import { renderHook, act } from
  '@testing-library/react';
import { usePrefs } from './usePrefs';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('usePrefs', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn().mockResolvedValue(
      ok({ items: [] }),
    );
    global.fetch = fm as unknown as typeof fetch;
  });

  it('load skips empty user', async () => {
    const { result } = renderHook(() => usePrefs());
    await act(async () => {
      await result.current.load('');
    });
    expect(fm).not.toHaveBeenCalled();
  });

  it('load GETs user prefs', async () => {
    const { result } = renderHook(() => usePrefs());
    await act(async () => {
      await result.current.load('uid');
    });
    expect(String(fm.mock.calls[0][0])).toBe(
      '/api/notifications/prefs/uid',
    );
  });

  it('toggle POSTs channel/enabled body', async () => {
    const { result } = renderHook(() => usePrefs());
    await act(async () => {
      await result.current.toggle(
        'uid', 'email', false,
      );
    });
    const call = fm.mock.calls.find(
      c => (c[1] as RequestInit)?.method === 'POST',
    );
    expect(call).toBeDefined();
    const body = JSON.parse(
      (call![1] as RequestInit).body as string,
    );
    expect(body).toEqual({
      channel: 'email', enabled: false,
    });
  });
});
