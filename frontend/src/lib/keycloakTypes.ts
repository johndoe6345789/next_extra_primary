/**
 * @file keycloakTypes.ts
 * @brief Token + JWT shapes for the Keycloak OIDC client.
 */

/** Token response from Keycloak's token endpoint. */
export interface KeycloakTokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in: number;
  refresh_expires_in?: number;
  token_type: string;
  scope?: string;
}

/** Realm-access claim shape. */
export interface RealmAccess {
  roles: string[];
}

/** Decoded Keycloak access token payload. */
export interface KeycloakJwtPayload {
  sub: string;
  email?: string;
  preferred_username?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: RealmAccess;
  exp: number;
  iat: number;
  iss: string;
}
