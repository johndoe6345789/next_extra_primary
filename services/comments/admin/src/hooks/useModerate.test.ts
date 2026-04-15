import { renderHook, act } from
  '@testing-library/react';
import { useModerate } from './useModerate';

type FM = jest.Mock<Promise<Response>>;
const ok = (): Response =>
  ({ ok: true, status: 200 }) as Response;

describe('useModerate', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn().mockResolvedValue(ok());
    global.fetch = fm as unknown as typeof fetch;
  });

  it('POSTs to /hide', async () => {
    const { result } = renderHook(() => useModerate());
    await act(async () => {
      await result.current.hide(9);
    });
    expect(String(fm.mock.calls[0][0])).toBe(
      '/api/comments/v2/9/hide',
    );
    expect(
      (fm.mock.calls[0][1] as RequestInit).method,
    ).toBe('POST');
  });

  it('POSTs to /unhide and /clear-flags', async () => {
    const { result } = renderHook(() => useModerate());
    await act(async () => {
      await result.current.unhide(1);
      await result.current.clearFlags(2);
    });
    expect(String(fm.mock.calls[0][0])).toContain(
      '/1/unhide',
    );
    expect(String(fm.mock.calls[1][0])).toContain(
      '/2/clear-flags',
    );
  });

  it('throws on non-ok', async () => {
    fm.mockResolvedValue(
      { ok: false, status: 500 } as Response,
    );
    const { result } = renderHook(() => useModerate());
    await act(async () => {
      await expect(result.current.hide(1))
        .rejects.toThrow(/500/);
    });
  });
});
