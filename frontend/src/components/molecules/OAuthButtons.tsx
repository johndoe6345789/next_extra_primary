'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Button from '@shared/m3/Button';
import endpoints from
  '@/constants/auth-endpoints.json';

/** Props for OAuthButtons. */
export interface OAuthButtonsProps {
  /** Optional extra CSS class. */
  className?: string;
}

type Provider = 'google' | 'github' | 'microsoft';

const PROVIDERS: {
  id: Provider;
  labelKey: string;
}[] = [
  { id: 'google', labelKey: 'auth.oauth.google' },
  { id: 'github', labelKey: 'auth.oauth.github' },
  {
    id: 'microsoft',
    labelKey: 'auth.oauth.microsoft',
  },
];

const oauthUrl = (provider: Provider): string =>
  endpoints.oauth.authorize.replace(
    ':provider',
    provider,
  );

/**
 * Three OAuth login buttons (Google, GitHub,
 * Microsoft). Each navigates to the backend
 * OAuth authorize endpoint.
 *
 * @param props - Component props.
 * @returns The OAuth buttons element.
 */
export const OAuthButtons: React.FC<
  OAuthButtonsProps
> = ({ className }) => {
  const t = useTranslations();

  return (
    <div
      className={className}
      data-testid="oauth-buttons"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginTop: 12,
      }}
    >
      {PROVIDERS.map(({ id, labelKey }) => (
        <Button
          key={id}
          variant="outlined"
          fullWidth
          data-testid={`oauth-btn-${id}`}
          aria-label={t(labelKey)}
          onClick={() => {
            window.location.href = oauthUrl(id);
          }}
        >
          {t(labelKey)}
        </Button>
      ))}
    </div>
  );
};

export default OAuthButtons;
