import { renderHook, act, waitFor } from
  '@testing-library/react';
import { usePasskey } from './usePasskey';

type FetchMock = jest.Mock<Promise<Response>>;

const makeResp = (body: unknown): Response =>
  ({
    ok: true,
    status: 200,
    json: async () => body,
  }) as Response;

const beginOpts = {
  challenge: 'AQID',
  rp: { id: 'r', name: 'R' },
  user: { id: 'AQID', name: 'u', displayName: 'U' },
  pubKeyCredParams: [
    { type: 'public-key', alg: -7 },
  ],
  timeout: 60000,
  attestation: 'none',
};

const assertOpts = {
  challenge: 'AQID',
  rpId: 'r',
  timeout: 60000,
  userVerification: 'preferred',
};

describe('usePasskey', () => {
  let fetchMock: FetchMock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const cred = {
      rawId: new Uint8Array([1, 2, 3]).buffer,
      response: {
        clientDataJSON: new Uint8Array([4]).buffer,
        attestationObject: new Uint8Array([5]).buffer,
        authenticatorData: new Uint8Array([6]).buffer,
        signature: new Uint8Array([7]).buffer,
      },
    };
    Object.defineProperty(navigator, 'credentials', {
      value: {
        create: jest.fn().mockResolvedValue(cred),
        get: jest.fn().mockResolvedValue(cred),
      },
      configurable: true,
    });
  });

  it('posts register begin then finish', async () => {
    fetchMock
      .mockResolvedValueOnce(makeResp(beginOpts))
      .mockResolvedValueOnce(makeResp({}));
    const { result } = renderHook(() => usePasskey());
    await act(async () => {
      await result.current.register();
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [url1] = fetchMock.mock.calls[0];
    expect(url1).toContain('register/begin');
    const [url2, init2] = fetchMock.mock.calls[1];
    expect(url2).toContain('register/finish');
    const body = JSON.parse(
      (init2 as RequestInit).body as string,
    );
    expect(body.credentialId).toBeDefined();
  });

  it('records error when fetch fails', async () => {
    fetchMock.mockResolvedValueOnce(
      { ok: false, status: 500 } as Response,
    );
    const { result } = renderHook(() => usePasskey());
    await act(async () => {
      await result.current.assert();
    });
    await waitFor(() =>
      expect(result.current.error).toMatch(/500/),
    );
    expect(result.current.busy).toBe(false);
  });

  it('runs assert flow when credential returned', async () => {
    fetchMock
      .mockResolvedValueOnce(makeResp(assertOpts))
      .mockResolvedValueOnce(makeResp({}));
    const { result } = renderHook(() => usePasskey());
    await act(async () => {
      await result.current.assert();
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
