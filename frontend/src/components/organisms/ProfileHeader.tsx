'use client';

import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { useAuth, useGamification } from '@/hooks';
import ProfileHeaderStat from
  './ProfileHeaderStat';
import {
  wrapStyle, avatarStyle, statsRow,
} from './profileHeaderStyles';

/**
 * Profile header showing avatar, name, role,
 * member-since date, and key stat pills.
 */
export default function ProfileHeader() {
  const t = useTranslations('gamification');
  const { user } = useAuth();
  const { level, points, badges, streak } =
    useGamification();

  if (!user) return null;

  const since = user.createdAt
    ? new Date(user.createdAt)
      .toLocaleDateString()
    : '—';
  const earned = badges.filter((b) => b.earnedAt);

  return (
    <Box data-testid="profile-header"
      style={wrapStyle}
    >
      <div style={avatarStyle}>
        {(user.displayName ?? user.username)?.[0]
          ?.toUpperCase() ?? '?'}
      </div>
      <div style={{ flex: 1 }}>
        <Typography variant="h5">
          {user.displayName ?? user.username}
        </Typography>
        <Typography variant="body2"
          color="textSecondary"
        >
          {user.email}
        </Typography>
        <Typography variant="caption"
          color="textSecondary"
        >
          {user.role} · Joined {since}
        </Typography>
      </div>
      <div style={statsRow}>
        <ProfileHeaderStat icon="star"
          value={`${points}`}
          label={t('points')} />
        <ProfileHeaderStat icon="trending_up"
          value={`Lv ${level}`}
          label={t('level')} />
        <ProfileHeaderStat icon="military_tech"
          value={`${earned.length}`}
          label={t('badges')} />
        <ProfileHeaderStat
          icon="local_fire_department"
          value={`${streak?.current ?? 0}`}
          label={t('streak')} />
      </div>
    </Box>
  );
}
