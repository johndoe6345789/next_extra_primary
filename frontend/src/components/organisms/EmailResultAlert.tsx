'use client';

import React from 'react';
import Alert from '@shared/m3/Alert';
import Link from '@shared/m3/Link';
import { useTranslations } from 'next-intl';

/** Props for EmailResultAlert. */
interface EmailResultAlertProps {
  /** Result state: ok, err, or null. */
  result: 'ok' | 'err' | null;
}

/** Success/error alert with inbox link. */
const EmailResultAlert: React.FC<
  EmailResultAlertProps
> = ({ result }) => {
  const t = useTranslations('admin');
  if (!result) return null;

  if (result === 'ok') {
    return (
      <>
        <Alert
          severity="success" sx={{ mt: 2 }}
          data-testid="email-success"
        >
          {t('emailSent')}
        </Alert>
        <Link
          href="/emailclient"
          data-testid="check-inbox-link"
          aria-label={t('checkInbox')}
          sx={{ mt: 1, display: 'inline-block' }}
        >
          {t('checkInbox')}
        </Link>
      </>
    );
  }

  return (
    <Alert
      severity="error" sx={{ mt: 2 }}
      data-testid="email-error"
    >
      {t('emailFailed')}
    </Alert>
  );
};

export default EmailResultAlert;
