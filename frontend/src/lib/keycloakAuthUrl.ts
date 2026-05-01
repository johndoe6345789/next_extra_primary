/**
 * @file keycloakAuthUrl.ts
 * @brief Build the OIDC authorization URL.
 */
import cfg from '@/constants/keycloak.json';

/**
 * Build the Keycloak authorization URL with PKCE.
 *
 * @param state - opaque CSRF token
 * @param codeVerifier - PKCE verifier (kept for symmetry)
 * @param codeChallenge - PKCE S256 challenge
 * @returns full URL to redirect the browser to
 */
export function buildAuthUrl(
  state: string,
  codeVerifier: string,
  codeChallenge: string,
): string {
  void codeVerifier;
  const p = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: cfg.redirectUri,
    response_type: 'code',
    scope: cfg.scopes,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  return `${cfg.endpoints.authorization}?${p.toString()}`;
}
