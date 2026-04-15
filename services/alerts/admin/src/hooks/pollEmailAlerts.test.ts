import { pollEmail } from './pollEmailAlerts';

type FM = jest.Mock<Promise<Response>>;
const ok = (b: unknown): Response =>
  ({ ok: true, status: 200, json: async () => b })
    as Response;
const bad = (): Response =>
  ({ ok: false, status: 500 }) as Response;

describe('pollEmail', () => {
  let fm: FM;
  beforeEach(() => {
    fm = jest.fn();
    global.fetch = fm as unknown as typeof fetch;
  });

  it('returns empty when no accounts', async () => {
    fm.mockResolvedValueOnce(ok([]));
    const out = await pollEmail();
    expect(out).toEqual([]);
  });

  it('maps unread messages to alerts', async () => {
    fm.mockResolvedValueOnce(ok([{ id: 7 }]))
      .mockResolvedValueOnce(ok({}))
      .mockResolvedValueOnce(
        ok({
          messages: [
            {
              id: 1, isRead: false,
              subject: 's', from: 'f@e',
              dateReceived:
                '2024-01-01T00:00:00Z',
            },
            { id: 2, isRead: true },
          ],
        }),
      );
    const out = await pollEmail();
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('email-1');
    expect(out[0].title).toBe('s');
    expect(out[0].link).toContain('/1');
  });

  it('throws on accounts failure', async () => {
    fm.mockResolvedValueOnce(bad());
    await expect(pollEmail()).rejects.toThrow(/500/);
  });

  it('sends tenant header', async () => {
    fm.mockResolvedValueOnce(ok([]));
    await pollEmail();
    const init =
      fm.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<
      string, string
    >;
    expect(headers['X-Tenant-Id']).toBe('default');
  });
});
