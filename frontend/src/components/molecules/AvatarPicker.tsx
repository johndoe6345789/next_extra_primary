'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import avatars from '@/constants/stock-avatars.json';
import { AvatarOption } from './AvatarOption';

/** Props for AvatarPicker. */
export interface AvatarPickerProps {
  /** Currently selected avatar src. */
  current?: string;
  /** Called with src or null to unset. */
  onPick: (src: string | null) => void;
}

const BASE =
  process.env.NEXT_PUBLIC_BASE_PATH ?? '/app';

const SIZE = 44;

/**
 * Grid of stock SVG avatars with an unset
 * option. Highlights the active choice.
 */
export const AvatarPicker: React.FC<
  AvatarPickerProps
> = ({ current, onPick }) => {
  const t = useTranslations('nav');
  return (
    <Box
      data-testid="avatar-picker"
      style={{ padding: '8px 16px' }}
    >
      <Typography
        variant="caption"
        style={{
          color:
            'var(--mat-sys-on-surface-variant)',
          marginBottom: '8px',
          display: 'block',
        }}
      >
        {t('chooseAvatar')}
      </Typography>
      <Box style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <AvatarOption
          id="none" src={null}
          active={!current}
          size={SIZE}
          onPick={() => onPick(null)}
          label={t('removeAvatar')}
        />
        {(avatars as { id: string; src: string }[])
          .map((a) => {
            const full = `${BASE}${a.src}`;
            return (
              <AvatarOption
                key={a.id} id={a.id}
                src={full}
                active={current === full}
                size={SIZE}
                onPick={() => onPick(full)}
                label={a.id}
              />
            );
          })}
      </Box>
    </Box>
  );
};

export default AvatarPicker;
