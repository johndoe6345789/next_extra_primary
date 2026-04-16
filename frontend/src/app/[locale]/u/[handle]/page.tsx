'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { UserProfileHeader } from
  '@/components/organisms/UserProfileHeader';

type ProfileTab = 'posts' | 'about';

const tabSx = (active: boolean) => ({
  background: 'none', border: 'none',
  borderBottom: active
    ? '2px solid var(--m3-primary)'
    : '2px solid transparent',
  cursor: 'pointer', px: 2, py: 1,
  fontWeight: active ? 700 : 400,
  color: active
    ? 'var(--m3-primary)'
    : 'var(--m3-on-surface)',
});

/**
 * Public user profile page.
 * Shows avatar, bio, presence, follower counts,
 * Follow button and tabbed content.
 */
export default function UserProfilePage() {
  const t = useTranslations('social');
  const params = useParams<{ handle: string }>();
  const handle = params?.handle ?? '';
  const [tab, setTab] = useState<ProfileTab>('posts');

  return (
    <Box
      data-testid="user-profile-page"
      aria-label={t('profileOf', { name: handle })}
      sx={{ maxWidth: 720, mx: 'auto', px: 2, py: 3 }}
    >
      <UserProfileHeader
        userId={handle}
        displayName={handle}
        handle={handle}
      />
      <Box
        component="nav"
        aria-label={t('profileTabs')}
        sx={{ display: 'flex', gap: 0, mb: 2 }}
      >
        {(['posts', 'about'] as ProfileTab[]).map(
          (key) => (
            <Box
              key={key}
              component="button"
              onClick={() => setTab(key)}
              aria-current={
                tab === key ? 'page' : undefined
              }
              aria-label={t(key)}
              data-testid={`profile-tab-${key}`}
              sx={tabSx(tab === key)}
            >
              {t(key)}
            </Box>
          ),
        )}
      </Box>
      <Box
        role="tabpanel"
        aria-label={t(tab)}
        data-testid={`profile-panel-${tab}`}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {tab === 'posts'
            ? t('noPostsYet')
            : t('noAboutInfo')}
        </Typography>
      </Box>
    </Box>
  );
}
