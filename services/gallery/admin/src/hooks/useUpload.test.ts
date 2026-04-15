import { renderHook, act } from
  '@testing-library/react';
import { useUpload } from './useUpload';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

describe('useUpload', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('POSTs each file then bulk endpoint', async () => {
    fm.mockResolvedValueOnce(
      ok({ id: 1, source_key: 's/1.jpg' }),
    ).mockResolvedValueOnce(ok({}));
    const { result } = renderHook(() => useUpload(9));
    const f = new File(['x'], 'a.jpg', {
      type: 'image/jpeg',
    });
    await act(async () => {
      await result.current.upload([f]);
    });
    expect(fm.mock.calls[0][0]).toBe('/api/images');
    const last = fm.mock.calls[1];
    expect(String(last[0])).toContain('/9/bulk');
    const body = JSON.parse(
      (last[1] as RequestInit).body as string,
    );
    expect(body.entries).toHaveLength(1);
    expect(body.entries[0].source_key).toBe('s/1.jpg');
  });

  it('skips files that fail upload', async () => {
    fm.mockResolvedValueOnce(
      { ok: false, status: 413 } as Response,
    ).mockResolvedValueOnce(ok({}));
    const { result } = renderHook(() => useUpload(1));
    const f = new File(['x'], 'a.jpg');
    await act(async () => {
      await result.current.upload([f]);
    });
    const last = fm.mock.calls[1];
    const body = JSON.parse(
      (last[1] as RequestInit).body as string,
    );
    expect(body.entries).toHaveLength(0);
  });
});
