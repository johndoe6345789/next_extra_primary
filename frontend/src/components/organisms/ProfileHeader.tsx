'use client';

import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { Icon } from '@shared/m3/data-display/Icon';
import { useTranslations } from 'next-intl';
import { useAuth, useGamification } from '@/hooks';

/** Stat pill shown in the header. */
function Stat({ icon, value, label }: {
  icon: string; value: string; label: string;
}) {
  return (
    <div style={statStyle}>
      <Icon size="sm" color="primary">{icon}</Icon>
      <Typography variant="h6">{value}</Typography>
      <Typography variant="caption"
        color="textSecondary"
      >
        {label}
      </Typography>
    </div>
  );
}

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
    ? new Date(user.createdAt).toLocaleDateString()
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
        <Stat icon="star" value={`${points}`}
          label={t('points')} />
        <Stat icon="trending_up"
          value={`Lv ${level}`}
          label={t('level')} />
        <Stat icon="military_tech"
          value={`${earned.length}`}
          label={t('badges')} />
        <Stat icon="local_fire_department"
          value={`${streak?.current ?? 0}`}
          label={t('streak')} />
      </div>
    </Box>
  );
}

const wrapStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center',
  gap: 20, flexWrap: 'wrap',
};
const avatarStyle: React.CSSProperties = {
  width: 72, height: 72, borderRadius: '50%',
  background: 'var(--mat-sys-primary)',
  color: 'var(--mat-sys-on-primary, #fff)',
  display: 'flex', alignItems: 'center',
  justifyContent: 'center',
  fontSize: 28, fontWeight: 700,
};
const statsRow: React.CSSProperties = {
  display: 'flex', gap: 16, flexWrap: 'wrap',
};
const statStyle: React.CSSProperties = {
  textAlign: 'center', minWidth: 64,
};
