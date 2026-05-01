'use client';

/**
 * @file KeycloakAuthGate.tsx
 * @brief Thin auth gate that redirects unauthenticated
 *        visitors into the Keycloak login flow.
 */
import { useEffect, type ReactElement, type ReactNode }
  from 'react';
import { CircularProgress } from '@shared/m3';
import { useKeycloak } from '@/hooks/useKeycloak';

/** Props for the Keycloak auth gate. */
export interface KeycloakAuthGateProps {
  /** Child nodes to render when authenticated. */
  readonly children: ReactNode;
  /** Optional post-login redirect target. */
  readonly next?: string;
}

/**
 * Renders children iff Keycloak says the user is signed
 * in; otherwise it kicks off the OIDC redirect.
 *
 * @param props - component props
 */
export default function KeycloakAuthGate({
  children, next,
}: KeycloakAuthGateProps): ReactElement {
  const { isAuthenticated, login } = useKeycloak();

  useEffect(() => {
    if (!isAuthenticated) {
      void login(next);
    }
  }, [isAuthenticated, login, next]);

  if (!isAuthenticated) {
    return (
      <div
        data-testid="keycloak-auth-gate"
        role="status"
        aria-label="Redirecting to sign-in"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100dvh',
        }}
      >
        <CircularProgress testId="kc-gate-spinner" />
      </div>
    );
  }
  return <>{children}</>;
}
