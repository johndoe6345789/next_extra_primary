import { renderHook, act } from
  '@testing-library/react';
import { usePollActions } from './usePollActions';

type FM = jest.Mock<Promise<Response>>;
const ok = (): Response =>
  ({ ok: true, status: 200 }) as Response;

describe('usePollActions', () => {
  let fm: FM;
  let onChanged: jest.Mock;
  beforeEach(() => {
    fm = jest.fn().mockResolvedValue(ok());
    global.fetch = fm as unknown as typeof fetch;
    onChanged = jest.fn();
  });

  it('POSTs create poll body', async () => {
    const { result } = renderHook(() =>
      usePollActions(onChanged),
    );
    await act(async () => {
      await result.current.create({
        question: 'q', kind: 'single',
        closes_at: 'z',
        options: ['a', 'b'],
        tenant_id: 't',
      });
    });
    const init = fm.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body as string);
    expect(body.options).toEqual([
      { label: 'a' }, { label: 'b' },
    ]);
    expect(onChanged).toHaveBeenCalled();
  });

  it('vote POSTs to /id/vote', async () => {
    const { result } = renderHook(() =>
      usePollActions(onChanged),
    );
    await act(async () => {
      await result.current.vote(4, {
        option_id: 1, rank: 2,
      });
    });
    expect(String(fm.mock.calls[0][0])).toContain(
      '/4/vote',
    );
  });
});
