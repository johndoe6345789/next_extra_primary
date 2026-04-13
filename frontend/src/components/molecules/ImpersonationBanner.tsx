'use client';

import React from 'react';
import Alert from '@shared/m3/Alert';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import { useImpersonation }
  from '@/hooks/useImpersonation';

/** Banner shown when admin is impersonating. */
const ImpersonationBanner: React.FC = () => {
  const t = useTranslations('admin');
  const { active, isLoading, stopImpersonating }
    = useImpersonation();

  if (!active) return null;

  return (
    <Alert
      severity="warning"
      data-testid="impersonation-banner"
      aria-label={t('impersonating')}
      sx={{
        borderRadius: 0,
        justifyContent: 'center',
      }}
      action={
        <Button
          size="small"
          onClick={stopImpersonating}
          disabled={isLoading}
          data-testid="stop-impersonate"
          aria-label={t('stopImpersonating')}
        >
          {t('stopImpersonating')}
        </Button>
      }
    >
      {t('impersonating')}
    </Alert>
  );
};

export default ImpersonationBanner;
