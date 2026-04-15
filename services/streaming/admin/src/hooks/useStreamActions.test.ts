import { renderHook, act } from
  '@testing-library/react';
import { useStreamActions } from './useStreamActions';

type FM = jest.Mock<Promise<Response>>;
const ok = (): Response =>
  ({ ok: true, status: 200 }) as Response;

describe('useStreamActions', () => {
  let fm: FM;
  let refresh: jest.Mock;
  beforeEach(() => {
    fm = jest.fn().mockResolvedValue(ok());
    global.fetch = fm as unknown as typeof fetch;
    refresh = jest.fn();
  });

  it('POSTs /block then refreshes', async () => {
    const { result } =
      renderHook(() => useStreamActions(refresh));
    await act(async () => {
      await result.current.block(3);
    });
    const [url, init] = fm.mock.calls[0];
    expect(String(url)).toContain('/3/block');
    expect((init as RequestInit).method).toBe('POST');
    expect(refresh).toHaveBeenCalled();
  });

  it('POSTs /kick', async () => {
    const { result } =
      renderHook(() => useStreamActions(refresh));
    await act(async () => {
      await result.current.kick(7);
    });
    expect(String(fm.mock.calls[0][0]))
      .toContain('/7/kick');
  });

  it('DELETEs the stream', async () => {
    const { result } =
      renderHook(() => useStreamActions(refresh));
    await act(async () => {
      await result.current.remove(9);
    });
    const [url, init] = fm.mock.calls[0];
    expect(String(url)).toContain('/9');
    expect((init as RequestInit).method).toBe('DELETE');
  });
});
