import {
  b64urlToBuf,
  bufToB64url,
  toCreationOptions,
  toRequestOptions,
} from './webauthnCodec';

const bytes = (buf: ArrayBuffer): number[] =>
  Array.from(new Uint8Array(buf));

describe('webauthnCodec', () => {
  it('roundtrips a simple buffer', () => {
    const src = new Uint8Array([1, 2, 3, 4, 5]).buffer;
    const encoded = bufToB64url(src);
    expect(encoded).not.toMatch(/=/);
    expect(bytes(b64urlToBuf(encoded))).toEqual(
      [1, 2, 3, 4, 5],
    );
  });

  it('handles unpadded base64url with dashes', () => {
    const src = new Uint8Array([255, 254, 253]).buffer;
    const enc = bufToB64url(src);
    expect(enc).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(bytes(b64urlToBuf(enc))).toEqual(
      [255, 254, 253],
    );
  });

  it('decodes padded and url-safe chars', () => {
    expect(bytes(b64urlToBuf('AQID'))).toEqual([1, 2, 3]);
    expect(bytes(b64urlToBuf('-_8'))).toEqual([251, 255]);
  });

  it('builds creation options from JSON', () => {
    const opts = toCreationOptions({
      challenge: 'AQID',
      rp: { id: 'r', name: 'R' },
      user: {
        id: 'AQID',
        name: 'u',
        displayName: 'U',
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
      ],
      timeout: 60000,
      attestation: 'none',
    });
    expect(bytes(opts.challenge as ArrayBuffer))
      .toEqual([1, 2, 3]);
    expect(opts.rp.id).toBe('r');
    expect(opts.timeout).toBe(60000);
  });

  it('builds request options from JSON', () => {
    const opts = toRequestOptions({
      challenge: 'AQID',
      rpId: 'r',
      timeout: 60000,
      userVerification: 'preferred',
    });
    expect(bytes(opts.challenge as ArrayBuffer))
      .toEqual([1, 2, 3]);
    expect(opts.rpId).toBe('r');
    expect(opts.userVerification).toBe('preferred');
  });
});
