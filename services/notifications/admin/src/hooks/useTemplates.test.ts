import { renderHook, act, waitFor } from
  '@testing-library/react';
import { useTemplates } from './useTemplates';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useTemplates', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads templates', async () => {
    fm.mockResolvedValue(
      ok({ items: [{ key: 'k' }] }),
    );
    const { result } = renderHook(() => useTemplates());
    await waitFor(() =>
      expect(result.current.items.length).toBe(1),
    );
  });

  it('save POSTs full body', async () => {
    fm.mockResolvedValue(ok({ items: [] }));
    const { result } = renderHook(() => useTemplates());
    await act(async () => {
      await result.current.save({
        key: 'k', channel: 'email',
        subject: 's', body: 'b',
      });
    });
    const call = fm.mock.calls.find(
      c => (c[1] as RequestInit)?.method === 'POST',
    );
    expect(call).toBeDefined();
    const body = JSON.parse(
      (call![1] as RequestInit).body as string,
    );
    expect(body.key).toBe('k');
  });
});
