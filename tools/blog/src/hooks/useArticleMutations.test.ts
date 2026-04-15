import { renderHook, act } from
  '@testing-library/react';
import { useArticleMutations } from
  './useArticleMutations';
import type { Article } from './useArticles';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;

const article: Article = {
  id: 5, tenant_id: 't', author_id: 'a',
  slug: 's', title: 'T', body_md: 'b',
  body_html: '', hero_image: '',
  status: 'draft', published_at: '',
  scheduled_at: '', created_at: '',
  updated_at: '',
};

describe('useArticleMutations', () => {
  let fm: FM;
  let refresh: jest.Mock<Promise<void>>;
  beforeEach(() => {
    fm = jest.fn().mockResolvedValue(ok({ id: 9 }));
    global.fetch = fm as unknown as typeof fetch;
    refresh = jest.fn().mockResolvedValue(undefined);
  });

  it('createDraft POSTs and returns id', async () => {
    const { result } = renderHook(() =>
      useArticleMutations(refresh),
    );
    let id: number | null = null;
    await act(async () => {
      id = await result.current.createDraft();
    });
    expect(id).toBe(9);
    const [url, init] = fm.mock.calls[0];
    expect(String(url)).toBe('/api/blog/articles');
    expect((init as RequestInit).method).toBe('POST');
    expect(refresh).toHaveBeenCalled();
  });

  it('save PUTs to /id', async () => {
    const { result } = renderHook(() =>
      useArticleMutations(refresh),
    );
    await act(async () => {
      await result.current.save(article);
    });
    const [url, init] = fm.mock.calls[0];
    expect(String(url)).toBe('/api/blog/articles/5');
    expect((init as RequestInit).method).toBe('PUT');
  });

  it('publishNow sets status=published', async () => {
    const { result } = renderHook(() =>
      useArticleMutations(refresh),
    );
    await act(async () => {
      await result.current.publishNow(article);
    });
    const init =
      fm.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(init.body as string);
    expect(body.status).toBe('published');
  });

  it('schedule sets scheduled_at', async () => {
    const { result } = renderHook(() =>
      useArticleMutations(refresh),
    );
    await act(async () => {
      await result.current.schedule(
        article, '2030-01-01T00:00:00Z',
      );
    });
    const init =
      fm.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(init.body as string);
    expect(body.status).toBe('scheduled');
    expect(body.scheduled_at).toMatch(/^2030/);
  });
});
