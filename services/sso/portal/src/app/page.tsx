import { redirect } from 'next/navigation';

/**
 * SSO portal landing page.
 *
 * Post-Keycloak migration there is no local UI to land on,
 * so anyone hitting `/sso/` is sent straight to the Keycloak
 * authorize endpoint with the same params used by the
 * nginx `@sso_login` named location.
 *
 * Kept (rather than deleted) per template repo policy:
 * fix in place, never strip features.
 */
export default function SsoIndexPage() {
  const params = new URLSearchParams({
    client_id: 'nextra-app',
    response_type: 'code',
    scope: 'openid profile email',
    redirect_uri:
      'http://localhost:8889/app/en/auth/callback',
    state: '/',
  });
  redirect(
    '/auth/realms/nextra/protocol/openid-connect/auth?' +
      params.toString(),
  );
}
