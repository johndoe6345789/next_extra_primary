/**
 * @file usePasskey.ts
 * @module hooks/usePasskey
 *
 * Hook that drives WebAuthn create/get flows, exchanging
 * base64url JSON with the Drogon backend.
 */

import { useCallback, useState } from 'react';
import webauthn from '@/constants/webauthn.json';
import {
  bufToB64url,
  toCreationOptions,
  toRequestOptions,
  type AssertOptionsJson,
  type RegisterOptionsJson,
} from './webauthnCodec';

/** Public API of the usePasskey hook. */
export interface UsePasskeyReturn {
  register: () => Promise<void>;
  assert: () => Promise<void>;
  error: string | null;
  busy: boolean;
}

const postJson = async <T,>(url: string, body: unknown): Promise<T> => {
  const r = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  if (!r.ok) throw new Error(`request failed: ${r.status}`);
  return (await r.json()) as T;
};

/** Stateful hook backing the passkey login/register UI. */
export const usePasskey = (): UsePasskeyReturn => {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<boolean>(false);

  const register = useCallback(async (): Promise<void> => {
    setError(null);
    setBusy(true);
    try {
      const opts = await postJson<RegisterOptionsJson>(
        webauthn.endpoints.registerBegin,
        {},
      );
      const cred = (await navigator.credentials.create({
        publicKey: toCreationOptions(opts),
      })) as PublicKeyCredential | null;
      if (!cred) throw new Error('no credential');
      const r = cred.response as AuthenticatorAttestationResponse;
      await postJson(webauthn.endpoints.registerFinish, {
        challenge: opts.challenge,
        credentialId: bufToB64url(cred.rawId),
        clientDataJSON: bufToB64url(r.clientDataJSON),
        attestationObject: bufToB64url(r.attestationObject),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, []);

  const assert = useCallback(async (): Promise<void> => {
    setError(null);
    setBusy(true);
    try {
      const opts = await postJson<AssertOptionsJson>(
        webauthn.endpoints.assertBegin,
        {},
      );
      const cred = (await navigator.credentials.get({
        publicKey: toRequestOptions(opts),
      })) as PublicKeyCredential | null;
      if (!cred) throw new Error('no credential');
      const r = cred.response as AuthenticatorAssertionResponse;
      await postJson(webauthn.endpoints.assertFinish, {
        challenge: opts.challenge,
        credentialId: bufToB64url(cred.rawId),
        authenticatorData: bufToB64url(r.authenticatorData),
        clientDataJSON: bufToB64url(r.clientDataJSON),
        signature: bufToB64url(r.signature),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, []);

  return { register, assert, error, busy };
};
