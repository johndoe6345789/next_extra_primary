/**
 * @file page.tsx (login)
 * @brief Server-side 302 redirector to Keycloak.
 *
 * Phase 5 migration: Keycloak owns the visible login UI
 * at /sso/. Visiting /app/en/login simply 302s straight
 * to Keycloak's branded authorize endpoint — no PKCE
 * verifier is generated here because the realm client
 * accepts non-PKCE auth flows (the SPA still uses PKCE
 * via useKeycloak().login() when triggered from inside
 * the app, e.g. AvatarMenu's switch-account or token
 * recovery).
 *
 * The state param carries the original `?next=` so the
 * /app/en/auth/callback can land the user there after
 * code exchange.
 *
 * Source kept per template-repo policy.
 */
import { redirect } from 'next/navigation';

const KC_AUTH =
  'http://localhost:8889/sso/realms/nextra/protocol/openid-connect/auth';

interface LoginPageProps {
  readonly searchParams: Promise<{ next?: string }>;
}

/**
 * 302 redirect to Keycloak's authorize endpoint.
 *
 * @param props - Page props with searchParams.
 */
export default async function LoginPage({
  searchParams,
}: LoginPageProps): Promise<never> {
  const { next: rawNext } = await searchParams;
  const next = rawNext && rawNext.startsWith('/')
    ? rawNext : '/app/en';
  const params = new URLSearchParams({
    client_id: 'nextra-app',
    response_type: 'code',
    scope: 'openid profile email',
    redirect_uri:
      'http://localhost:8889/app/en/auth/callback',
    state: next,
  });
  redirect(`${KC_AUTH}?${params.toString()}`);
}
