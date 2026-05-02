/**
 * @file keycloakUserMap.ts
 * @brief Derive an in-app User from a Keycloak JWT.
 *        Used when the nextra_sso cookie is present so
 *        useAuth can skip the legacy /api/auth/me round
 *        trip entirely.
 */
import type { KeycloakJwtPayload } from '@/lib/keycloakTypes';
import { parseJwt } from '@/lib/keycloakClient';
import {
  COOKIE, readCookie,
} from '@/lib/keycloakCookies';
import type { User } from '@/types/auth';

const ROLES: ReadonlyArray<User['role']> = [
  'admin', 'moderator', 'user', 'guest',
];

/** Pick the highest-priority known role, lowercased. */
function pickRole(claims: KeycloakJwtPayload): User['role'] {
  const raw = claims.realm_access?.roles ?? [];
  for (const r of ROLES) {
    if (raw.some((x) => x.toLowerCase() === r)) return r;
  }
  return 'user';
}

/** Map a decoded Keycloak JWT payload to a User. */
export function userFromKeycloakClaims(
  claims: KeycloakJwtPayload,
): User {
  const username =
    claims.preferred_username ?? claims.email ?? claims.sub;
  const display = claims.name ?? username;
  return {
    id: claims.sub,
    email: claims.email ?? '',
    username,
    displayName: display,
    role: pickRole(claims),
    createdAt: '',
    updatedAt: '',
  };
}

/**
 * Read the Keycloak access token from the nextra_sso
 * cookie and project its claims onto a User. Returns
 * null when the cookie is missing or the JWT is invalid.
 */
export function readKeycloakUser(): {
  user: User;
  accessToken: string;
} | null {
  const tok = readCookie(COOKIE.access);
  if (!tok) return null;
  const claims = parseJwt(tok);
  if (!claims) return null;
  return {
    user: userFromKeycloakClaims(claims),
    accessToken: tok,
  };
}
