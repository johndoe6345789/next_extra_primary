'use client';

/**
 * @file KeycloakAutoLogin.tsx
 * @brief Auto-triggers Keycloak login when the page is
 *        reached with a `?next=` query param. This is
 *        the bridge for nginx `@sso_login` redirects and
 *        the legacy /sso/ portal — they bounce here with
 *        the original requested URL so PKCE cookies get
 *        set up before the user hits Keycloak.
 *
 * If no `next` is present, falls back to rendering a
 * normal "Continue with Keycloak" button so direct
 * visits to /login still have a UI to click.
 */
import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { useSearchParams } from 'next/navigation';
import { CircularProgress } from '@shared/m3';
import { useKeycloak } from '@/hooks/useKeycloak';
import KeycloakLoginButton from
  './KeycloakLoginButton';

/**
 * Auto-redirector / fallback button.
 *
 * @returns Either a spinner (auto-redirecting) or the
 *          manual login button.
 */
export default function KeycloakAutoLogin():
ReactElement {
  const search = useSearchParams();
  const { login, isAuthenticated } = useKeycloak();
  const ran = useRef(false);
  const next = search.get('next');

  useEffect(() => {
    if (ran.current) return;
    if (!next) return;
    if (isAuthenticated) return;
    ran.current = true;
    void login(next);
  }, [next, login, isAuthenticated]);

  if (next && !isAuthenticated) {
    return (
      <div
        data-testid="keycloak-auto-login"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
        }}
      >
        <CircularProgress aria-label="Redirecting to login" />
      </div>
    );
  }

  return <KeycloakLoginButton next={next ?? undefined} />;
}
