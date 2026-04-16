'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';
import endpoints from
  '@/constants/auth-endpoints.json';

/** A single passkey credential. */
export interface PasskeyCredential {
  id: string;
  name: string;
  createdAt: string;
}

/** Props for PasskeyList. */
export interface PasskeyListProps {
  credentials: PasskeyCredential[];
  onRemoved: () => void;
  testId?: string;
}

const removeUrl = (id: string): string =>
  endpoints.passkeys.remove.replace(':id', id);

/**
 * Renders the list of enrolled passkeys with
 * a remove button for each entry.
 *
 * @param props - Component props.
 * @returns The passkey list element.
 */
export const PasskeyList: React.FC<
  PasskeyListProps
> = ({
  credentials,
  onRemoved,
  testId = 'passkey-list',
}) => {
  const t = useTranslations('auth.passkey');

  const handleRemove = async (id: string) => {
    await fetch(removeUrl(id), {
      method: 'DELETE',
      credentials: 'include',
    });
    onRemoved();
  };

  if (credentials.length === 0) {
    return (
      <Typography
        variant="body2"
        data-testid={`${testId}-empty`}
      >
        {t('none')}
      </Typography>
    );
  }

  return (
    <ul
      data-testid={testId}
      style={{ listStyle: 'none', padding: 0 }}
    >
      {credentials.map((c) => (
        <li
          key={c.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px 0',
          }}
        >
          <Typography variant="body2">
            {c.name || c.id}
          </Typography>
          <Button
            variant="text"
            size="small"
            data-testid={`passkey-remove-${c.id}`}
            aria-label={`${t('remove')} ${c.name}`}
            onClick={() => handleRemove(c.id)}
          >
            {t('remove')}
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default PasskeyList;
