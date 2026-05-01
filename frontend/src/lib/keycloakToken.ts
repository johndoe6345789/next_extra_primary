/**
 * @file keycloakToken.ts
 * @brief Token endpoint calls (code exchange + refresh).
 */
import cfg from '@/constants/keycloak.json';
import type { KeycloakTokenResponse } from './keycloakTypes';

const HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

/**
 * Exchange an authorization code for tokens.
 *
 * @param code - the `code` query param Keycloak sent
 * @param codeVerifier - the PKCE verifier used at /auth
 */
export async function exchangeCode(
  code: string,
  codeVerifier: string,
): Promise<KeycloakTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: cfg.clientId,
    code,
    redirect_uri: cfg.redirectUri,
    code_verifier: codeVerifier,
  });
  const r = await fetch(cfg.endpoints.token, {
    method: 'POST',
    headers: HEADERS,
    body: body.toString(),
  });
  if (!r.ok) throw new Error('keycloak exchange failed');
  return (await r.json()) as KeycloakTokenResponse;
}

/**
 * Refresh tokens using the refresh/offline token.
 *
 * @param refreshToken - the stored refresh token
 */
export async function refresh(
  refreshToken: string,
): Promise<KeycloakTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: cfg.clientId,
    refresh_token: refreshToken,
  });
  const r = await fetch(cfg.endpoints.token, {
    method: 'POST',
    headers: HEADERS,
    body: body.toString(),
  });
  if (!r.ok) throw new Error('keycloak refresh failed');
  return (await r.json()) as KeycloakTokenResponse;
}
