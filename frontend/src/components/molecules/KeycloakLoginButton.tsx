'use client';

/**
 * @file KeycloakLoginButton.tsx
 * @brief Single-button trigger that hands the visitor
 *        off to Keycloak's authorize endpoint.
 */
import type { ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@shared/m3';
import { useKeycloak } from '@/hooks/useKeycloak';

/** Props for the Keycloak login button. */
export interface KeycloakLoginButtonProps {
  /** Optional post-login redirect target. */
  readonly next?: string;
}

/**
 * Renders a primary button that begins the OIDC PKCE
 * flow to the Keycloak authorize endpoint.
 *
 * @param props - component props
 */
export default function KeycloakLoginButton({
  next,
}: KeycloakLoginButtonProps): ReactElement {
  const t = useTranslations('auth');
  const { login } = useKeycloak();
  return (
    <Button
      data-testid="keycloak-login-btn"
      aria-label={t('continueWithKeycloak')}
      onClick={() => { void login(next); }}
      variant="filled"
    >
      {t('continueWithKeycloak')}
    </Button>
  );
}
