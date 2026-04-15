import { renderHook, act } from
  '@testing-library/react';
import {
  useWebhookActions,
} from './useWebhookActions';

type FM = jest.Mock<Promise<Response>>;
const ok = (): Response =>
  ({ ok: true, status: 200 }) as Response;

describe('useWebhookActions', () => {
  let fm: FM;
  let refresh: jest.Mock;
  beforeEach(() => {
    fm = jest.fn().mockResolvedValue(ok());
    global.fetch = fm as unknown as typeof fetch;
    refresh = jest.fn();
  });

  it('POSTs new endpoint', async () => {
    const { result } =
      renderHook(() => useWebhookActions(refresh));
    await act(async () => {
      await result.current.create({
        url: 'http://x',
        secret: 's',
        events: ['a'],
        active: true,
      });
    });
    const [url, init] = fm.mock.calls[0];
    expect(String(url)).toContain('/endpoints');
    expect((init as RequestInit).method).toBe('POST');
    expect(refresh).toHaveBeenCalled();
  });

  it('PUTs endpoint update', async () => {
    const { result } =
      renderHook(() => useWebhookActions(refresh));
    await act(async () => {
      await result.current.update(7, { active: false });
    });
    expect(String(fm.mock.calls[0][0]))
      .toContain('/endpoints/7');
    expect(
      (fm.mock.calls[0][1] as RequestInit).method,
    ).toBe('PUT');
  });

  it('POSTs delivery replay', async () => {
    const { result } =
      renderHook(() => useWebhookActions(refresh));
    await act(async () => {
      await result.current.replay(5);
    });
    expect(String(fm.mock.calls[0][0]))
      .toContain('/deliveries/5/replay');
  });
});
