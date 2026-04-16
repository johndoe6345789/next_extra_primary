'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';
import { usePasskey } from '@/hooks/usePasskey';
import { PasskeyList } from './PasskeyList';
import type {
  PasskeyCredential,
} from './PasskeyList';
import endpoints from
  '@/constants/auth-endpoints.json';

/** Props for PasskeySection. */
export interface PasskeySectionProps {
  testId?: string;
}

/**
 * Security section card showing enrolled passkeys
 * with add and remove capabilities.
 *
 * @param props - Component props.
 * @returns The passkey management section.
 */
export const PasskeySection: React.FC<
  PasskeySectionProps
> = ({ testId = 'passkey-section' }) => {
  const t = useTranslations('auth.passkey');
  const { register, busy, error } = usePasskey();
  const [creds, setCreds] =
    useState<PasskeyCredential[]>([]);

  const fetchCreds = useCallback(async () => {
    const r = await fetch(
      endpoints.passkeys.credentials,
      { credentials: 'include' },
    );
    if (r.ok) {
      const data =
        (await r.json()) as PasskeyCredential[];
      setCreds(data);
    }
  }, []);

  useEffect(() => { void fetchCreds(); }, [fetchCreds]);

  const handleAdd = async () => {
    await register();
    void fetchCreds();
  };

  return (
    <section
      data-testid={testId}
      aria-label={t('sectionTitle')}
      style={{ marginBottom: 16 }}
    >
      <Typography variant="titleMedium">
        {t('sectionTitle')}
      </Typography>
      <PasskeyList
        credentials={creds}
        onRemoved={fetchCreds}
      />
      <Button
        variant="filled"
        disabled={busy}
        data-testid="passkey-add-btn"
        aria-label={t('add')}
        onClick={handleAdd}
        style={{ marginTop: 8 }}
      >
        {t('add')}
      </Button>
      {error && (
        <p
          role="alert"
          style={{
            color: 'var(--md-sys-color-error)',
          }}
        >
          {error}
        </p>
      )}
    </section>
  );
};

export default PasskeySection;
