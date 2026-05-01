import { redirect } from 'next/navigation';
import { safeNext } from '@/lib/safeNext';

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

/**
 * SSO login page.
 *
 * Historically this page rendered a local username/password
 * form. As of the Keycloak migration, the local form is
 * bypassed: the entire identity flow now lives in Keycloak
 * and this page exists only as a thin server-side redirector
 * so external bookmarks / `/sso/login?next=...` links keep
 * working.
 *
 * The original requested URL travels through the OIDC
 * `state` param so the callback can return the user there.
 *
 * The file is intentionally retained (template repo policy:
 * fix in place, never delete features).
 *
 * @param props - Page props with searchParams.
 */
export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const { next: raw } = await searchParams;
  const next = safeNext(raw);
  const params = new URLSearchParams({
    client_id: 'nextra-app',
    response_type: 'code',
    scope: 'openid profile email',
    redirect_uri:
      'http://localhost:8889/app/en/auth/callback',
    state: next,
  });
  const target =
    '/auth/realms/nextra/protocol/openid-connect/auth?' +
    params.toString();
  redirect(target);
}
