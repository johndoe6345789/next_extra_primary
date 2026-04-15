import { renderHook, act, waitFor } from
  '@testing-library/react';
import { useWikiPage } from './useWikiPage';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useWikiPage', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('loads page from /pages/:id', async () => {
    fm.mockResolvedValue(
      ok({ id: 5, title: 'T' }),
    );
    const { result } = renderHook(() => useWikiPage(5));
    await waitFor(() =>
      expect(result.current.page?.title).toBe('T'),
    );
  });

  it('save PUTs with body and reloads',
    async () => {
    fm.mockResolvedValue(
      ok({ id: 5, title: 'New' }),
    );
    const { result } = renderHook(() => useWikiPage(5));
    await waitFor(() =>
      expect(result.current.page).not.toBeNull(),
    );
    await act(async () => {
      await result.current.save('New', 'body');
    });
    const put = fm.mock.calls.find(
      (c) =>
        (c[1] as RequestInit)?.method === 'PUT',
    );
    expect(put).toBeDefined();
    expect(String(put?.[0])).toContain('/pages/5');
  });
});
