/**
 * @file webauthnCodec.ts
 * @module hooks/webauthnCodec
 *
 * Base64url <-> ArrayBuffer helpers and JSON-to-options
 * converters used by the passkey hook.  Kept separate so
 * usePasskey.ts stays under the 100-LOC cap.
 */

/**
 * Decode a base64url string into an ArrayBuffer.
 * @param value Base64url (RFC 7515) encoded string.
 */
export const b64urlToBuf = (value: string): ArrayBuffer => {
  const pad = '='.repeat((4 - (value.length % 4)) % 4);
  const b64 = (value + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) {
    out[i] = bin.charCodeAt(i);
  }
  return out.buffer;
};

/**
 * Encode an ArrayBuffer as a base64url string.
 * @param buf Binary buffer to encode.
 */
export const bufToB64url = (buf: ArrayBuffer): string => {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 1) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/** JSON shape returned by the registerBegin endpoint. */
export interface RegisterOptionsJson {
  challenge: string;
  rp: { id: string; name: string };
  user: { id: string; name: string; displayName: string };
  pubKeyCredParams: Array<{ type: 'public-key'; alg: number }>;
  timeout: number;
  attestation: AttestationConveyancePreference;
}

/** JSON shape returned by the assertBegin endpoint. */
export interface AssertOptionsJson {
  challenge: string;
  rpId: string;
  timeout: number;
  userVerification: UserVerificationRequirement;
}

/** Decode registerBegin JSON into PublicKeyCredentialCreationOptions. */
export const toCreationOptions = (
  j: RegisterOptionsJson,
): PublicKeyCredentialCreationOptions => ({
  challenge: b64urlToBuf(j.challenge),
  rp: j.rp,
  user: {
    id: b64urlToBuf(j.user.id),
    name: j.user.name,
    displayName: j.user.displayName,
  },
  pubKeyCredParams: j.pubKeyCredParams,
  timeout: j.timeout,
  attestation: j.attestation,
});

/** Decode assertBegin JSON into PublicKeyCredentialRequestOptions. */
export const toRequestOptions = (
  j: AssertOptionsJson,
): PublicKeyCredentialRequestOptions => ({
  challenge: b64urlToBuf(j.challenge),
  rpId: j.rpId,
  timeout: j.timeout,
  userVerification: j.userVerification,
});
